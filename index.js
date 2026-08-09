const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const { ejecutarComando } = require('./comandos');

// Base de datos en memoria para los usuarios
const usuariosBD = {};

// 1. Servidor Express para mantener el puerto de Render activo
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
    res.send('PokéBot activo 🚀');
});

app.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});

// 2. Configuración del cliente de WhatsApp
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

// Muestra el QR en la consola/logs
client.on('qr', (qr) => {
    console.log('--- ESCANEA ESTE CÓDIGO QR EN WHATSAPP ---');
    qrcode.generate(qr, { small: true });
});

// Notifica cuando el bot está conectado
client.on('ready', () => {
    console.log('¡PokéBot conectado y listo para recibir mensajes! 🎉');
});

// 3. Manejo de mensajes entrantes
client.on('message_create', async (msg) => {
    if (!msg.body) return;

    try {
        // Determina si el mensaje lo enviaste tú mismo o viene de otro usuario
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

// Inicialización del cliente
client.initialize();
