var React = require("react");
import SubText from './subText';
import PhotoViewer from './PhotoViewer/photoViewer';
import ImageLoader from './ImageLoader';
import './_Image.scss';

var Images = React.createClass({
    propTypes: {
        content: React.PropTypes.array,
        hasPopup: React.PropTypes.bool,
        color: React.PropTypes.string,
        popupImage: React.PropTypes.bool
    },
    getDefaultProps: function () {
        return {
            content: [],
            columns: null,
            centerContent: true,
            hasPopup: false,
            popupImage: false,
            color: "",
            imagesPerRow: 3,
            popupHeight: null,
            backgroundColo: null,
            roundBackground: false
        }
    },
    getInitialState: function () {
        return {
            popupImages: [],
            startFrom: 0
        }
    },
    componentWillReceiveProps: function (newProps) {
        this.showImagesInPopup(newProps.content);
    },
    componentWillMount: function () {
        this.showImagesInPopup(this.props.content);
    },
    renderImages: function () {
        return this.props.content.map(function (image, index) {

            //render list below the image
            var list = [];
            if (image.listItems) {
                image.listItems.map(function (item, index) {
                    list.push(<li key={index} dangerouslySetInnerHTML={{ __html: item }} />)
                });
            }

            if (image.description && image.description.indexOf("Food does not have description field") != -1) {
                image.description = "";
            }
            //check if the image description is an Array or a string and render it
            var description = [];
            if (image.description) {
                if (image.description instanceof Array) {
                    description = image.description.map(function (descr, index) {
                        return <p key={index} className="img-description"
                                  style={{
                                      color: image.color,
                                      textAlign: image.position,
                                      alignSelf: image.alignSelf
                                  }}
                                  dangerouslySetInnerHTML={{ __html: descr }} />
                    }.bind(this));
                } else {
                    description.push(<p key={index} className="img-description"
                                        style={{
                                            color: image.color,
                                            textAlign: image.position,
                                            alignSelf: image.alignSelf
                                        }}
                                        dangerouslySetInnerHTML={{ __html: image.description }} />);
                }
            }

            //check whether the image title is a profile title and if so, then set a different class
            var imgTitleClass = "img-title";
            if (image.isProfile) {
                imgTitleClass = "img-title-profile"
            }

            var imgSegmentClass = "img-segment";

            if (this.props.content.length === 1) {
                imgSegmentClass += " one";
            } else if (this.props.content.length === 2) {
                imgSegmentClass += " two";
            } else if (this.props.content.length === 3) {
                imgSegmentClass += " three";
            } else if (this.props.content.length === 4) {
                imgSegmentClass += " four";
            } else if (this.props.content.length > 4 && !this.props.columns) {
                imgSegmentClass += " three";
            } else {
                imgSegmentClass += " wrap";
            }

            let pointerClass = "";
            if (this.props.hasPopup) {
                pointerClass = " pointer";
            }

            return <div key={index} className={imgSegmentClass + pointerClass}
                        onClick={this.props.popupImage ? ()=>this.popupPhoto(index) : null}>
                <div className="user-photo">
                    <div className="photo">
                        <ImageLoader ref="image"
                                     src={image.url}
                                     className={(!image.removeCircle) ? "img-circle" : "img-responsive"} />
                        {image.rating > 0 &&
                        <div className="rating" style={{ background: this.ratingColor(image.rating) }}>
                            {image.rating}
                        </div>
                        }
                        <div className={this.props.textOverImage && "text-over-image"}
                             style={{ textAlign: image.position }}>

                            {image.title &&
                            <p className={imgTitleClass}
                               style={{ "color": image.color, textAlign: image.titlePosition }}
                               dangerouslySetInnerHTML={{ __html: image.title }} />
                            }

                            {(image.listItems) ? <ul className="img-list">
                                {list}
                            </ul> : null}
                            {description}
                        </div>
                        {image.subText &&
                        <SubText
                            text={image.subText.text}
                            greyboxText={image.subText.greyboxText}
                            color={image.subText.color} />
                        }
                    </div>
                </div>
            </div>

        }.bind(this));
    },
    popupPhoto: function (index) {
        this.setState({
            startFrom: index
        }, ()=> {
            setTimeout(()=> {
                this.refs.photoViewer.display();
            }, 100);
        })
    },
    ratingColor: function (ratingNum) {
        const num = Math.ceil(ratingNum);
        switch (num) {
            case 1:
                return "#E53E3E";
            case 2:
                return "#FF8383";
            case 3:
                return "#F2A151";
            case 4:
                return "#9FCE55";
            case 5:
                return "#46A55D";
            default:
                return "grey"
        }
    },
    showImagesInPopup: function (images) {
        this.setState({
            popupImages: images.map(({ title, description, url }) => ({
                title,
                subtitle: description,
                image: url
            }))
        });
    },
    render: function () {
        let style = {};
        if (this.props.centerContent)
            style.justifyContent = "center";

        if (this.props.backgroundColor) {
            style.background = this.props.backgroundColor;
            style.padding = "15px 5px";
        }

        if (this.props.roundBackground)
            style.borderRadius = "8px";

        return <div className="component ImageModule" style={style}>
            {this.renderImages()}
            <PhotoViewer ref="photoViewer" photos={this.state.popupImages} popupHeight={this.props.popupHeight}
                         startFrom={this.state.startFrom} />
        </div>
    }
});

module.exports = Images;
