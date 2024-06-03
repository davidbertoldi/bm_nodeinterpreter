'use strict';

const Logger = require('dw/system/Logger').getLogger('BMNI', 'NodeInterpreter');

// The buffer is a global object.
let internalInterpreterBuffer = [];

/**
 * Shows the editor in the Business Manager
 */
function internalInterpreterShow() {
  const ISML = require('dw/template/ISML');
  const System = require('dw/system/System');
  ISML.renderTemplate('sf/interpreter', {
    enabled: System.instanceType === System.DEVELOPMENT_SYSTEM,
    code: "'use strict';\n\nvar Site = require('dw/system/Site');\nprint(Site.current.name);",
  });
}

/**
 * Runs any Node script within a new scope.
 */
function internalInterpreterRun() {
  const code = request.httpParameterMap.code.stringValue;
  let error = false;
  let exception = null;
  let codeResult = null;

  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(code);
    Logger.warn('[BEFORE] Code executed:\n{0}', code);
    codeResult = fn.call(null);
    Logger.warn('[AFTER] Code executed:\n{0}', code);
  } catch (e) {
    exception = e;
    Logger.error('Error in running code:\n{0}', code, e);
    error = true;
    err(e);
  }

  response.setBuffered(false);
  response.setContentType('application/json');
  response.writer.print(
    JSON.stringify({
      error: error,
      exception: exception,
      codeResult: codeResult,
      buffer: internalInterpreterBuffer,
    })
  );

  internalInterpreterBuffer = [];
}

/**
 * Stores in the buffer object the string that the user wants to print as stdout.
 */
function print() {
  internalInterpreterOut(arguments, false);
}

/**
 * Stores in the buffer object the string that the user wants to print as stderr.
 */
function err() {
  internalInterpreterOut(arguments, true);
}

function internalInterpreterOut(args, error) {
  const newArgs = args;
  const StringUtils = require('dw/util/StringUtils');
  if (newArgs[0] === null) {
    newArgs[0] = 'null';
  }
  internalInterpreterBuffer.push({
    error: error,
    msg: StringUtils.format.apply(null, newArgs),
  });
}

internalInterpreterShow.public = true;
internalInterpreterRun.public = true;

exports.Show = internalInterpreterShow;
exports.Run = internalInterpreterRun;
