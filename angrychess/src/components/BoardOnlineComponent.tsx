import React, {FC, useEffect, useState} from 'react';
import { Navigate, useLocation, useNavigate, Link} from 'react-router-dom';
import {Board} from "../models/Board";
import {Cell} from "../models/Cell";
import CellComponent from "./CellComponent";
import {Player} from "../models/Player";
import {Colors} from "../models/Colors";
import {FigureNames} from '../models/figures/BaseFigure'
import ChooseFigureComponent from "../modal/ChooseFigureComponent";
import MessageComponent from "../modal/MessageComponent";
import { DndProvider } from 'react-dnd';
import { MultiBackend } from 'react-dnd-multi-backend';
import { HTML5toTouch } from 'rdndmb-html5-to-touch'

interface BoardProps {
    board: Board;
    setBoard: (board: Board) => void;
    currentPlayer: Player | null;
    swapPlayer: () => Colors;
    onMove: (newBoardState: Board) => void;
    playerColor: Colors;
    draw: boolean;
    loose: boolean;
    sendWin: () => void;
    sendDraw: () => void;
}
const BoardOnlineComponent: FC<BoardProps> = ({board, setBoard, currentPlayer, swapPlayer, onMove, playerColor, draw, loose, sendWin, sendDraw}) => {
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
    const [showChooseModal, setShowChooseModal] = useState(false);
    const [messageModal, setMessageModal] = useState<string | null>(null);
    const [resultModal, setResultModal] = useState<boolean>(true);
    const [modalShown, setModalShown] = useState<boolean>(true);
    const[lastCell, setLastCell] = useState<Cell | null>(null);
    const[win, setWin] = useState<boolean>(false);
    const [dragSuccess, setDragSuccess] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleSelectFigure = (figureName: FigureNames) => {
        if (lastCell) {
            lastCell.pawnUp(lastCell, figureName);
            setShowChooseModal(false);
        }
    };

    // useEffect(() => {
    //     if (modalShown) {
    //         document.body.style.overflow = 'hidden'; // блокируем прокрутку
    //     } else {
    //         document.body.style.overflow = 'auto'; // разблокируем прокрутку
    //     }
    // }, [modalShown]);

    function click(cell: Cell) {
        if (selectedCell && selectedCell !== cell 
            && selectedCell.figure?.canMove(cell)) {
            moveFigure(selectedCell, cell);
        } else if (cell.figure?.color === currentPlayer?.color 
            && currentPlayer?.color === playerColor) {
            setSelectedCell(cell);
        }
    }

    function moveFigure(fromCell: Cell, toCell: Cell) {
        if (fromCell !== toCell && fromCell.figure?.color === currentPlayer?.color 
            && fromCell.figure?.canMove(toCell) && currentPlayer?.color === playerColor) {
            fromCell.moveFigure(toCell);
            setLastCell(toCell);
            setDragSuccess(true);

            if (fromCell.checkPawnUp(toCell)) {
                setShowChooseModal(true);
            }

            onMove(board);
            const enemyColor: Colors = swapPlayer();
            

            if (board.staleMate(enemyColor)) {
                // setMessageModal(`Draw`)
                // setModalShown(true);
                sendDraw();
            }
            // if (draw) {
            //     setMessageModal(`Draw`)
            //     setModalShown(true);
            // }
            if (board.checkMate(enemyColor)) {
                // setModalShown(true)
                // setMessageModal(`${enemyColor === Colors.WHITE? Colors.BLACK.toUpperCase() : Colors.WHITE.toUpperCase()} won`)
                sendWin();
                setWin(true);
            }
            setSelectedCell(null);
        }
        else if(currentPlayer?.color === playerColor){
            highlightCells();
        }
    }

    // function click(cell: Cell){
    //     if (selectedCell && selectedCell !== cell && selectedCell.figure?.canMove(cell) && currentPlayer?.color === playerColor) {
    //         selectedCell.moveFigure(cell);
    //         setLastCell(cell);
    //         if (selectedCell.checkPawnUp(cell)) {
    //             setShowChooseModal(true);
    //         }

    //         setSelectedCell(null);
    //         const enemyColor: Colors = swapPlayer();
    //         onMove(board);

    //         if (board.staleMate(enemyColor)) {
    //             // setMessageModal(`Draw`)
    //             // setModalShown(true);
    //             sendDraw();
    //         }
    //         // if (draw) {
    //         //     setMessageModal(`Draw`)
    //         //     setModalShown(true);
    //         // }
    //         if (board.checkMate(enemyColor)) {
    //             // setModalShown(true)
    //             // setMessageModal(`${enemyColor === Colors.WHITE? Colors.BLACK.toUpperCase() : Colors.WHITE.toUpperCase()} won`)
    //             sendWin();
    //             setWin(true);
    //         }
    //         // if (loose){
    //         //     setModalShown(true)
    //         //     setMessageModal(`${enemyColor === Colors.WHITE? Colors.BLACK.toUpperCase() : Colors.WHITE.toUpperCase()} won`)
    //         // }

    //     } else {
    //         if (cell.figure?.color === currentPlayer?.color && currentPlayer?.color === playerColor) {
    //             setSelectedCell(cell);
    //         }
            
    //     }
        
    // }

    function onDropFigure(fromCell: Cell, toCell: Cell) {
        setDragSuccess(false);
        moveFigure(fromCell, toCell);
        if (!dragSuccess && fromCell.figure?.color === currentPlayer?.color) {
            setSelectedCell(fromCell);
        }
    }

    useEffect(() => {
        highlightCells()
    }, [selectedCell])

    function highlightCells(){
        board.highlightCells(selectedCell);
        updateBoard();
    }

    function updateBoard(){
        const newBoard = board.getCopyBoard();
        setBoard(newBoard);
    }
    return (
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
        <div className="board">
            {playerColor === Colors.WHITE
                ?
                board.cells
                    .map((row, index) =>

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
                    ):
                board.cells.slice().reverse().map((row, index) =>

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
                    )
            }
            {showChooseModal && (
                <ChooseFigureComponent
                    isOpen={showChooseModal}
                    handleClose={() => setShowChooseModal(false)}
                    handleSelectFigure={handleSelectFigure}/>
            )}
            {/* Блокировка интерактивных элементов при открытом модальном окне */}
            {showChooseModal && <div className="overlay" />}

            {modalShown && (draw || loose) &&(
                <MessageComponent
                    isOpen={modalShown}
                    handleClose={() => {
                        setModalShown(false);
                    }}
                    message={draw ? 'Draw' : `${win? playerColor.toUpperCase() : 
                        (playerColor === Colors.BLACK ? Colors.WHITE.toUpperCase() : Colors.BLACK.toUpperCase())} won`}
                />
            )}
            {/* Блокировка интерактивных элементов при открытом модальном окне */}
            {/* {modalShown && resultModal && <div className="overlay" />} */}
        </div>
        </DndProvider>
    );

};

export default BoardOnlineComponent;