const { eventBus } = require('../utils/eventBus.js');
const jam = require('../utils/jamController.js');
let hit=false;
eventBus.on('sigil:jam',()=>{hit=true;});
for(let i=0;i<5;i++) jam.register('1');
if(!hit) throw new Error('jam not triggered');
console.log('sigil jam tests passed');
