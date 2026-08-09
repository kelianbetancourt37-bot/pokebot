const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const { ejecutarComando } = require('./comandos');

const usuariosBD = {};

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => res.send('PokéBot activo 🚀'));
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));

// Configuración ligera de Puppeteer para no agotar la RAM de Render
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
            '--single-process', // Ahorra mucha memoria RAM
            '--disable-gpu'
        ]
    }
});

client.on('qr', (qr) => {
    console.log('========================================');
    console.log('ESCANEA ESTE CÓDIGO QR EN WHATSAPP:');
    console.log('========================================');
    qrcode.generate(qr, { small: true });
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
