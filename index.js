const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { Generator } = require("./lib/generator");
const inquirer = require("inquirer");

// configuration file
const main = require("./configs/main.json");

// cli tools vibe
inquirer
    .prompt([
        {
            type: "confirm",
            name: "confirmation",
            message: "Is everything set? (positioning, naming ...)",
        },
        {
            type: "input",
            name: "assetsFolder",
            message: "Enter the assets folder path",
            default: main.defaultAssetsFolder,
        },
    ])
    .then((answers) => {
        // setup for generation
        if (!answers.confirmation) {
            console.log("exited with code 1.");
            process.exit(1);
        }

        console.log(chalk.cyan("◌") + " Reading assets directory ...");
        console.time("⏱");
        let folders = fs.readdirSync(answers.assetsFolder);

        let assetsTree = {};
        assetsTree.traitFolders = [];
        assetsTree.traits = {};

        for (const folder of folders) {
            let traitPath = path.join(answers.assetsFolder, folder);
            assetsTree.traitFolders.push({ name: folder, path: traitPath });

            let images = fs.readdirSync(traitPath, null);
            images = images.filter((img) => img.endsWith(".png"));
            assetsTree.traits[folder] = [];

            for (let image of images) {
                assetsTree.traits[folder].push(image);
            }
        }

        fs.writeFileSync(
            "./configs/layers.json",
            JSON.stringify(assetsTree, null, 4)
        );
        console.timeEnd("⏱");

        // the generation process is here
        const prompt = inquirer.createPromptModule();
        prompt([
            {
                type: "input",
                name: "outputPath",
                message: "Enter ouput folder path",
                default: path.join(__dirname, "output"),
            },
            {
                type: "number",
                name: "count",
                message: "Enter the number of images u wanna generate",
                default: 1,
            },
        ]).then((answers) => {
            if (!fs.existsSync(answers.outputPath)) {
                console.log(chalk.red("err: ") + "output path doesn't exist");
                process.exit(1);
            }

            if(fs.readdirSync(answers.outputPath).length > 0){
                console.log(chalk.yellow("warning: ") + "output folder must be empty!");
                process.exit(1);
            }

            if (answers.count == 0) {
                console.log(chalk.red("err: ") + "no need to generate");
                process.exit(1);
            }

            console.log(chalk.bold("creating folders ..."));
            async function run(i) {
                const generator = new Generator(
                    main.imageSize,
                    answers.outputPath
                );
                await generator.renderImage(i);
            }

            for (let i = 0; i < answers.count; i++) {
                run(i)
            }
        });
    });
