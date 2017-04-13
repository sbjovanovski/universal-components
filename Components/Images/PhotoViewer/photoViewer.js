/**
 *   Usage
 *   <PhotoViewer
 *     ref="photoViewer"
 *     photos={photos} (@array of Objects - {title, subtitle, image})
 *     startFrom={this.state.startFrom} (@integer - default 0)
 *   />
 Display by calling Reference.display;
 **/

import React, { Component } from 'react';
import Paging from './Paging/paging';
import ImageLoader from '../ImageLoader';
import helper from './_helper';
import ReactDOM from 'react-dom';
import './_photoViewer.scss';

export default class PhotoViewer extends Component {
    constructor(props) {
        super(props);
        this.destroy = this.destroy.bind(this);
        this.loadPhotos = this.loadPhotos.bind(this);
    }

    static defaultProps = {
        photos: [],
        startFrom: 0
    };

    state = {
        isVisible: false
    };

    displayPhotos = [];
    pictureContent = null;
    currentParent = null;

    componentWillReceiveProps(newProps) {
        this.loadPhotos(newProps.photos)
    }

    componentWillMount() {
        this.loadPhotos(this.props.photos)
    }

    loadPhotos(photos) {
        var style = {};
        this.displayPhotos = photos.map((photo, index) => {
            return (
                <div className="image-container" key={index}>
                    <div className="details-holder">
                        <i className="fa fa-close" onClick={this.destroy} />
                        <ImageLoader src={photo.image} popupHeight={this.props.popupHeight} />
                        <div className="details-container">
                            <div className="title" dangerouslySetInnerHTML={{ __html: photo.title }} />
                            <div className="subtitle" dangerouslySetInnerHTML={{ __html: photo.subtitle }} />
                        </div>
                    </div>
                </div>
            );
        });
    }

    display() {
        if (this.state.isVisible) {
            return;
        } else if (this.currentParent) {
            return;
        } else {
            helper.common.disableScroll();
            var allParents = document.getElementsByClassName("notify");
            this.currentParent = allParents[allParents.length - 1];
            var parent = this.currentParent;
            this.pictureContent = ReactDOM.render(<PictureContent height={{ height: (window.innerHeight - 56) + "px" }}
                                                                  child={ReactDOM.findDOMNode(this)}
                                                                  parent={ReactDOM.findDOMNode(this).parentNode}
                                                                  onDestroy={this.destroy}
                                                                  startFrom={this.props.startFrom}
                                                                  displayPhotos={this.displayPhotos.filter((item) => item != undefined)} />, parent);
        }
    }

    destroy() {
        var parent = this.currentParent;
        if (!parent) return;
        setTimeout(function () {
            ReactDOM.unmountComponentAtNode(parent);
        }.bind(this), 100);

        this.pictureContent = null;
        this.currentParent = null;
        helper.common.enableScroll();
        this.setState({
            isVisible: false
        });
    }

    render() {
        return <span>
                <div style={{ "display": (this.state.isVisible) ? "block" : "none" }}></div>
                </span>;
    }
}

const PictureContent = React.createClass({
    render: function () {
        return <div className="photo-viewer" style={this.props.height}>
            <div className="background" onClick={this.props.onDestroy} />
            <Paging itemsToShow={1} flexWrap={true} navigation="arrows" startFrom={this.props.startFrom}>
                {this.props.displayPhotos}
            </Paging>
        </div>;
    }
})