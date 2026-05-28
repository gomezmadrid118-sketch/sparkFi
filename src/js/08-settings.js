const API_SETTINGS = "https://6a0f699dd2a9857070354e65.mockapi.io/Settings";

// Usuario base para que la pantalla funcione aunque todavía no exista backend de sesión.
const USUARIO_SESION = {
  nombre: "Juan Perez",
  email: "juan.perez@example.com",
  password: "sparkfi123",
};

// Preferencias base; luego pueden ser reemplazadas por localStorage o por la API.
const preferencias = {
  notificacionEmail: true,
  notificacionPush: true,
  perfilPublico: false,
  mostrarActividad: true,
};

// Si ya se editó el usuario en esta misma máquina, se recupera para llenar el formulario.
const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
if (usuarioGuardado) {
  USUARIO_SESION.nombre = usuarioGuardado.nombre || USUARIO_SESION.nombre;
  USUARIO_SESION.email = usuarioGuardado.email || USUARIO_SESION.email;
  USUARIO_SESION.password = usuarioGuardado.password || USUARIO_SESION.password;
}

// Las preferencias guardadas localmente tienen prioridad antes de consultar configuración remota.
const preferenciasGuardadas = JSON.parse(localStorage.getItem("preferencias"));
if (preferenciasGuardadas) {
  preferencias.notificacionEmail =
    preferenciasGuardadas.notificacionEmail ?? preferencias.notificacionEmail;
  preferencias.notificacionPush =
    preferenciasGuardadas.notificacionPush ?? preferencias.notificacionPush;
  preferencias.perfilPublico =
    preferenciasGuardadas.perfilPublico ?? preferencias.perfilPublico;
  preferencias.mostrarActividad =
    preferenciasGuardadas.mostrarActividad ?? preferencias.mostrarActividad;
}

// Valida formato básico de email para evitar guardar correos imposibles.
function validarFormatoEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Regla mínima para aceptar una nueva contraseña.
function validarLongitudPassword(password) {
  return password.length >= 6;
}

// Muestra mensajes de éxito, carga o error dentro de la sección correspondiente.
function mostrarMensaje(area, texto, tipo) {
  const classByType = {
    exito: "settings-form__message--success",
    error: "settings-form__message--error",
    cargando: "settings-form__message--success",
  };

  area.innerHTML = "";

  const div = document.createElement("div");
  div.className = ["settings-form__message", classByType[tipo]]
    .filter(Boolean)
    .join(" ");
  div.textContent = texto;

  area.appendChild(div);
}

// Pinta una lista de errores para que el usuario pueda corregir varios campos a la vez.
function mostrarErrores(area, errores) {
  area.innerHTML = "";

  const titulo = document.createElement("p");
  titulo.className =
    "settings-form__feedback-title settings-form__feedback-title--error";
  titulo.textContent = "Por favor corrige los siguientes errores:";
  area.appendChild(titulo);

  const lista = document.createElement("ul");
  lista.className = "settings-form__feedback-list";

  for (let i = 0; i < errores.length; i++) {
    const item = document.createElement("li");
    item.textContent = errores[i];
    lista.appendChild(item);
  }

  area.appendChild(lista);
}

// Reúne las reglas de validación para nombre y correo del perfil.
function validarPerfil(nombre, email) {
  const errores = [];

  if (!nombre) {
    errores.push("El nombre completo es obligatorio.");
  }

  if (!email) {
    errores.push("El correo electronico es obligatorio.");
  } else if (!validarFormatoEmail(email)) {
    errores.push("El correo no tiene un formato valido (ejemplo@correo.com).");
  }

  return errores;
}

// Guarda los cambios básicos de perfil en localStorage y actualiza el mensaje del DOM.
function manejarGuardarPerfil() {
  const inputNombre = document.getElementById("edit-nombre");
  const inputEmail = document.getElementById("edit-email");
  const resultadoArea = document.getElementById("resultado-perfil");

  const nombre = inputNombre.value.trim();
  const email = inputEmail.value.trim();
  const errores = validarPerfil(nombre, email);

  if (errores.length > 0) {
    mostrarErrores(resultadoArea, errores);
    return;
  }

  USUARIO_SESION.nombre = nombre;
  USUARIO_SESION.email = email;
  localStorage.setItem("usuario", JSON.stringify(USUARIO_SESION));

  mostrarMensaje(resultadoArea, "Perfil actualizado correctamente.", "exito");
}

