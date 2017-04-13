/**
 * Upstream version of event listener. Does not take into account specific
 * nature of platform.
 */
var isArray = require("lodash/isArray");

var EventListener = {
    /**
     * Listen to DOM events during the bubble phase.
     *
     * @param {DOMEventTarget} target DOM element to register listener on.
     * @param {string} eventType Event type, e.g. "click" or "mouseover".
     * @param {function} callback Callback function.
     * @return {object} Object with a `remove` method.
     */
    listen: function(target, eventTypes, callback) {

        if (!isArray(eventTypes)){
            eventTypes = [eventTypes];
        }
        var callbacks = [];
        for(var i=0; i < eventTypes.length; i++) {
            var eventType = eventTypes[i];

            if (target.addEventListener) {
                target.addEventListener(eventType, callback, false);
                callbacks.push( function () {
                        target.removeEventListener(eventType, callback, false);
                    }
                );

            } else if (target.attachEvent) {
                target.attachEvent("on" + eventType, callback);
                callbacks.push( function () {

                    target.detachEvent("on" + eventType, callback);
                });

            }
        }
        return {
            remove: function () {
                for (var i = 0; i < callbacks.length; i++){
                    callbacks[i]();
                }
            }
        };
    },

    /**
     * Listen to DOM events during the capture phase.
     *
     * @param {DOMEventTarget} target DOM element to register listener on.
     * @param {string} eventType Event type, e.g. "click" or "mouseover".
     * @param {function} callback Callback function.
     * @return {object} Object with a `remove` method.
     */
    capture: function(target, eventType, callback) {
        if (!target.addEventListener) {
            return {
                remove: function () {}
            };
        } else {
            target.addEventListener(eventType, callback, true);
            return {
                remove: function() {
                    target.removeEventListener(eventType, callback, true);
                }
            };
        }
    },

    registerDefault: function() {}
};

module.exports = EventListener;