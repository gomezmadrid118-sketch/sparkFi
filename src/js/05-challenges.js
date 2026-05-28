document.addEventListener("DOMContentLoaded", function () {
  // API pública usada para traer datos base y transformarlos en retos financieros.
  const API_RETOS_URL = "https://jsonplaceholder.typicode.com/todos?_limit=6";
  const metaTotal = 50000;

  // El progreso se guarda temporalmente para que no se pierda al recargar la página.
  let ahorroActual = Number(localStorage.getItem("sparkfi_ahorro_actual")) || 25000;
  let contadorDepositos =
    Number(localStorage.getItem("sparkfi_contador_depositos")) || 0;
  let retosAceptadosIds =
    JSON.parse(localStorage.getItem("sparkfi_retos_aceptados")) || [];

  const challengeSection = document.querySelector(".challenge");
  const listaDisponibles = document.querySelector(".available-list");
  const listaLogros = document.querySelectorAll(".achievement");

  // Ajusta títulos que vienen de la API para que se vean mejor en la interfaz.
  function capitalizar(texto) {
    if (!texto) return "Reto financiero";
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  // Convierte una tarea genérica de la API en un nombre de reto entendible para SparkFi.
  function crearTituloReto(tarea, index) {
    return "Reto " + (index + 1) + ": " + capitalizar(tarea.title);
  }

  // Función encargada de consultar la API y devolver datos adaptados al módulo de retos.
  async function obtenerRetosApi() {
    const respuesta = await fetch(API_RETOS_URL);

    if (!respuesta.ok) {
      throw new Error("No se pudieron consultar los retos.");
    }

    const datos = await respuesta.json();

    return datos.map(function (tarea, index) {
      return {
        id: "reto-api-" + tarea.id,
        titulo: crearTituloReto(tarea, index),
        nivel: tarea.completed ? "Intermedio" : "Basico",
        duracion: 7 + index + " dias",
        bono: index === 0 ? 3000 : 5000,
      };
    });
  }

  // Muestra carga o error en el área principal de retos y limpia la lista disponible.
  function mostrarEstadoRetos(texto, tipo) {
    if (challengeSection) {
      challengeSection.innerHTML = "";

      const titulo = document.createElement("h2");
      titulo.className = "challenge-title";
      titulo.dataset.estado = tipo;
      titulo.textContent = texto;

      challengeSection.appendChild(titulo);
    }

    if (listaDisponibles) {
      listaDisponibles.innerHTML = "";
    }
  }

  // Recalcula la barra de progreso y el texto con base en el ahorro actual.
  function actualizarVistaProgreso() {
    const barraFill = document.querySelector(".progress-fill");
    const textoProgreso = document.querySelector(".progress-text");
    const porcentaje = Math.min((ahorroActual / metaTotal) * 100, 100);

    if (barraFill) {
      barraFill.style.width = porcentaje + "%";
    }

    if (textoProgreso) {
      textoProgreso.textContent =
        "Progreso: $" +
        ahorroActual.toLocaleString("es-CO") +
        " / $" +
        metaTotal.toLocaleString("es-CO");
    }

    actualizarLogros();
  }

  // Suma dinero al progreso, limita el valor a la meta y guarda el cambio en localStorage.
  function actualizarGraficaProgreso(incremento) {
    ahorroActual += incremento;

    if (ahorroActual > metaTotal) {
      ahorroActual = metaTotal;
    }

    localStorage.setItem("sparkfi_ahorro_actual", String(ahorroActual));
    actualizarVistaProgreso();
  }

  // Ilumina o apaga logros según el avance financiero del usuario.
  function actualizarLogros() {
    if (listaLogros[1]) {
      const desbloqueado = ahorroActual >= 35000;
      listaLogros[1].classList.toggle("achievement-active", desbloqueado);
      listaLogros[1].classList.toggle("achievement-inactive", !desbloqueado);

      const etiqueta = listaLogros[1].querySelector(".achievement-label");
      if (etiqueta && desbloqueado) {
        etiqueta.textContent = "Inversor novato desbloqueado";
      }
    }

    if (listaLogros[2]) {
      const desbloqueado = ahorroActual >= metaTotal;
      listaLogros[2].classList.toggle("achievement-active", desbloqueado);
      listaLogros[2].classList.toggle("achievement-inactive", !desbloqueado);

      const etiqueta = listaLogros[2].querySelector(".achievement-label");
      if (etiqueta && desbloqueado) {
        etiqueta.textContent = "Maestro del ahorro";
      }
    }
  }

  // Reconstruye el reto principal con datos que vienen de la API.
  function renderizarRetoActivo(reto) {
    if (!challengeSection || !reto) return;

    challengeSection.innerHTML = "";

    const titulo = document.createElement("h2");
    titulo.className = "challenge-title";
    titulo.textContent = reto.titulo;

    const barra = document.createElement("div");
    barra.className = "progress-bar";

    const relleno = document.createElement("div");
    relleno.className = "progress-fill";
    barra.appendChild(relleno);

    const progreso = document.createElement("p");
    progreso.className = "progress-text";

    const vencimiento = document.createElement("p");
    vencimiento.className = "challenge-deadline";
    vencimiento.textContent = "Vence el domingo";

    const botonDeposito = document.createElement("button");
    botonDeposito.id = "btn-depositar-dinamico";
    botonDeposito.type = "button";
    botonDeposito.className = "btn-join";

    function actualizarBotonDeposito() {
      // El botón cambia de texto según el avance del usuario.
      if (ahorroActual >= metaTotal) {
        botonDeposito.textContent = "Meta cumplida";
        botonDeposito.disabled = true;
        return;
      }

      botonDeposito.textContent =
        contadorDepositos > 0
          ? "Deposito #" + contadorDepositos + " registrado (+$5.000)"
          : "Registrar deposito (+$5.000)";
    }

    botonDeposito.addEventListener("click", function () {
      if (ahorroActual >= metaTotal) return;

      contadorDepositos++;
      localStorage.setItem("sparkfi_contador_depositos", String(contadorDepositos));
      actualizarGraficaProgreso(5000);
      actualizarBotonDeposito();
    });

    challengeSection.appendChild(titulo);
    challengeSection.appendChild(barra);
    challengeSection.appendChild(progreso);
    challengeSection.appendChild(vencimiento);
    challengeSection.appendChild(botonDeposito);

    actualizarVistaProgreso();
    actualizarBotonDeposito();
  }

  // Deja claro visualmente que un reto ya fue aceptado y evita repetir el bono.
  function marcarBotonComoAceptado(boton, bono) {
    boton.textContent = "Aceptado (+$" + bono.toLocaleString("es-CO") + ")";
    boton.disabled = true;
  }

  // Agrega al reto activo una tarjeta pequeña con cada reto que el usuario acepta.
  function crearTarjetaActivaEnPantalla(titulo) {
    if (!challengeSection) return;

    const existente = Array.from(
      challengeSection.querySelectorAll(".replica-retos-dinamica"),
    ).some(function (elemento) {
      return elemento.textContent.includes(titulo);
    });

    if (existente) return;

    const tarjeta = document.createElement("div");
    tarjeta.className = "replica-retos-dinamica";

    const etiqueta = document.createElement("span");
    etiqueta.textContent = "Reto adquirido";

    const nombre = document.createElement("h4");
    nombre.textContent = titulo;

    tarjeta.appendChild(etiqueta);
    tarjeta.appendChild(nombre);
    challengeSection.appendChild(tarjeta);
  }

  // Pinta los retos secundarios y registra la interacción de "Unirse".
  function renderizarRetosDisponibles(retos) {
    if (!listaDisponibles) return;

    listaDisponibles.innerHTML = "";

    retos.slice(1).forEach(function (reto) {
      const tarjeta = document.createElement("article");
      tarjeta.className = "available-card";

      const info = document.createElement("div");
      info.className = "available-info";

      const icono = document.createElement("span");
      icono.className = "available-icon";
      icono.textContent = "$";

      const textos = document.createElement("div");

      const titulo = document.createElement("h3");
      titulo.className = "available-title";
      titulo.textContent = reto.titulo;

      const meta = document.createElement("p");
      meta.className = "available-meta";
      meta.textContent = "Nivel: " + reto.nivel + " - " + reto.duracion;

      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "btn-join";
      boton.textContent = "Unirse";

      if (retosAceptadosIds.includes(reto.id)) {
        marcarBotonComoAceptado(boton, reto.bono);
        crearTarjetaActivaEnPantalla(reto.titulo);
      }

      boton.addEventListener("click", function () {
        if (retosAceptadosIds.includes(reto.id)) return;

        // Se guarda el id del reto aceptado para conservar el estado al recargar.
        retosAceptadosIds.push(reto.id);
        localStorage.setItem(
          "sparkfi_retos_aceptados",
          JSON.stringify(retosAceptadosIds),
        );

        marcarBotonComoAceptado(boton, reto.bono);
        actualizarGraficaProgreso(reto.bono);
        crearTarjetaActivaEnPantalla(reto.titulo);
      });

      textos.appendChild(titulo);
      textos.appendChild(meta);
      info.appendChild(icono);
      info.appendChild(textos);
      tarjeta.appendChild(info);
      tarjeta.appendChild(boton);
      listaDisponibles.appendChild(tarjeta);
    });
  }

  // Punto de entrada del módulo: muestra carga, consulta la API y renderiza la experiencia.
  async function cargarModuloRetos() {
    try {
      mostrarEstadoRetos("Cargando retos...", "cargando");

      const retos = await obtenerRetosApi();
      renderizarRetoActivo(retos[0]);
      renderizarRetosDisponibles(retos);
    } catch (error) {
      mostrarEstadoRetos("No se pudieron cargar los retos. Intenta mas tarde.", "error");
    }
  }

  cargarModuloRetos();
});
