import React, { FC, useEffect, useState } from 'react';
import { Board } from "../../models/Board";
import { Cell } from "../../models/Cell";
import CellComponent from "./CellComponent";
import { Player } from "../../models/Player";
import { Colors } from "../../models/Colors";
import { FigureNames } from "../../models/figures/BaseFigure";
import ChooseFigureComponent from "../../modal/ChooseFigureComponent";
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

const BoardComponent: FC<BoardProps> = ({ board, setBoard, currentPlayer, swapPlayer }) => {
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
    const [showChooseModal, setShowChooseModal] = useState(false);
    const [messageModal, setMessageModal] = useState<string | null>(null);
    const [resultModal, setResultModal] = useState<boolean>(true);
    const [modalShown, setModalShown] = useState<boolean>(false);
    const [lastCell, setLastCell] = useState<Cell | null>(null);
    const [dragSuccess, setDragSuccess] = useState<boolean>(false);

    const handleSelectFigure = (figureName: FigureNames) => {
        if (lastCell) {
            lastCell.pawnUp(lastCell, figureName);
            setShowChooseModal(false);
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

    function moveFigure(fromCell: Cell, toCell: Cell) {
        if (fromCell !== toCell && fromCell.figure?.color === currentPlayer?.color 
            && fromCell.figure?.canMove(toCell)) {
            fromCell.moveFigure(toCell);

            fromCell.board.clearLastMoveHighlight();
            fromCell.lastMoveHighlight = true;
            toCell.lastMoveHighlight = true;

            setLastCell(toCell);
            setDragSuccess(true);

            if (fromCell.checkPawnUp(toCell)) {
                setShowChooseModal(true);
            }

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
                                <CellComponent
                                    key={cell.id}
                                    cell={cell}
                                    selected={cell.x === selectedCell?.x && cell.y === selectedCell?.y}
                                    click={click}
                                    onDropFigure={onDropFigure}
                                />
                            ))}
                        </React.Fragment>
                    ))
                    : board.cells.slice().reverse().map((row, index) => (
                        <React.Fragment key={index}>
                            {row.slice().reverse().map(cell => (
                                <CellComponent
                                    key={cell.id}
                                    cell={cell}
                                    selected={cell.x === selectedCell?.x && cell.y === selectedCell?.y}
                                    click={click}
                                    onDropFigure={onDropFigure}
                                />
                            ))}
                        </React.Fragment>
                    ))}
                {showChooseModal && (
                    <ChooseFigureComponent
                        isOpen={showChooseModal}
                        handleClose={() => setShowChooseModal(false)}
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

export default BoardComponent;
