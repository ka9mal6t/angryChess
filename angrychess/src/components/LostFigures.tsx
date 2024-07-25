import React, {FC} from 'react';
import {Figure} from "../models/figures/Figure";

interface LostFiguresProps{
    title: string;
    figures: Figure[];
}
const LostFigures: FC<LostFiguresProps> = ({title, figures}) => {
    return (
        <div className='lost'>
            <div className="lostTitle">
                <h3>{title}</h3>
            </div>

            <div className='lostFigures'>
                {figures.map(figure =>
                <div key={figure.id}>
                    {figure.logo && <img width={20} height={20} src={figure.logo} alt={figure.name}/>}
                </div>)}
            </div>
        </div>
    );
};

export default LostFigures;