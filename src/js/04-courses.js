// Datos de todos los cursos disponibles en la plataforma.
// Cuando exista backend, este arreglo se reemplazará por una llamada a la API.
// const cursos = [
//   {
//     id: "ahorro-intro",
//     tema: "Ahorro",
//     titulo: "Introducción al ahorro",
//     icono: "🐷",
//     progreso: 65,
//     estado: "En curso",
//     lecciones: [
//       { icono: "🎟️", titulo: "Reducir gastos en entretenimiento" },
//       { icono: "💸", titulo: "Guardar incremento salarial" },
//       { icono: "🏦", titulo: "Separar ahorro fijo al inicio del mes" },
//       { icono: "🔁", titulo: "Configurar transferencia automatica de ahorro" },
//     ],
//   },
//   {
//     id: "presupuesto-basico",
//     tema: "Presupuesto",
//     titulo: "Presupuesto básico",
//     icono: "🧮",
//     progreso: 20,
//     estado: "En curso",
//     lecciones: [
//       { icono: "📝", titulo: "Registrar ingresos y gastos por categoría" },
//       { icono: "📐", titulo: "Definir topes semanales realistas" },
//       { icono: "📆", titulo: "Revisar gastos variables cada fin de semana" },
//       { icono: "🧠", titulo: "Ajustar presupuesto segun resultados del mes" },
//     ],
//   },
//   {
//     id: "inversion-fundamentos",
//     tema: "Inversión",
//     titulo: "Fundamentos de inversión",
//     icono: "📈",
//     progreso: 0,
//     estado: "Por iniciar",
//     lecciones: [
//       { icono: "⚖️", titulo: "Riesgo vs rentabilidad" },
//       { icono: "⏳", titulo: "Interés compuesto y horizonte de tiempo" },
//       { icono: "📊", titulo: "Diferencias entre renta fija y variable" },
//       { icono: "🚀", titulo: "Como empezar con montos pequenos" },
//     ],
//   },
//   {
//     id: "fondo-emergencia",
//     tema: "Ahorro",
//     titulo: "Fondo de emergencia",
//     icono: "🛟",
//     progreso: 0,
//     estado: "Por iniciar",
//     lecciones: [
//       { icono: "🧮", titulo: "Calcular 3 a 6 meses de gastos" },
//       { icono: "🔒", titulo: "Elegir cuenta segura y líquida" },
//       { icono: "📋", titulo: "Definir regla para usar el fondo" },
//       { icono: "🧩", titulo: "Plan de reposicion del fondo tras emergencia" },
//     ],
//   },
//   {
//     id: "gastos-hormiga",
//     tema: "Ahorro",
//     titulo: "Control de gastos hormiga",
//     icono: "🧾",
//     progreso: 0,
//     estado: "Por iniciar",
//     lecciones: [
//       { icono: "🔎", titulo: "Identificar fugas diarias de dinero" },
//       { icono: "⏸️", titulo: "Aplicar regla de pausa antes de comprar" },
//       { icono: "🛒", titulo: "Crear lista de compras consciente" },
//       { icono: "📉", titulo: "Medir ahorro semanal por recorte de fugas" },
//     ],
//   },
//   {
//     id: "ahorro-objetivos",
//     tema: "Ahorro",
//     titulo: "Ahorro por objetivos",
//     icono: "🎯",
//     progreso: 0,
//     estado: "Por iniciar",
//     lecciones: [
//       { icono: "🎯", titulo: "Definir metas SMART" },
//       { icono: "🤖", titulo: "Automatizar aportes mensuales" },
//       { icono: "🗂️", titulo: "Priorizar metas de corto y largo plazo" },
//       { icono: "✅", titulo: "Monitorear avance con checkpoints mensuales" },
//     ],
//   },
//   {
//     id: "metodo-503020",
//     tema: "Presupuesto",
//     titulo: "Método 50/30/20",
//     icono: "📊",
//     progreso: 0,
//     estado: "Por iniciar",
//     lecciones: [
//       { icono: "📊", titulo: "Separar necesidades, gustos y ahorro" },
//       { icono: "🧭", titulo: "Ajustar porcentajes a tu realidad" },
//       { icono: "📏", titulo: "Calcular limite mensual por categoria" },
//       { icono: "♻️", titulo: "Corregir desbalance al cierre del mes" },
//     ],
//   },
//   {
//     id: "presupuesto-familiar",
//     tema: "Presupuesto",
//     titulo: "Presupuesto familiar",
//     icono: "👨‍👩‍👧",
//     progreso: 0,
//     estado: "Por iniciar",
//     lecciones: [
//       { icono: "🏠", titulo: "Distribuir gastos del hogar" },
//       { icono: "🛍️", titulo: "Planificar compras grandes" },
//       { icono: "🛡️", titulo: "Establecer fondo para imprevistos familiares" },
//       { icono: "🤝", titulo: "Definir metas compartidas en familia" },
//     ],
//   },
//   {
//     id: "inversion-indexados",
//     tema: "Inversión",
//     titulo: "Inversión en fondos indexados",
//     icono: "💹",
//     progreso: 0,
//     estado: "Por iniciar",
//     lecciones: [
//       { icono: "📚", titulo: "Qué es un índice bursátil" },
//       { icono: "🌍", titulo: "Cómo diversificar con bajo costo" },
//       { icono: "💰", titulo: "Como evaluar comisiones del fondo" },
//       { icono: "📅", titulo: "Estrategia de aportes periodicos" },
//     ],
//   },
//   {
//     id: "inversion-riesgo",
//     tema: "Inversión",
//     titulo: "Perfil de riesgo e inversión",
//     icono: "⚖️",
//     progreso: 0,
//     estado: "Por iniciar",
//     lecciones: [
//       { icono: "🧠", titulo: "Identificar tu tolerancia al riesgo" },
//       { icono: "🧾", titulo: "Elegir productos según tu perfil" },
//       { icono: "🧱", titulo: "Balancear cartera segun horizonte" },
//       { icono: "⚙️", titulo: "Rebalanceo basico cada trimestre" },
//     ],
//   },
// ];

