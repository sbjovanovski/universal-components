import React, { Component } from 'react';
import './_imageLoader.scss';

export default class ImageLoader extends Component {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        spinnerSize: "",
        spinnerColor: "grey"
    };

    state = {
        isLoading: false,
        src: '',
    };

    shouldComponentUpdate(nextProps) {
        return this.props.src !== nextProps.src;
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            loading: true,
            src: newProps.src,
        });
    }

    componentWillMount() {
        this.setState({
            src: this.props.src,
        });
    }

    handleImageLoaded = () => {
        this.setState({
            isLoading: false,
        });
        this.refs.image.style.display = 'block';
    };

    handleImageFailed = (error) => {
        this.setState({
            isLoading: false,
        });
        this.refs.image.src = '/assets/blank.png';
        this.refs.image.style.display = 'block';
    };

    render() {
        let style = {};

        let imgStyle = {
            display: 'block',
        };

        if (this.props.popupHeight) {
            style.maxHeight = this.props.popupHeight + 'px';
            imgStyle.maxHeight = this.props.popupHeight + 'px';
        }

        let spinnerStyle = {};
        if (this.props.spinnerSize === "small") {
            spinnerStyle = {
                width: "22px",
                height: "22px",
            };
        }

        return (
            <div className="image-loader"
                 style={Object.assign({}, style, this.props.style)}>
                {this.state.isLoading &&
                <div className='loading'>
                    <div className="spinner-holder">
                        <div className="spinner" style={spinnerStyle}>
                            <div className="double-bounce1" style={{ backgroundColor: this.props.spinnerColor }} />
                            <div className="double-bounce2" style={{ backgroundColor: this.props.spinnerColor }} />
                        </div>
                    </div>
                </div>
                }
                <img ref='image'
                     src={this.state.src}
                     style={Object.assign({}, imgStyle, this.props.style)}
                     onLoad={this.handleImageLoaded}
                     onError={this.handleImageFailed}
                     className={this.props.className} />
            </div>
        );
    }
}
