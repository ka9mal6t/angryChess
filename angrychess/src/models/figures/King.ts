import {BaseFigure} from "./BaseFigure";
import {FigureNames} from './BaseFigure'
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackLogo from "../../assets/black-king.png";
import whiteLogo from "../../assets/white-king.png";

export class King extends BaseFigure{
    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.KING;
    }
    canMove(target: Cell): boolean {
        if(!super.canMove(target))
            return false;
        if(this.cell && Math.abs(target.y - this.cell.y) < 2
            && Math.abs(target.x - this.cell.x) < 2
            && !this.cell.board.isWillBeKingUnderCheck(this.cell.y, this.cell.x, target.y, target.x))
            return true;

        if(this.color === Colors.WHITE){
            if(this.cell && target.y === this.cell.y
            && target.x === this.cell.x - 2
            && !this.cell.board.isWillBeKingUnderCheck(this.cell.y, this.cell.x, target.y, this.cell.x - 2)
            && !this.cell.board.isWillBeKingUnderCheck(this.cell.y, this.cell.x, target.y, this.cell.x - 1)
            && !this.cell.board.isKingUnderCheck(this.color)
            && this.isFirstStep

            && this.cell.board.getCell(0, 7).figure?.name === FigureNames.ROOK

            && this.cell.board.getCell(0, 7).figure?.color === this.color
            && this.cell.board.getCell(0, 7).figure?.isFirstStep){
                for (let col = 1; col < this.cell.x; col++) {
                    if (!this.cell.board.getCell(col, 7).isEmpty()) {
                        return false;
                    }
                }
                return true;
            }

            if(this.cell && target.y === this.cell.y
            && target.x === this.cell.x + 2
            && !this.cell.board.isWillBeKingUnderCheck(this.cell.y, this.cell.x, target.y, this.cell.x + 2)
            && !this.cell.board.isWillBeKingUnderCheck(this.cell.y, this.cell.x, target.y,  this.cell.x + 1)
            && !this.cell.board.isKingUnderCheck(this.color)
            && this.isFirstStep

            && this.cell.board.getCell(7, 7).figure?.name === FigureNames.ROOK

            && this.cell.board.getCell(7, 7).figure?.color === this.color
            && this.cell.board.getCell(7, 7).figure?.isFirstStep){
                for (let col = this.cell.x + 1; col < 7; col++) {
                    if (!this.cell.board.getCell(col, 7).isEmpty()) {
                        return false;
                    }
                }
                return true;
            }

        }
        else {
            if(this.cell && target.y === this.cell.y
            && target.x === this.cell.x - 2
            && !this.cell.board.isWillBeKingUnderCheck(this.cell.y, this.cell.x, target.y, this.cell.x - 2)
            && !this.cell.board.isWillBeKingUnderCheck(this.cell.y, this.cell.x, target.y, this.cell.x - 1)
            && !this.cell.board.isKingUnderCheck(this.color)
            && this.isFirstStep

            && this.cell.board.getCell(0, 0).figure?.name === FigureNames.ROOK

            && this.cell.board.getCell(0, 0).figure?.color === this.color
            && this.cell.board.getCell(0, 0).figure?.isFirstStep){
                for (let col = 1; col < this.cell.x; col++) {
                    if (!this.cell.board.getCell(col, 0).isEmpty()) {
                        return false;
                    }
                }
                return true;
            }

            if(this.cell && target.y === this.cell.y
            && target.x === this.cell.x + 2
            && !this.cell.board.isWillBeKingUnderCheck(this.cell.y, this.cell.x, target.y, this.cell.x + 2)
            && !this.cell.board.isWillBeKingUnderCheck(this.cell.y, this.cell.x, target.y, this.cell.x + 1)
            && !this.cell.board.isKingUnderCheck(this.color)
            && this.isFirstStep

            && this.cell.board.getCell(7, 0).figure?.name === FigureNames.ROOK

            && this.cell.board.getCell(7, 0).figure?.color === this.color
            && this.cell.board.getCell(7, 0).figure?.isFirstStep){
                for (let col = this.cell.x + 1; col < 7; col++) {
                    if (!this.cell.board.getCell(col, 0).isEmpty()) {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    }

    toJSON() {
        return {
          ...super.toJSON(),
        };
      }
    
      static fromJSON(json: any, cell: Cell): King {
        const pawn = new King(json.color, cell);
        pawn.id = json.id;
        pawn.isFirstStep = json.isFirstStep;
        return pawn;
      }
}