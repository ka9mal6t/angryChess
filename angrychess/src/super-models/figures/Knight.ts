import {BaseFigure} from "./BaseFigure";
import {FigureNames} from './BaseFigure'
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackLogo from "../../assets/black-knight.png";
import whiteLogo from "../../assets/white-knight.png";

export class Knight extends BaseFigure{

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.KNIGHT;
    }
    canMove(target: Cell): boolean {
        if(!super.canMove(target))
            return false;
        if (this.cell){
          const dx = Math.abs(this.cell.x - target.x);
          const dy = Math.abs(this.cell.y - target.y);

          if (((dx === 1 && dy === 2) || (dx === 2 && dy === 1))
          && !this.cell.board.isWillBeKingUnderCheck(this.cell.y, this.cell.x, target.y, target.x))
              return true;
        }
        return false;
    }
    canMoveWithOutCheck(target: Cell): boolean {
      if (!super.canMove(target)) {
          return false;
      }
      if (this.cell){
        const dx = Math.abs(this.cell.x - target.x);
        const dy = Math.abs(this.cell.y - target.y);

        if (((dx === 1 && dy === 2) || (dx === 2 && dy === 1)))
          return true;
      }
      return false;
    }
    

    toJSON() {
        return {
          ...super.toJSON(),
        };
      }
    
      static fromJSON(json: any, cell: Cell): Knight {
        const figure = new Knight(json.color, cell);
        figure.id = json.id;
        figure.isFirstStep = json.isFirstStep;
        return figure;
      }

}