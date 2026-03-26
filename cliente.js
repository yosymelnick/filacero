let miTurno = null;
let yaNotificado = false;

async function sacarTurno() {
    try {
        const res = await fetch("/turno", { method: "POST" });
        const data = await res.json();

        miTurno = data.numero;
        yaNotificado = false;

        document.getElementById("turno").innerText =
            "Tu número: " + miTurno;

        actualizar();

    } catch (error) {
        console.error("Error al sacar turno:", error);
    }
}

async function actualizar() {
    if (!miTurno) return;

    try {
        const res = await fetch("/cola");
        const data = await res.json();

        const turno = data.cola.find(t => t.numero === miTurno);

        if (!turno) {
            document.getElementById("info").innerText =
                "Ya fue atendido";
        } 
        else if (turno.tiempoEstimado <= 0) {

            document.getElementById("info").innerText =
                "🚨 Ya es tu turno!";

            if (!yaNotificado) {
                yaNotificado = true;

                document.getElementById("alertaSonido").play();
                alert("🚨 ¡Es tu turno!");
            }

        } 
        else if (turno.tiempoEstimado <= 5) {

            document.getElementById("info").innerText =
                "⚠️ Te quedan " + turno.tiempoEstimado + " minutos";

        } 
        else {

            document.getElementById("info").innerText =
                "Tiempo estimado: " + turno.tiempoEstimado + " minutos";
        }

    } catch (error) {
        console.error("Error al actualizar:", error);
    }
}

async function checkin() {
    if (!miTurno) return;

    await fetch("/checkin/" + miTurno, { method: "POST" });
    alert("Check-in realizado");
}

setInterval(actualizar, 2000);