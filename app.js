const path = require('path');
const Midi = require('./Midi.js');

const pathToFile = path.join(__dirname, 'midiFiles', 'dd-buffered-song12.mid');

const midi = new Midi(pathToFile);



