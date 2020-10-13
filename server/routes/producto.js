const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

app.get('/productos', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .sort('nombre')
        .skip(desde)
        .limit(limite)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    producto,
                    totals: conteo
                })
            });
        });

});

app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: `El id: ${id} no existe`
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');
    
    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }

            res.json({
                ok: true,
                producto
            })

        });

})

app.post('/productos', verificaToken, (req, res) => {
    let id_usuario = req.usuario._id;
    let body = req.body

    let producto = new Producto({
        ...body,
        usuario: id_usuario
    });

    producto.save((err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: producto
        })
    })
});

app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    // let usuario_id = req.usuario._id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `El id: ${id} no existe`
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.descripcion = body.descripcion ? body.descripcion : productoDB.descripcion;
        productoDB.disponible = body.disponible;

        productoDB.save((err, product) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: product,
                message: `EL producto - ${product.nombre} - fue Actualizado con éxito`
            });
        })
    });

});

app.delete('/productos/:id', (req, res) => {
    let id = req.params.id;

    let producto = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, producto, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            message: `Producto ${productoDB.nombre} eliminado correctamente`
        })
    });

});


module.exports = app;