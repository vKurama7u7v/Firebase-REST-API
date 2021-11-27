// IMPORTACIONES
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

// RETORNA OBJETO Y SE ALMACENA EN APP
const app = express();
admin.initializeApp({
  credential: admin.credential.cert("./credentials.json"),
  databaseURL: "https://fir-api-porfolio.firebaseio.com",
});

const db = admin.firestore();

// ================= ROUTES ===================

// CREATE PROYECTO
app.post("/api/projects", async (req, res) => {
  try {
    await db.collection("projects").doc().create({
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      fotoURL: req.body.fotoURL,
      categoria: req.body.categoria,
      fecha_creacion: req.body.fecha_creacion,
      fechaC_Orden: req.body.fechaC_Orden,
      fecha_edicion: req.body.fecha_edicion,
      fechaE_Orden: req.body.fechaE_Orden,
      urlProject: req.body.urlProject,
    });
    return res.status(204).json();

  } catch (error) {
    console.log("Error al Crear Proyecto: ", error);
    return res.status(500).send(error);
  }
});

// GET PROYECTO
app.get("/api/projects/:id", async (req, res) => {
  try {
    const doc = db.collection("projects").doc(req.params.id);
    const project = await doc.get();
    return res.status(200).json(project);

  } catch (error) {
    console.log("Error al Obtener Proyecto: ", error);
    return res.status(500).send(error);
  }
})

// GET PROYECTOS
app.get("/api/projects", async (req, res) => {
  try {
    const query = db.collection("projects");
    const querySnapshot = await query.get();
    const docs = querySnapshot.docs;

    // DECLARATIVO
    const response = docs.map(doc => ({
      id: doc.id,
      titulo: doc.data().titulo,
      descripcion: doc.data().descripcion,
      fotoURL: doc.data().fotoURL,
      categoria: doc.data().categoria,
      fecha_creacion: doc.data().fecha_creacion,
      fechaC_Orden: doc.data().fechaC_Orden,
      fecha_edicion: doc.data().fecha_edicion,
      fechaE_Orden: doc.data().fechaE_Orden,
      urlProject: doc.data().urlProject,
    }))

    return res.status(200).json(response);

  } catch (error) {
    console.log("Error al Obtener Proyectos: ", error);
    return res.status(500).send(error);
  }

})

// DELETE PROYECTO
app.delete("/api/projects/:id", async (req, res) => {
  try {
    const document = db.collection("projects").doc(req.params.id);
    await document.delete();

    return res.status(200).json();

  } catch (error) {
    console.log("Error al Eliminar Proyecto: ", error);
    return res.status(500).send(error);
  }
})

// ACTUALIZAR PROYECTO
app.put("/api/projects/:id", async (req, res) => {
  try {
    const document = db.collection("projects").doc(req.params.id);
    await document.update({
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      fotoURL: req.body.fotoURL,
      categoria: req.body.categoria,
      fecha_creacion: req.body.fecha_creacion,
      fechaC_Orden: req.body.fechaC_Orden,
      fecha_edicion: req.body.fecha_edicion,
      fechaE_Orden: req.body.fechaE_Orden,
      urlProject: req.body.urlProject,
    })

    return res.status(200).json();

  } catch (error) {
    console.log("Error al Actualizar Proyecto: ", error);
    return res.status(500).send(error);
  }
})

// PASANDO BACKEND A FIREBASE
exports.app = functions.https.onRequest(app);
