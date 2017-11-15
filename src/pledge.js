'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js ES6-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

function $Promise(executor) {

  if (typeof executor !== 'function') {
    throw TypeError('executor function is not defined');
  }
  this._state = 'pending'
  this._assigned = false;
  this._value = undefined;
  this._handlerGroups = []

  executor(this._internalResolve.bind(this), this._internalReject.bind(this))
}

$Promise.prototype._internalResolve = function (someData) {
  if (!$Promise.prototype._value && !this._assigned) {
    this._value = someData;
    this._assigned = true;
    this._state = 'fulfilled'
    this._callHandlers()
  }

}
$Promise.prototype._internalReject = function (reason) {
  if (!this._value && !this._assigned) {
    this._state = 'rejected'
    this._value = reason;
    this._assigned = true;
    this._callHandlers()
  }
}
$Promise.prototype.catch = function (errorHandler) {
  this.then(null, errorHandler)
  return new $Promise(function(){

  });
}

$Promise.prototype.then = function (resolveFunc, errorFunc) {
  if (typeof resolveFunc !== 'function') {
    resolveFunc = null;
  }
  if (typeof errorFunc !== 'function') {
    errorFunc = null;
  }
  let newProm = new $Promise(function () {
  })
  this._handlerGroups.push({
    successCb: resolveFunc,
    errorCb: errorFunc,
    downstreamPromise: newProm
  })
  this._callHandlers()
  return newProm;
}

$Promise.prototype._callHandlers = function () {
  if (this._state === 'fulfilled') {
    this._handlerGroups.forEach((elem) => {
      if (elem.called === undefined){
        elem.successCb(this._value)
        elem.called = true;
      }

    })
  }
  if (this._state === 'rejected') {
    this._handlerGroups.forEach((elem) => {


      if (elem.called === undefined){
        if (typeof elem.errorCb === 'function'){
          elem.errorCb(this._value)
          elem.called = true;
        }
      }

    })
  }
  let newGroups = this._handlerGroups.filter((elem) => {
    return elem.called === undefined;
  })
  this._handlerGroups = newGroups;

}







/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = $Promise;

So in a Node-based project we could write things like this:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
