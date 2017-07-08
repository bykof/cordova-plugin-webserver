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
};

exports.defineManualTests = function(contentEl, createActionButton) {
  createActionButton('Start bljad Webserver', function() {
    console.log("Starting webserver...");

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
