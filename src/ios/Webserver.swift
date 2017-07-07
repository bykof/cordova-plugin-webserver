@objc(Webserver) class Webserver : CDVPlugin {
  func start(command: CDVInvokedUrlCommand) {
    var pluginResult = CDVPluginResult(
        status: CDVCommandStatus_OK
    )

    self.commandDelegate!.sendPluginResult(
      pluginResult,
      callbackId: command.callbackId
    )
  }
}
