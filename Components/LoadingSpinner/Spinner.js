import React, { Component } from 'react';
import './_spinner.scss';

export default class Spinner extends Component {
    static defaultProps = {
        size: "",
        color: "grey"
    };

    render() {
        let spinnerStyle = {};
        if (this.props.size === "small") {
            spinnerStyle = {
                width: "22px",
                height: "22px",
            };
        }

        return <div className="spinner-holder">
            <div className="spinner" style={spinnerStyle}>
                <div className="double-bounce1" style={{ backgroundColor: this.props.color }}></div>
                <div className="double-bounce2" style={{ backgroundColor: this.props.color }}></div>
            </div>
        </div>
    };
}