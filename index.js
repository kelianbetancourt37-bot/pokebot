const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const { ejecutarComando } = require('./comandos'); // Importa tu archivo de comandos

// Base de datos en memoria para los usuarios
const usuariosBD = {};

// 1. Servidor Express
const app = express();
const PORT = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('PokéBot activo 🚀'));
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));

// 2. Configuración del cliente
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    }
});

client.on('qr', (qr) => {
    console.log('Escanea el QR:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('¡PokéBot conectado y listo! 🎉');
});

// 3. Manejo de mensajes entrantes
client.on('message_create', async (msg) => {
    // Esto asegura que reponda tanto a tus propios mensajes como a los de otros
    if (!msg.body) return;

    const remitente = msg.from;
    const resultado = await ejecutarComando(msg.body, remitente, usuariosBD);

    if (resultado) {
        if (typeof resultado === 'object' && resultado.imagen) {
            try {
                const media = await MessageMedia.fromUrl(resultado.imagen);
                await client.sendMessage(msg.from, media, { caption: resultado.texto });
            } catch (error) {
                await msg.reply(resultado.texto);
            }
        }  else if (typeof resultado === 'string') {
            await msg.reply(resultado);
        }
    }
});

client.initialize();
