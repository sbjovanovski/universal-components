const components = {
    get FlexRow() {
        return require('./Components/FlexRow/FlexRow')
    },
    get Collapsible() {
        return require('./Components/Collapsibe/Collapsible');
    },
    get Images() {
        return require('./Components/Images/images');
    },
    get Spinner() {
        return require('./Components/LoadingSpinner/Spinner');
    },
    get Paging() {
        return require('./Components/Paging/paging');
    },
    get Popup() {
        return require('./Components/Popup/popup');
    },
    get SelectableBoxes() {
        return require('./Components/SelectableBoxes/SelectableBoxes');
    },
    get Tabs() {
        return require('./Components/Tabs/Tabs');
    },
    get Tooltip() {
        return require('./Components/Tooltip/tooltipLabel');
    },
    get Notification() {
        return require('./Components/Notification/notification');
    }
};

module.exports = components;