// Procedemos a usar APIs
const Courses_URL = "https://6a074a82c83ba8ad9b3ebec7.mockapi.io/api/v1/Courses";
const TIEMPO_MINIMO_CARGA_MS = 1200;
const PARAMETROS_CURSOS = new URLSearchParams(window.location.search);
const SIMULAR_ERROR_CURSOS = PARAMETROS_CURSOS.get("simularErrorCursos") === "1";
let huboErrorCargaCursos = false;

async function obtenerCursosMedianteAPI() {
  huboErrorCargaCursos = false;
  try {
    if (SIMULAR_ERROR_CURSOS) {
      throw new Error("Error simulado de cursos.");
    }
    const respuesta = await fetch(Courses_URL);
    if (!respuesta.ok) {
      throw new Error("No se pudieron consultar los cursos.");
    }
    const cursosAPI = await respuesta.json();
    return Array.isArray(cursosAPI) ? cursosAPI : [];
  } catch (error) {
    huboErrorCargaCursos = true;
    console.log("Ha habido un error", error);
    return [];
  }
}

let cursos = [];

// Referencias a los elementos del DOM que se actualizan dinámicamente
const barraLateral = document.querySelector(".barra-lateral-cursos");
const contenidoCursos = document.querySelector(".contenido-cursos");
const encabezadoCursos = document.querySelector(".encabezado-cursos");
const bloqueErrorCursos = document.querySelector("[data-cursos-error]");
const inputBusqueda = document.querySelector(".campo-busqueda-cursos");
const contenedorLecciones = document.querySelector(".lista-cursos");
const mensajeVacio = document.getElementById("mensaje-vacio-cursos");

const porcentajeLeccion = document.querySelector(".porcentaje-leccion");
const listaLeccion = document.querySelector(".lista-leccion");
const barraLeccion = document.querySelector(".relleno-progreso-leccion");
let bloqueCargando = null;

// Estado de la UI: qué tema está activo, qué texto se busca y qué curso está seleccionado
let temaActivo = "Ahorro";
let textoBusqueda = "";
let cursoActivoId = null;

// Filtra los cursos que coinciden con el texto de búsqueda (sin importar mayúsculas)
function obtenerCursosActivos() {
  return cursos.filter((curso) => curso.tema === temaActivo);
}

function obtenerCursosFiltrados() {
  return cursos.filter((curso) => {
    const coincideTexto = curso.titulo
      .toLowerCase()
      .includes(textoBusqueda.toLowerCase());

    return coincideTexto;
  });
}

