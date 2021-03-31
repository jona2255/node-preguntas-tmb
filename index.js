require("dotenv").config();
const { program } = require("commander");
const inquirer = require("inquirer");
const preguntas = require("./preguntas");
const chalk = require("chalk");
const fetch = require("node-fetch");

program
  .option("-c, --color <color>", "Color de la Línea")
  .option("-a, --abrev", "Texto de la línea abreviado");

program.parse(process.argv);

const opciones = program.opts();
console.log(opciones);

const error = () => {
  console.log(chalk.red.bold("No existe la línea seleccionada"));
  process.exit(1);
};

const mostrarDatos = (color, datos, respuesta) => {
  const paradaMensaje = datos.features[0].properties.NOM_LINIA +
    "\n" + datos.features[0].properties.DESC_SERVEI;
  const lineasMensaje = datos.features.filter(linea => linea.properties.NOM_ESTACIO_INI !== "Inici");
  console.log(respuesta.informacion);
  if (respuesta.informacion[0] === "coordenadas" && respuesta.informacion[1] === "fecha-inauguración") {
    if (opciones.abrev) {
      console.log(chalk.hex(color)(paradaMensaje + "\n" + lineasMensaje.map(linea => "\n" + linea.properties.NOM_ESTACIO_INI.substring(0, 3) + ". " + linea.properties.DATA + " " + linea.geometry.coordinates[0].map(coordenada => coordenada[0]))));
    } else {
      console.log(chalk.hex(color)(paradaMensaje + "\n" + lineasMensaje.map(linea => "\n" + linea.properties.NOM_ESTACIO_INI + " " + linea.properties.DATA + " " + linea.geometry.coordinates[0].map(coordenada => coordenada[0]))));
    }
  } else if (respuesta.informacion.includes("fecha-inauguración")) {
    if (opciones.abrev) {
      console.log(chalk.hex(color)(paradaMensaje + "\n" + lineasMensaje.map(linea => "\n" + linea.properties.NOM_ESTACIO_INI.substring(0, 3) + ". " + " " + linea.properties.DATA)));
    } else {
      console.log("fecha");
      console.log(chalk.hex(color)(paradaMensaje + "\n" + lineasMensaje.map(linea => "\n" + linea.properties.NOM_ESTACIO_INI + " " + linea.properties.DATA)));
    }
  } else if (respuesta.informacion.includes("coordenadas")) {
    if (opciones.abrev) {
      console.log(chalk.hex(color)(paradaMensaje + "\n" + lineasMensaje.map(linea => "\n" + linea.properties.NOM_ESTACIO_INI.substring(0, 3) + "." + linea.geometry.coordinates[0].map(coordenada => coordenada[0]))));
    } else {
      console.log(chalk.hex(color)(paradaMensaje + "\n" + lineasMensaje.map(linea => "\n" + linea.properties.NOM_ESTACIO_INI + " " + linea.geometry.coordinates[0].map(coordenada => coordenada[0]))));
    }
  } else {
    if (opciones.abrev) {
      console.log(chalk.hex(color)(paradaMensaje + "\n" + lineasMensaje.map(linea => "\n" + linea.properties.NOM_ESTACIO_INI.substring(0, 3) + ".")));
    } else {
      console.log(chalk.hex(color)(paradaMensaje + "\n" + lineasMensaje.map(linea => "\n" + linea.properties.NOM_ESTACIO_INI)));
    }
  }

};

inquirer.prompt(preguntas)
  .then(resp => {
    console.log(resp);
    if (resp.transporte === "bus") {
      console.log(chalk.yellow("no tenemos información disponible sobre los buses. Para más info ves a:"));
      console.log(chalk.yellow(process.env.url_tmb));
      process.exit(0);
    }
    if (resp.linea === "") {
      if (resp.error) {
        error();
      }
      process.exit(1);
    }
    fetch(`${process.env.url_api_tmb + resp.linea}/trams/?app_id=${process.env.api_id}&app_key=${process.env.api_key}`)
      .then(res => res.json())
      .then(json => {
        if (json.numberReturned === 0) {
          if (resp.error) {
            error();
          }
          process.exit(1);
        }
        if (opciones.color) {
          mostrarDatos(opciones.color, json, resp);
        } else {
          mostrarDatos(`#${json.features[0].properties.COLOR_LINIA}`, json, resp);
        }

      });
  });
