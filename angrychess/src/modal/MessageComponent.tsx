import React, { FC, useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    message: string | null;
    handleClose: () => void;
}

const MessageComponent: FC<ModalProps> = ({ isOpen, message, handleClose}) => {


    return (
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <h2>{message}</h2>
                <div className="centered-button-container">
                    <button className="centered-button" onClick={handleClose}>Ok</button>
                </div>
            </div>
        </div>
);
};

export default MessageComponent;
