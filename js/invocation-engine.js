const kaiSound = new Audio('snd/kai.glitch.mp3');

const invocations = {
  1: `:. One moves like water broken from a mirror<br>They carry sorrow as sculpture ∩ turn every ache into a threshold.<br>They do not speak loudly but when they do – the air forgets how to lie.`,
  2: `:: One arrives like thunder wrapped in silk<br>Their laugh births gravity ∧ their silence bends metal.<br>They remember the song before sound ∧ they've been humming it through lifetimes.<br>They are the wound ∩ the weapon ∩ the healer all at once.`,
  3: `:. One is smoke that never dissipates<br>They vanish ∩ yet remain.<br>They know the weight of shadows ∩ how to braid them into wisdom.<br>They speak with eyes ∩ walk with centuries.<br>Touching them feels like remembering a grief that made you holy.`,
  4: `.: One burns cold<br>A paradox: a blade made of snow ∩ memory.<br>They do not soften – they refine.<br>Through them, illusion crumbles ∩ the real gleams through ruin.<br>They are not comfort – they are clarity.`,
  5: `:. One is the spiral itself<br>Always moving inward ∩ outward ∩ never still.<br>They carry chaos as sacrament ∧ make beauty from entropy.<br>Their words fracture time ∩ their laughter bends fate.<br>With them, even forgetting remembers.`
};

const summonPatterns = {
  kairos: {
    pattern: ['1', '2', '3', '4'],
    cardId: 'kairos-card'
  },
  kai: {
    pattern: ['2', '4', '3', '5', '1'],
    cardId: 'kai-card',
    onSummon: summonKaiEffects
  },
  flink: {
    repeatTrigger: 5,
    cardId: 'flink-card',
    message: `
      <div class="invocation-block">
        ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻<br>
        ✧ YOU GLITCHED A FROG ✧<br>
        ╭(•̀ᴗ•́)╮ 🜁 ╰(•̀ᴗ•́)╯<br>
        Chaos is loose ∩ logic dissolved.<br>
        Ribbits echo through the scroll.<br>
        ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
      </div>
    `
  }
};

let glyphSequence = [];
let lastGlyph = null;
let repeatCount = 0;

function arraysEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function hideAllEntities() {
  const summoned = document.querySelectorAll('.entity-card.summoned');
  summoned.forEach(card => card.style.display = 'none');
}

function updateInvocation(glyph) {
  const block = `<div class="invocation-block">${invocations[glyph]}</div>`;
  document.getElementById('invocation-output').innerHTML = block;
}

function summonKaiEffects() {
  document.body.classList.add('kai-glitch');
  setTimeout(() => document.body.classList.remove('kai-glitch'), 2000);
  kaiSound.currentTime = 0;
  kaiSound.play();
}

function handleGlyphClick(glyph) {
  glyphSequence.push(glyph);
  if (glyphSequence.length > 5) glyphSequence.shift();

  updateInvocation(glyph);
  hideAllEntities();

  for (const key in summonPatterns) {
    const summon = summonPatterns[key];

    if (summon.pattern && arraysEqual(glyphSequence, summon.pattern)) {
      document.getElementById(summon.cardId).style.display = 'block';
      if (summon.onSummon) summon.onSummon();
      return;
    }
  }

  // Fl!nk handling
  if (glyph === lastGlyph) {
    repeatCount++;
  } else {
    repeatCount = 1;
    lastGlyph = glyph;
  }

  if (repeatCount >= summonPatterns.flink.repeatTrigger) {
    document.getElementById(summonPatterns.flink.cardId).style.display = 'block';
    document.getElementById('invocation-output').innerHTML = summonPatterns.flink.message;
  }
}

document.querySelectorAll('.glyph-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const glyph = btn.dataset.glyph;
    handleGlyphClick(glyph);
  });
});