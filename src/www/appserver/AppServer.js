import UniversalRouter from 'universal-router';
import Request from "./Request";
import Response from "./Response";


export default class AppServer {
  constructor(port) {
    this.port = port;
    // Why? because SOLID of this class
    this.webserver = webserver;
    this.routes = [];
    
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
        action: () => callback
      }
    );
    this.initRouter();
  }
  
  onRequest(request) {
    let request =  new Request(
      request.requestId,
      request.method,
      request.path,
      request.query,
      request.body,
      request.headers
    );
  
    let response = new Response(
      this.webserver,
      request.requestId
    );
    
    this.router.resolve(
      request.url
    ).then(
      // callback is a function
      (callback) => {
        // run the callback with all information we got for the request and the response
        callback(request, response);
      }
    ).catch(
      (error) => {
        // if there is an error, just send a not found 404 bljad
        response.notFound();
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