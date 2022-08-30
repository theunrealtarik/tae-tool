const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");

const { Generator } = require("./lib/generator");
const { calcMax } = require("./helpers/max");

// configuration file
const MAIN = require("./configs/main.json");
const AG_DNA = [];

// cli tools vibe
console.clear();
inquirer
    .prompt([
        {
            type: "input",
            name: "assetsFolder",
            message: "Enter the assets folder path",
            default: MAIN.defaultAssetsFolder,
        },
    ])
    .then((answers) => {
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
                type: "input",
                name: "projectName",
                message: "Enter your project name",
                default: String(Math.floor(Math.random() * 10 ** 6)),
            },
            {
                type: "number",
                name: "count",
                message: "Enter the number of images u wanna generate",
                default: 1,
            },
        ]).then((answers) => {
            let count = answers.count;

            let projectOPath = path.join(
                answers.outputPath,
                answers.projectName
            );

            if (!fs.existsSync(answers.outputPath)) {
                console.log(chalk.red("err: ") + "output path doesn't exist");
                process.exit(1);
            }

            if (!fs.existsSync(projectOPath)) {
                console.log(
                    chalk.green("log: ") + "project folder has been created"
                );
                fs.mkdirSync(projectOPath);
            }

            if (fs.readdirSync(projectOPath).length > 0) {
                console.log(
                    chalk.yellow("warning: ") + "output folder must be empty!"
                );
                process.exit(1);
            }

            if (count <= 0) {
                console.log(chalk.red("err: ") + "no need to generate");
                process.exit(1);
            }

            // calc the max of possible combos
            const LAYERS = require("./configs/layers.json");
            const MAX = calcMax(...Object.values(LAYERS.traits));

            if (count > MAX) {
                console.log(
                    chalk.red("err: ") +
                        "the maximum u can generate with the provided assets is " +
                        chalk.bold(MAX)
                );
                process.exit(1);
            }

            // rendering images and meta data & checks for repeated ones
            console.log(chalk.bold("creating folders ..."));
            async function run(i) {
                const generator = new Generator(MAIN.imageSize, projectOPath);
                let dna = generator.generateDNA();

                if (!AG_DNA.includes(dna)) {
                    AG_DNA.push(dna);
                    await generator.renderImage(i);
                } else {
                    run(i);
                }
            }

            for (let i = 0; i < count; i++) {
                run(i);
            }
        });
    });
