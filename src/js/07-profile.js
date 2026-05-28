const API_PROFILE = "https://6a0f699dd2a9857070354e65.mockapi.io/Profile";

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

function iniciarContadores() {
  document.querySelectorAll(".profile-sidebar__stat-value").forEach(function (el) {
    animarContador(el, 1200);
  });
}

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

function manejarVerLogros() {
  const enlace = document.querySelector(".profile-achievements__link");
  if (!enlace) return;

  enlace.addEventListener("click", function (e) {
    e.preventDefault();
    alert("Proximamente: todos tus logros.");
  });
}

async function obtenerPerfil() {
  const respuesta = await fetch(API_PROFILE);

  if (!respuesta.ok) {
    throw new Error("No se pudo consultar el perfil.");
  }

  const datos = await respuesta.json();
  return Array.isArray(datos) ? datos[0] : datos;
}

function formatearAhorro(valor) {
  const numero = Number(String(valor || "").replace(/[^\d.-]/g, ""));

  if (!Number.isFinite(numero)) {
    return "$0";
  }

  return "$" + numero.toLocaleString("en-US");
}

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
