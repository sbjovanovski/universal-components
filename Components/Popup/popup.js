let utils = require("./_helper");
let EventListener = require("./event-listener");
let React = require("react");
let ReactDOM = require("react-dom");
let requestFrame = require("request-frame");
let isArray = require("lodash/isArray");
let findIndex = require("lodash/findIndex");
import './_popup.scss';

function findPos(obj) {
    let curtop = 0;
    let curleft = 0;
    if (obj.offsetParent - 1) {
        do {
            curleft -= obj.scrollLeft;
            curtop -= obj.scrollTop;
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (Boolean(obj = obj.offsetParent));
    }
    return { left: curleft, top: curtop };
}

let PopupMenu = React.createClass({
    collapsed: true,
    displayName: "PopupMenu",
    ev: null,
    options: null,
    currentParent: null,
    popupN: -1,
    getDefaultProps: function () {
        return {
            closeOnClick: true,
            disableScrolls: true,
            tintColor: "#000000",
            tint: 0,
            width: "initial",
            height: "initial",
            allwaysExpanded: false,
            onCollapse: null,
            top: 0,
            background: "",
            borderRadius: 0
        };
    },
    formStateFromProps: function (props) {
        let children;

        if (isArray(props.children)) {
            children = props.children.slice();
        } else {
            children = [props.children];
        }

        children = children.map(function (child, i) {
            return React.cloneElement(child, { key: "popupChild" + this.popupN + "i" + i });
        }.bind(this));

        return {
            width: props.width,
            children: children,
            background: props.background,
            borderRadius: props.borderRadius
        }
    },
    componentWillReceiveProps: function (newProps) {
        let allParents = document.getElementsByClassName("menu-container");
        this.popupN = allParents.length;
        if (this.currentParent) {
            this.popupN = findIndex(allParents, this.currentParent);
        }

        this.setState(this.formStateFromProps(newProps));
        if (this.options && this.options.isMounted()) {
            this.options.setState({
                width: newProps.width,
                background: newProps.background,
                borderRadius: newProps.borderRadius
            });
        }
    },
    getInitialState: function () {
        let s = this.formStateFromProps(this.props);
        s.isExpanded = false;
        return s;
    },
    disableScroll: function () {
        if (!this.collapsed && this.props.disableScrolls && !utils.common.isOnMobileDevice()) {
            utils.common.disableScroll();
        }
    },
    enableScroll: function () {
        if (this.collapsed || this.props.disableScrolls && !utils.common.isOnMobileDevice()) {
            utils.common.enableScroll();
        }
    },
    disableScrollWheel: function () {
        if (!this.collapsed && this.props.disableScrolls && !utils.common.isOnMobileDevice()) {
            utils.common.disableScrollWheel();
        }
    },
    enableScrollWheel: function () {
        if (!this.collapsed && this.props.disableScrolls && !utils.common.isOnMobileDevice()) {
            utils.common.enableScrollWheel();
        }
    },
    componentWillUpdate: function () {
        if (this.options && this.options.isMounted()) {
            this.options.setState({
                width: this.state.width
            });
        }
    },
    expandMenu: function (color) {
        let bg = color ? color : this.state.background;
        if (this.state.isExpanded) return;
        this.collapsed = false;
        let pos = findPos(ReactDOM.findDOMNode(this));
        let allParents = document.getElementsByClassName("menu-container");
        if (!allParents) {

        }
        this.currentParent = allParents[allParents.length - 1];
        let parent = this.currentParent;
        parent.style.zIndex = 999999999999999999;
        parent.style.display = "block";
        parent.style.background = "rgba(0,0,0,0.4)";

        this.options = ReactDOM.render(<Options {...this.props} popupN={this.popupN} child={ReactDOM.findDOMNode(this)}
                                                parent={ReactDOM.findDOMNode(this).parentNode}
                                                left={pos.left}
                                                background={bg}
                                                borderRadius={this.state.borderRadius}
                                                top={(this.props.top !== 0) ? this.props.top : pos.top}
                                                enableScrollWheel={this.enableScrollWheel}
                                                disableScrollWheel={this.disableScrollWheel}>{this.state.children}</Options>, parent);

        this.setState({
            isExpanded: true
        }, function () {
            if (this.state.isExpanded) {
                this.disableScroll();
                if (this.props.closeOnClick) {
                    this.ev = utils.common.onClickOutside(this.currentParent, this.collapseMenu);
                }
            }
        }.bind(this));
    },
    collapseMenu: function () {
        if (this.props.allwaysExpanded) {
            if (this.props.onCollapse) {
                this.props.onCollapse();
            }

            return;
        }

        this.destroyPopup();

        if (this.props.onCollapse) {
            this.props.onCollapse();
        }
    },
    destroyPopup: function () {
        this.collapsed = true;
        let parentNode = this.currentParent;
        if (!parentNode) return;
        parentNode.style.zIndex = -1;
        parentNode.style.display = "none";
        ReactDOM.unmountComponentAtNode(parentNode);
        //setTimeout(function () {
        //
        //}, 100);

        this.setState({
            isExpanded: false
        });

        this.enableScroll();

        if (this.ev) {
            this.ev.remove();
            this.ev = null;
        }
        this.options = null;
        this.currentParent = null;
        if (this.props.onCollapse)
            this.props.onCollapse();
    },
    reposition: function () {
        if (this.options) {
            this.options.forceUpdate();
        }
    },
    componentDidMount: function () {
        this.componentDidUpdate();
    },
    componentDidUpdate: function () {
        if (this.props.allwaysExpanded) {
            this.expandMenu();
        }
    },
    componentWillUnmount: function () {
        if (this.state.isExpanded) {
            this.destroyPopup();
        }
    },
    render: function () {
        return (
            <span>
                <div ref="tint"
                     style={{
                         width: "100%",
                         height: "100%",
                         position: "fixed",
                         zIndex: 2147483646,
                         left: 0,
                         top: 0,
                         opacity: this.props.tint,
                         backgroundColor: this.props.tintColor,
                         display: this.state.isExpanded ? "block" : "none"
                     }} />
            </span>
        );
    }
});

let Options = React.createClass({
    width: 0,
    height: 0,
    oldWidth: 0,
    oldHeight: 0,
    indicatorWidth: 0,
    indicatorHeight: 0,
    isOnHorizontalEdge: false,
    isOnVerticalEdge: false,
    resizeEvent: null,
    isMesuring: true,
    getInitialState: function () {
        return {
            top: this.props.top,
            left: this.props.left,
            width: this.props.width,
            height: this.props.height,
            lockToCenterX: false,
            lockToCenterY: false,
            relativeToScreen: false,
            addIndicatorDiv: false,
            wrapParent: false,
            trigger: false
        }
    },
    componentDidMount: function () {
        this.componentDidUpdate();
        let frameID = null;
        this.resizeEvent = EventListener.listen(window, "resize", function () {
            if (frameID === null) {
                frameID = requestFrame(function () {
                    frameID = null;
                    this.forceUpdate();
                }.bind(this));
            }
        }.bind(this));
    },
    componentWillUnmount: function () {
        this.resizeEvent.remove();
    },
    componentDidUpdate: function () {
        if (this.isMesuring) {
            this.mesure();
            this.isMesuring = false;
        } else {
            this.isMesuring = true;
        }
    },
    mesure: function () {
        let domNode = ReactDOM.findDOMNode(this.refs.optionsHolder);
        let style = domNode.currentStyle || window.getComputedStyle(domNode);
        this.width = Number(style.width.replace("px", ""));
        this.height = Number(style.height.replace("px", ""));

        if (this.refs.indicator) {
            let dn = this.refs.indicator.getDOMNode();
            style = dn.currentStyle || window.getComputedStyle(dn);

            this.indicatorWidth = Number(style.width.replace("px", ""));
            this.indicatorHeight = Number(style.height.replace("px", ""));
        }

        let pos = findPos(this.props.child);
        this.setState({
            left: pos.left,
            top: pos.top
        });
    },
    onWheel: function (e) {
        let target = e.currentTarget;
        let root = this.props.parent;
        while (target && target !== root && target !== document) {
            let style = target.currentStyle || window.getComputedStyle(target);
            if (style.overflowY == "scroll" || style.overflowY == "auto")
                break;
            target = target.parentNode;
        }

        if (!target || target === root || target === document) {
            this.props.disableScrollWheel();
            return;
        }

        this.disableScrollWhenOutOfBounds(e.deltaY, target);
    },
    disableScrollWhenOutOfBounds: function (goingUp, domNode) {
        if (utils.common.isOnMobileDevice()) return;

        if (goingUp > 0) {
            let style = domNode.currentStyle || window.getComputedStyle(domNode);
            let height = Number(style.height.replace("px", ""));
            if (domNode.scrollTop >= domNode.scrollHeight - height) {
                this.props.disableScrollWheel();
            } else {
                this.props.enableScrollWheel();
            }
        } else if (goingUp < 0) {
            if (domNode.scrollTop <= 0) {
                this.props.disableScrollWheel();
            } else {
                this.props.enableScrollWheel();
            }
        }
    },
    mesurementDraw: function () {
        let indicator;
        if (this.props.addIndicatorDiv && !this.props.relativeToScreen) {
            indicator = <div ref="indicator" key={"popup" + this.props.popupN + "indicator"}
                             style={{ position: "absolute", left: 0, top: 0 }}
                             className={"popup-indicator popup-indicator-top"} />;
        }
        return this.getPopupRender({
            left: 0,
            top: 0,
            position: "fixed",
            width: this.props.width,
            height: this.props.height
        }, indicator);
    },
    drawToParent: function () {
        let parentWidth;
        let parentHeight;

        if (this.props.parent) {
            let style = this.props.parent.currentStyle || window.getComputedStyle(this.props.parent);
            parentWidth = Number(style.width.replace("px", ""));
            parentHeight = Number(style.height.replace("px", ""));
        } else {
            parentWidth = 0;
            parentHeight = 0;
        }

        let left = this.state.left;//(window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        if (this.props.lockToCenterX) {
            left -= ((this.width - parentWidth) / 2);
        }

        let top = this.state.top;//(window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
        if (this.props.lockToCenterY) {
            top -= ((this.height - parentHeight) / 2);
        }

        let indicator = undefined;
        let indicatorSide;

        if (this.props.wrapParent && this.props.parent) {
            let isWrapped = true;
            let parentPos = findPos(this.props.parent);
            if (left <= parentPos.left + parentWidth && left + this.width >= parentPos.left &&
                top + this.height >= parentPos.top && top <= parentPos.top + parentHeight) {

                let oldTop = top;
                let toTop = null;
                if (top - parentPos.top > parentPos.top + parentHeight - top) {
                    top = parentPos.top + parentHeight;
                    toTop = false;
                } else {
                    top = parentPos.top - this.height;
                    toTop = true;
                }

                if ((top + this.height) > window.innerHeight || top < 0) {
                    if (toTop) {
                        top = parentPos.top + parentHeight;
                    } else {
                        top = parentPos.top - this.height;
                    }
                }

                if ((top + this.height) > window.innerHeight || top < 0) {
                    top = oldTop;
                    let oldLeft = left;
                    left = parentPos.left + parentWidth;
                    let toLeft = false;

                    if ((left + this.width) > window.innerWidth || left < 0) {
                        if (toLeft) {
                            left = parentPos.left + parentWidth;
                        } else {
                            left = parentPos.left - this.width;
                        }
                    }

                    if ((left + this.width) > window.innerWidth || left < 0) {
                        left = oldLeft;
                        isWrapped = false;
                    }
                }
            }

            if ((top + this.height) > window.innerHeight) {
                top = window.innerHeight - this.height;
            }

            if ((left + this.width) > window.innerWidth) {
                left = window.innerWidth - this.width;
            }

            if (top < 0) {
                top = 0;
            }

            if (left < 0) {
                left = 0;
            }

            if (isWrapped && this.props.addIndicatorDiv) {
                let indicatorLeft = parentPos.left - left + (parentWidth - this.indicatorWidth) / 2;
                let indicatorTop = parentPos.top - top + (parentHeight - this.indicatorHeight) / 2;

                if (indicatorLeft < 0) {
                    indicatorLeft = 0;
                    indicatorSide = "left";
                }

                if (indicatorLeft > this.width) {
                    indicatorLeft = this.width - this.indicatorWidth;
                    indicatorSide = "right";
                }

                if (indicatorTop < 0) {
                    indicatorTop = 0;
                    indicatorSide = "top";
                }

                if (indicatorTop > this.height) {
                    indicatorTop = this.height - this.indicatorHeight;
                    indicatorSide = "bottom";
                }

                indicator = <div key={"popup" + this.props.popupN + "indicator"} ref="indicator"
                                 style={{ position: "absolute", left: indicatorLeft, top: indicatorTop }}
                                 className={"popup-indicator popup-indicator-" + indicatorSide} />;
            }
        } else {
            if ((top + this.height) > window.innerHeight) {
                top = window.innerHeight - this.height;
            }

            if ((left + this.width) > window.innerWidth) {
                left = window.innerWidth - this.width;
            }

            if (top < 0) {
                top = 0;
            }

            if (left < 0) {
                left = 0;
            }
        }

        let mainStyle = {
            position: "fixed",
            left: left,
            top: (this.props.top !== 0) ? this.props.top : top,
            width: this.props.width,
            background: this.props.background,
            borderRadius: this.props.borderRadius
        };

        if (indicatorSide) {
            if (indicatorSide === "top" || indicatorSide === "bottom")
                mainStyle["padding" + indicatorSide[0].toUpperCase() + indicatorSide.slice(1)] = this.indicatorHeight;
            else
                mainStyle["padding" + indicatorSide[0].toUpperCase() + indicatorSide.slice(1)] = this.indicatorWidth;
        }

        if (this.width >= window.innerWidth) {
            if (indicatorSide == "left" || indicatorSide == "right") {
                indicator = undefined;
                mainStyle["paddingLeft"] = "5px";
                mainStyle["paddingRight"] = "5px";
                mainStyle["border"] = "1px solid #fff";
                // mainStyle["boxShadow"] = "0 0 0px 40px rgba(0, 0, 0, 0.35)";
            }
            left = 10;
            mainStyle["width"] = "calc(100% - 20px)";
            this.width = window.innerWidth - 20;
        }

        if (this.height >= window.innerHeight) {
            if (indicatorSide == "top" || indicatorSide == "bottom") {
                indicator = undefined;
                mainStyle["paddingTop"] = "15px";
                mainStyle["paddingBottom"] = "15px";
                mainStyle["border"] = "1px solid #fff";
                // mainStyle["box-shadow"] = "0 0 0px 40px rgba(0, 0, 0, 0.35)";
            }
            top = 10;
            mainStyle["height"] = "calc(100% - 20px)";
            this.height = window.innerHeight - 20;
        }

        return this.getPopupRender(mainStyle, indicator);
    },
    drawToScreen: function () {
        let left = 0;
        let top = 0;

        let w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName("body")[0],
            windowWidth = w.innerWidth || e.clientWidth || g.clientWidth,
            windowHeight = w.innerHeight || e.clientHeight || g.clientHeight;

        if (this.props.lockToCenterX) {
            left = ((windowWidth - this.width) / 2);
        }

        if (this.props.lockToCenterY) {
            top = ((windowHeight - this.height) / 2);
        }

        let mainStyle = {
            position: "fixed",
            //left: left,
            //top: (this.props.top !== 0) ? this.props.top : top,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: this.props.width,
            height: this.props.height,
            background: this.props.background,
            borderRadius: this.props.borderRadius,
            zIndex: 2147483647
        };

        if (this.width >= window.innerWidth) {
            mainStyle["paddingLeft"] = "5px";
            mainStyle["paddingRight"] = "5px";
            mainStyle["border"] = "1px solid #fff";
            // mainStyle["box-shadow"] = "0 0 0px 40px rgba(0, 0, 0, 0.35)";
            //mainStyle["left"] = 10;
            mainStyle["width"] = "calc(100% - 20px)";
            this.width = window.innerWidth - 20;
        }

        if (this.height >= window.innerHeight) {
            mainStyle["paddingTop"] = "15px";
            mainStyle["paddingBottom"] = "15px";
            // mainStyle["border"] = "1px solid #fff";
            // mainStyle["box-shadow"] = "0 0 0px 40px rgba(0, 0, 0, 0.35)";
            // mainStyle["top"] = 10;
            mainStyle["height"] = "calc(100% - 20px)";
            mainStyle["overflow-y"] = "scroll";
            this.height = window.innerHeight - 20;
            this.addMouseWheelEvent(this.refs.optionsHolder);
        }
        return this.getPopupRender(mainStyle);
    },
    addMouseWheelEvent: function (div) {
        if (div)
            div.addEventListener("mousewheel", this.mouseWheelHandler, false);
    },
    mouseWheelHandler: function (e, d) {
        const popupDiv = this.refs.optionsHolder;
        if ((popupDiv.scrollTop === (popupDiv.scrollHeight - popupDiv.clientHeight) && e.deltaY > 0) || (popupDiv.scrollTop === 0 && e.deltaY < 0)) {
            e.preventDefault();
        }
    },
    getPopupRender: function (mainStyle, indicator) {
        let browser = utils.common.detectBrowser();
        return (<div className={browser}>
            <div ref="optionsHolder"
                 key={"popup" + this.props.popupN + "popupOptions"}
                 style={mainStyle}
                 className={this.props.className} onWheel={this.onWheel}
                 onMouseOver={utils.common.isOnMobileDevice() ? undefined : this.props.enableScrollWheel}
                 onMouseOut={utils.common.isOnMobileDevice() ? undefined : this.props.disableScrollWheel}>
                {indicator}
                {this.props.children}
            </div>
            <div className="menu-container" key={"popup" + this.props.popupN + "menuContainer"} />
        </div>);
    },
    render: function () {
        if (this.isMesuring) {
            return this.mesurementDraw();
        } else {
            if (this.props.relativeToScreen)
                return this.drawToScreen();
            else
                return this.drawToParent();
        }
    }
});

module.exports = PopupMenu;
