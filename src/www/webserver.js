import exec from 'cordova/exec';

const WEBSERVER_CLASS = 'Webserver';
const START_FUNCTION = 'start';
const ONREQUEST_FUNCTION = 'onRequest';
const SENDRESPONSE_FUNCION = 'sendResponse';
const SENDFILE_FUNCION = 'sendFileResponse';
const STOP_FUNCTION = 'stop';

export function start(success_callback, error_callback, port) {
  let params = [];
  if (port) {
    params.push(port);
  }
  exec(
    success_callback,
    error_callback,
    WEBSERVER_CLASS,
    START_FUNCTION,
    params
  );
}

export function onRequest(success_callback) {
  exec(
    success_callback,
    function(error) {console.error(error)},
    WEBSERVER_CLASS,
    ONREQUEST_FUNCTION,
    []
  );
}

export function sendResponse(
  requestId,
  params,
  success_callback,
  error_callback
) {
  exec(
    success_callback,
    error_callback,
    WEBSERVER_CLASS,
    SENDRESPONSE_FUNCION,
    [requestId, params]
  );
}

export function sendFile(
  requestId,
  params,
  success_callback,
  error_callback
) {
  exec(
    success_callback,
    error_callback,
    WEBSERVER_CLASS,
    SENDFILE_FUNCION,
    [requestId, params]
  );
}

export function stop(success_callback, error_callback) {
  exec(
    success_callback,
    error_callback,
    WEBSERVER_CLASS,
    STOP_FUNCTION,
    []
  );
}
