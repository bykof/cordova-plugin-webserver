/*global webserver*/

import UniversalRouter from 'universal-router';
import Request from "./Request";
import Response from "./Response";


export default class AppServer {
  constructor(port) {
    this.port = port;
    // Why? because SOLID of this class
    this.webserver = webserver;
    this.routes = [];
    this.notFoundCallback = null;

    this.onRequest = this.onRequest.bind(this);
    this.initWebserver();
    this.initRouter();
  }

  initWebserver() {
    this.webserver.onRequest(this.onRequest);
  }

  initRouter() {
    this.router = new UniversalRouter(this.routes);
  }

  addRoute(path, callback) {
    this.routes.push(
      {
        path: path,
        action: (context) => {
          return {
            callback: callback,
            context: context
          };
        }
      }
    );
    this.initRouter();
  }

  addNotFound(callback) {
    this.notFoundCallback = callback;
  }

  onRequest(request) {
    let requestObject =  new Request(
      request.requestId,
      request.method,
      request.body,
      request.headers,
      request.path,
      request.query
    );

    let responseObject = new Response(
      this.webserver,
      requestObject.requestId
    );

    this.router.resolve(
      requestObject.path
    ).then(
      // callback is a function
      (callbackContext) => {
        // run the callback with all information we got for the request and the response
        requestObject.params = callbackContext.context.params;
        callbackContext.callback(requestObject, responseObject);
      }
    ).catch(
      (error) => {
        if (!this.notFoundCallback) {
          // if there is an error, just send a not found 404 bljad
          responseObject.notFound();
        } else {
          this.notFoundCallback();
        }
      }
    );
  }

  start() {
    this.webserver.start();
  }

  stop() {
    this.webserver.stop();
  }
}
