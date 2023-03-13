const fs = require('fs');
const Utils = require('./Utils.js');

class Midi {
    constructor(fileName) {
        this.fileName = fileName;
        this.offset = 0;

        this.extractFileData();
    }

    extractFileData() {
        this.rawData = fs.readFileSync(this.fileName, {encoding: 'hex'});
        this.parse();      
    }

    parse() {
        let chunkType = Utils.getBytes(this.offset, 4, this.rawData);
        console.log(Utils.hexToAscii(chunkType));

        // this.midiHeaderTrack = new MidiHeaderTrack(this.getBytes(2));
    }
}

class MidiHeaderTrack {
    constructor(binaryData) {
        this.binaryData = binaryData;
        this.parse();
    }

    parse() {
        console.log(this.binaryData);
    }
}

module.exports = Midi;