import React, {useState} from 'react';
import { useSelector } from 'react-redux'

import Checkbox from '../../widgets/Checkbox/Checkbox';
import RadioButton from '../../widgets/RadioButton/RadioButton';
import RadioButtonList from '../../widgets/RadioButtonList/RadioButtonList';
import Selector from '../../widgets/Selector/Selector/Selector';

import * as helper from '../../../utils/Helper';

import './PartyChartFilter.scss';


const PartyChartFilter = ({onFilterChange, chart, moment}) => {
    const parties = useSelector(state => state.party.parties);
    const opinionInstitutes = useSelector(state => state.party.opinionInstitutes);
    const electionYears = useSelector(state => helper.getAllElectionYears(state.party.parties))
    const opinionMonths = useSelector(state => helper.getAllOpinionMonths(state.party.parties))


    const [toggled, setToggled] = useState(undefined);

    return (
        <div className="party-chart-filter-container">
            <div className={"party-chart-filter-toggler" + (toggled === true? ' active': '') + (toggled === false? ' inactive': '')} onClick={() => setToggled(toggled === undefined? true: !toggled)}>
                <p>Filtrera Diagrammet</p>
            </div>
            <div className={"party-chart-filter" + (toggled? ' toggled': '') + (toggled === false? ' hidden': '')}>
                <div className="filter-section">
                    <p className="header">Visade Partier</p>
                    {Object.keys(parties).map(party => {
                        return <Checkbox key={party} color={parties[party].color} label={parties[party].name} onCheck={(isChecked) => onFilterChange("parties", party, isChecked)}/>
                    })}
                </div>
                <div>
                    <div className="filter-section">
                        <p className="header">Diagramstyp</p>
                        <RadioButtonList onChoice={(name) => {onFilterChange('chart', name)}}>
                            <RadioButton key="opinionsundersökningar" name="opinionsundersökningar"/>
                            <RadioButton key="riksdagsval" name="riksdagsval"/>
                        </RadioButtonList>
                    </div>
                    <div className="filter-section">
                        <p className="header">{chart === 'opinionsundersökningar'? 'Månad': 'År'}</p>
                        <Selector choice={moment} options={chart === "riksdagsval"? electionYears: opinionMonths} select={(_, choice) => onFilterChange('moment', choice) }/>
                    </div>
                </div>
               
                <div className="filter-section">
                    <p className="header">Opinionsinstitut</p>
                    {opinionInstitutes.map(oi => {
                        return <Checkbox key={oi} label={oi} onCheck={(isChecked) => onFilterChange("opinionInstitutes", oi, isChecked)}/>
                    })}
                </div>
            </div>
        </div>
    )
}

export default PartyChartFilter;