import React, {useState} from 'react';

import check from '../../../resources/icons/check.svg';

import './Checkbox.scss';

const Checkbox = ({color = "#866752", label, onCheck, id}) => {

    const [checked, setChecked] = useState(true)

    return (
        <div className="checkbox-wrapper" onClick={() => {setChecked(!checked); onCheck(checked)}}>
            <div className={"checkbox " + (checked? ' checked': '')} style={{backgroundColor: checked? color: 'white'}}>
                <img src={check} alt="check"/>
            </div>
            <label>{label}</label>
        </div>
    )
}

export default Checkbox;