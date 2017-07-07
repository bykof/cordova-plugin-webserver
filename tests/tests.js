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
  createActionButton('Start', function() {
    webserver.start(
      function() {
        console.log('Success!');
      },
      function() {
        console.log('Error!');
      },

    );
  });
};
