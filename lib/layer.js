const { rarities } = require("../configs/main.json");
class Layer {
    constructor() {
        this.layersDataTree = require("../configs/layers.json");
        this.path = "";
        this.properties = {
            rarity: 1,
            value: "",
            trait: "",
        };
    }

    static randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    getRandomLayer(traitFolder) {
        let proposedLayers = this.layersDataTree.traits[traitFolder];
        let dice = Math.floor(Math.random() * 100);

        let items = [];

        // my potato rarity system
        for (let layer of proposedLayers) {
            let _layerRarity = layer.replace(/.png$/g, "").split("_");
            let layerRarity = _layerRarity[_layerRarity.length - 1];

            for (let rarity of rarities) {
                let diceInRange = dice >= rarity.rate.down && dice < rarity.rate.up;
                if(rarity.key === layerRarity && diceInRange){
                    this.properties.rarity = rarity.rate.up - rarity.rate.down;
                    items.push(layer)
                }
            }
        }            
        
        let randomLayer = items[Layer.randomNum(0, items.length)];
        return randomLayer;
    }
}

module.exports = Layer;
