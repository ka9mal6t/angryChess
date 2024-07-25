import {Colors} from "../Colors";
import {Cell} from "../Cell";
import logo from '../../assets/black-king.png'


export enum FigureNames {
    FIGURE = "Figure",
    KING = "King",
    KNIGHT = "Knight",
    PAWN = "Pawn",
    QUEEN = "Queen",
    ROOK = "Rook",
    BISHOP = "Bishop",
}

export class BaseFigure {
    color: Colors;
    logo: typeof logo | null;
    cell: Cell | null;
    name: FigureNames;
    isFirstStep: boolean = true;
    id: number;


    constructor(color: Colors, cell: Cell) {
        this.color = color;
        this.cell = null;
        this.logo = null;
        this.name = FigureNames.FIGURE;
        this.id = Math.random();
        this.cell = cell;
        this.cell.figure = this;
    }

    canMove(target: Cell): boolean {
        if (target.figure?.color === this.color)
            return false;
        return true;
    }

    toJSON() {
        return {
            color: this.color,
            logo: this.logo,
            id: this.id,
            isFirstStep: this.isFirstStep,
            name: this.name,
        };
    }

    moveFigure(target: Cell) {
        this.isFirstStep = false;
    }

    checkPawnUp(target: Cell): boolean {
        return true;
    }

    pawnUp(target: Cell, figure: FigureNames) {}
}
