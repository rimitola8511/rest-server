process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//Base de datos

let stringConnection;

if (process.env.NODE_ENV === 'dev') {
    stringConnection = 'mongodb://localhost:27017/cafe';
} else {
    stringConnection = process.env.MONGO_URI;
}

process.env.URLDB = stringConnection;


// Vencimiento del token
process.env.CADUCIDAD_TOKEN = '48h';

// Seed
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//CLIENT_ID google
process.env.CLIENT_ID = process.env.CLIENT_ID || '1046071045396-bgfm6h9k4jpeahcq204ot2cdim6rjjtq.apps.googleusercontent.com';