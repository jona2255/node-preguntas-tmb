const preguntas = opciones => ([
  {
    type: "list",
    name: "transporte",
    message: "¿Qué tipo de transporte quiere consultar?",
    choices: [
      {
        name: "Metro",
        value: "metro"
      },
      {
        name: "Bus",
        value: "bus"
      }
    ],
  },
  {
    type: "checkbox",
    name: "informacion",
    message: "¿Qué información extra quiere obtener de cada parada?",
    default: 0,
    choices: [
      {
        name: "Coordenadas",
        value: "coordenadas"
      },
      {
        name: "Fecha de inauguración",
        value: "fecha-inauguración"
      }
    ], when: respuestas => respuestas.transporte !== "bus"
  },
  {
    type: "confirm",
    name: "error",
    message: "¿Quiere que le informemos de los errores?",
    when: respuestas => respuestas.transporte !== "bus"
  },
  {
    type: "input",
    name: "linea",
    message: "¿Qué línea quiere consultar?",
    when: respuestas => respuestas.transporte !== "bus"
  }
]);

module.exports = preguntas;
