import React from 'react';

import './RadioButton.scss';

const RadioButton = ({onClick, name, selected}) => {

    return (
        <div className={"radio-button" + (selected ? ' selected': '')} onClick={() => onClick(name)}>
            <div className="radio">
                <div className="selection-indicator" />
            </div>
            {name}
        </div>
    )
}
RadioButton.displayName = 'RadioButton'; //For production (child.type.name is empty in production).

export default RadioButton;