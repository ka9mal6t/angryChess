import React, {FC, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Board} from "../../models/Board";
import {Cell} from "../../models/Cell";
import CellComponent from "./CellComponent";
import {Player} from "../../models/Player";
import {Colors} from "../../models/Colors";
import {FigureNames} from '../../models/figures/BaseFigure'
import ChooseFigureComponent from "../../modal/ChooseFigureComponent";
import MessageComponent from "../../modal/MessageComponent";
import { DndProvider } from 'react-dnd';
import { MultiBackend } from 'react-dnd-multi-backend';
import { HTML5toTouch } from 'rdndmb-html5-to-touch'

interface BoardProps {
    matchId: number,
    swapSides: boolean,
    spectator: boolean,
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
const BoardOnlineComponent: FC<BoardProps> = ({matchId, swapSides, spectator, board, setBoard, currentPlayer, swapPlayer, onMove, playerColor, draw, loose, sendWin, sendDraw}) => {
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
    const [showChooseModal, setShowChooseModal] = useState(false);
    const [modalShown, setModalShown] = useState<boolean>(true);
    const[lastCell, setLastCell] = useState<Cell | null>(null);
    const[win, setWin] = useState<boolean>(false);
    const [dragSuccess, setDragSuccess] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSelectFigure = (figureName: FigureNames) => {
        if (lastCell) {
            lastCell.pawnUp(lastCell, figureName);
            setShowChooseModal(false);
            
            onMove(board);
            const enemyColor: Colors = swapPlayer();
            

            if (board.staleMate(enemyColor)) {
                sendDraw();
            }
         
            if (board.checkMate(enemyColor)) {
                sendWin();
            }
            setSelectedCell(null);
        }
    };


    function click(cell: Cell) {
        if (selectedCell && selectedCell !== cell 
            && selectedCell.figure?.canMove(cell)) {
            moveFigure(selectedCell, cell);
        } else if (cell.figure?.color === currentPlayer?.color 
            && currentPlayer?.color === playerColor) {
            setSelectedCell(cell);
        }
        else if (cell.figure?.color === currentPlayer?.color && spectator) {
            setSelectedCell(cell);
        }
    }

    function moveFigure(fromCell: Cell, toCell: Cell) {
        if (fromCell !== toCell && fromCell.figure?.color === currentPlayer?.color 
            && fromCell.figure?.canMove(toCell) && currentPlayer?.color === playerColor && !spectator) {
            fromCell.moveFigure(toCell);

            fromCell.board.clearLastMoveHighlight();
            fromCell.lastMoveHighlight = true;
            toCell.lastMoveHighlight = true;
            
            setLastCell(toCell);
            setDragSuccess(true);

            if (fromCell.checkPawnUp(toCell)) {
                setShowChooseModal(true);
            }
            else{
                onMove(board);
                const enemyColor: Colors = swapPlayer();
                
    
                if (board.staleMate(enemyColor)) {
                    sendDraw();
                }
             
                if (board.checkMate(enemyColor)) {
                    sendWin();
                    setWin(true);
                }
                setSelectedCell(null);
            }
            
        }
        else if(currentPlayer?.color === playerColor ){
            highlightCells();
        }
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
        
        if (!dragSuccess && fromCell.figure?.color === currentPlayer?.color && currentPlayer?.color === playerColor && !spectator) {
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

            {swapSides ? 

                (playerColor === Colors.WHITE
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
                        )
                    
                    :

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
                        )) 
            : 
            
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
                ) 

            }
            {showChooseModal && (
                <ChooseFigureComponent
                    isOpen={showChooseModal}
                    handleClose={() => setShowChooseModal(false)}
                    handleSelectFigure={handleSelectFigure}/>
            )}
            
            {showChooseModal && <div className="overlay" />}

            {modalShown && (draw || loose) &&(
                <MessageComponent
                    isOpen={modalShown}
                    handleClose={() => {
                        setModalShown(false);
                        navigate('/match/' + matchId)
                    }}
                    message={draw ? 'Draw' : `${win? playerColor.toUpperCase() : 
                        (playerColor === Colors.BLACK ? Colors.WHITE.toUpperCase() : Colors.BLACK.toUpperCase())} won`}
                />
            )}

        </div>
        </DndProvider>
    );

};

export default BoardOnlineComponent;