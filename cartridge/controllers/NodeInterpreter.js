'use strict';

const Logger = require('dw/system/Logger');
const StringUtils = require('dw/util/StringUtils');

var buffer = []

function show() {
  dw.template.ISML.renderTemplate('sf/interpreter', {
    Code: ''
  });
}

function print() {
  buffer.push({
    error: false,
    txt: StringUtils.format.apply(null, arguments)
  });
}

function err() {
  buffer.push({
    error: true,
    msg: StringUtils.format.apply(null, arguments)
  });
}

function run() {
  var code = request.httpParameterMap.code.stringValue;
  var error = false;
  var exception = null;
  var codeResult = null;
  response.setBuffered(false);
  try {
    var fn = new Function(code);
    codeResult = fn.call();
  } catch (e) {
    exception = e;
    Logger.error('Error in running script', e);
    error = true;
    err(e);
  }

  response.setContentType('application/json');
  response.writer.print(JSON.stringify({
    error: error,
    exception: exception,
    codeResult: codeResult,
    buffer: buffer
  }));

  buffer = null;
}

show.public = true;
run.public = true;

exports.Show = show;
exports.Run = run;
