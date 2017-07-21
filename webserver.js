"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _universalRouter = require("universal-router");

var _universalRouter2 = _interopRequireDefault(_universalRouter);

var _Request = require("./Request");

var _Request2 = _interopRequireDefault(_Request);

var _Response = require("./Response");

var _Response2 = _interopRequireDefault(_Response);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppServer = function () {
  function AppServer(port) {
    _classCallCheck(this, AppServer);

    this.port = port;
    // Why? because SOLID of this class
    this.webserver = webserver;
    this.routes = [];

    this.initWebserver();
    this.initRouter();
  }

  _createClass(AppServer, [{
    key: "initWebserver",
    value: function initWebserver() {
      this.webserver.onRequest(this.onRequest);
    }
  }, {
    key: "initRouter",
    value: function initRouter() {
      this.router = new _universalRouter2.default(this.routes);
    }
  }, {
    key: "addRoute",
    value: function addRoute(path, callback) {
      this.routes.push({
        path: path,
        action: function action() {
          return callback;
        }
      });
      this.initRouter();
    }
  }, {
    key: "onRequest",
    value: function onRequest(request) {
      var requestObject = new _Request2.default(request.requestId, request.method, request.path, request.query, request.body, request.headers);

      var responseObject = new _Response2.default(this.webserver, requestObject.requestId);

      this.router.resolve(requestObject.url).then(
      // callback is a function
      function (callback) {
        // run the callback with all information we got for the request and the response
        callback(requestObject, responseObject);
      }).catch(function (error) {
        // if there is an error, just send a not found 404 bljad
        responseObject.notFound();
      });
    }
  }, {
    key: "start",
    value: function start() {
      this.webserver.start();
    }
  }, {
    key: "stop",
    value: function stop() {
      this.webserver.stop();
    }
  }]);

  return AppServer;
}();

exports.default = AppServer;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Request = function () {
  function Request(requestId, method, body, headers, path, query) {
    _classCallCheck(this, Request);

    this.requestId = requestId;
    this.method = method;
    this.path = path;
    this.query = query;
    this.body = body;
    this.headers = headers;
  }

  _createClass(Request, [{
    key: "json",
    get: function get() {
      return JSON.parse(this.body);
    }
  }]);

  return Request;
}();

exports.default = Request;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Response = function () {
  function Response(webserver, requestId) {
    var status = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;
    var body = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
      'Content-Type': 'text/plain'
    };

    _classCallCheck(this, Response);

    this.webserver = webserver;
    this.requestId = requestId;
    this.status = status;
    this.body = body;
    this.headers = headers;
  }

  _createClass(Response, [{
    key: 'send',
    value: function send() {
      this.webserver.sendResponse({
        status: this.status,
        body: this.body,
        headers: this.headers
      });
      return this;
    }
  }, {
    key: 'status',
    value: function status(_status) {
      this.status(_status);
      return this;
    }
  }, {
    key: 'notFound',
    value: function notFound() {
      return this.status(404).send();
    }
  }, {
    key: 'methodNotAllowed',
    value: function methodNotAllowed() {
      return this.status(405).send();
    }
  }, {
    key: 'ok',
    value: function ok() {
      return this.status(200).send();
    }
  }, {
    key: 'json',
    value: function json(data) {
      this.body = JSON.stringify(data);
      return this;
    }
  }]);

  return Response;
}();

exports.default = Response;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppServer = undefined;
exports.start = start;
exports.onRequest = onRequest;
exports.sendResponse = sendResponse;
exports.stop = stop;

var _exec = require('cordova/exec');

var _exec2 = _interopRequireDefault(_exec);

var _AppServer = require('./appserver/AppServer');

var ImportedAppServer = _interopRequireWildcard(_AppServer);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Export the Appserver
var AppServer = exports.AppServer = ImportedAppServer;
var WEBSERVER_CLASS = 'Webserver';
var START_FUNCTION = 'start';
var ONREQUEST_FUNCTION = 'onRequest';
var SENDRESPONSE_FUNCION = 'sendResponse';
var STOP_FUNCTION = 'stop';

function start(success_callback, error_callback, port) {
  var params = [];
  if (port) {
    params.push(port);
  }
  (0, _exec2.default)(success_callback, error_callback, WEBSERVER_CLASS, START_FUNCTION, params);
}

function onRequest(success_callback) {
  (0, _exec2.default)(success_callback, function (error) {
    console.error(error);
  }, WEBSERVER_CLASS, ONREQUEST_FUNCTION, []);
}

function sendResponse(requestId, params, success_callback, error_callback) {
  (0, _exec2.default)(success_callback, error_callback, WEBSERVER_CLASS, SENDRESPONSE_FUNCION, [requestId, params]);
}

function stop(success_callback, error_callback) {
  (0, _exec2.default)(success_callback, error_callback, WEBSERVER_CLASS, STOP_FUNCTION, []);
}
