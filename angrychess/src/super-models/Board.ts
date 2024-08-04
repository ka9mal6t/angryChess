import {Cell} from "./Cell";
import {Colors} from "./Colors";
import {Pawn} from "./figures/Pawn";
import {King} from "./figures/King";
import {Queen} from "./figures/Queen";
import {Bishop} from "./figures/Bishop";
import {Rook} from "./figures/Rook";
import {Knight} from "./figures/Knight";
import {Figure} from "./figures/Figure";
import {FigureNames} from './figures/BaseFigure'

export class Board {
    cells: Cell[][] = [];
    lostBlackFigures: Figure[] = [];
    lostWhiteFigures: Figure[] = [];

    public initCells() {
        for (let i = 0; i < 8; i++) {
            const row: Cell[] = []
            for (let j = 0; j < 8; j++) {
                if ((i + j) % 2 !== 0)
                    row.push(new Cell(this, j, i, Colors.BLACK, null))
                else
                    row.push(new Cell(this, j, i, Colors.WHITE, null))
            }
            this.cells.push(row);
        }
    }

    public clearLastMoveHighlight(){
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.cells[i][j].lastMoveHighlight = false;
            }
        }
    }

    getBoardState() {
        return {
          cells: this.cells.map(row => row.map(cell => cell.toJSON())),
          lostWhiteFigures: this.lostWhiteFigures.map(figure => figure.toJSON()),
          lostBlackFigures: this.lostBlackFigures.map(figure => figure.toJSON())
        };
      }

    setBoardFromState(state: any) {
        this.cells = state.cells.map((row: any) => 
          row.map((cell: any) => {
            const newCell = new Cell(this, cell.x, cell.y, cell.color, null);
            newCell.lastMoveHighlight = cell.lastMoveHighlight;
            newCell.figure = cell.figure ? Figure.fromJSON(cell.figure, newCell) : null;
            return newCell;
          })
        );

        state.lostWhiteFigures.map((figure: any) => {
            const fig = this.cells[0][0].figure;
            const newFig = Figure.fromJSON(figure, this.cells[0][0]);
            this.cells[0][0].figure = fig;
            this.lostWhiteFigures.push(newFig)            
      });
        state.lostBlackFigures.map((figure: any) => 
        {
            const fig = this.cells[0][0].figure;
            const newFig = Figure.fromJSON(figure, this.cells[0][0]);
            this.cells[0][0].figure = fig;
            this.lostBlackFigures.push(newFig)   
        });
      }

    public getCopyBoard(): Board {
        const newBoard = new Board();
        newBoard.cells = this.cells;
        newBoard.lostWhiteFigures = this.lostWhiteFigures;
        newBoard.lostBlackFigures = this.lostBlackFigures;
        return newBoard;
    }


    getKingCell(color: Colors): Cell | null {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const cell = this.getCell(row, col);
                if (cell.figure?.name === FigureNames.KING
                    && cell.figure.color === color)
                    return cell;
            }
        }
        return null;
    }

    isWillBeKingUnderCheck(cell_y: number, cell_x: number, target_y: number, target_x: number): boolean {
        const newBoard = this.getCopyBoard();
        const figure = newBoard.cells[cell_y][cell_x].figure;

        if (figure === null) {
            return false;
        }

        const color = figure.color;
        const oldFigure = newBoard.cells[target_y][target_x].figure;

        newBoard.cells[target_y][target_x].figure = figure;
        newBoard.cells[cell_y][cell_x].figure = null;

        const kingUnderCheck = this.isKingUnderCheck(color, newBoard);

        // Вернем фигуры обратно в исходные клетки
        newBoard.cells[cell_y][cell_x].figure = figure;
        newBoard.cells[target_y][target_x].figure = oldFigure;

        if (kingUnderCheck) {
            return true;
        } else {
            return false;
        }
    
    }
    

    isKingUnderCheck(kingColor: Colors, newBoard: Board = this.getCopyBoard()): boolean {
        const enemyColor = kingColor === Colors.WHITE ? Colors.BLACK : Colors.WHITE;

        const kingPos = newBoard.getKingCell(kingColor)
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (newBoard.cells[row][col].figure?.color === enemyColor
                    && kingPos !== null
                    && newBoard.cells[row][col].figure?.canMoveWithOutCheck(kingPos)) {
                        return true;
                }
            }
        }
        return false;
    }

    checkMate(color: Colors, board: Board = this): boolean {
        if (board.isKingUnderCheck(color)) {
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (board.cells[row][col].figure?.color === color) {
                        const figure = board.cells[row][col].figure;
                        for (let i = 0; i < 8; i++) {
                            const newRow = board.cells[i];
                            for (let j = 0; j < 8; j++) {
                                const target = newRow[j];
                                if (figure?.canMove(target))
                                    return false;
                            }
                        }
                    }
                }
            }
            return true;
        }
        return false;

    }
    staleMate(color: Colors): boolean{
        if (!this.isKingUnderCheck(color)) {
            for (let row= 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (this.cells[row][col].figure?.color === color) {
                        const figure = this.cells[row][col].figure;
                        for (let i = 0; i < 8; i++) {
                            const newRow = this.cells[i];
                            for (let j = 0; j < 8; j++) {
                                const target = newRow[j];
                                if (figure?.canMove(target))
                                    return false;
                            }
                        }
                    }
                }
            }
            return true;
        }
        else {
            return false;
        }
    }
    public highlightCells(selectedCell: Cell | null){
        for (let i = 0; i < this.cells.length; i++) {
            const row = this.cells[i];
            for (let j = 0; j < row.length; j++) {
                const target = row[j];
                target.available = !!selectedCell?.figure?.canMove(target);
            }
        }
    }
    public getCell(x: number, y: number){
        return this.cells[y][x];
    }
    private addPawns(){
        for (let i = 0; i < 8; i++) {
            new Pawn(Colors.BLACK, this.getCell(i, 1));
            new Pawn(Colors.WHITE, this.getCell(i, 6));
        }
    }
    private addKings(){
        new King(Colors.BLACK, this.getCell(4, 0));
        new King(Colors.WHITE, this.getCell(4, 7));
    }
    private addQueens(){
        new Queen(Colors.BLACK, this.getCell(3, 0));
        new Queen(Colors.WHITE, this.getCell(3, 7));
    }
    private addBishops(){
        new Bishop(Colors.BLACK, this.getCell(2, 0));
        new Bishop(Colors.BLACK, this.getCell(5, 0));
        new Bishop(Colors.WHITE, this.getCell(2, 7));
        new Bishop(Colors.WHITE, this.getCell(5, 7));
    }
    private addRooks(){
        new Rook(Colors.BLACK, this.getCell(0, 0));
        new Rook(Colors.BLACK, this.getCell(7, 0));
        new Rook(Colors.WHITE, this.getCell(0, 7));
        new Rook(Colors.WHITE, this.getCell(7, 7));
    }
    private addKnight(){
        new Knight(Colors.BLACK, this.getCell(1, 0));
        new Knight(Colors.BLACK, this.getCell(6, 0));
        new Knight(Colors.WHITE, this.getCell(1, 7));
        new Knight(Colors.WHITE, this.getCell(6, 7));
    }
    public addFigures(){
        this.addKings();
        this.addQueens();
        this.addRooks();
        this.addBishops();
        this.addKnight();
        this.addPawns();

    }
}

