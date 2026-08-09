const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

// 1. Servidor Express para mantener el servicio activo en Render
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => res.send('Bot activo 🚀'));

app.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});

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

// 3. Evento para mostrar el código QR si se requiere reconexión
client.on('qr', (qr) => {
    console.log('Escanea este código QR con WhatsApp:');
    qrcode.generate(qr, { small: true });
});

// 4. Confirmación de conexión exitosa
client.on('ready', () => {
    console.log('¡PokéBot conectado y listo para recibir mensajes! 🎉');
});

// 5. ESCUCHADOR DE MENSAJES Y COMANDOS
client.on('message_create', async (msg) => {
    // Convierte el mensaje a minúsculas
    const texto = msg.body.toLowerCase();

    // Ejemplo de comando !ping
    if (texto === '!ping') {
        await msg.reply('pong 🏓');
    }

    // Ejemplo de comando !hola
    if (texto === '!hola') {
        await msg.reply('¡Hola! Soy PokéBot 🤖 ¿En qué te puedo ayudar?');
    }
});

// 6. Inicializar el cliente
client.initialize();
