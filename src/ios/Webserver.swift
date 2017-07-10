@objc(Webserver) class Webserver : CDVPlugin {
    // Timeout in seconds
    let TIMEOUT: Int = 60 * 3 * 1000000

    var webServer: GCDWebServer = GCDWebServer()
    var responses: Dictionary<String, Any> = [:]
    var onRequestCommand: CDVInvokedUrlCommand? = nil

    override func pluginInitialize() {
        self.webServer = GCDWebServer()
        self.onRequestCommand = nil
    }

    func requestToRequestDict(requestUUID: String, request: GCDWebServerDataRequest) -> Dictionary<String, Any> {
        return [
            "requestId": requestUUID,
            "body": request.jsonObject ?? "",
            "headers": request.headers,
            "method": request.method,
            "path": request.url.path,
            "query": request.url.query ?? ""
        ]
    }

    func processRequest(request: GCDWebServerRequest) -> GCDWebServerResponse {
        var timeout = 0
        // Fetch data as GCDWebserverDataRequest
        let dataRequest = request as! GCDWebServerDataRequest
        let requestUUID = UUID().uuidString
        // Transform it into an dictionary for the javascript plugin
        let requestDict = self.requestToRequestDict(requestUUID: requestUUID, request: dataRequest)

        // Do a call to the onRequestCommand to inform the JS plugin
        if (self.onRequestCommand != nil) {
            self.commandDelegate.send(
                CDVPluginResult(status: CDVCommandStatus_OK, messageAs: requestDict),
                callbackId: self.onRequestCommand?.callbackId
            )
        }

        // Here we have to wait until the javascript block fetches the message and do a response
        while self.responses[requestUUID] == nil && timeout < self.TIMEOUT {
            timeout += 2000
            usleep(2000)
        }

        let response = GCDWebServerResponse()
        return response
    }

    func onRequest(_ command: CDVInvokedUrlCommand) {
        self.onRequestCommand = command
    }

    func initHTTPRequestHandlers() {
        for methodType in ["GET", "POST", "PUT", "PATCH", "DELETE"] {
            self.webServer.addDefaultHandler(
                forMethod: methodType,
                request: GCDWebServerDataRequest.self,
                processBlock: self.processRequest
            )
        }
    }

    func sendResponse(_ command: CDVInvokedUrlCommand) {
        self.responses[command.argument(at: 0) as! String] = command.argument(at: 1)
    }

    func start(_ command: CDVInvokedUrlCommand) {
        var port = 8080
        let portArgument = command.argument(at: 0)

        if portArgument != nil {
            port = portArgument as! Int
        }
        self.webServer.start(withPort: UInt(port), bonjourName: nil)
        let pluginResult = CDVPluginResult(status: CDVCommandStatus_OK)
        self.commandDelegate!.send(pluginResult, callbackId: command.callbackId)
    }

    func stop(_ command: CDVInvokedUrlCommand) {
        if self.webServer.isRunning {
            self.webServer.stop()
        }
        print("Stopping webserver")
        let pluginResult = CDVPluginResult(status: CDVCommandStatus_OK)
        self.commandDelegate!.send(pluginResult, callbackId: command.callbackId)
    }
}
