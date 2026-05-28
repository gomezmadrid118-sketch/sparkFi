const API_PROFILE = "https://6a0f699dd2a9857070354e65.mockapi.io/Profile";

// Anima los números del perfil para que las estadísticas no aparezcan de golpe.
function animarContador(elemento, duracion) {
  const texto = elemento.textContent.trim();
  const esDinero = texto.startsWith("$");
  const numero = parseInt(texto.replace(/\D/g, ""), 10);
  if (isNaN(numero)) return;

  const inicio = Date.now();

  (function tick() {
    const progreso = Math.min((Date.now() - inicio) / duracion, 1);
    const ease = 1 - Math.pow(1 - progreso, 3);
    const actual = Math.round(numero * ease);

    elemento.textContent = esDinero
      ? "$" + actual.toLocaleString("en-US")
      : String(actual);

    if (progreso < 1) requestAnimationFrame(tick);
    else elemento.textContent = texto;
  })();
}

// Recorre todos los indicadores numéricos del sidebar y les aplica la animación.
function iniciarContadores() {
  document.querySelectorAll(".profile-sidebar__stat-value").forEach(function (el) {
    animarContador(el, 1200);
  });
}

// Pide confirmación antes de cerrar sesión para evitar salidas accidentales.
function confirmarCerrarSesion() {
  const enlace = document.querySelector(".profile-sidebar__logout-link");
  if (!enlace) return;

  enlace.addEventListener("click", function (e) {
    e.preventDefault();
    if (confirm("Seguro que quieres cerrar sesion?")) {
      window.location.href = enlace.getAttribute("href");
    }
  });
}

// Aplica una aparición escalonada a las tarjetas de logros.
function animarLogros() {
  document.querySelectorAll(".profile-achievements__card").forEach(function (tarjeta, i) {
    tarjeta.style.opacity = "0";
    tarjeta.style.transform = "translateY(16px)";
    tarjeta.style.transition = "opacity 0.4s ease, transform 0.4s ease";

    setTimeout(function () {
      tarjeta.style.opacity = "1";
      tarjeta.style.transform = "translateY(0)";
    }, 200 + i * 150);
  });
}

// Mantiene controlado el enlace de "Ver todos" mientras no exista una pantalla dedicada.
function manejarVerLogros() {
  const enlace = document.querySelector(".profile-achievements__link");
  if (!enlace) return;

  enlace.addEventListener("click", function (e) {
    e.preventDefault();
    alert("Proximamente: todos tus logros.");
  });
}

// Recupera datos guardados localmente si la API de perfil todavía no tiene registros.
function obtenerPerfilLocal() {
  const usuarioSesion = sessionStorage.getItem("usuarioSparkFi");
  const usuarioLocal = localStorage.getItem("usuario");
  const raw = usuarioSesion || usuarioLocal;

  if (!raw) {
    return {
      nombre: "Usuario SparkFi",
      email: "sin-correo@sparkfi.com",
      cursos: 0,
      retos: 0,
      ahorro: 0,
    };
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return {
      nombre: "Usuario SparkFi",
      email: "sin-correo@sparkfi.com",
      cursos: 0,
      retos: 0,
      ahorro: 0,
    };
  }
}

// Consulta la API de perfil; si está vacía, usa datos temporales para mantener la pantalla funcional.
async function obtenerPerfil() {
  const respuesta = await fetch(API_PROFILE);

  if (!respuesta.ok) {
    throw new Error("No se pudo consultar el perfil.");
  }

  const datos = await respuesta.json();
  return Array.isArray(datos) ? datos[0] || obtenerPerfilLocal() : datos;
}

// Convierte el ahorro recibido en texto monetario para la tarjeta de estadísticas.
function formatearAhorro(valor) {
  const numero = Number(String(valor || "").replace(/[^\d.-]/g, ""));

  if (!Number.isFinite(numero)) {
    return "$0";
  }

  return "$" + numero.toLocaleString("en-US");
}

// Estado inicial mientras se espera la respuesta de la API.
function mostrarEstadoPerfil(texto) {
  const nombre = document.getElementById("profile-name");
  const email = document.getElementById("profile-email");
  const cursos = document.getElementById("stat-cursos");
  const retos = document.getElementById("stat-retos");
  const ahorro = document.getElementById("stat-ahorro");

  if (nombre) nombre.textContent = texto;
  if (email) email.textContent = texto;
  if (cursos) cursos.textContent = "0";
  if (retos) retos.textContent = "0";
  if (ahorro) ahorro.textContent = "$0";
}

// Pinta en el DOM el perfil obtenido desde API o desde almacenamiento temporal.
function renderizarPerfil(usuario) {
  const nombre = document.getElementById("profile-name");
  const email = document.getElementById("profile-email");
  const cursos = document.getElementById("stat-cursos");
  const retos = document.getElementById("stat-retos");
  const ahorro = document.getElementById("stat-ahorro");

  if (nombre) nombre.textContent = usuario.nombre || usuario.name || "Usuario SparkFi";
  if (email) email.textContent = usuario.email || "sin-correo@sparkfi.com";
  if (cursos) cursos.textContent = usuario.cursos || usuario.courses || 0;
  if (retos) retos.textContent = usuario.retos || usuario.challenges || 0;
  if (ahorro) ahorro.textContent = formatearAhorro(usuario.ahorro || usuario.savings);

  iniciarContadores();
}

// Controla el ciclo de carga del perfil: estado de carga, consulta, render y error.
async function cargarPerfil() {
  try {
    mostrarEstadoPerfil("Cargando...");

    const usuario = await obtenerPerfil();
    renderizarPerfil(usuario);
  } catch (error) {
    const nombre = document.getElementById("profile-name");
    const email = document.getElementById("profile-email");

    if (nombre) nombre.textContent = "Error cargando perfil";
    if (email) email.textContent = "Intenta nuevamente";
  }
  }

document.addEventListener("DOMContentLoaded", function () {
  cargarPerfil();
  confirmarCerrarSesion();
  animarLogros();
  manejarVerLogros();
});
