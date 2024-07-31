import {FC} from 'react';
import {Figure} from "../../super-models/figures/Figure";

interface SuperLostFigures{
    title: string;
    figures: Figure[];
}
const LostFigures: FC<SuperLostFigures> = ({title, figures}) => {
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