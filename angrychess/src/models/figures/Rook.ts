import {BaseFigure} from "./BaseFigure";
import {FigureNames} from './BaseFigure'
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackLogo from "../../assets/black-rook.png";
import whiteLogo from "../../assets/white-rook.png";

export class Rook extends BaseFigure{

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.ROOK;
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
      return false;
    }
    canMoveWithOutCheck(target: Cell): boolean {
      if(!super.canMove(target))
        return false;
      if(this.cell && this.cell.isEmptyVertical(target))
          return true;
      if(this.cell && this.cell.isEmptyHorizontal(target))
          return true;
      return false;
  }

    toJSON() {
        return {
          ...super.toJSON(),
        };
      }
    
      static fromJSON(json: any, cell: Cell): Rook {
        const figure = new Rook(json.color, cell);
        figure.id = json.id;
        figure.isFirstStep = json.isFirstStep;
        return figure;
      }

}