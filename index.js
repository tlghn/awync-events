/**
 * Created by tolgahan on 04.11.2016.
 */
"use strict";

const EE = require('events');
const util = require('util');
const awync = require('awync');

const WHEN = Symbol('when');
const WHATEVER = Symbol('when');
const EMIT = Symbol('emit');
var WHICEVER_COUNT = 0;


function whichever() {

    return function () {
        var args = Array.prototype.slice.call(arguments);

        if(!args.length) {
            return function *() {
            };
        }

        return (function (eventName, args) {
            
            var handlers = args.map(name => {
                return {name, cb: handler.bind(this, name)}
            });
            
            function handler(name) {
                var args = Array.prototype.slice.call(arguments, 1);
                handlers.forEach(item => {
                    this.removeListener(item.name, item.cb);
                });

                if(args[0] instanceof Error){
                    args[0].name = name;
                    args[0].args = args;
                    return this.emit(eventName, args[0]);
                }
                
                this.emit(eventName, {name, args});
            }

            handlers.forEach(item => this.once(item.name, item.cb));
            return awync(awync.callback, this.once.bind(this, eventName))();
        }.bind(this, 'awync-events-whicever-' + (++WHICEVER_COUNT), args))();
        
    }.bind(this);
    
}

function whatever() {
    if(this[WHATEVER]){
        return this[WHATEVER];
    }

    this[EMIT] = this.emit;
    this.emit = function () {
        var args = Array.prototype.slice.call(arguments);
        this[EMIT].apply(this, args);
        var name = args.shift();
        this[EMIT]('awync-events-whatever', {name, args});
    };

    return this[WHATEVER] = awync(awync.callback, this.on.bind(this, 'awync-events-whatever'));
}

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
EventEmitter.prototype.whatever = function () {
};
EventEmitter.prototype.whichever = function () {
};

EventEmitter.attach = function (target) {
    if (target && typeof target === 'object') {
        Object.defineProperties(target, {
            when: { get: when },
            whatever: {get: whatever },
            whichever: {get: whichever }
        });
    }
    return target;
};

EventEmitter.attach(EventEmitter.prototype);

module.exports = EventEmitter;