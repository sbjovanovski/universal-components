import React from 'react';
import cx from 'classnames';
import './Collapsible.scss';

class Collapsible extends React.Component {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        title: "",
        children: {},
        isCollapsed: false,
        titleColor: "",
        subTitle: "",
        showCloseIcon: false
    };

    state = {
        isCollapsed: this.props.isCollapsed,
    };

    handleOnClick = () => {
        this.setState({ isCollapsed: !this.state.isCollapsed });
    };

    render() {
        const { title, children, titleColor, subTitle, hideArrow, optionalTitle, showCloseIcon } = this.props;
        const { isCollapsed } = this.state;

        return (
            <div className="collapsible-base">
                <div onClick={this.handleOnClick}
                     className={cx("headerWrapper ", !isCollapsed && "collapsed")}
                     title={!isCollapsed ? "Click to collapse" : "Click to open"}>
                    <h3 className="title" style={{ color: titleColor }}>
                        {title}
                        {optionalTitle &&
                        <label className="optional-title">
                            {optionalTitle}
                        </label>
                        }
                    </h3>
                    <div className="icons">
                        {(subTitle && isCollapsed) && <label>{subTitle}</label>}
                        {!hideArrow && <i className={!isCollapsed ? "fa fa-arrow-down" : "fa fa-arrow-right"} />}
                        {(showCloseIcon && !isCollapsed) && <i className="fa fa-close" />}
                    </div>
                </div>
                {!isCollapsed &&
                <div className="content collapsed">
                    {children}
                </div>
                }
            </div>
        );
    }
}

export default Collapsible;
