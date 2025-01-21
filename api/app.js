const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();

app.use(express.json());

// Configura la conexión a MongoDB
const uri = "mongodb+srv://ialfper:ialfper21@alumnos.zoinj.mongodb.net/?retryWrites=true&w=majority&appName=alumnos";
async function connectToMongoDB() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();
    const db = client.db('despliegue');
    return db.collection('usuarios');
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    throw new Error('Error al conectar a la base de datos');
  }
}

// Endpoint GET para obtener todos los usuarios
app.get('/api/users', async (req, res) => {
  try {
    const usersCollection = await connectToMongoDB();
    const users = await usersCollection.find().toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// Endpoint POST para crear un nuevo usuario
app.post('/api/nuevo', async (req, res) => {
  const { nombre, ap1, direccion, dni } = req.body;
  try {
    const usersCollection = await connectToMongoDB();
    const newId = await usersCollection.countDocuments() + 1; // Generar ID secuencial
    const newUser = { id: newId, nombre, ap1, direccion, dni };
    await usersCollection.insertOne(newUser);
    res.json({ mensaje: 'Usuario creado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

// Endpoint GET para buscar usuarios
app.get('/api/:buscar', async (req, res) => {
  const query = req.params.buscar.toLowerCase();
  if (!query) {
    return res.status(400).json({ error: "Debes proporcionar un término de búsqueda." });
  }

  try {
    let lista=[];
    const usersCollection = await connectToMongoDB();
    const resultados = await usersCollection.find().toArray();
    for (let dato of resultados) {
      console.log(dato);
      
      if (dato["nombre"].toLowerCase().includes(resultados)) {
        lista.push(dato);
      }else{

      }
      
    }
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar usuarios' });
  }
});

module.exports = app;
