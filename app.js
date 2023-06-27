/* Carga la biblioteca dotenv y luego invoca su funcion config(). la biblioteca carga las variables de entorno */
require("dotenv").config();

/* Importamos la libreria necesaria para el ChatBOT con tres constantes definidas */
const { createBot, createProvider, createFlow } = require("@bot-whatsapp/bot");

/* Importamos el módulo de la libreria portal, para generar códigos QR */
const QRPortalWeb = require("@bot-whatsapp/portal");
/* Importamos el módulo de la libreria provider, para conectarse al servidor de WhatsApp */
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
/* Importamos el módulo de la libreria database, para cenectarse a una base de datos */
const MongoAdapter = require("@bot-whatsapp/database/mongo");

/* Declaramos las conexiones de Mongo */
const MONGO_DB_URI = 'mongodb://0.0.0.0:27017'
const MONGO_DB_NAME = 'db_bot'

/* Crea una instancia y lo guarda en una variable llamada chatGPTclass para usarla desde  */
const ChatGPTClass = require("./chatgpt.class");
const chatGPT = new ChatGPTClass();

/* Importamos los documentos especificos de la carpetas de flows (sufrirá cambios) */
const flowPrincipal = require("./flows/flowPrincipal");
const flowAgente = require("./flows/flowAgente");
const { flowReparacion } = require("./flows/flowReparacion");
const { flowOfertas } = require("./flows/flowOfertas");

/* Funcion principal (sufrirá cambios) */
const main = async () => {

  /* Declaramos las conexiones de Mongo */
  const adapterDB = new MongoAdapter({
    dbUri: MONGO_DB_URI,
    dbName: MONGO_DB_NAME,
  });

  /* Declaramos el chatbot y lo instanciamos */
  const adapterFlow = createFlow([
    flowPrincipal,
    flowAgente,
    flowReparacion(chatGPT),
    flowOfertas(chatGPT),
  ]);

  /* Declaramos el provider y lo instanciamos */
  const adapterProvider = createProvider(BaileysProvider);

  /* Declaramos el bot y lo instanciamos */
  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  /* Llamamos a la funcion QRPortalWeb() la cual genera códigos QR */
  QRPortalWeb();
};

/* Ejecutamos la funcion principal */
main();
