var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    precioUni: { type: Number, required: [true, 'El precio únitario es necesario'] },
    descripcion: { type: String, required: false },
    disponible: { type: Boolean, required: [true, 'Indique si el producto está disponible o no'] ,default: true },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: [true, 'La categoria es requerida'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'usuario' }
});


module.exports = mongoose.model('Producto', productoSchema);