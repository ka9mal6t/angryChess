import { FC, useEffect } from 'react';
import {FigureNames} from '../super-models/figures/BaseFigure'

interface ModalProps {
  isOpen: boolean;
  superPawn: boolean;
  handleClose: () => void;
  handleSelectFigure: (figureName: FigureNames) => void;
  
}

const SuperChooseFigureComponent: FC<ModalProps> = ({ isOpen, superPawn, handleClose, handleSelectFigure, }) => {
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
      {superPawn ? 
      <div className="modal-content">
        <h2>Select a Figure</h2>
            <button onClick={() => handleFigureSelection(FigureNames.TIME_ROOK)}>Rook</button>
            <button onClick={() => handleFigureSelection(FigureNames.TIME_KNIGHT)}>Knight</button>
            <button onClick={() => handleFigureSelection(FigureNames.TIME_BISHOP)}>Bishop</button>
            <button onClick={() => handleFigureSelection(FigureNames.TIME_QUEEN)}>Queen</button>
      </div>
      :
      <div className="modal-content">
        <h2>Select a Figure</h2>
            <button onClick={() => handleFigureSelection(FigureNames.ROOK)}>Rook</button>
            <button onClick={() => handleFigureSelection(FigureNames.KNIGHT)}>Knight</button>
            <button onClick={() => handleFigureSelection(FigureNames.BISHOP)}>Bishop</button>
            <button onClick={() => handleFigureSelection(FigureNames.QUEEN)}>Queen</button>
      </div>
    }
    </div>
  );
};

export default SuperChooseFigureComponent;
