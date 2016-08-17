'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = exports.sign = undefined;

var _crypto = require('crypto');

var hasher = {
  MD5: function MD5(data) {
    return (0, _crypto.createHash)('md5').update(data).digest('hex');
  },
  SHA1: function SHA1(data) {
    return (0, _crypto.createHash)('sha1').update(data).digest('hex');
  }
};

var sign = exports.sign = function sign(params, options) {

  Object.assign(params, {
    timestamp: options.timestamp || new Date().getTime()
  });

  var baseStr = Object.keys(params).sort().map(function (k) {
    return 'k=' + params[k];
  }).join('&');

  return Object.assign(params, {
    sign: hasher[options.type || 'SHA1'](baseStr + '&secret=' + options.secret)
  });
};

var validate = exports.validate = function validate(params, options) {

  var ts = params.timestamp;
  var sig = params.sign;

  delete params.timestamp;
  delete params.sign;

  return sig === sign(params, Object.assign(options, {
    timestamp: ts
  })).sign;
};