// Acción temporal para una función que todavía no tiene implementación real.
function manejarCambioFoto() {
  const resultadoArea = document.getElementById("resultado-perfil");
  mostrarMensaje(resultadoArea, "Cambio de foto disponible proximamente.", "error");
}

// Valida el cambio de contraseña comparando contra la contraseña guardada temporalmente.
function validarCambioPassword(actual, nueva, confirmar) {
  const errores = [];

  if (!actual) errores.push("Debes ingresar tu contrasena actual.");
  if (!nueva) errores.push("La nueva contrasena es obligatoria.");
  if (!confirmar) errores.push("Debes confirmar la nueva contrasena.");
  if (actual && actual !== USUARIO_SESION.password) {
    errores.push("La contrasena actual no es correcta.");
  }
  if (nueva && !validarLongitudPassword(nueva)) {
    errores.push("La nueva contrasena debe tener al menos 6 caracteres.");
  }
  if (nueva && confirmar && nueva !== confirmar) {
    errores.push("Las contrasenas nuevas no coinciden.");
  }

  return errores;
}

// Limpia los campos sensibles después de cambiar la contraseña.
function limpiarCamposPassword() {
  document.getElementById("password-actual").value = "";
  document.getElementById("password-nueva").value = "";
  document.getElementById("password-confirmar").value = "";
}

// Aplica las validaciones de contraseña y guarda el nuevo valor temporalmente.
function manejarCambioPassword() {
  const actual = document.getElementById("password-actual").value;
  const nueva = document.getElementById("password-nueva").value;
  const confirmar = document.getElementById("password-confirmar").value;
  const resultadoArea = document.getElementById("resultado-settings");
  const errores = validarCambioPassword(actual, nueva, confirmar);

  if (errores.length > 0) {
    mostrarErrores(resultadoArea, errores);
    return;
  }

  USUARIO_SESION.password = nueva;
  localStorage.setItem("usuario", JSON.stringify(USUARIO_SESION));

  limpiarCamposPassword();
  mostrarMensaje(resultadoArea, "Contrasena actualizada exitosamente.", "exito");
}

// Conecta cada toggle con una clave de preferencias y la persiste cuando cambia.
function registrarToggle(checkbox, clave) {
  checkbox.addEventListener("change", function () {
    preferencias[clave] = checkbox.checked;
    localStorage.setItem("preferencias", JSON.stringify(preferencias));
  });
}

// Convierte valores booleanos que pueden llegar como boolean real o como texto desde la API.
function leerBooleano(valor, valorActual) {
  if (typeof valor === "boolean") return valor;
  if (valor === "true") return true;
  if (valor === "false") return false;
  return valorActual;
}

// Consulta la configuración remota. Si la API está vacía, devuelve undefined sin romper la pantalla.
async function obtenerConfiguracion() {
  const respuesta = await fetch(API_SETTINGS);

  if (!respuesta.ok) {
    throw new Error("No se pudo consultar la configuracion.");
  }

  const datos = await respuesta.json();
  return Array.isArray(datos) ? datos[0] : datos;
}

// Copia los valores recibidos desde la API hacia el objeto de preferencias usado por la interfaz.
function aplicarConfiguracion(config) {
  if (!config) return;

  preferencias.notificacionEmail = leerBooleano(
    config.notificacionEmail,
    preferencias.notificacionEmail,
  );
  preferencias.notificacionPush = leerBooleano(
    config.notificacionPush,
    preferencias.notificacionPush,
  );
  preferencias.perfilPublico = leerBooleano(
    config.perfilPublico,
    preferencias.perfilPublico,
  );
  preferencias.mostrarActividad = leerBooleano(
    config.mostrarActividad,
    preferencias.mostrarActividad,
  );

  localStorage.setItem("preferencias", JSON.stringify(preferencias));
}

