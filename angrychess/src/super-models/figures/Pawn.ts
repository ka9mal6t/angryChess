import {BaseFigure} from "./BaseFigure";
import {FigureNames} from './BaseFigure'
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackLogo from "../../assets/black-pawn.png";
import whiteLogo from "../../assets/white-pawn.png";
// import superBlackBishopLogo from "../../assets/super-black-bishop.png";
// import superBlackKnightLogo from "../../assets/super-black-knight.png";
// import superBlackQueenLogo from "../../assets/super-black-queen.png";
// import superBlackRookLogo from "../../assets/super-black-rook.png";
import superWhiteBishopLogo from "../../assets/super-white-bishop.png";
import superWhiteKnightLogo from "../../assets/super-white-knight.png";
import superWhiteQueenLogo from "../../assets/super-white-queen.png";
import superWhiteRookLogo from "../../assets/super-white-rook.png";
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
                target.setFigure(new Rook(target.figure.color, target));
            if(figure === FigureNames.QUEEN)
                target.setFigure(new Queen(target.figure.color, target));
            if(figure === FigureNames.KNIGHT)
                target.setFigure(new Knight(target.figure.color, target));
            if(figure === FigureNames.BISHOP)
                target.setFigure(new Bishop(target.figure.color, target));

            if(figure === FigureNames.TIME_ROOK && target.figure.color === Colors.WHITE){
                const rook = new Rook(target.figure.color, target)
                rook.logo = superWhiteRookLogo;
                rook.name = FigureNames.TIME_ROOK;
                target.setFigure(rook);
            }
            if(figure === FigureNames.TIME_QUEEN && target.figure.color === Colors.WHITE){
                const queen = new Queen(target.figure.color, target)
                queen.logo = superWhiteQueenLogo;
                queen.name = FigureNames.TIME_QUEEN;
                target.setFigure(queen);
            }
            if(figure === FigureNames.TIME_KNIGHT && target.figure.color === Colors.WHITE){
                const knight = new Knight(target.figure.color, target)
                knight.logo = superWhiteKnightLogo;
                knight.name = FigureNames.TIME_KNIGHT;
                target.setFigure(knight);
            }
            if(figure === FigureNames.TIME_BISHOP && target.figure.color === Colors.WHITE){
                const bishop = new Bishop(target.figure.color, target)
                bishop.logo = superWhiteBishopLogo;
                bishop.name = FigureNames.TIME_BISHOP;
                target.setFigure(bishop);
            }

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


