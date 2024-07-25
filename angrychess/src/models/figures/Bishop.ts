import {BaseFigure} from "./BaseFigure";
import {FigureNames} from './BaseFigure'
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackLogo from "../../assets/black-bishop.png";
import whiteLogo from "../../assets/white-bishop.png";

export class Bishop extends BaseFigure{

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.BISHOP;
    }
    canMove(target: Cell): boolean {
        if(!super.canMove(target))
            return false;
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
    
      static fromJSON(json: any, cell: Cell): Bishop {
        const pawn = new Bishop(json.color, cell);
        pawn.id = json.id;
        pawn.isFirstStep = json.isFirstStep;
        return pawn;
      }
}