// Sincroniza los checkboxes del HTML con las preferencias actuales.
function pintarPreferenciasEnFormulario() {
  const seccionNotif = document.querySelector(".settings-section--notifications");
  const seccionPrivacidad = document.querySelector(".settings-section--privacy");

  if (seccionNotif) {
    const checkboxesNotif = seccionNotif.querySelectorAll("input[type='checkbox']");
    if (checkboxesNotif[0]) checkboxesNotif[0].checked = preferencias.notificacionEmail;
    if (checkboxesNotif[1]) checkboxesNotif[1].checked = preferencias.notificacionPush;
  }

  if (seccionPrivacidad) {
    const checkboxesPrivacidad =
      seccionPrivacidad.querySelectorAll("input[type='checkbox']");
    if (checkboxesPrivacidad[0]) checkboxesPrivacidad[0].checked = preferencias.perfilPublico;
    if (checkboxesPrivacidad[1]) {
      checkboxesPrivacidad[1].checked = preferencias.mostrarActividad;
    }
  }
}

// Maneja el ciclo de carga de configuración remota y actualiza los toggles si hay datos.
async function cargarConfiguracionRemota(resultadoArea) {
  try {
    mostrarMensaje(resultadoArea, "Cargando configuracion...", "cargando");

    const configuracion = await obtenerConfiguracion();
    aplicarConfiguracion(configuracion);
    pintarPreferenciasEnFormulario();
    resultadoArea.innerHTML = "";
  } catch (error) {
    mostrarMensaje(
      resultadoArea,
      "No se pudo cargar la configuracion. Intenta mas tarde.",
      "error",
    );
  }
}

// Inicializa eventos, valores del formulario y consulta remota cuando el HTML está listo.
document.addEventListener("DOMContentLoaded", function () {
  const seccionPerfil = document.querySelector(".settings-section--profile");
  const btnGuardarPerfil = seccionPerfil.querySelector(".settings-form__submit--profile");

  const resultadoPerfil = document.createElement("div");
  resultadoPerfil.id = "resultado-perfil";
  resultadoPerfil.className = "settings-form__feedback";
  seccionPerfil.insertBefore(resultadoPerfil, btnGuardarPerfil);

  btnGuardarPerfil.addEventListener("click", manejarGuardarPerfil);

  document.getElementById("edit-nombre").value = USUARIO_SESION.nombre;
  document.getElementById("edit-email").value = USUARIO_SESION.email;

  const btnCambiarFoto = document.querySelector(
    ".settings-section__change-photo-button",
  );
  if (btnCambiarFoto) {
    btnCambiarFoto.addEventListener("click", manejarCambioFoto);
  }

  const btnGuardarPassword = document.getElementById("btn-guardar-password");
  if (btnGuardarPassword) {
    btnGuardarPassword.addEventListener("click", manejarCambioPassword);
  }

  const seccionNotif = document.querySelector(".settings-section--notifications");
  if (seccionNotif) {
    const clavesNotif = ["notificacionEmail", "notificacionPush"];
    const checkboxesNotif = seccionNotif.querySelectorAll("input[type='checkbox']");

    for (let i = 0; i < checkboxesNotif.length; i++) {
      registrarToggle(checkboxesNotif[i], clavesNotif[i]);
    }
  }

  const seccionPrivacidad = document.querySelector(".settings-section--privacy");
  if (seccionPrivacidad) {
    const clavesPrivacidad = ["perfilPublico", "mostrarActividad"];
    const checkboxesPrivacidad =
      seccionPrivacidad.querySelectorAll("input[type='checkbox']");

    for (let i = 0; i < checkboxesPrivacidad.length; i++) {
      registrarToggle(checkboxesPrivacidad[i], clavesPrivacidad[i]);
    }
  }

  pintarPreferenciasEnFormulario();
  localStorage.setItem("usuario", JSON.stringify(USUARIO_SESION));
  cargarConfiguracionRemota(resultadoPerfil);
});
