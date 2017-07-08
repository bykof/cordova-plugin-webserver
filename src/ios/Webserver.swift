@objc(Webserver) class Webserver : CDVPlugin {
    var webServer: GCDWebServer = GCDWebServer()
    var request_ids: [String] = []

    override func pluginInitialize() {
        self.request_ids = []
        self.webServer = GCDWebServer()
        self.initHTTPRequestHandlers()
    }
    
    func initHTTPRequestHandlers() {
        for methodType in ["GET", "POST", "PUT", "PATCH", "DELETE"] {
            self.webServer.addDefaultHandler(
                forMethod: methodType,
                request: GCDWebServerDataRequest.self,
                processBlock: {
                    (request) -> GCDWebServerResponse in
                        let json = ["hello": "world"]
                        print((request as! GCDWebServerDataRequest).jsonObject as Any)
                        let response = GCDWebServerDataResponse(jsonObject: json)
                        return response!
                    
                }
            )
        }
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