// Escucha lo que el usuario escribe para filtrar la lista en tiempo real
if (inputBusqueda) {
  inputBusqueda.addEventListener("input", (e) => {
    textoBusqueda = e.target.value.trim();
    renderizarCursos();
  });

}

function crearBloqueCargando() {
  if (!contenidoCursos || bloqueCargando) return;

  const bloque = document.createElement("div");
  bloque.className = "bloque-cargando-cursos";
  bloque.setAttribute("aria-live", "polite");
  bloque.textContent = "Cargando cursos...";

  if (encabezadoCursos) {
    contenidoCursos.insertBefore(bloque, encabezadoCursos);
  } else {
    contenidoCursos.prepend(bloque);
  }
  bloqueCargando = bloque;
}

function mostrarCargandoCursos() {
  if (!bloqueCargando) {
    crearBloqueCargando();
  }
  if (bloqueCargando) {
    bloqueCargando.hidden = false;
  }
}

function ocultarCargandoCursos() {
  if (bloqueCargando) {
    bloqueCargando.hidden = true;
  }
}

function mostrarErrorCursos(mensaje) {
  if (bloqueErrorCursos) {
    bloqueErrorCursos.textContent = mensaje;
    bloqueErrorCursos.hidden = false;
  }
}

function ocultarErrorCursos() {
  if (bloqueErrorCursos) {
    bloqueErrorCursos.hidden = true;
  }
}

// Quita la clase "activo" de todos los botones y la pone solo en el seleccionado
function activarBotonSeleccionado(botonSeleccionado) {
  const botones = document.querySelectorAll(".boton-tema-curso");
  botones.forEach((boton) => boton.classList.remove("activo"));
  botonSeleccionado.classList.add("activo");
}

// Reconstruye la lista de cursos en el sidebar según los filtros activos
function renderizarCursos() {
  if (!barraLateral) {
    return;
  }

  const cursosActivos = obtenerCursosFiltrados();
  const botonesActuales = barraLateral.querySelectorAll(".boton-tema-curso");
  botonesActuales.forEach((boton) => boton.remove());

  // Si no hay resultados, muestra el mensaje de "no encontrados"
  mensajeVacio.hidden = cursosActivos.length > 0;
  if (cursosActivos.length === 0) return;

  // Si el curso activo ya no está en los resultados, selecciona el primero visible
  const cursoSigueVisible = cursosActivos.find(c => c.id === cursoActivoId);
  if (cursosActivos.length > 0 && !cursoSigueVisible) {
    cursoActivoId = cursosActivos[0].id;
  }

  // DocumentFragment para hacer un solo reflow al insertar todos los botones
  const fragmento = document.createDocumentFragment();
  cursosActivos.forEach((curso) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "boton-tema-curso";
    if (curso.id === cursoActivoId) {
      boton.classList.add("activo");
    }
    boton.textContent = curso.titulo;
    fragmento.appendChild(boton);

    boton.addEventListener("click", () => {
      cursoActivoId = curso.id;
      activarBotonSeleccionado(boton);
      renderizarLeccionesCurso(curso);
      renderizarDetalleCurso(curso);
    });
  });

  barraLateral.appendChild(fragmento);

  // Actualiza el contenido derecho con el curso activo tras reconstruir la lista
  const cursoActivo = cursosActivos.find((curso) => curso.id === cursoActivoId);
  renderizarLeccionesCurso(cursoActivo);
  renderizarDetalleCurso(cursoActivo);
}

// Genera las tarjetas de lecciones del curso seleccionado en el área de la derecha
function renderizarLeccionesCurso(curso) {
  if (!contenedorLecciones || !curso) {
    return;
  }

  contenedorLecciones.innerHTML = curso.lecciones
    .map((leccion, index) => {
      const numero = index + 1;
      // La primera lección tiene el botón principal "Iniciar"; las demás, "Ver lección"
      const textoBoton = numero === 1 ? "Iniciar" : "Ver lección";
      const claseBoton = "boton-leccion iniciar";

      return `
        <article class="tarjeta-curso">
          <div class="cuerpo-tarjeta-curso">
            <div class="icono-curso">${leccion.icono || "📘"}</div>

            <div class="info-curso">
              <h2 class="nombre-curso">${leccion.titulo || "Lección"}</h2>
            </div>
          </div>

          <button class="${claseBoton}" data-estado="iniciar">${textoBoton}</button>
        </article>
      `;
    })
    .join("");
}

