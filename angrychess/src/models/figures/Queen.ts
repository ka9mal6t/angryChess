import {BaseFigure} from "./BaseFigure";
import {FigureNames} from './BaseFigure'
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackLogo from "../../assets/black-queen.png";
import whiteLogo from "../../assets/white-queen.png";

export class Queen extends BaseFigure{

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.QUEEN;
    }
    canMove(target: Cell): boolean {
        if(!super.canMove(target))
            return false;
        if(this.cell && this.cell.isEmptyVertical(target)
        && !this.cell.board.isWillBeKingUnderCheck(this.cell.y, this.cell.x, target.y, target.x))
            return true;
        if(this.cell && this.cell.isEmptyHorizontal(target)
        && !this.cell.board.isWillBeKingUnderCheck(this.cell.y, this.cell.x, target.y, target.x))
            return true;
        if(this.cell && this.cell.isEmptyDiagonal(target)
        && !this.cell.board.isWillBeKingUnderCheck(this.cell.y, this.cell.x, target.y, target.x))
            return true;
        return false;
    }
    toJSON() {
        return {
          ...super.toJSON(),
        };
      }
    
      static fromJSON(json: any, cell: Cell): Queen {
        const pawn = new Queen(json.color, cell);
        pawn.id = json.id;
        pawn.isFirstStep = json.isFirstStep;
        return pawn;
      }
}