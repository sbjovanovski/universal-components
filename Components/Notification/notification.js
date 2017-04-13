var React = require('react');
var ReactDOM = require('react-dom');
import './_notification.scss';

var Notification = React.createClass({
    notificationContent: null,
    currentParent: null,
    getDefaultProps: function () {
        return {
            type: "",
            title: '',
            message: '',
            duration: 0,
            position: "right",
            showNotification: false
        }
    },
    formState: function (props) {
        return {
            type: props.type,
            title: props.title,
            message: props.message,
            duration: props.duration,
            position: props.position ? props.position : "right",
            showNotification: props.showNotification
        }
    },
    getInitialState: function () {
        return this.formState(this.props);
    },
    notificationType: function () {
        var style = {};
        if (this.props.type === "success") {
            style.background = "#4bb47b";
        }
        if (this.props.type === "error") {
            style.background = "#ed4848";
        }
        if (this.props.type === "info") {
            style.background = "#1072ba";
        }
        if (this.props.position === "top") {
            style.left = "50%";
            style.top = "5px";
            style.transform = "translate(-50%,0)";
        }
        else {
            style[this.props.position] = "5px";
        }

        return style;
    },
    destroyNotification: function () {
        var parent = this.currentParent;
        if (!parent) return;
        setTimeout(function () {
            ReactDOM.unmountComponentAtNode(parent);
        }.bind(this), 100);

        this.notificationContent = null;
        this.currentParent = null;
        if (this.props.onDestroy)
            this.props.onDestroy();
    },
    componentWillReceiveProps: function (newProps) {
        if (newProps.showNotification) {
            this.setState(this.formState(newProps), () => {
                this.displayNotification()
            });
        } else {
            setTimeout(function () {
                this.setState(this.formState(newProps), () => {
                    this.destroyNotification();
                });
            }.bind(this), 5000);
        }
    },
    displayNotification: function () {
        if (!this.state.showNotification) {
            return;
        } else if (this.currentParent) {
            return;
        } else {
            var allParents = document.getElementsByClassName("notify");
            this.currentParent = allParents[allParents.length - 1];
            var parent = this.currentParent;
            this.notificationContent = ReactDOM.render(<NotificationContent {...this.props}
                                                                            child={ReactDOM.findDOMNode(this)}
                                                                            parent={ReactDOM.findDOMNode(this).parentNode}
                                                                            notificationType={this.notificationType()}
                                                                            handleClick={this.destroyNotification} />, parent);
        }
        // this.setState({
        //     isVisible: true
        // })
    },
    componentWillUnmount: function () {
        if (this.state.showNotification) {
            this.destroyNotification();
        }
    },
    render: function () {
        return <span>
            <div style={{ "display": (this.state.showNotification) ? "block" : "none" }}></div>
        </span>
    }
});

var NotificationContent = React.createClass({
    componentDidMount: function () {
        setTimeout(function () {
            this.props.handleClick();
        }.bind(this), 5000);
    },
    render: function () {
        return <div className="notification animated fadeIn pointer"
                    style={this.props.notificationType}
                    onClick={this.props.handleClick}>
            <div className="notification-title">{this.props.title}</div>
            <div className="notification-description">{this.props.message}</div>
            <div className="notify"></div>
        </div>
    }
});

export default Notification;