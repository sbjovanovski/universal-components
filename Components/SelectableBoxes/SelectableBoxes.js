import React, { Component } from 'react';
import findIndex from 'lodash/findIndex';
import './_selectableBoxes.scss';

export default class SelectableBoxes extends Component {
    constructor(props) {
        super(props);
        this.onSelectBox = this.onSelectBox.bind(this);
    }

    defaultProps = {
        data: [],
        maxSelection: 999999,
    };

    state = {
        data: [],
        selectedData: [],
    };

    componentWillMount() {
        this.setState({
            data: this.props.data,
        });
    }

    componentWillReceiveProps(newProps) {
        const selectedData = [];
        for (let i = 0; i < newProps.data.length; i++) {
            if (newProps.data[i].marked) {
                selectedData.push(newProps.data[i]);
            }
        }
        this.setState({
            data: newProps.data,
            selectedData,
        });
    }

    componentDidMount() {
        const selectedData = [];
        for (let i = 0; i < this.props.data.length; i++) {
            if (this.props.data[i].marked) {
                selectedData.push(this.props.data[i]);
            }
        }
        this.setState({
            selectedData,
        });
    }

    onSelectBox(selectedBox) {
        const propsData = this.state.data.slice();
        const selectedData = this.state.selectedData.slice();
        const propsDataIndex = findIndex(propsData, { id: selectedBox.id });
        const selectedDataIndex = findIndex(selectedData, { id: selectedBox.id });

        if ((selectedData.length > 0) && (this.props.maxSelection === 1)) {
            const oldIndex = findIndex(propsData, { value: selectedData[0].value });
            selectedData.splice(0, 1);
            selectedData.push(selectedBox);
            propsData[propsDataIndex].marked = true;
            propsData[oldIndex].marked = false;
        } else if (selectedDataIndex !== -1) {
            selectedData.splice(selectedDataIndex, 1);
            propsData[propsDataIndex].marked = false;
        } else if (this.props.maxSelection !== selectedData.length) {
            selectedData.push(selectedBox);
            propsData[propsDataIndex].marked = true;
        }

        this.setState({
            data: propsData,
            selectedData,
        }, () => {
            if (this.props.onSelect) {
                this.props.onSelect(this.state.selectedData);
            }
        });
    }

    render() {
        return (<div className='selectable-boxes'>
            {this.props.data.map((box, index) =>
                <Box key={index}
                     index={index}
                     text={box.text}
                     id={box.id}
                     value={box.value}
                     disabled={box.disabled}
                     marked={box.marked}
                     onSelect={this.onSelectBox} />
            )}
        </div>);
    }
}

const Box = React.createClass({
    onSelect() {
        this.props.onSelect(this.props);
    },
    render() {
        let planClass = 'box';
        if (this.props.marked) {
            planClass = 'box marked';
        }

        return (<div className='box-container'>
            <div className={planClass}
                 onClick={this.props.disabled ? null : this.onSelect}
                 dangerouslySetInnerHTML={{ __html: this.props.text }} />
        </div>);
    },
});
