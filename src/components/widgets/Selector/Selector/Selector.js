import React, {useState} from 'react';
import sortIcon from '../../../../resources/icons/sort-icon.svg'


import './Selector.scss';

const Selector  = ({options, choice, select, name}) => {

    const [toggled, toggle] = useState(false);

    return (
        <div className="selector" onClick={() => toggle(!toggled)} onMouseLeave={() => toggle(false)}>
            <div className="choice">{choice}</div>
            <img className="sort-icon" src={sortIcon} alt="sort"/>
            {toggled && 
                <ul className="options">
                    {options.map(o => <li onClick={() => select(name, o)}>{o}</li>)}
                </ul>
            }
        </div>
    )
}

export default Selector;