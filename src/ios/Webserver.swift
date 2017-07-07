@objc(Webserver) class Webserver : CDVPlugin {

    var request_ids: [String] = []
    var webServer = GCDWebServer()

    override func pluginInitialize() {
        self.request_ids = []
    }

    func start(_ command: CDVInvokedUrlCommand) {
        self.request_ids.append("Hi")

        for request_id in self.request_ids {
            print(request_id)
        }

        let pluginResult = CDVPluginResult(status: CDVCommandStatus_OK)
        self.commandDelegate!.send(pluginResult, callbackId: command.callbackId)
    }
}
