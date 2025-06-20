const { eventBus } = require('../utils/eventBus.js');

function init() {
  eventBus.on('kairos:window', ({ module }) => {
    if (typeof window === 'undefined') return;
    window.open(module, '_blank', 'noopener');
  });
}

module.exports = { init };
