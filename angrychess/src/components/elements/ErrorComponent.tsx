import { FC } from 'react';

interface ModalProps {
    isOpen: boolean;
    message: string;
    handleClose: () => void;
    messageCancel: string;
}

const ErrorComponent : FC<ModalProps> = ({ isOpen, message, handleClose, messageCancel}) => {
    return (
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <h2 style={{color: '#ff2517'}}>{message}</h2>
                <div className="centered-button-container">
                    <button className="centered-button" onClick={handleClose}>{messageCancel}</button>
                </div>
            </div>
        </div>
);
};

export default ErrorComponent ;