// Actualiza la barra de progreso y el detalle de la primera lección del curso activo
function renderizarDetalleCurso(curso) {
  if (!curso) return;

  if (porcentajeLeccion) {
    porcentajeLeccion.textContent = curso.progreso + "% completado";
  }

  if (barraLeccion) {
    barraLeccion.style.width = curso.progreso + "%";
  }

  if (listaLeccion) {
    const primeraLeccion = curso.lecciones[0];
    const icono = primeraLeccion?.icono || "📘";
    const titulo = primeraLeccion?.titulo || "Lección";

    listaLeccion.innerHTML =
      '<li class="item-leccion">' +
      '<span class="icono-item-leccion">' + icono + "</span>" +
      '<span class="texto-item-leccion">' + titulo + "</span>" +
      "</li>";
  }
}

// Marca el curso activo como 100% completado y actualiza la vista
function completarCursoActivo() {
  const cursoActivo = cursos.find((curso) => curso.id === cursoActivoId);
  if (!cursoActivo) {
    return;
  }

  cursoActivo.progreso = 100;
  cursoActivo.estado = "Completado";
  renderizarDetalleCurso(cursoActivo);
}

const botonCompletarLeccion = document.querySelector(".boton-completar-leccion");
if (botonCompletarLeccion) {
  botonCompletarLeccion.addEventListener("click", completarCursoActivo);
}

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function inicializarCursos() {
  mostrarCargandoCursos();
  ocultarErrorCursos();
  const inicioCarga = Date.now();

  const cursosAPI = await obtenerCursosMedianteAPI();
  cursos = cursosAPI;

  const tiempoTranscurrido = Date.now() - inicioCarga;
  const tiempoRestante = TIEMPO_MINIMO_CARGA_MS - tiempoTranscurrido;
  if (tiempoRestante > 0) {
    await esperar(tiempoRestante);
  }

  ocultarCargandoCursos();
  renderizarCursos();

  if (huboErrorCargaCursos) {
    mostrarErrorCursos("No se pudieron cargar los cursos. Intenta más tarde.");
  }
}

inicializarCursos();

// =============================================
// MANEJO DE ESTADO DE LECCIONES (SIMULADO)
// =============================================
const barraProgresoRelleno = document.querySelector('.relleno-progreso-leccion');
const textoProgresoLeccion = document.querySelector('.porcentaje-leccion');
let leccionesCompletadas = 0;
let totalLecciones = 0;

// Función para actualizar la barra y el texto de progreso
function actualizarBarraProgreso() {
  if (!barraProgresoRelleno || !textoProgresoLeccion) {
    return;
  }
  const porcentaje = totalLecciones > 0 ? (leccionesCompletadas / totalLecciones) * 100 : 0;
  barraProgresoRelleno.style.width = `${porcentaje}%`;
  textoProgresoLeccion.textContent = `${Math.round(porcentaje)}% completado`;
}

// Delegación de eventos: escucha clics en el contenedor de lecciones
if (contenedorLecciones) {
  contenedorLecciones.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.boton-leccion');
    if (!boton) return;

    const estadoActual = boton.dataset.estado;

    if (estadoActual === 'iniciar') {
      // Cambia a "Continuar"
      boton.dataset.estado = 'continuar';
      boton.textContent = 'Continuar Lección';
      boton.classList.remove('iniciar');
      boton.classList.add('continuar');
    } else if (estadoActual === 'continuar') {
      // Cambia a "Completado"
      boton.dataset.estado = 'completado';
      boton.textContent = 'Completado';
      boton.classList.remove('continuar');
      boton.classList.add('completado');
      boton.disabled = true; // Desactiva el botón

      // Actualiza el progreso
      leccionesCompletadas++;
      actualizarBarraProgreso();
    }
    // No hacer nada si ya está "completado"
  });
}

// Observador para contar el total de lecciones cuando se renderizan
const observador = new MutationObserver(() => {
  totalLecciones = contenedorLecciones.querySelectorAll('.boton-leccion').length;
  leccionesCompletadas = contenedorLecciones.querySelectorAll('.boton-leccion.completado').length;
  actualizarBarraProgreso();
});

if (contenedorLecciones) {
  observador.observe(contenedorLecciones, { childList: true, subtree: true });
}