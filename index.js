const {Transformer} = require("@parcel/plugin");
const {toWoff, toSfnt} = require("woff-tools");

function getTransformer(sourceType, targetType) {
    if (sourceType === targetType) {
        return null;
    }

    if (targetType === "woff") {
        return toWoff;
    }

    if (targetType === "ttf" || targetType === "otf") {
        return toSfnt;
    }

    throw new Error("unsupported required file type");
}

module.exports = new Transformer({
    async transform({asset}) {
        if (!asset.query.has("as")) {
            return [asset];
        }

        const requiredType = asset.query.get("as");

        if (!["otf", "ttf", "woff"].includes(requiredType)) {
            throw new Error("unsupported required file type");
        }

        const transformer = getTransformer(asset.type, requiredType);

        if (transformer === null) {
            return [asset];
        }

        const buffer = await asset.getBuffer();
        const result = transformer(buffer);

        asset.setBuffer(result);

        asset.type = requiredType;

        return [asset];
    }
});