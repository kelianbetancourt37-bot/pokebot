const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

// 1. Servidor Express para Render
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => res.send('Bot activo 🚀'));

app.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});

// 2. Configuración de WhatsApp Client
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

// 3. Generar Código QR en la consola
client.on('qr', (qr) => {
    console.log('Escanea este código QR con WhatsApp:');
    qrcode.generate(qr, { small: true });
});

// 4. Mensaje cuando se conecta con éxito
client.on('ready', () => {
    console.log('¡PokéBot conectado y listo para usarse! 🎉');
});

// 5. Inicializar el cliente
client.initialize();
