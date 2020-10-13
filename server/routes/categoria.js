const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// Mostrar todas la categorias
app.get('/categoria', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Categoria.find({})
        .sort('descripcion')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .exec((err, categoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categoria,
                    totals: conteo
                });
            });

        });
});

// Mostrar una categoria por id
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `El id: ${id} no existe`
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

// Crear una nueva categoria
app.post('/categoria', verificaToken, (req, res) => {
    let usuario = req.usuario
    let body = req.body

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// Actualizar una catgeoria
app.put('/categoria/:id', [verificaToken], (req, res) => {
    let id = req.params.id;
    let CategoriaActualzizar = {
        descripcion: req.body.descripcion,
        usuario: req.usuario._id
    }

    Categoria.findByIdAndUpdate(id, CategoriaActualzizar, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `El id: ${id} no existe`
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB,
            message: 'La categoria fue Actualizada con éxito'
        });
    })
});

// Borrar una catgeoria
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria,
            message: 'La categoria fue eliminada con éxito'
        });
    });
});

module.exports = app;