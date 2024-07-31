import {Colors} from "./Colors";
import {Figure} from "./figures/Figure";
import {FigureNames} from './figures/BaseFigure'
import {Board} from "./Board";

export class Cell{
    readonly x: number;
    readonly y: number;
    readonly color: Colors;
    figure: Figure | null;
    board: Board;
    available: boolean; // move?
    id: number; // for react keys

    constructor(board: Board, x: number, y: number, color: Colors, figure: Figure | null) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.figure = figure;
        this.board = board;
        this.available = false;
        this.id = Math.random()
    }
    toJSON() {
        return {
          x: this.x,
          y: this.y,
          color: this.color,
          figure: this.figure ? this.figure.toJSON() : null
        };
      }

      static fromJSON(json: any): Cell {
        const cell = new Cell(json.board, json.x, json.y, json.color, null);
        cell.figure = json.figure ? Figure.fromJSON(json.figure, cell) : null;
        return cell;
      }

    isEmpty(){
        return this.figure === null || this.figure.name === FigureNames.PAWNCLONE;
    }

    isEnemy(target: Cell): boolean{
        if(target.figure){
            return this.figure?.color !== target.figure?.color;
        }
        return false;
    }
    isEmptyVertical(target: Cell) : boolean {
        if (this.x !== target.x){
            return false;
        }
        const min = Math.min(this.y, target.y);
        const max = Math.max(this.y, target.y);
        for (let y= min + 1; y < max; y++) {
            if(!this.board.getCell(this.x, y).isEmpty()){
                return false
            }
        }
        return true;
    }
    isEmptyHorizontal(target: Cell) : boolean {
        if (this.y !== target.y){
            return false;
        }
        const min = Math.min(this.x, target.x);
        const max = Math.max(this.x, target.x);
        for (let x= min + 1; x < max; x++) {
            if(!this.board.getCell(x, this.y).isEmpty()){
                return false
            }
        }
        return true;
    }
    isEmptyDiagonal(target: Cell) : boolean {
        const absX = Math.abs(target.x - this.x);
        const absY = Math.abs(target.y - this.y);
        if (absY !== absX)
            return false;

        const dy = this.y < target.y ? 1 : -1;
        const dx = this.x < target.x ? 1 : -1;

        for (let i = 1; i < absY; i++) {
            if (!this.board.getCell(this.x + dx * i, this.y + dy * i).isEmpty())
                return false;
        }

        return true;
    }
    setFigure(figure: Figure | null){
        if (figure){
            this.figure = figure;
            this.figure.cell = this;
        }
    }

    addLostFigure(figure: Figure){
        figure.color === Colors.WHITE ?
            this.board.lostWhiteFigures.push(figure) :
            this.board.lostBlackFigures.push(figure)
    }
    moveFigure(target: Cell){
        if(this.figure && this.figure?.canMove(target)) {
            if (this.figure.name === FigureNames.KING
                && Math.abs(target.x - this.x) === 2){
                const secondTarget = this.board.getCell(this.x + (target.x - this.x)/2, target.y);
                const secondFigure = target.x - this.x > 0
                    ? this.board.getCell(7, target.y).figure
                    : this.board.getCell(0, target.y).figure;
                if(secondFigure)
                {
                    this.board.cells[secondTarget.y][secondTarget.x].figure = secondFigure;
                    this.board.cells[target.y][target.x - this.x > 0 ? 7 : 0].figure = null;
                }

            }
            if(target.figure?.cell && target.figure?.name === FigureNames.PAWNCLONE){
                let pawnCell: Cell | null = null;
                
                if (target.figure.color === Colors.BLACK) {
                    pawnCell = target.figure.cell.board.cells[3][target.figure.cell.x];
                }
                else{
                    pawnCell = target.figure.cell.board.cells[4][target.figure.cell.x];
                    
                }
                if (pawnCell.figure){
                    this.addLostFigure(pawnCell.figure);
                    pawnCell.figure.cell = null;
                    pawnCell.figure = null;
                }
                
            }
            

            this.figure?.moveFigure(target);

            if(target.figure){
                this.addLostFigure(target.figure);
            }
            target.setFigure(this.figure);
            this.figure = null;
        }
    }
    checkPawnUp(target: Cell): boolean{
        if (target.figure?.name === FigureNames.PAWN) {
            return target.figure.checkPawnUp(target);
        }
        return false;
    }
    pawnUp(target: Cell, figure: FigureNames){
        if (target.figure) {
            target.figure?.pawnUp(target, figure);
        }
    }
    isKingUnderCheck(): boolean{
        if (this.figure?.name === FigureNames.KING) {
            const enemyColor = this.figure.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE
            const newBoard = this.board.getCopyBoard();
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (newBoard.cells[row][col].figure?.color === enemyColor
                        && this !== null
                        && newBoard.cells[row][col].figure?.canMove(this)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

}