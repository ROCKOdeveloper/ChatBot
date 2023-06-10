/* Carga la biblioteca dotenv y luego invoca su funcion config(). la biblioteca carga las variables de entorno */
require("dotenv").config();

/* Importamos la libreria necesaria para el ChatBOT con tres constantes definidas */
const { createBot, createProvider, createFlow } = require("@bot-whatsapp/bot");
/* Importamos el módulo de la libreria portal, para generar códigos QR */
const QRPortalWeb = require("@bot-whatsapp/portal");
/* Importamos el módulo de la libreria provider, para conectarse al servidor de WhatsApp */
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
/* Importamos el módulo de la libreria database, para cenectarse a una base de datos */
const MockAdapter = require("@bot-whatsapp/database/mock");

/* Crea una instancia y lo guarda en una variable llamada chatGPT */
const ChatGPTClass = require("./chatgpt.class");
const chatGPT = new ChatGPTClass();

/* Importamos los documentos especificos de la carpetas de flows (sufrirá cambios) */
const flowPrincipal = require("./flows/flowPrincipal");
const flowAgente = require("./flows/flowAgente");
const { flowReparacion } = require("./flows/flowReparacion");
const { flowOfertas } = require("./flows/flowOfertas");

/* Funcion principal (sufrirá cambios) */
const main = async () => {
  const adapterDB = new MockAdapter();

  const adapterFlow = createFlow([
    flowPrincipal,
    flowAgente,
    flowReparacion(chatGPT),
    flowOfertas(chatGPT),
  ]);
  
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
