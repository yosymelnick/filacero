const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

let turnoActual = 0;
let cola = [];
let contador = 1;
const TIEMPO_POR_PERSONA = 5;

app.post("/turno", (req, res) => {
    const nuevo = {
        numero: contador++,
        presente: false
    };
    cola.push(nuevo);
    res.json(nuevo);
});

app.get("/cola", (req, res) => {
    const colaConTiempo = cola.map((t, index) => {
        return {
            ...t,
            tiempoEstimado: index * TIEMPO_POR_PERSONA
        };
    });

    res.json({ turnoActual, cola: colaConTiempo });
});

app.post("/checkin/:numero", (req, res) => {
    const turno = cola.find(t => t.numero == req.params.numero);
    if (turno) turno.presente = true;
    res.json({ ok: true });
});

app.post("/siguiente", (req, res) => {
    while (cola.length > 0) {
        const siguiente = cola.shift();
        if (siguiente.presente) {
            turnoActual = siguiente.numero;
            return res.json({ turnoActual });
        }
    }
    res.json({ mensaje: "No hay clientes presentes" });
});

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});