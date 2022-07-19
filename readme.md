> This plugin for Parcel can be used to easily convert fonts to desired formats.

The plugin supports TTF, WOFF and WOFF2 fonts formats.
A conversion between the above formats can be done in any way 
i.e. TTF to WOFF, WOFF2 to TTF, etc.

## Install

Install the package using the following command:

    npm i -D parcel-transformer-fonts

## Enable

Add a plugin name with the extensions you want to process into
`transformers` section of your `.parcelrc` file:

    {
        "extends": "@parcel/config-default",
        "transformers": {
            "*.{ttf,woff,woff2}": ["parcel-transformer-fonts"]
        }
    }

## Use

To transform a font, just add `as` query parameter to the URL of imported font.
Value of `as` parameter can be one of extensions you want to get (ttf, woff, woff2). For example:

    @font-face {
        font-family: Bitter;
        src:
            url("/source/fonts/bitter/Regular.ttf?as=woff2") format("woff2"),
            url("/source/fonts/bitter/Regular.ttf?as=woff") format("woff"),
            url("/source/fonts/bitter/Regular.ttf") format("truetype");
    }