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

// NUEVO: métricas
let historial = [];
let tiemposAtencion = [];

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
    const atendido = cola.shift();

    if (atendido) {
        const tiempoReal = Math.floor(Math.random() * 10) + 3;

        tiemposAtencion.push(tiempoReal);

        historial.push({
            ...atendido,
            atendido: true,
            tiempoReal
        });
    }

    res.json({ ok: true });
});

// MÉTRICAS
app.get("/metrics", (req, res) => {
    const atendidosHoy = historial.length;

    const tiempoPromedio = tiemposAtencion.length
        ? (tiemposAtencion.reduce((a, b) => a + b, 0) / tiemposAtencion.length).toFixed(1)
        : 0;

    const enCola = cola.length;

    const perdidos = historial.filter(t => !t.checkin).length;

    res.json({
        atendidosHoy,
        tiempoPromedio,
        enCola,
        perdidos
    });
});

// Rutas
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// 🔥 FIX IMPORTANTE
app.get("/admin", (req, res) => {
    res.redirect("/admin.html");
});

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT);
});