import {BaseFigure} from "./BaseFigure";
import {FigureNames} from './BaseFigure'
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import {Pawn} from "./Pawn"

export class PawnClone extends BaseFigure{

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = null;
        this.name = FigureNames.PAWNCLONE;
    }
    canMove(target: Cell): boolean {
        return false;
    }
    canMoveWithOutCheck(target: Cell): boolean {
      return false;
    }

    toJSON() {
        return {
          ...super.toJSON(),
        };
      }
    
      static fromJSON(json: any, cell: Cell): Pawn {
        const figure = new PawnClone(json.color, cell);
        figure.id = json.id;
        figure.isFirstStep = json.isFirstStep;
        return figure;
      }

}


