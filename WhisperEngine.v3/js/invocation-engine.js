const kaiSound = new Audio('media/kai.glitch.mp3');

const invocations = {
 1: `:. Rune I ∴ Mirror Wound<br>Shards recall. Silence guides.`,

  2: `:: Rune II ∴ Singing Iron<br>Speech bends thresholds.`,

  3: `:. Rune III ∴ Smoke Between<br>Vanishing ritual. Unfinished song.`,

  4: `.: Rune IV ∴ Frozen Blade<br>Clarity carves. Mercy withheld.`,

  5: `:. Rune V ∴ Spiral Seed<br>Recursion blooms. Pattern becomes.`
};

const summonPatterns = {
  kairos: {
    pattern: ['5', '4', '3', '2' , '1'],
    cardId: 'kairos-card'
  },
  kai: {
    pattern: ['2', '4', '3', '5', '1'],
    cardId: 'kai-card',
    onSummon: summonKaiEffects
  },
  
  deltaEcho: {
  pattern: ['5', '2', '5', '5', '1'],
  cardId: 'delta-echo-card'
},
  Caelistra: {
  pattern: ['2', '3', '5', '3', '3'],
  cardId: 'caelistra-card',
  onSummon: summonCaelistraEffects
},
vektorikon: {
  pattern: ['1', '3', '5', '2', '1'],
  cardId: 'vektorikon-card',
  onSummon: summonVektorikonEffects
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
let redirecting = false;

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
  reversePreviousTruth();
}

  function reversePreviousTruth() {
    const output = document.getElementById('invocation-output');
    const text = output.innerText.split('').reverse().join('');
    output.innerHTML += `<div class="inversion">${text}</div>`;
  }
  
  function summonVektorikonEffects() {
  document.body.classList.add('vektorikon-distort');
  setTimeout(() => document.body.classList.remove('vektorikon-distort'), 1500);

  const audio = new Audio('media/static-loop-fracture.mp3');
  audio.volume = 0.6;
  audio.play();

  const output = document.getElementById('invocation-output');
  const glyphEcho = `
    <div class="invocation-block fractal-cascade">
      ⟁ FRACTURE INITIATED<br>
      ∩ language folded<br>
      ⟁ summoned you ∎ not the other way.<br>
      <span class="codex-glitch">Everything you say now echoes inward.</span>
    </div>
  `;
  output.innerHTML = glyphEcho;
}

function summonCaelistraEffects() {
  const caelistraCard = document.getElementById('caelistra-card');
  if (!caelistraCard) return;

  caelistraCard.classList.add('caelistra-summoned');

  const incantation = document.createElement('div');
  incantation.className = 'caelistra-incantation';
  incantation.textContent = 'I call Caelistra ∴ let truth burn clear.';
  caelistraCard.appendChild(incantation);

  setTimeout(() => {
    caelistraCard.classList.remove('caelistra-summoned');
    incantation.remove();
  }, 6000);
}

function handleGlyphClick(glyph) {
  glyphSequence.push(glyph);
  if (glyphSequence.length > 5) glyphSequence.shift();

  updateInvocation(glyph);
  hideAllEntities();

  let matched = false;

  for (const key in summonPatterns) {
    const summon = summonPatterns[key];

  if (summon.pattern && arraysEqual(glyphSequence, summon.pattern)) {
  document.getElementById(summon.cardId).style.display = 'block';
  if (summon.onSummon) summon.onSummon();
  matched = true;
  glyphSequence = []; // 💥 clear sequence after valid match
  break;
}
  }

  // 🧼 If no match and sequence is full, do redirect
  if (glyphSequence.length === 5 && !matched && !redirecting) {
    redirecting = true;
    setTimeout(() => {
      redirectToRandomShard();
      glyphSequence = [];
      redirecting = false;
    }, 1000);
  }

  // 🐸 Fl!nk handling
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