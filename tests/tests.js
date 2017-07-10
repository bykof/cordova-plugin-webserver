cordova.define("cordova-plugin-webserver-tests.tests", function(require, exports, module) {
exports.defineAutoTests = function() {

  describe('Webserver (window.webserver)', function () {
    var fns = [
      'start'
    ];

    it('should exist', function() {
      expect(webserver).toBeDefined();
    });

    fns.forEach(function(fn) {
      it('should contain a ' + fn + ' function', function () {
        expect(typeof webserver[fn]).toBeDefined();
        expect(typeof webserver[fn] === 'function').toBe(true);
      });
    })
  });

  describe('Do a request', function() {

    it('should do a request', function() {
        webserver.onRequest(
          function(request) {
            // Check for a request is made
          }
        );
        websever.start();
        webserver.stop();
    });
  });
};

exports.defineManualTests = function(contentEl, createActionButton) {
  createActionButton('Start bljad Webserver', function() {
    console.log("Starting webserver...");

    webserver.onRequest(
      function(request) {
        console.log('Received request');
        console.log('Sending response');
        webserver.sendResponse(
            request["requestId"],
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'TestHeader': 'Just a testheader'
                },
                body: '{"hello":"from js!"}'
            }
        );
      }
    );

    webserver.start(
      function() {
        console.log('Success!');
      },
      function() {
        console.log('Error!');
      }
    );
  });

  createActionButton('Start Webserver with Port 1337', function() {
    console.log("Starting webserver...");

    webserver.start(
      function() {
        console.log('Success!');
      },
      function() {
        console.log('Error!');
      },
      1337
    );
  });

  createActionButton('Stop Webserver', function() {
    console.log("Stopping webserver...");

    webserver.stop(
      function() {
        console.log('Success!');
      },
      function() {
        console.log('Error!');
      }
    );
  });
};

});
