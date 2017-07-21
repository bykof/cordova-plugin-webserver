


export default class Request {
  constructor(
    requestId,
    method,
    body,
    headers,
    path,
    query
  ) {
    this.requestId = requestId;
    this.method = method;
    this.path = path;
    this.query = query;
    this.body = body;
    this.headers = headers;
  }
  
  get json() {
    return JSON.parse(this.body);
  }
}