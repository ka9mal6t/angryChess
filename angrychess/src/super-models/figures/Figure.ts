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
                const pawnClone = new PawnClone(json.color, cell);
                pawnClone.isFirstStep = json.isFirstStep;
                return pawnClone;
                
            case FigureNames.PAWN:
                const pawn = new Pawn(json.color, cell);
                pawn.isFirstStep = json.isFirstStep;
                return pawn;

            case FigureNames.KNIGHT:
                const knight = new Knight(json.color, cell);
                knight.isFirstStep = json.isFirstStep;
                return knight;

            case FigureNames.BISHOP:
                const bishop = new Bishop(json.color, cell);
                bishop.isFirstStep = json.isFirstStep;
                return bishop;

            case FigureNames.ROOK:
                const rook = new Rook(json.color, cell);
                rook.isFirstStep = json.isFirstStep;
                return rook;

            case FigureNames.QUEEN:
                const queen = new Queen(json.color, cell);
                queen.isFirstStep = json.isFirstStep;
                return queen;

            case FigureNames.KING:
                const king = new King(json.color, cell);
                king.isFirstStep = json.isFirstStep;
                return king;

            default:
                throw new Error("Unknown figure type");
        }
    }
}