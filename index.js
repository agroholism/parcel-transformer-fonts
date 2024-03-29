const {Transformer} = require("@parcel/plugin");
const {ttfToWoff, ttfToWoff2, woffToTtf, woff2ToTtf} = require("./transformers.js");

const supportedFormats = ["otf", "ttf", "woff", "woff2"];

function isSupportedFormat(type) {
    return supportedFormats.includes(type);
}

function isTrueTypeFont(type) {
    return ["ttf", "otf"].includes(type);
}

function getTransformer(sourceType, targetType) {
    if (sourceType === targetType) {
        return null;
    }

    if (targetType === "woff") {
        if (sourceType === "woff2") {
            return async (woff2Buffer) => await ttfToWoff(await woff2ToTtf(woff2Buffer));
        }

        return ttfToWoff;
    }

    if (targetType === "woff2") {
        if (sourceType === "woff") {
            return async (woffBuffer) => await ttfToWoff2(await woffToTtf(woffBuffer));
        }

        if (isTrueTypeFont(sourceType)) {
            return ttfToWoff2;
        }
    }

    if (isTrueTypeFont(targetType)) {
        if (isTrueTypeFont(sourceType)) {
            return null;
        }

        if (sourceType === "woff") {
            return woffToTtf;
        }

        if (sourceType === "woff2") {
            return woff2ToTtf;
        }
    }

    throw new Error(`no transformer found to process ${sourceType} to ${targetType}`);
}

module.exports = new Transformer({
    async transform({asset}) {
        if (!isSupportedFormat(asset.type) || !asset.query.has("as")) {
            return [asset];
        }

        const requiredType = asset.query.get("as");

        if (!isSupportedFormat(requiredType)) {
            throw new Error("unsupported required file type");
        }

        const transformer = getTransformer(asset.type, requiredType);

        asset.type = requiredType;

        // There is no transformation required
        if (transformer === null) {
            return [asset];
        }

        const buffer = await asset.getBuffer();
        const result = await transformer(buffer);

        asset.setBuffer(result);

        return [asset];
    }
});