// import React, {FC} from 'react';
// import {Cell} from "../models/Cell";
// import { useDrag, useDrop } from 'react-dnd';

// interface CellProps{
//     cell: Cell;
//     selected: boolean;
//     click: (cell: Cell) => void;
// }
// const CellComponent: FC<CellProps> = ({cell, selected, click}) => {
//     return (
//         <div className={['cell', cell.color, selected ? 'selected': null, cell.isKingUnderCheck() ? 'isKingUnderCheck' : null].join(' ')}
//              onClick={() => click(cell)}
//              style = {{background: cell.available && cell.figure ? 'green' : ''}}
//         >
//             {cell.available && !cell.figure && <div className={'available'}/>}
//             {cell.figure?.logo && <img src={cell.figure.logo} alt=""/>}
//         </div>
//     );
// };

// export default CellComponent;


// import React, { FC } from 'react';
// import { Cell } from "../models/Cell";
// import { useDrag, useDrop } from 'react-dnd';

// interface CellProps {
//     cell: Cell;
//     selected: boolean;
//     click: (cell: Cell) => void;
//     onDropFigure: (fromCell: Cell, toCell: Cell) => void;
// }

// const CellComponent: FC<CellProps> = ({ cell, selected, click, onDropFigure }) => {
//     const [{ isOver, canDrop }, drop] = useDrop(() => ({
//         accept: 'figure',
//         drop: (item: { cell: Cell }) => {
//             onDropFigure(item.cell, cell);
//         },
//         collect: monitor => ({
//             isOver: monitor.isOver(),
//             canDrop: monitor.canDrop(),
//         }),
//     }), [cell, onDropFigure]);

//     return (
//          <div
//             ref={drop}
//             className={[
//                 'cell',
//                 cell.color,
//                 selected ? 'selected' : null,
//                 cell.isKingUnderCheck() ? 'isKingUnderCheck' : null,
//                 isOver && canDrop ? 'highlighted' : null, // Добавляем класс для выделения ячейки
//             ].join(' ')}
//             onClick={() => click(cell)}
//         >
//             {cell.available && !cell.figure && <div className={'available'} />}
//             {
//                 <DraggableFigure
//                     cell={cell}
//                 />
//             }
//         </div>
//     );
// };

// interface DraggableFigureProps {
//     cell: Cell;
// }

// const DraggableFigure: FC<DraggableFigureProps> = ({ cell }) => {
//     const [{ isDragging }, drag] = useDrag(() => ({
//         type: 'figure',
//         item: { cell },
//         collect: monitor => ({
//             isDragging: !!monitor.isDragging(),
//         }),
//     }), [cell]);
//     if(cell.figure?.logo)
//     return (
//         <img
//             ref={drag}
//             src={cell.figure?.logo}
//             alt=""
//             style={{
//                 opacity: isDragging ? 0.5 : 1,
//                 cursor: 'pointer', // Курсор как при наведении на кнопку
//                 zIndex: 10, // Позволяет фигуре быть поверх ячейки
//             }}
//         />
//     );
//     else return null;
// };

// export default CellComponent;

import React, { FC } from 'react';
import { Cell } from "../models/Cell";
import { useDrag, useDrop } from 'react-dnd';

interface CellProps {
    cell: Cell;
    selected: boolean;
    click: (cell: Cell) => void;
    onDropFigure: (fromCell: Cell, toCell: Cell) => void;
}

const CellComponent: FC<CellProps> = ({ cell, selected, click, onDropFigure }) => {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: 'figure',
        drop: (item: { cell: Cell }) => {
            onDropFigure(item.cell, cell);
        },
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }), [cell, onDropFigure]);

    return (
        <div
            ref={drop}
            className={[
                'cell',
                cell.color,
                selected ? 'selected' : null,
                cell.isKingUnderCheck() ? 'isKingUnderCheck' : null,
                isOver && canDrop ? 'highlighted' : null, // Добавляем класс для выделения ячейки
            ].join(' ')}
            onClick={() => click(cell)}
            style={{background: cell.available && cell.figure ? 'green' : ''}}
        >
            {cell.available && !cell.figure && <div className={'available'} />}
            {
                <DraggableFigure
                    cell={cell}
                />
            }
        </div>
    );
};

interface DraggableFigureProps {
    cell: Cell;
}

const DraggableFigure: FC<DraggableFigureProps> = ({ cell }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'figure',
        item: { cell },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [cell]);
    
    if(cell.figure?.logo) {
        return (
            <img
                ref={drag}
                src={cell.figure?.logo}
                alt=""
                style={{
                    opacity: isDragging ? 0.5 : 1,
                    cursor: 'pointer', // Курсор как при наведении на кнопку
                    zIndex: isDragging ? 1000 : 1, // Позволяет фигуре быть поверх ячейки
                    // position: 'absolute', // Обеспечивает правильное позиционирование при перетаскивании
                }}
            />
        );
    } else {
        return null;
    }
};

export default CellComponent;