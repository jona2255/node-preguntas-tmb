require("dotenv").config();
const { program } = require("commander");
const inquirer = require("inquirer");
const preguntas = require("./preguntas");
const chalk = require("chalk");


program
  .option("-c, --color <color>", "Color de la Línea")
  .option("-a, --abrev", "Texto de la línea abreviado");

program.parse(process.argv);

const opciones = program.opts();
console.log(opciones);

inquirer.prompt(preguntas(opciones))
  .then(resp => {
    console.log(resp);
    if (resp.transporte === "bus") {
      console.log(chalk.yellow("no tenemos información disponible sobre los buses. Para más info ves a:"));
      console.log(chalk.yellow(process.env.url_tmb));
      process.exit(0);
    }
    if (resp.linea === "") {
      if (resp.error) {
        console.log(chalk.red.bold("No existe la línea seleccionada"));
        process.exit(1);
      }
      process.exit(1);
    }
  });
