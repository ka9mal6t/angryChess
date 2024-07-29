import React from 'react';
import {Link} from 'react-router-dom';

const FooterComponent: React.FC = () => {

    return(
        <footer className="footer">
            <div className="footer__item">
                <Link to="/help" className="footer__link">Help</Link>
            </div>
            <div className="footer__item">
                <Link to="/developers" className="footer__link">Developers</Link>
            </div>
            <div className="footer__item">
            AngryChess © 2024
            </div>
        </footer>
    );

};

export default FooterComponent;
