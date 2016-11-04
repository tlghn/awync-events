/**
 * Created by tolgahan on 04.11.2016.
 */
"use strict";

const EE = require('events');
const util = require('util');
const awync = require('awync');
const WHEN = Symbol('when');

function when() {
    return this[WHEN] || (this[WHEN] = new Proxy({}, {
            get: (target, prop) => {
                return awync(awync.callback, this.once.bind(this, prop));
            }
        }));
}

function EventEmitter() {
    if (!(this instanceof EventEmitter)) {
        return EventEmitter.attach(arguments[0]);
    }
}

util.inherits(EventEmitter, EE);

EventEmitter.prototype.when = function () {
};

Object.defineProperty(EventEmitter.prototype, 'when', {
    get: when
});

EventEmitter.attach = function (target) {
    if (target && typeof target === 'object') {
        Object.defineProperty(target, 'when', {
            get: when
        });
    }

    return target;
};

module.exports = EventEmitter;