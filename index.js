const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { ejecutarComando } = require('./comandos');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Base de datos de jugadores en memoria (guardada por número de teléfono)
const usuariosBD = {};

client.on('qr', (qr) => qrcode.generate(qr, { small: true }));

client.on('ready', () => {
    console.log('¡PokeBot con Registro y +400 Pokémon está listo! 🚀');
});

client.on('message_create', async msg => {
    const remitente = msg.from; // ID único del número de WhatsApp
    const texto = msg.body;

    // Ejecutar lógica de comandos
    const resultado = await ejecutarComando(texto, remitente, usuariosBD);

    if (resultado) {
        if (typeof resultado === 'object' && resultado.imagen) {
            try {
                const media = await MessageMedia.fromUrl(resultado.imagen);
                await msg.reply(media, null, { caption: resultado.texto });
            } catch (error) {
                msg.reply(resultado.texto);
            }
        } else {
            msg.reply(resultado);
        }
    }
});

client.initialize();