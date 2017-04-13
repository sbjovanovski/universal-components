var React = require('react');
import './_tooltipLabel.scss';

const TooltipLabel = React.createClass({
    getDefaultProps: function () {
        return {
            hideTooltip: false,
            tooltip: "",
            label: "",
            type: "",
            background: "#607D8B"
        }
    },
    getInitialState: function () {
        return {
            tooltip: "hide"
        }
    },
    showTooltip: function (e) {
        let tooltip = this.refs.tooltip;
        this.setState({
            tooltip: "show",
            top: e.target.offsetTop - tooltip.offsetHeight
        })
    },
    hideTooltip: function () {
        this.setState({
            tooltip: "hide"
        });
    },
    render: function () {
        let tooltipStyle = {
            top: this.state.top + "px",
            background: this.props.background,
            color: "#fff"
        };
        let labelStyle = {};
        if (!this.props.hideTooltip) {
            labelStyle = {
                cursor: "pointer",
                textDecoration: "underline"
            }
        }
        return <div className="tooltip-label">
            <div className={"tooltip " + this.state.tooltip}
                 ref="tooltip"
                 style={tooltipStyle}
                 dangerouslySetInnerHTML={{ __html: this.props.tooltip }} />

            <div className="label"
                 style={Object.assign(labelStyle, this.props.style)}
                 onMouseOver={!this.props.hideTooltip && this.showTooltip}
                 onMouseOut={!this.props.hideTooltip && this.hideTooltip}
                 dangerouslySetInnerHTML={{ __html: this.props.label }} />
        </div>
    }
});

module.exports = TooltipLabel;
