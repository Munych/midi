class Utils {
    static getBytes(offset, number = 1, data) {
        const offsetNew = offset + number * 2;
        const bytes = data.slice(offset, offsetNew);
        return bytes;
    }

    static hexToAscii(hexValue) {
        const hexString = hexValue.toString();
        let asciiString = '';

        for(let i = 0; i < hexString.length; i += 2) {
            asciiString += String.fromCharCode(parseInt(hexString.substr(i, 2), 16))
        }

        return asciiString;
    }
}

module.exports = Utils;