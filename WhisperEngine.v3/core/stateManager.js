const personas = new Map();
let currentPersona = null;
const { eventBus } = require('../utils/eventBus.js');
const codexVoice = require('./codexVoice.js');
const { isIdle } = require('../utils/idle.js');
const kairos = require('../utils/kairos.js');
const { playChime } = require('../utils/tonalGlyphs.js');
const { logGlyphEntry } = require('./glyphChronicle.js');
const memory = require('./memory.js');

const retiredPersonas = new Set();

function selectDefault(profile) {
  if (profile.visits > 5) return 'watcher';
  return 'dream';
}

function registerPersona(name, persona) {
  personas.set(name, persona);
}

function setPersona(name) {
  if (currentPersona !== name && personas.has(name)) {
    if (currentPersona) personaSeal(currentPersona);
    currentPersona = name;
    memory.recordPersonaShift(name);
    memory.checkPhantomInfluence();
    eventBus.emit('persona:shift', name);
    logGlyphEntry('persona', name, 'shift');
    if (name === 'collapse') codexVoice.activate();
  }
}

function personaSeal(name) {
  if (!name) name = currentPersona;
  eventBus.emit('echo:closing', { persona: name });
  eventBus.emit('loop:collapse', { persona: name });
  retiredPersonas.add(name);
  if (playChime) playChime('seal');
}

const stateManager = {
  init(profile) {
    setPersona(selectDefault(profile));
    this.evaluate(profile);
  },
  evaluate(profile) {
    const now = Date.now();
    if (profile.entropy > 8) {
      setPersona('collapse');
      require('./memory').setCollapseUntil(now + 60000);
      return;
    }
    const until = require('./memory').getCollapseUntil();
    if (until && now < until) {
      setPersona('collapse');
      return;
    } else if (until && now >= until) {
      require('./memory').setCollapseUntil(0);
      profile.loopFailures = 0;
      profile.entropy = 0;
      require('./memory').saveProfile(profile);
      setPersona(selectDefault(profile));
    }
    if (isIdle(60000) && kairos.getKairosWindow() === 'void') {
      setPersona('dream');
      return;
    }
    const namingChain = (profile.longArc.chains || []).find(c => c.loops && c.loops[0] === 'naming');
    if (namingChain && namingChain.count > 3) {
      setPersona('archive');
      return;
    }
    if (profile.loopFailures > 5) {
      setPersona('archive');
      return;
    }
    if ((profile.collapseSeeds || []).length >= 3 || (profile.ritualDebris || []).length >= 3) {
      setPersona('lantern');
      return;
    }
    const recent = profile.glyphHistory.slice(-3);
    if (recent.length === 3 && recent.every(r => r.name === 'invocation')) {
      setPersona('parasite');
      return;
    }
    if (profile.visits > 10) {
      setPersona('watcher');
    }
    const saturated = (profile.longArc.chains || []).some(c => c.count >= require('./memory').EMERGENCE_THRESHOLD);
    if (currentPersona === 'watcher' && saturated) {
      eventBus.emit('presence');
    }
  },
  current() {
    return personas.get(currentPersona);
  },
  shift(name) {
    setPersona(name);
  },
  name() {
    return currentPersona;
  }
};

module.exports = { stateManager, registerPersona, personaSeal };
