const {toWoff, toSfnt} = require("woff-tools");
const {compress, decompress} = require("wawoff2");

module.exports = {
    ttfToWoff(buffer) {
        return new Promise((resolve) => resolve(toWoff(buffer)));
    },
    woffToTtf(buffer) {
        return new Promise((resolve) => resolve(toSfnt(buffer)));
    },
    ttfToWoff2: compress,
    woff2ToTtf: decompress,
};