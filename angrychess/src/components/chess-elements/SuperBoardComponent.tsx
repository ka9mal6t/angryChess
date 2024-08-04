import React, { FC, useEffect, useState } from 'react';
import { Board } from "../../super-models/Board";
import { Cell } from "../../super-models/Cell";
import SuperCellComponent from "./SuperCellComponent";
import { Player } from "../../super-models/Player";
import { Colors } from "../../super-models/Colors";
import { FigureNames } from "../../super-models/figures/BaseFigure";
import SuperChooseFigureComponent from "../../modal/SuperChooseFigureComponent";
import MessageComponent from "../../modal/MessageComponent";
import { DndProvider } from 'react-dnd';
import { MultiBackend } from 'react-dnd-multi-backend';
import { HTML5toTouch } from 'rdndmb-html5-to-touch'

interface BoardProps {
    board: Board;
    setBoard: (board: Board) => void;
    currentPlayer: Player | null;
    swapPlayer: () => Colors;
}

const SuperBoardComponent: FC<BoardProps> = ({ board, setBoard, currentPlayer, swapPlayer }) => {
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
    const [showChooseModal, setShowChooseModal] = useState(false);
    const [messageModal, setMessageModal] = useState<string | null>(null);
    const [resultModal, setResultModal] = useState<boolean>(true);
    const [modalShown, setModalShown] = useState<boolean>(false);
    const [lastCell, setLastCell] = useState<Cell | null>(null);
    const [dragSuccess, setDragSuccess] = useState<boolean>(false);
    const [superPawn, setSuperPawn] = useState<boolean>(false);

    const handleSelectFigure = (figureName: FigureNames) => {
        if (lastCell) {
            lastCell.pawnUp(lastCell, figureName);
            setShowChooseModal(false);

            const enemyColor: Colors = swapPlayer();

            if (board.staleMate(enemyColor) && resultModal && !modalShown) {
                setMessageModal(`Draw`);
                setModalShown(true);
            }
            if (board.checkMate(enemyColor) && resultModal && !modalShown) {
                setModalShown(true);
                setMessageModal(`${enemyColor === Colors.WHITE ? Colors.BLACK.toUpperCase() : Colors.WHITE.toUpperCase()} won`);
            }

            setSelectedCell(null);
        }
    };

    useEffect(() => {
        if (modalShown) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [modalShown]);

    function click(cell: Cell) {
        if (selectedCell && selectedCell !== cell 
            && selectedCell.figure?.canMove(cell)) {
            moveFigure(selectedCell, cell);
        } else if (cell.figure?.color === currentPlayer?.color) {
            setSelectedCell(cell);
        }
    }

    function doubleClick(cell: Cell) {
        if (cell.figure 
            && cell.figure?.color === currentPlayer?.color 
            && cell.figure?.name === FigureNames.PAWN 
            && !cell.board.isKingUnderCheck(cell.figure.color, cell.board)) {
            
            cell.board.clearLastMoveHighlight();
            cell.lastMoveHighlight = true;

            setLastCell(cell);
            setSuperPawn(true);
            setShowChooseModal(true);
        }
    }

    function moveFigure(fromCell: Cell, toCell: Cell) {
        if (fromCell !== toCell && fromCell.figure?.color === currentPlayer?.color 
            && fromCell.figure?.canMove(toCell)) {
            fromCell.moveFigure(toCell);

            fromCell.board.clearLastMoveHighlight();
            fromCell.lastMoveHighlight = true;
            toCell.lastMoveHighlight = true;

            setLastCell(toCell);
            setDragSuccess(true);

            // Delete ult of white PAWN
            if(toCell.figure?.color === Colors.BLACK){
                for(let i = 0; i < 8; i++){
                    for(let j = 0; j < 8; j++){
                        const cell = fromCell.board.cells[i][j];
                        if (cell?.figure?.color === Colors.WHITE &&
                            (cell?.figure?.name === FigureNames.TIME_BISHOP 
                            || cell?.figure?.name === FigureNames.TIME_KNIGHT 
                            || cell?.figure?.name === FigureNames.TIME_QUEEN
                            || cell?.figure?.name === FigureNames.TIME_ROOK)){
                                cell.figure = null;
                        }
                    }
                }
            }

            if (fromCell.checkPawnUp(toCell)) {
                setShowChooseModal(true);
            }
            else{
                const enemyColor: Colors = swapPlayer();

                if (board.staleMate(enemyColor) && resultModal && !modalShown) {
                    setMessageModal(`Draw`);
                    setModalShown(true);
                }
                if (board.checkMate(enemyColor) && resultModal && !modalShown) {
                    setModalShown(true);
                    setMessageModal(`${enemyColor === Colors.WHITE ? Colors.BLACK.toUpperCase() : Colors.WHITE.toUpperCase()} won`);
                }

                setSelectedCell(null);
            }
        }
        highlightCells();
    }

    function onDropFigure(fromCell: Cell, toCell: Cell) {
        setDragSuccess(false);

        // rokirovka
        
        if(fromCell.figure?.name === FigureNames.KING 
            && toCell.figure?.name === FigureNames.ROOK
            && fromCell.figure.color === toCell.figure.color){
                moveFigure(fromCell, toCell.x === 0 ? 
                    toCell.board.getCell(fromCell.x - 2, toCell.y) : 
                    toCell.board.getCell(fromCell.x + 2, toCell.y));
        }
        else{
            moveFigure(fromCell, toCell);
        }


        
        
        if (!dragSuccess && fromCell.figure?.color === currentPlayer?.color) {
            setSelectedCell(fromCell);
        }
    }

    useEffect(() => {
        highlightCells();
    }, [selectedCell]);

    function highlightCells() {
        board.highlightCells(selectedCell);
        updateBoard();
    }

    function updateBoard() {
        const newBoard = board.getCopyBoard();
        setBoard(newBoard);
    }

    return (
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
            <div className="board">
                {currentPlayer?.color === Colors.WHITE
                    ? board.cells.map((row, index) => (
                        <React.Fragment key={index}>
                            {row.map(cell => (
                                <SuperCellComponent
                                    key={cell.id}
                                    cell={cell}
                                    selected={cell.x === selectedCell?.x && cell.y === selectedCell?.y}
                                    click={click}
                                    doubleClick={doubleClick}
                                    onDropFigure={onDropFigure}
                                />
                            ))}
                        </React.Fragment>
                    ))
                    : board.cells.slice().reverse().map((row, index) => (
                        <React.Fragment key={index}>
                            {row.slice().reverse().map(cell => (
                                <SuperCellComponent
                                    key={cell.id}
                                    cell={cell}
                                    selected={cell.x === selectedCell?.x && cell.y === selectedCell?.y}
                                    click={click}
                                    doubleClick={doubleClick}
                                    onDropFigure={onDropFigure}
                                />
                            ))}
                        </React.Fragment>
                    ))}
                {showChooseModal && (
                    <SuperChooseFigureComponent
                        isOpen={showChooseModal}
                        superPawn={superPawn}
                        handleClose={() => {setShowChooseModal(false); setSuperPawn(false);}}
                        handleSelectFigure={handleSelectFigure}
                    />
                )}
                {showChooseModal && <div className="overlay" />}
                
                {modalShown && resultModal && (
                    <MessageComponent
                        isOpen={modalShown}
                        handleClose={() => {
                            setResultModal(false);
                            setModalShown(false);
                        }}
                        message={messageModal}
                    />
                )}
                {modalShown && resultModal && <div className="overlay" />}
            </div>
        </DndProvider>
    );
};

export default SuperBoardComponent;
