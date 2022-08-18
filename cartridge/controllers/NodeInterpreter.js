'use strict';

const Logger = require('dw/system/Logger').getLogger('BMNI','NodeInterpreter');
const StringUtils = require('dw/util/StringUtils');

// The buffer is a global object.
var buffer = []

/**
 * Shows the editor in the Business Manager
 */
function __internal__interpreter__show() {
  dw.template.ISML.renderTemplate('sf/interpreter', {
    code: '\'use strict\';\n\nvar Site = require(\'dw/system/Site\');\nprint(Site.current.name);',
  });
}

/**
 * Runs any Node script within a new scope.
 */
function __internal__interpreter__run() {
  var code = request.httpParameterMap.code.stringValue;
  var error = false;
  var exception = null;
  var codeResult = null;

  try {
    var fn = new Function(code);
    codeResult = fn.call(null);
    Logger.warn('Code executed:\n{0}', code);
  } catch (e) {
    exception = e;
    Logger.error('Error in running code:\n{0}', code, e);
    error = true;
    err(e);
  }

  response.setBuffered(false);
  response.setContentType('application/json');
  response.writer.print(JSON.stringify({
    error: error,
    exception: exception,
    codeResult: codeResult,
    buffer: buffer
  }));

  buffer = [];
}

/**
 * Stores in the buffer object the string that the user wants to print as stdout.
 */
function print() {
  __internal__interpreter__out(arguments, false);
}

/**
 * Stores in the buffer object the string that the user wants to print as stderr.
 */
function err() {
  __internal__interpreter__out(arguments, true);
}

function __internal__interpreter__out(args, error) {
  if (args[0] === null) {
    args[0] = 'null';
  }
  buffer.push({
    error: error,
    msg: StringUtils.format.apply(null, args)
  });
}

__internal__interpreter__show.public = true;
__internal__interpreter__run.public = true;

exports.Show = __internal__interpreter__show;
exports.Run = __internal__interpreter__run;
