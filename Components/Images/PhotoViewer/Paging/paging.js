/**
 * Paging component usage:
 *
 * <Paging navigation="arrows/numbers"
 *       flexWrap={true/false}
 *       itemsToShow={number}>
 *          <div>Item 1</div>
 *          <div>Item 2</div>
 *          <div>Item 3</div>
 *          ....
 * </Paging>
 **/

import React, { Component } from 'react';
import './_paging.scss';

export default class Paging extends Component {
    constructor(props) {
        super(props);
        this.navigationEventListener = this.navigationEventListener.bind(this);
        this.getNextPageArrows = this.getNextPageArrows.bind(this);
    }

    state = {
        activePage: this.props.startFrom + 1,
        start: this.props.startFrom,
        end: this.props.itemsToShow,
        leftArrowValue: this.props.startFrom,
        rightArrowValue: this.props.itemsToShow
    };

    navigationEventListener(event) {

        if (event.which === 37) {
            this.getNextPageArrows(event)
        } else if (event.which === 39) {
            this.getNextPageArrows(event)
        }
    }

    componentWillMount() {
        if (this.props.startFrom) {
            this.setState({
                activePage: this.props.startFrom ? this.props.startFrom + 1 : 1,
                start: this.props.startFrom ? this.props.startFrom : 0,
                end: this.props.startFrom ? this.props.startFrom + this.props.itemsToShow : this.props.itemsToShow,
                leftArrowValue: this.props.startFrom ? this.props.startFrom - this.props.itemsToShow : 0,
                rightArrowValue: this.props.startFrom ? this.props.startFrom + this.props.itemsToShow : this.props.itemsToShow
            });
        }
    }

    getNextPage(event) {
        this.setState({
            activePage: parseInt(event.target.dataset.id),
            start: parseInt(event.target.dataset.start),
            end: parseInt(event.target.dataset.end)
        });
    };

    renderPageNumbers() {
        const num = this.props.children.length / this.props.itemsToShow;
        let paging = [];
        let i = 1;
        let start = 0;
        let end = this.props.itemsToShow;
        for (; i < num; i++) {
            if (i !== 1) {
                start = start + (this.props.itemsToShow);
                end = end + (this.props.itemsToShow);
            }

            paging.push(<div data-id={i} data-start={start} data-end={end} key={i}
                             className={(i === this.state.activePage) ? "active" : "page-num"}
                             onClick={(i !== this.state.activePage) && ::this.getNextPage}>{i}</div>);
        }

        start = start + (this.props.itemsToShow);
        end = end + (this.props.itemsToShow);
        paging.push(<div data-id={i} data-start={start} data-end={end} key={i + 10}
                         className={(i === this.state.activePage) ? "active" : "page-num"}
                         onClick={(i !== this.state.activePage) && ::this.getNextPage}>{i}</div>);
        return paging;
    };

    getNextPageArrows(event) {
        const start = parseInt(event.target.dataset.start);
        const end = parseInt(event.target.dataset.end);

        if (start !== 0 && this.props.startFrom !== 0) {
            this.setState({
                start: start,
                end: end,
                leftArrowValue: start - this.props.itemsToShow,
                rightArrowValue: end
            });
        } else if (start !== 0 && this.props.startFrom === 0) {
            this.setState({
                start: start,
                end: end,
                leftArrowValue: start - this.props.itemsToShow,
                rightArrowValue: end
            });
        } else {
            this.setState({
                start: start,
                end: end,
                leftArrowValue: start,
                rightArrowValue: end
            }, () => {
                return;
            });
        }
    };

    render() {
        const { children, navigation, flexWrap, itemsToShow } = this.props;

        var style = {};
        if (flexWrap) {
            style.flexWrap = "wrap";
        }

        return <div className="paging" style={style}>
            {children.slice(this.state.start, this.state.end)}
            {(() => {
                switch (navigation) {
                    case 'numbers':
                        return <div className="paging-numbers">
                            {this.renderPageNumbers()}
                        </div>;
                    case "arrows":
                        return <div className="paging-arrows">
                            {this.state.start !== 0 &&
                            <div className="arrow-left fa fa-arrow-left"
                                 data-start={this.state.leftArrowValue}
                                 data-end={this.state.leftArrowValue + itemsToShow}
                                 onClick={this.getNextPageArrows} />
                            }

                            {this.state.end < children.length &&
                            <div className="arrow-right fa fa-arrow-right"
                                 data-start={this.state.rightArrowValue}
                                 data-end={this.state.rightArrowValue + itemsToShow}
                                 onClick={this.getNextPageArrows} />
                            }
                        </div>;
                }
            })()}
        </div>
    }
}

Paging.propTypes = {
    itemsToShow: React.PropTypes.number.isRequired,
    children: React.PropTypes.oneOfType([
        React.PropTypes.array,
        React.PropTypes.element
    ]).isRequired,
    flexWrap: React.PropTypes.bool,
    navigation: React.PropTypes.string.isRequired,
    startFrom: React.PropTypes.number
};

Paging.defaultProps = {
    itemsToShow: 1,
    children: [],
    flexWrap: true,
    navigation: "arrows",
    startFrom: 0
};