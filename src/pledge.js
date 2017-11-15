'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js ES6-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

function $Promise(executor){

  if(typeof executor !== 'function') {
    throw TypeError('executor function is not defined');
  }
  this._state = 'pending'
  this._assigned = false;
  this._value = undefined;

  executor(this._internalResolve.bind(this), this._internalReject.bind(this))
}
//this._internalResolve
$Promise.prototype._internalResolve  = function(someData){
  console.log('this', this)
  if (!$Promise.prototype._value && !this._assigned){
    this._value = someData;
    this._assigned = true;
    this._state = 'fulfilled'
  }

}
$Promise.prototype._internalReject  = function(reason){
  console.log('thisRej', this)
  if (!this._value && !this._assigned){
    this._state = 'rejected'
    this._value = reason;
    this._assigned = true;
  }
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
