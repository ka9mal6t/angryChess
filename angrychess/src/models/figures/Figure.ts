import {Colors} from "../Colors";
import {Cell} from "../Cell";
import {Pawn} from "../figures/Pawn";
import {Rook} from "../figures/Rook";
import {Knight} from "../figures/Knight";
import {Bishop} from "../figures/Bishop";
import {King} from "../figures/King";
import {Queen} from "../figures/Queen";
import {BaseFigure, FigureNames} from "./BaseFigure";
import { PawnClone } from "./PawnClone";

export class Figure extends BaseFigure {
    constructor(color: Colors, cell: Cell) {
        super(color, cell);
    }

    static fromJSON(json: any, cell: Cell): Figure {
        switch (json.name) {
            case FigureNames.PAWNCLONE:
                return new PawnClone(json.color, cell);
            case FigureNames.PAWN:
                return new Pawn(json.color, cell);
            case FigureNames.KNIGHT:
                return new Knight(json.color, cell);
            case FigureNames.BISHOP:
                return new Bishop(json.color, cell);
            case FigureNames.ROOK:
                return new Rook(json.color, cell);
            case FigureNames.QUEEN:
                return new Queen(json.color, cell);
            case FigureNames.KING:
                return new King(json.color, cell);
            default:
                throw new Error("Unknown figure type");
        }
    }
}