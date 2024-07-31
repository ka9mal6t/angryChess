import {BaseFigure} from "./BaseFigure";
import {FigureNames} from './BaseFigure'
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackLogo from "../../assets/black-pawn.png";
import whiteLogo from "../../assets/white-pawn.png";
import {Queen} from "./Queen";
import {Bishop} from "./Bishop";
import {Knight} from "./Knight";
import {Rook} from "./Rook";
import {PawnClone} from './PawnClone'

export class Pawn extends BaseFigure{

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.PAWN;
    }
    canMove(target: Cell): boolean {
        if(!super.canMove(target))
            return false;
        if (this.cell){
            const direction = this.cell.figure?.color === Colors.BLACK ? 1 : -1;
            const firstStepDirection = this.cell.figure?.color === Colors.BLACK ? 2 : -2;

            if (target.y === this.cell.y + direction 
                && target.x === this.cell.x
                && this.cell.board.getCell(target.x, target.y).isEmpty()
                && this.cell.board.getCell(this.cell.x, this.cell.y + direction).isEmpty()
                && !this.cell.board.isWillBeKingUnderCheck(this.cell.y, this.cell.x, target.y, target.x)) {
                return true;
            }

            if (this.isFirstStep && target.y === this.cell.y + firstStepDirection
                && (this.color === Colors.BLACK ? this.cell.y === 1 : this.cell.y === 6)
                && target.x === this.cell.x
                && this.cell.board.getCell(target.x, target.y).isEmpty()
                && this.cell.board.getCell(this.cell.x, this.cell.y + direction).isEmpty()
                && !this.cell.board.isWillBeKingUnderCheck(this.cell.y, this.cell.x, target.y, target.x)) {
                return true;
            }

            if (target.y === this.cell.y + direction
                && (target.x === this.cell.x + 1 || target.x === this.cell.x - 1)
                && this.cell.isEnemy(target)
                && !this.cell.board.isWillBeKingUnderCheck(this.cell.y, this.cell.x, target.y, target.x)){
                return true;
            }
        }
        return false;
    }
    canMoveWithOutCheck(target: Cell): boolean {
        if(!super.canMove(target))
            return false;
        if (this.cell){
            const direction = this.cell.figure?.color === Colors.BLACK ? 1 : -1;
            const firstStepDirection = this.cell.figure?.color === Colors.BLACK ? 2 : -2;

            if (target.y === this.cell.y + direction 
                && target.x === this.cell.x
                && this.cell.board.getCell(target.x, target.y).isEmpty()
                && this.cell.board.getCell(this.cell.x, this.cell.y + direction).isEmpty()) {
                return true;
            }

            if (this.isFirstStep && target.y === this.cell.y + firstStepDirection
                && (this.color === Colors.BLACK ? this.cell.y === 1 : this.cell.y === 6)
                && target.x === this.cell.x
                && this.cell.board.getCell(target.x, target.y).isEmpty()
                && this.cell.board.getCell(this.cell.x, this.cell.y + direction).isEmpty()) {
                return true;
            }

            if (target.y === this.cell.y + direction
                && (target.x === this.cell.x + 1 || target.x === this.cell.x - 1)
                && this.cell.isEnemy(target)){
                return true;
            }
        }
        return false;
      }
    
    checkPawnUp(target: Cell): boolean {
        if (target.figure
            && target.y === 7
            && target.figure?.color === Colors.BLACK) {
            return true;
        }
        if (target.figure
            && target.y === 0
            && target.figure?.color === Colors.WHITE) {
            return true;
        }
        return false;
    }
    pawnUp(target: Cell, figure: FigureNames){
        if (target.figure)
        {
            if(figure === FigureNames.ROOK)
                target.setFigure(new Rook(target.figure.color, target))
            if(figure === FigureNames.QUEEN)
                target.setFigure(new Queen(target.figure.color, target))
            if(figure === FigureNames.KNIGHT)
                target.setFigure(new Knight(target.figure.color, target))
            if(figure === FigureNames.BISHOP)
                target.setFigure(new Bishop(target.figure.color, target))
        }
    }
    
    moveFigure(target: Cell){
        super.moveFigure(target);
        if(this.cell && Math.abs(this.cell.y - target.y) === 2){
            const direction = this.cell.figure?.color === Colors.BLACK ? 1 : -1;
            const cell = this.cell.board.getCell( this.cell.x,  this.cell.y + direction);
            new PawnClone(this.color, cell);
        }
    }


    

    toJSON() {
        return {
          ...super.toJSON(),
        };
      }
    
      static fromJSON(json: any, cell: Cell): Pawn {
        const figure = new Pawn(json.color, cell);
        figure.id = json.id;
        figure.isFirstStep = json.isFirstStep;
        return figure;
      }

}


