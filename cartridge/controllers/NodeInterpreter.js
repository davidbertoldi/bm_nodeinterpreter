'use strict';

const Logger = require('dw/system/Logger').getLogger('BMNI', 'NodeInterpreter');

// The buffer is a global object.
let internalInterpreterBuffer = [];

const reqDict = {
  ABTestMgr: 'dw/campaign/',
  AgentUserMgr: 'dw/customer/',
  BasketMgr: 'dw/order/',
  CacheMgr: 'dw/system/',
  CampaignMgr: 'dw/campaign/',
  CatalogMgr: 'dw/catalog/',
  ContentMgr: 'dw/content/',
  CouponMgr: 'dw.campaign',
  CustomerContextMgr: 'dw/customer/',
  CustomerMgr: 'dw/customer/',
  CustomObjectMgr: 'dw/object/',
  GiftCertificateMgr: 'dw/order/',
  HookMgr: 'dw/system/',
  MappingMgr: 'dw/util/',
  OAuthLoginFlowMgr: 'dw/customer/oauth/',
  OrderMgr: 'dw/order/',
  PageMgr: 'dw/experience/',
  PaymentMgr: 'dw.order',
  PriceBookMgr: 'dw/catalog/',
  ProductInventoryMgr: 'dw/catalog/',
  ProductListMgr: 'dw/customer/',
  ProductMgr: 'dw/catalog/',
  PromotionMgr: 'dw/campaign/',
  RESTResponseMgr: 'dw/system/',
  SalesforcePaymentsMgr: 'dw/extensions/payments/',
  ShippingMgr: 'dw/order/',
  SitemapMgr: 'dw/sitemap/',
  StoreMgr: 'dw/catalog/',
  SystemObjectMgr: 'dw/object/',
  TaxMgr: 'dw/order/',
  URLRedirectMgr: 'dw/web/',
  // ----
  Site: 'dw/system/',
  System: 'dw/system/',
};

/**
 * Shows the editor in the Business Manager
 */
function internalInterpreterShow() {
  const ISML = require('dw/template/ISML');
  const System = require('dw/system/System');
  ISML.renderTemplate('sf/interpreter', {
    enabled: true, // 😈
    code: "'use strict';\n\n// You don't need requires statement for managers and other system objects.\nprint(\`🖥️ Hostname: ${System.instanceHostname}`);\nprint(`🌐 Sites: ${Site.allSites.size()}`);\nprint(`👤 User: ${session.userName}`)\nprint(`🛍️ Catalog: ${CatalogMgr.getSiteCatalog() ? CatalogMgr.getSiteCatalog().displayName: 'none'}`);",
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
    Logger.warn('[BEFORE] Code executed:\n{0}', code);
    const extendedCode = internalExtendContext(code);
    // eslint-disable-next-line no-new-func
    const fn = new Function(extendedCode);
    codeResult = fn.call(null);
    Logger.warn('[AFTER] Code executed:\n{0}', extendedCode);
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

function internalExtendContext(code) {
  let context = '';
  Object.keys(reqDict).forEach(function (key) {
    if (!empty(code) && code.includes(key)) {
      context += `const ${key}=require('${reqDict[key] + key}');\n`;
    }
  });
  return `${context}\n\n${code}`;
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
