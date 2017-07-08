var WEBSERVER_CLASS = "Webserver";

exports.start = function(success_callback, error_callback, port) {
    cordova.exec(
      success_callback,
      error_callback,
      WEBSERVER_CLASS,
      "start",
      [port]
    );
};

exports.onRequest = function(success_callback, error_callback) {
    cordova.exec(
      success_callback,
      error_callback,
      WEBSERVER_CLASS,
      "onRequest",
      []
    );
};

exports.send = function(params, success_callback, error_callback) {
    cordova.exec(
      success_callback,
      error_callback,
      WEBSERVER_CLASS,
      "send",
      [params]
    );
};

exports.stop = function(success_callback, error_callback) {
    cordova.exec(
      success_callback,
      error_callback,
      WEBSERVER_CLASS,
      "stop",
      []
    );
};
