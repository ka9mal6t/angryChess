import { FC } from 'react';

interface ModalProps {
    isOpen: boolean;
    message: string;
    handleClose: () => void;
    messageCancel: string;
}

const LoadingComponent: FC<ModalProps> = ({ isOpen, message, handleClose, messageCancel}) => {
    return (
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <h2>{message}</h2>
                <div className="loader" id="loader-4">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className="centered-button-container">
                    <button className="centered-button" onClick={handleClose}>{messageCancel}</button>
                </div>
            </div>
        </div>
);
};

export default LoadingComponent;
