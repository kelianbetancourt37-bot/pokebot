const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const express = require('express');
const { ejecutarComando } = require('./comandos');

const usuariosBD = {};

const app = express();
const PORT = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('PokéBot activo 🚀'));
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: '/data/data/com.termux/files/usr/bin/chromium',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    }
});

// Evento para generar el código de vinculación por número de teléfono
client.on('qr', async () => {
    const numeroTelefono = '559581068631';

    try {
        const codigo = await client.requestPairingCode(numeroTelefono);
        console.log('========================================');
        console.log(`TU CÓDIGO DE VINCULACIÓN ES: ${codigo}`);
        console.log('========================================');
    } catch (err) {
        console.error('Error al generar el código:', err);
    }
});

client.on('ready', () => {
    console.log('¡PokéBot conectado y listo para recibir mensajes! 🎉');
});

client.on('message_create', async (msg) => {
    if (!msg.body) return;

    try {
        const remitente = msg.fromMe ? msg.to : msg.from;
        const resultado = await ejecutarComando(msg.body, remitente, usuariosBD);

        if (resultado) {
            if (typeof resultado === 'object' && resultado.imagen) {
                try {
                    const media = await MessageMedia.fromUrl(resultado.imagen);
                    await client.sendMessage(msg.from, media, { caption: resultado.texto });
                } catch (error) {
                    await msg.reply(resultado.texto);
                }
            } else if (typeof resultado === 'string') {
                await msg.reply(resultado);
            }
        }
    } catch (err) {
        console.error('Error al procesar el mensaje:', err);
    }
});

client.initialize();
