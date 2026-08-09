const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Pokebot está activo 🚀'));

app.listen(PORT, () => {
  console.log(`Servidor web escuchando en el puerto ${PORT}`);
});
