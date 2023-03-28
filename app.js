const path = require('path');
const Midi = require('./Midi.js');

const pathToFile = path.join(__dirname, 'midiFiles', 'dd-buffered-song0.mid');
// const pathToFile = path.join(__dirname, 'midiFiles', 'mario.mid');
// const pathToFile = path.join(__dirname, 'midiFiles', 'BUMER.mid');

const midi = new Midi(pathToFile);



