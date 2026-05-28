const API_USUARIOS =
  "https://69ff3b6e8c70b15fa3cb2e3d.mockapi.io/api/v1/users";

// Se permite un máximo de intentos fallidos antes de bloquear el formulario.
const MAX_INTENTOS = 3;
let intentosRealizados = 0;

// Muestra en el DOM el mensaje correspondiente a validación, carga, éxito, error o bloqueo.
function mostrarMensaje(area, texto, tipo) {
  area.innerHTML = "";

  const div = document.createElement("div");
  div.className = "mensaje mensaje--" + tipo;
  div.textContent = texto;

  area.appendChild(div);
}

// Bloquea los campos cuando el usuario supera el número permitido de intentos.
function deshabilitarFormulario() {
  document.getElementById("email").disabled = true;
  document.getElementById("password").disabled = true;

  const btn = document.getElementById("btn-login");
  btn.disabled = true;
  btn.textContent = "Bloqueado";
}

// Cambia el texto y disponibilidad del botón mientras se consulta la API.
function cambiarEstadoBoton(cargando) {
  const btn = document.getElementById("btn-login");

  if (cargando) {
    btn.disabled = true;
    btn.textContent = "Validando...";
    return;
  }

  btn.disabled = false;
  btn.textContent = "Iniciar sesion";
}

// Consulta la API de usuarios y devuelve el arreglo de cuentas disponibles.
async function obtenerUsuarios() {
  const respuesta = await fetch(API_USUARIOS);

  if (!respuesta.ok) {
    throw new Error("No se pudieron consultar los usuarios.");
  }

  return await respuesta.json();
}

// Busca coincidencia exacta entre el correo y la contraseña ingresados por el usuario.
function buscarUsuario(usuarios, email, password) {
  return usuarios.find(function (usuario) {
    return usuario.email === email && usuario.password === password;
  });
}

// Valida el formulario, consulta usuarios reales y decide si permite entrar al sistema.
async function manejarLogin() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const resultadoArea = document.getElementById("resultado-login");

  if (!email || !password) {
    mostrarMensaje(resultadoArea, "Por favor, completa todos los campos.", "error");
    return;
  }

  if (intentosRealizados >= MAX_INTENTOS) {
    mostrarMensaje(
      resultadoArea,
      "Usuario bloqueado. Ha superado el numero de intentos.",
      "bloqueado",
    );
    deshabilitarFormulario();
    return;
  }

  try {
    // Mientras se espera la respuesta de internet, el usuario ve un estado de carga.
    cambiarEstadoBoton(true);
    mostrarMensaje(resultadoArea, "Validando usuario...", "cargando");

    const usuarios = await obtenerUsuarios();
    const usuarioEncontrado = buscarUsuario(usuarios, email, password);

    if (usuarioEncontrado) {
      // La sesión se guarda temporalmente para que Home pueda personalizar la experiencia.
      sessionStorage.setItem(
        "usuarioSparkFi",
        JSON.stringify(usuarioEncontrado),
      );

      mostrarMensaje(
        resultadoArea,
        "Bienvenido al sistema. Redirigiendo...",
        "exito",
      );

      setTimeout(function () {
        window.location.href = "03-home.html";
      }, 1500);

      return;
    }

    intentosRealizados++;

    // Si los datos son incorrectos, se informa el avance de intentos antes del bloqueo.
    if (intentosRealizados < MAX_INTENTOS) {
      mostrarMensaje(
        resultadoArea,
        "Datos incorrectos. Intento " +
          intentosRealizados +
          " de " +
          MAX_INTENTOS +
          ".",
        "error",
      );
    } else {
      mostrarMensaje(
        resultadoArea,
        "Usuario bloqueado. Ha superado el numero de intentos.",
        "bloqueado",
      );
      deshabilitarFormulario();
    }
  } catch (error) {
    mostrarMensaje(
      resultadoArea,
      "No se pudieron cargar los datos. Intenta mas tarde.",
      "error",
    );
  } finally {
    if (intentosRealizados < MAX_INTENTOS) {
      cambiarEstadoBoton(false);
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("btn-login").addEventListener("click", manejarLogin);
});
