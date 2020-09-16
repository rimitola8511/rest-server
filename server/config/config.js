process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//Base de datos

let stringConnection;

if (process.env.NODE_ENV === 'dev') {
    stringConnection = 'mongodb://localhost:27017/cafe'
} else {
    stringConnection = 'mongodb+srv://test01:test01@cluster0.dmp3a.gcp.mongodb.net/cafe?retryWrites=true&w=majority'
}

process.env.URLDB = stringConnection