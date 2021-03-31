const { program } = require("commander");
const inquirer = require("inquirer");
const preguntas = require("./preguntas");


program
  .option("-c, --color <color>", "Color de la Línea")
  .option("-a, --abrev", "Texto de la línea abreviado");

program.parse(process.argv);

const options = program.opts();
console.log(options);

inquirer.prompt(preguntas)
  .then(resp => {
    // resp es un array con las respuestas
  });
