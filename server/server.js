require('./config/config')

const express = require('express');
const app = express();

// Parsear la información que llega por post
const bodyPaser = require('body-parser');

// Middlerwares
app.use(bodyPaser.urlencoded({ extended: false }));
app.use(bodyPaser.json());

app.get('/usuario', (req, res) => {
    res.json('get usuario');
})

app.post('/usuario', (req, res) => {

    let body = req.body;

    if (body.name === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es requerido'
        })
        return;
    }

    res.json({
        persona: body
    });
})

app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;

    res.json({
        id
    });
})

app.delete('/usuario', (req, res) => {
    res.json('delete usuario');
})

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
})