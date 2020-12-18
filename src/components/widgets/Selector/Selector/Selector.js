import React, {useState} from 'react';
import sortIcon from '../../../../resources/icons/arrow.svg'


import './Selector.scss';

const Selector  = ({options, choice, select, name, prefix}) => {

    const [toggled, toggle] = useState(false);

    return (
        <div className="selector" onClick={() => toggle(!toggled)} onMouseLeave={() => toggle(false)}>
           
            <div className="choice">
                <p>{prefix? prefix + ':': ''} {choice}</p>
            </div>
            <img className="sort-icon" src={sortIcon} alt="sort"/>
            { toggled && 
                <ul className="options">
                    <div className="arrow" />
                    {options.map(o => <li key={o} onClick={() => select(name, o)}>{o}</li>)}
                </ul>
            }
        </div>
    )
}

export default Selector;