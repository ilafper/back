const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();


app.use(express.json());

// Configura la conexión a MongoDB
const uri = "mongodb+srv://ialfper:ialfper21@alumnos.zoinj.mongodb.net/alumnos?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Conectado a MongoDB Atlas");
    const db = client.db('despliegue');
    let usersCollection = db.collection('usuarios');
    let pat={};
    const datos=await usersCollection.find(pat).toArray(); 
    return datos;
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
  }
}


// Endpoint GET para obtener todos los usuarios
app.get('/api/users', async (req, res) => {
  try {
    const patata= await connectToMongoDB();
    res.json(patata);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// Endpoint POST para crear un nuevo usuario
app.post('/api/nuevo', async (req, res) => {
  const { nombre, ap1, direccion, dni } = req.body;
  try {
    const newId = await usersCollection.countDocuments() + 1; // Generar ID secuencial
    const newUser = { id: newId, nombre, ap1, direccion, dni };
    await usersCollection.insertOne(newUser);
    res.json({ mensaje: 'Usuario creado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

// Endpoint GET para buscar usuarios
app.get('/api/buscar', async (req, res) => {
  const query = req.query.q?.toLowerCase();
  if (!query) {
    return res.status(400).json({ error: "Debes proporcionar un término de búsqueda." });
  }

  try {
    const resultados = await usersCollection.find({
      $or: [
        { nombre: { $regex: query, $options: 'i' } },
        { ap1: { $regex: query, $options: 'i' } },
        { direccion: { $regex: query, $options: 'i' } }
      ]
    }).toArray();
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar usuarios' });
  }
});

module.exports = app;
