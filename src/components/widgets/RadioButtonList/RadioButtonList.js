import React, {Component} from 'react';

import RadioButton from '../RadioButton/RadioButton';

import './RadioButtonList.scss';

class RadioButtonList extends Component {
    
    state = {
        selectedRadioButton: ''
    }

    componentDidMount = () => {
        const interval = setInterval(() => {
            if (this.props.children !== undefined) {
                clearInterval(interval)
                if (this.props.children instanceof Array) {
                    
                    if (this.props.children[0].type.displayName === 'RadioButton') {
                        
                        this.setState({
                            selectedRadioButton: this.props.children[0].props.name
                        })
                    }
                } else {
                    if (this.props.children.type.displayName === 'RadioButton') {
                        this.setState({
                            selectedRadioButton: this.props.children.props.name
                        })
                    }
                }
            }
        }, 200)
    }

    chooseOption = (name) => {
        this.setState({
            selectedRadioButton: name,
        }, () => 
            this.props.onChoice(name)
        )
    }
    
    render() {
        return (
            <div className="radio-button-list">
                {(this.props.children instanceof Array) 
                    ? this.props.children
                        .filter(radioButton => radioButton.type.displayName === 'RadioButton')
                        .map(r => (
                            <RadioButton 
                                key={r.key}
                                name={r.props.name}
                                selected={this.state.selectedRadioButton === r.props.name}
                                onClick={this.chooseOption}/>
                        ))
                    : this.props.children.type.displayName === 'RadioButton'
                        ? (
                            <RadioButton 
                                name={this.props.children.name}
                                selected={this.state.selectedRadioButton === this.props.children.name}
                                onClick={this.chooseOption}/>
                        )
                        : '' 
                }
                
            </div>
        )
    }
    
}

export default RadioButtonList;