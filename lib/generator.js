const Layer = require("./layer");
const Canvas = require("canvas");
const fs = require("fs");
const chalk = require("chalk");
const crypto = require("crypto");

class Generator {
    constructor(size = { w: 350, h: 350 }, outputFolder = "./output") {
        this.layersDataTree = require("../configs/layers.json");
        this.traitFolders = this.layersDataTree.traitFolders;
        this.rndLayers = this.getImageSequence();
        this.size = size;
        this.outputFolder = outputFolder;
    }

    // generate a sequence of images [...]
    getImageSequence() {
        let layers = [];
        for (const folder of this.layersDataTree.traitFolders) {
            let layer = new Layer();
            let randomLayer = layer.getRandomLayer(folder.name);

            if (typeof randomLayer != "undefined") {
                layer.properties.trait = folder.name.replace(/^[0-9]_/g, "");
                layer.properties.value = randomLayer.split("_")[0];
                layer.file = randomLayer.replace(/.png$/g, "");
                layer.path = folder.path + "/" + randomLayer;

                layers.push(layer);
            }
        }

        return layers;
    }

    generateDNA() {
        let hash = crypto.createHmac("sha256", "tae-tool");
        let filesCombo = "";
        for (const layer of this.rndLayers) {
            filesCombo += layer.file;
        }

        hash = hash.update(filesCombo).digest("hex").toUpperCase();

        return hash;
    }

    // return the meta data object
    generateMetadata(indc) {
        indc =
            typeof indc == "undefined"
                ? Math.floor(Math.random() * 10 ** 4)
                : indc;
        const meta = {};
        meta.name = "#" + "0".repeat(4 - String(indc).length) + indc;
        meta.attributes = [];

        for (let layer of this.rndLayers) {
            meta.attributes.push({
                trait_type: layer.properties.trait,
                value: layer.properties.value,
            });
        }

        return meta;
    }

    // return the art's buffer
    async getImageBuffer() {
        const canvas = Canvas.createCanvas(this.size.w, this.size.h);
        const ctx = canvas.getContext("2d");

        for (let layer of this.rndLayers) {
            let img = await Canvas.loadImage(layer.path);
            ctx.drawImage(img, 0, 0, this.size.w, this.size.h);
        }
        return canvas.toBuffer();
    }

    // rendering time :)
    async renderImage(n = 1) {
        let name = "0".repeat(4 - String(n).length) + n;
        let outputFolder = `${this.outputFolder}/${name}`;
        let outputFile = `${outputFolder}/${name}`;

        fs.mkdir(outputFolder, { recursive: true }, (err) => {
            if (err) {
                console.log(err.message);
            }

            this.getImageBuffer().then((buffer) => {
                fs.writeFileSync(`${outputFile}.png`, buffer);
                fs.writeFileSync(
                    `${outputFile}.json`,
                    JSON.stringify(this.generateMetadata(n), null, 4)
                );
                console.log(
                    chalk.green("#" + name),
                    " generated with DNA " + chalk.bold(this.generateDNA())
                );
            });
        });
    }
}

module.exports = { Generator };
