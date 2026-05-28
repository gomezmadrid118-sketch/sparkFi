const API_ESTUDIANTES =
  "https://69ff3b6e8c70b15fa3cb2e3d.mockapi.io/api/v1/students";

// Contenedor principal donde se muestran los integrantes que llegan desde la API.
const contenedorEstudiantes = document.getElementById("resultado-estudiantes");

// Limpia el contenedor y muestra un mensaje de estado: carga, error o lista vacía.
function mostrarMensajeEstado(texto, tipo) {
  contenedorEstudiantes.innerHTML = "";

  const mensaje = document.createElement("p");
  mensaje.className = "mensaje-estado mensaje-estado--" + tipo;
  mensaje.textContent = texto;

  contenedorEstudiantes.appendChild(mensaje);
}

// Construye visualmente una tarjeta por estudiante usando los campos recibidos desde MockAPI.
function crearTarjetaEstudiante(estudiante) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "tarjeta-estudiante";

  tarjeta.innerHTML = `
    <div class="tarjeta-estudiante__avatar">
      ${estudiante.nombre.charAt(0)}
    </div>

    <div class="tarjeta-estudiante__contenido">
      <h3>${estudiante.nombre}</h3>
      <p class="tarjeta-estudiante__rol">${estudiante.rol}</p>
      <p class="tarjeta-estudiante__descripcion">${estudiante.descripcion}</p>

      <div class="tarjeta-estudiante__acciones">
        <a href="${estudiante.ruta1}">${estudiante.pantalla1}</a>
        <a href="${estudiante.ruta2}">${estudiante.pantalla2}</a>
      </div>
    </div>
  `;

  return tarjeta;
}

// Borra el estado anterior y pinta todas las tarjetas de estudiantes en una sola operación.
function renderizarEstudiantes(estudiantes) {
  contenedorEstudiantes.innerHTML = "";

  if (estudiantes.length === 0) {
    mostrarMensajeEstado("No hay estudiantes registrados.", "error");
    return;
  }

  const fragmento = document.createDocumentFragment();

  estudiantes.forEach(function (estudiante) {
    const tarjeta = crearTarjetaEstudiante(estudiante);
    fragmento.appendChild(tarjeta);
  });

  contenedorEstudiantes.appendChild(fragmento);
}

// Función responsable únicamente de consultar la API y devolver el JSON listo para usar.
async function consultarEstudiantes() {
  const respuesta = await fetch(API_ESTUDIANTES);

  if (!respuesta.ok) {
    throw new Error("Error al consultar estudiantes");
  }

  return await respuesta.json();
}

// Controla el flujo completo de la pantalla inicial: carga, consulta, renderizado y error.
async function cargarEstudiantes() {
  try {
    mostrarMensajeEstado("Cargando estudiantes...", "cargando");

    const estudiantes = await consultarEstudiantes();
    renderizarEstudiantes(estudiantes);
  } catch (error) {
    mostrarMensajeEstado(
      "No se pudieron cargar los estudiantes. Intenta más tarde.",
      "error",
    );
  }
}

document.addEventListener("DOMContentLoaded", cargarEstudiantes);
