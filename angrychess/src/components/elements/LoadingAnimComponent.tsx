import { FC } from 'react';
import '../../pages/css/AuthContext.css'

interface ModalProps {
    isOpen: boolean;
    handleClose: () => void;
}


const LoadingAnimComponent: FC<ModalProps> = ({ isOpen, handleClose}) => {
    return (
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <div className="loader" id="loader-4">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
);
};

export default LoadingAnimComponent;
