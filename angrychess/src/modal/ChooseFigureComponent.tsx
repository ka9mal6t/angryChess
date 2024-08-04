import { FC, useEffect } from 'react';
import {FigureNames} from '../models/figures/BaseFigure'

interface ModalProps {
  isOpen: boolean;
  handleClose: () => void;
  handleSelectFigure: (figureName: FigureNames) => void;
}

const ChooseFigureComponent: FC<ModalProps> = ({ isOpen, handleClose, handleSelectFigure, }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // блокируем прокрутку
    } else {
      document.body.style.overflow = 'auto'; // разблокируем прокрутку
    }
  }, [isOpen]);

  const handleFigureSelection = (figureName: FigureNames) => {
    handleSelectFigure(figureName);
    handleClose();
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <h2>Select a Figure</h2>
        <button onClick={() => handleFigureSelection(FigureNames.ROOK)}>Rook</button>
        <button onClick={() => handleFigureSelection(FigureNames.KNIGHT)}>Knight</button>
        <button onClick={() => handleFigureSelection(FigureNames.BISHOP)}>Bishop</button>
        <button onClick={() => handleFigureSelection(FigureNames.QUEEN)}>Queen</button>
      </div>
    </div>
  );
};

export default ChooseFigureComponent;
