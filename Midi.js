const fs = require('fs');
const Utils = require('./Utils.js');

class Midi {
    constructor(fileName) {
        this.fileName = fileName;
        this.offset = 0;
        this.tracks = [];

        this.extractFileData();
    }

    extractFileData() {
        this.rawData = fs.readFileSync(this.fileName, {encoding: 'hex'});
        this.parse();      
    }

    parse() {
        const chunkHeaderType = Utils.getBytes(this.offset, 4, this.rawData);
        this.changeOffset(4);

        const chunkHeaderLength = Utils.getBytes(this.offset, 4, this.rawData);
        this.changeOffset(4);
        const chunkHeaderFormat = Utils.getBytes(this.offset, 2, this.rawData);
        this.changeOffset(2);
        const chunkHeaderNumberTracks = Utils.getBytes(this.offset, 2, this.rawData);
        this.changeOffset(2);
        const chunkHeaderDivision = Utils.getBytes(this.offset, 2, this.rawData);
        this.changeOffset(2);
        
        this.midiHeaderTrack = new MidiHeaderTrack(chunkHeaderType, chunkHeaderLength, chunkHeaderFormat, chunkHeaderNumberTracks, chunkHeaderDivision);
        // this.midiHeaderTrack.print();

        for(let i = 0; i < this.midiHeaderTrack.chunkNumberTracks; i++) {
            const chunkTypeTrack = Utils.getBytes(this.offset, 4, this.rawData);
            this.changeOffset(4);
            const chunkLengthTrack = Utils.getBytes(this.offset, 4, this.rawData);
            this.changeOffset(4);
            const chunkEvents = Utils.getBytes(this.offset, parseInt(chunkLengthTrack, 16), this.rawData);
            this.changeOffset(parseInt(chunkLengthTrack, 16));
            
            const midiTrack = new MidiTrack(chunkTypeTrack, chunkLengthTrack, chunkEvents);
            // midiTrack.print();

            this.tracks.push(midiTrack);
        }

        console.log(this);
    }

    changeOffset(offset) {
        this.offset += offset * 2;
    }
}

class MidiHeaderTrack {
    constructor(chunkType, chunkLength, chunkFormat, chunkNumberTracks, division) {
        this.chunkType = Utils.hexToAscii(chunkType);
        this.chunkLength = parseInt(chunkLength, 16);
        this.chunkFormat = parseInt(chunkFormat, 16);
        this.chunkNumberTracks = parseInt(chunkNumberTracks, 16);
        this.division = division;
    }

    parse() {
        console.log(this.binaryData);
    }

    print() {
        console.log('chunkType', this.chunkType);
        console.log('chunkLength', this.chunkLength);
        console.log('chunkFormat', this.chunkFormat);
        console.log('chunkNumberTracks', this.chunkNumberTracks);
        console.log('division', this.division);
    }
}

class MidiTrack {
    constructor(chunkType, chunkLength, chunkEvents) {
        this.chunkType = Utils.hexToAscii(chunkType);
        this.chunkLength = parseInt(chunkLength, 16);
        this.chunkEvents = chunkEvents;

        // this.print();
    }

    print() {
        console.log('chunkType', this.chunkType);
        console.log('chunkLength', this.chunkLength);
        console.log('chunkEvents', this.chunkEvents);
    }
}

module.exports = Midi;