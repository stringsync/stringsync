export const requestIdleCallback =
  window.requestIdleCallback ||
  function(callback: IdleRequestCallback) {
    var start = Date.now();
    return setTimeout(function() {
      callback({
        didTimeout: false,
        timeRemaining: function() {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };

export const cancelIdleCallback =
  window.cancelIdleCallback ||
  function(handle: number) {
    clearTimeout(handle);
  };
