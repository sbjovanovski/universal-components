/**
 *Tabs component usage:
 *
 * You can use the tabs component and add it to the React component like this:
 *
 * <Tabs onMount={onComponentMountFunction}
 *       className=""
 *       liClass=""
 *       background=""
 *       removeRoundedEdges={true/false, default(false)}
 *       onBeforeChange={onBeforeChangingTab}
 *       onAfterChange={onAfterChangingTab}
 *       tabActive={number}>
 *     <Tabs.Panel title="Tab Title 1" icon="">
 *         Tab content 1
 *     </Tabs.Panel>
 *     <Tabs.Panel title="Tab Title 2">
 *         Tab content 2
 *     </Tabs.Panel>
 * </Tabs>
 */
var React = require("react");
import "./_tabs.scss";

var Tabs = React.createClass({
    propTypes: {
        className: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.string,
            React.PropTypes.object
        ]),
        tabActive: React.PropTypes.number, //index of child tab that will be shown as active
        onMount: React.PropTypes.func,
        onBeforeChange: React.PropTypes.func,
        onAfterChange: React.PropTypes.func,
        children: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.element
        ]).isRequired
    },
    getDefaultProps: function () {
        return {tabActive: 1};
    },
    getInitialState: function () {
        return {
            tabActive: this.props.tabActive
        };
    },
    shouldComponentUpdate: function (nextProps, nextState) {
        // if (nextState.tabActive !== this.state.tabActive) return false;
        return true;
    },
    componentDidMount: function () {
        var index = this.state.tabActive;
        var selectedPanel = this.refs["tab-panel"];
        var selectedMenu = this.refs[("tab-menu-" + index)];

        if (this.props.onMount) {
            this.props.onMount(index, selectedPanel, selectedMenu);
        }
    },
    componentWillReceiveProps: function (newProps) {
        if (newProps.tabActive) {
            this.setState({tabActive: newProps.tabActive})
        }
    },
    render: function () {
        var className = "ip-tab-panel" + (typeof(this.props.className) == "undefined" ? "" : " " + this.props.className);
        return (
            <div className={className}>
                {this._getMenuItems()}
                {this._getSelectedPanel()}
            </div>
        );
    },
    setActive: function (index) {
        var onAfterChange = this.props.onAfterChange;
        var onBeforeChange = this.props.onBeforeChange;
        var selectedPanel = this.refs["tab-panel"];
        var selectedTabMenu = this.refs[("tab-menu-" + index)];

        if (onBeforeChange) {
            var cancel = onBeforeChange(index, selectedPanel, selectedTabMenu);
            if (cancel === false) {
                return
            }
        }

        this.setState({tabActive: index}, function () {
            if (onAfterChange) {
                onAfterChange(index, selectedPanel, selectedTabMenu);
            }
        });
    },
    setActiveEvent: function (e) {
        var index = e.target.dataset.id;

        this.setActive(index);

        e.preventDefault();
    },
    _getMenuItems: function () {
        if (!this.props.children) {
            throw new Error("Tabs must contain at least one Tabs.Panel");
        }

        if (!Array.isArray(this.props.children)) {
            this.props.children = [this.props.children];
        }

        var menuItems = this.props.children
            .map(function (panel) {
                return typeof panel === "function" ? panel() : panel;
            })
            .map(function (panel, index) {
                if (!panel) return undefined;
                var ref = ("tab-menu-" + (index + 1));
                var title = panel.props.title;
                var icon = panel.props.icon;
                var hideIconOnLargeScreen = panel.props.hideIconOnLargeScreen;
                var isActive = this.state.tabActive == (index + 1);
                var classes = (isActive ? "active" : "");
                var which = "";
                if (!this.props.removeRoundedEdges) {
                    if (index === this.props.children.length - 1) {
                        which = " last";
                    } else if (index === 0) {
                        which = " first";
                    }
                }
                var liClass = " " + this.props.liClass;
                return (
                    <li ref={ref} key={index} data-id={index+1} className={classes + which + liClass}
                        onClick={this.setActiveEvent}
                        style={{background:this.props.background}}>
                        <a data-id={index+1}>
                            <div className="show-on-large-screen" data-id={index+1}>
                                {icon && !hideIconOnLargeScreen && <img src={icon}
                                              className="img-responsive"
                                              data-id={index+1}
                                              alt={title}
                                              title={title}/>}
                                &nbsp;
                                {title}
                            </div>

                            <div className="show-on-small-screen" data-id={index+1}>
                                {icon ?
                                    <img src={icon}
                                         className="w-100"
                                         data-id={index+1}
                                         alt={title}
                                         title={title}/>
                                    :
                                    title
                                }</div>

                        </a>
                    </li>
                );
            }.bind(this));

        return (
            <div className="tabs-nav-holder">
                <nav className={this.props.className}
                     style={{background:this.props.background?this.props.background:"#f2f2f2"}}>
                    <ul className="tabs">
                        {menuItems}
                    </ul>
                </nav>
            </div>
        );
    },
    _getSelectedPanel: function () {
        var index = this.state.tabActive - 1;
        var visiblePanel = this.props.children[index];
        var newChildren = [];
        for (var i = 0; i < this.props.children.length; i++) {
            if (!this.props.children[i]) continue;
            if (this.props.children[i] !== visiblePanel) {
                newChildren.push(React.cloneElement(this.props.children[i], {key: i, isVisible: false}));
            } else {
                newChildren.push(React.cloneElement(this.props.children[i], {key: i, isVisible: true}));
            }
        }

        return (newChildren);
    }
});

Tabs.Panel = React.createClass({
    displayName: "TabPanel",
    propTypes: {
        title: React.PropTypes.string.isRequired,
        isVisible: React.PropTypes.bool,
        children: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.element
        ]).isRequired
    },
    render: function () {
        if (this.props.isVisible)
            return (
                <article className="tab-content" ref="tab-panel">
                    <div>
                        {this.props.children}
                    </div>
                </article>
            );
        else {
            return <div/>;
        }
    }
});

module.exports = Tabs;
