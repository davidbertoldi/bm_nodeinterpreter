'use strict';

const Logger = require('dw/system/Logger');

function show() {
  dw.template.ISML.renderTemplate('sf/interpreter', {
    Code: ''
  });
}

function println() {
  response.writer.println(dw.util.StringUtils.format.apply(null, arguments));
  response.writer.flush();
}
function print() {
  response.writer.print(dw.util.StringUtils.format.apply(null, arguments));
  response.writer.flush();
}

function run() {
  var result = '';
  var code = request.httpParameterMap.code.stringValue;
  var error = false;
  response.setBuffered(false);
  if (request.httpParameterMap.html.submitted && request.httpParameterMap.html.stringValue == 'false') {
    response.setContentType('text/plain');
  } else {
    response.setContentType('text/html');
    println('<html><body><pre>');
  }
  if (code) {
    try {
      print(this);
      var fn = new Function(code);
      result = fn.call(null);
    } catch (e) {
      error = e;
      Logger.error('Error in running script', e);
    }
  }
  if (result) {
    println(result);
  }
  if (error) {
    println('Exception: ' + error.message);
    println('  in file: ' + error.fileName + '#' + error.lineNumber);
    println(error.stack);
  }

  if (!request.httpParameterMap.html.submitted || request.httpParameterMap.html.stringValue != 'false') {
    println('</pre></body></html>');
  }
}

show.public = true;
run.public = true;

exports.Show = show;
exports.Run = run;
