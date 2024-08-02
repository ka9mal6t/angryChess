import { FC, useRef} from 'react';
import { Cell } from "../../models/Cell";
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
                cell.lastMoveHighlight ? 'lastMoveHighlight': null,
                cell.isKingUnderCheck() ? 'isKingUnderCheck' : null,
                isOver && canDrop ? 'highlighted' : null, // Добавляем класс для выделения ячейки
            ].join(' ')}
            onClick={() => click(cell)}
            style={{background: cell.available && cell.figure ? '#be3b24' : '', aspectRatio: 1 / 1}}
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
                alt={cell.figure?.name}
                style={{
                    opacity: isDragging ? 0.5 : 1,
                    cursor: 'pointer', 
                    zIndex: isDragging ? 1000 : 1, 
                }}
            />
        );
    } else {
        return null;
    }
};

export default CellComponent;