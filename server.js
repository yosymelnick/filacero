console.log("🔥 VERSION NUEVA ACTIVA");

const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// Datos en memoria
let cola = [];
let contador = 1;

// Crear turno
app.post("/turno", (req, res) => {
    const nuevo = {
        numero: contador++,
        tiempoEstimado: cola.length * 5,
        checkin: false
    };

    cola.push(nuevo);
    res.json(nuevo);
});

// Obtener cola
app.get("/cola", (req, res) => {
    res.json({ cola });
});

// Check-in
app.post("/checkin/:numero", (req, res) => {
    const turno = cola.find(t => t.numero == req.params.numero);

    if (turno) {
        turno.checkin = true;
    }

    res.json({ ok: true });
});

// Avanzar cola
app.post("/avanzar", (req, res) => {
    cola.shift();
    res.json({ ok: true });
});

// Rutas principales (SOLO UNA VEZ)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "admin.html"));
});

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT);
});