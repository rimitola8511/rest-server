const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5
    limite = Number(limite)

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    totalDocuments: conteo
                })

            })
        })
})

app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        // usuarioDB.password = null

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
})

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    // Es una forma de eliminar los atributos de un objeto 
    // que no quiero que se actualice
    // pero es ineficiente
    /* 
       delete body.password;
       delete body.google; 
    */

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
})

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    // ACtualizar el estado del un afiliado
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (usuario === null) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario no encontrado'
                    }
                });
            }
        }

        res.json({
            ok: true,
            usuario
        })
    })


    // Eliminar un usuario
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (usuarioBorrado === null) {
    //         if (err) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 err: {
    //                     message: 'Usuario no encontrado'
    //                 }
    //             });
    //         }
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     })
    // })


})

module.exports = app;
