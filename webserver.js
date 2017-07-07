exports.start = function(success_callback, error_callback) {
    cordova.exec(success_callback, error_callback, "Webserver", "start", []);
};
