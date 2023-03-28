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

            this.tracks.push(midiTrack);
        }
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
        this.offset = 0;

        this.chunkType = Utils.hexToAscii(chunkType);
        this.chunkLength = parseInt(chunkLength, 16);
        this.chunkEvents = this.parseEvents(chunkEvents);
        this.print();
    }

    parseEvents(chunkEvents) {
        const events = [];

        while(Utils.getBytes(this.offset, 1, chunkEvents)) {
            const deltaTime = Utils.getBytes(this.offset, 1, chunkEvents);
            this.changeOffset(1);
            const type = Utils.getBytes(this.offset, 1, chunkEvents);
            this.changeOffset(1);
    
            switch(type) {
                case 'ff': {
                    const code = Utils.getBytes(this.offset, 1, chunkEvents);
                    this.changeOffset(1);
    
                    if(code && code === '51') {
                        const nextCode = Utils.getBytes(this.offset, 1, chunkEvents);
                        this.changeOffset(1);

                        const tempo = Utils.getBytes(this.offset, 3, chunkEvents);
                        this.changeOffset(3);

                        const event = {
                            deltaTime,
                            type,
                            code,
                            nextCode,
                            tempo,
                            description: 'Set Tempo'
                        }

                        events.push(event);
                    }
                    
                    break;
                }
            }
        }

        return events;
    }

    changeOffset(offset) {
        this.offset += offset * 2;
    }

    print() {
        console.log('chunkType', this.chunkType);
        console.log('chunkLength', this.chunkLength);
        console.log('chunkEvents', this.chunkEvents);
    }
}

// class MidiEvent {
//     constructor() {

//     }
// }

module.exports = Midi;