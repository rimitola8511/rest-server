require('./config/config')

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Parsear la información que llega por post
const bodyPaser = require('body-parser');

// Middlerwares
app.use(bodyPaser.urlencoded({ extended: false }));
app.use(bodyPaser.json());

// Habilitar la carpeta public para que se pueda acceder de cualquier lugar
app.use(express.static(path.resolve(__dirname, '../public')));

// Importar las rutas desde la carpeta routes
app.use(require('./routes/index'));

// Conexión base de datos mongo con mongoose
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
})

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
})