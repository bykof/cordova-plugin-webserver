@objc(Webserver) class Webserver : CDVPlugin {
    // Timeout in seconds
    let TIMEOUT: Int = 60 * 3 * 1000000

    var webServer: GCDWebServer = GCDWebServer()
    var requests = SynchronizedDictionary<AnyHashable, (GCDWebServerRequest, GCDWebServerCompletionBlock)>()
    var onRequestCommand: CDVInvokedUrlCommand? = nil

    override func pluginInitialize() {
        self.webServer = GCDWebServer()
        self.onRequestCommand = nil
        self.requests = SynchronizedDictionary<AnyHashable,(GCDWebServerRequest, GCDWebServerCompletionBlock)>()
        self.initHTTPRequestHandlers()
    }

    func requestToRequestDict(requestUUID: String, request: GCDWebServerRequest) -> Dictionary<String, Any> {
        let dataRequest = request as! GCDWebServerDataRequest
        var body = ""

        if dataRequest.hasBody() {
            body = dataRequest.data.base64EncodedString(options: NSData.Base64EncodingOptions(rawValue: 0))
        }

        return [
            "requestId": requestUUID,
            "body": body,
            "headers": dataRequest.headers,
            "method": dataRequest.method,
            "path": dataRequest.path,
            "query": dataRequest.url.query ?? "",
            "bodyIsBase64": true // we only implement this for iOS so this way we can check if it is actually base64
        ]
    }

    func fileRequest(request: GCDWebServerRequest, path: String) -> GCDWebServerResponse {
        // Check if file exists, given its path
        if !(FileManager.default.fileExists(atPath: path)) {
            return GCDWebServerResponse(statusCode: 404);
        }

        if (request.hasByteRange()) {
            return GCDWebServerFileResponse(file: path, byteRange: request.byteRange)!
        }

        return GCDWebServerFileResponse(file: path)!
    }

    func processRequest(request: GCDWebServerRequest, completionBlock: @escaping GCDWebServerCompletionBlock) {
        if (self.onRequestCommand == nil) {

            print("No onRequest callback available. Ignore request")
            return
        }
        // Fetch data as GCDWebserverDataRequest
        let requestUUID = UUID().uuidString
        // Transform it into an dictionary for the javascript plugin
        let requestDict = self.requestToRequestDict(requestUUID: requestUUID, request: request)

        // Save the request to when we receive a response from javascript
        self.requests[requestUUID] = (request, completionBlock)

        // Do a call to the onRequestCommand to inform the JS plugin
        let pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: requestDict)
        pluginResult?.setKeepCallbackAs(true)
        self.commandDelegate.send(
            pluginResult,
            callbackId: self.onRequestCommand?.callbackId
        )
    }

    @objc(onRequest:)
    func onRequest(_ command: CDVInvokedUrlCommand) {
        self.onRequestCommand = command
        let pluginResult = CDVPluginResult(status: CDVCommandStatus_NO_RESULT)
        pluginResult?.setKeepCallbackAs(true)
        self.commandDelegate.send(
            pluginResult,
            callbackId: self.onRequestCommand?.callbackId
        )
    }

    func initHTTPRequestHandlers() {
        self.webServer.addHandler(
            match: {
                (requestMethod, requestURL, requestHeaders, urlPath, urlQuery) -> GCDWebServerRequest? in
                    return GCDWebServerDataRequest(method: requestMethod, url: requestURL, headers: requestHeaders, path: urlPath, query: urlQuery)
            },
            asyncProcessBlock: self.processRequest
        )
    }

    @objc(sendResponse:)
    func sendResponse(_ command: CDVInvokedUrlCommand) {
        do {
            let requestUUID = command.argument(at: 0) as! String

            if (self.requests[requestUUID] == nil) {
                print("No matching request")
                self.commandDelegate!.send(CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: "No matching request"), callbackId: command.callbackId)
                return
            }

            // We got the dict so put information in the response
            let request = self.requests[requestUUID]?.0 as! GCDWebServerRequest
            let completionBlock = self.requests[requestUUID]?.1 as! GCDWebServerCompletionBlock
            let responseDict = command.argument(at: 1) as! Dictionary<AnyHashable, Any>

            // Check if a file path is provided else use regular data response
            let response = responseDict["path"] != nil
                ? fileRequest(request: request, path: responseDict["path"] as! String)
                : GCDWebServerDataResponse(text: responseDict["body"] as! String)

            if responseDict["status"] != nil {
                response?.statusCode = responseDict["status"] as! Int
            }

            for (key, value) in (responseDict["headers"] as! Dictionary<String, String>) {
                response?.setValue(value, forAdditionalHeader: key)
            }

            // Remove the handled request
            self.requests.removeValue(forKey: requestUUID)

            // Complete the async response
            completionBlock(response!)

            let pluginResult = CDVPluginResult(status: CDVCommandStatus_OK)
            self.commandDelegate!.send(pluginResult, callbackId: command.callbackId)
        } catch let error {
            print(error.localizedDescription)
            self.commandDelegate!.send(CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: error.localizedDescription), callbackId: command.callbackId)
        }
    }

    @objc(start:)
    func start(_ command: CDVInvokedUrlCommand) {
        var port = 8080
        let portArgument = command.argument(at: 0)

        if portArgument != nil {
            port = portArgument as! Int
        }

        if self.webServer.isRunning{
            self.commandDelegate!.send(CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: "Server already running"), callbackId: command.callbackId)
            return
        }

        do {
            try self.webServer.start(options:[GCDWebServerOption_AutomaticallySuspendInBackground : false, GCDWebServerOption_Port: UInt(port)])
        } catch let error {
            print(error.localizedDescription)
            self.commandDelegate!.send(CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: error.localizedDescription), callbackId: command.callbackId)
            return
        }
        let pluginResult = CDVPluginResult(status: CDVCommandStatus_OK)
        self.commandDelegate!.send(pluginResult, callbackId: command.callbackId)
    }


    @objc(stop:)
    func stop(_ command: CDVInvokedUrlCommand) {
        if self.webServer.isRunning {
            self.webServer.stop()
        }
        print("Stopping webserver")
        let pluginResult = CDVPluginResult(status: CDVCommandStatus_OK)
        self.commandDelegate!.send(pluginResult, callbackId: command.callbackId)
    }
}
