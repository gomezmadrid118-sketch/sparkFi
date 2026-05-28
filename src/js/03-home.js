// Devuelve el saludo apropiado según la hora del día
function obtenerSaludo() {
  const hora = new Date().getHours();
  if (hora >= 5 && hora < 12) return "Buenos días";
  if (hora >= 12 && hora < 18) return "Buenas tardes";
  return "Buenas noches";
}

// Lee la sesión temporal creada en Login. Si no existe o está dañada, se trabaja como invitado.
function obtenerUsuarioSesion() {
  try {
    const raw = sessionStorage.getItem("usuarioSparkFi");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error("Sesion invalida:", error);
    return null;
  }
}

// Convierte números simples en formato de pesos colombianos para las tarjetas de resumen.
function formatearCOP(valor) {
  const numero = Number(valor) || 0;
  return "COP " + numero.toLocaleString("es-CO");
}

const META_MENSUAL = 500000;

const USERS_URL = "https://69ff3b6e8c70b15fa3cb2e3d.mockapi.io/api/v1/users";
const TIPS_URL = "https://6a074a82c83ba8ad9b3ebec7.mockapi.io/api/v1/Tips";
const INTERVALO_ROTACION_TIPS_MS = 8000;
const TIEMPO_MINIMO_CARGA_HOME_MS = 1200;

// Consulta los tips financieros desde MockAPI. Si algo falla, devuelve null para activar el fallback.
async function obtenerTipsMedianteAPI() {
  try {
    const respuesta = await fetch(TIPS_URL);
    if (!respuesta.ok) {
      throw new Error("No se pudieron consultar los tips.");
    }
    return await respuesta.json();
  } catch (error) {
    console.log("Ha habido un error", error);
    return null;
  }
}

// Busca en la API de usuarios el mismo correo guardado en sesión para refrescar datos reales.
async function obtenerUsuarioDesdeAPI(email) {
  if (!email) return null;

  try {
    const respuesta = await fetch(USERS_URL);
    if (!respuesta.ok) {
      throw new Error("No se pudieron consultar los usuarios.");
    }

    const usuarios = await respuesta.json();
    return (
      usuarios.find(
        (usuario) =>
          String(usuario.email).toLowerCase() === String(email).toLowerCase(),
      ) || null
    );
  } catch (error) {
    console.error("Error consultando API de usuarios:", error);
    return null;
  }
}

// Centraliza cómo se obtiene el nombre, sin depender de un único nombre de propiedad.
function obtenerNombreVisible(usuario) {
  if (!usuario) return "Invitado";
  return usuario.nombre || usuario.name || "Invitado";
}

// Si el usuario no trae ahorro desde la API, se usa cero para que la interfaz siga estable.
function obtenerAhorroVisible(usuario) {
  return usuario && usuario.ahorro != null ? usuario.ahorro : 0;
}

// El curso pendiente puede venir de la API o de localStorage si se guardó en otra pantalla.
function obtenerCursoVisible(usuario) {
  if (!usuario) return null;

  return (
    usuario.ultimoCurso ||
    usuario.cursoActual ||
    usuario.curso ||
    localStorage.getItem("sparkfi-ultimo-curso") ||
    null
  );
}

// Actualiza el título principal con el saludo y el nombre del usuario actual.
function actualizarSaludo(usuario) {
  const titulo = document.querySelector(".inicio-hero__titulo");
  if (!titulo) return;

  titulo.innerHTML =
    obtenerSaludo() +
    ", " +
    obtenerNombreVisible(usuario) +
    ' <span class="inicio-hero__icono-saludo">👋</span>';
}

// Pinta ahorro, meta y porcentaje de avance usando los datos recibidos del usuario.
function actualizarAhorroMensual(usuario) {
  const ahorro = obtenerAhorroVisible(usuario);

  const ahorroCard = document.querySelector('[data-metric="ahorro"]');
  const metaCard = document.querySelector('[data-metric="meta"]');
  const avanceCard = document.querySelector('[data-metric="avance"]');
  const progresoTexto = document.querySelector("[data-progress-text]");
  const progresoFill = document.querySelector("[data-progress-fill]");

  const porcentaje = Math.min((ahorro / META_MENSUAL) * 100, 100);

  if (ahorroCard) {
    ahorroCard.textContent = formatearCOP(ahorro);
  }

  if (metaCard) {
    metaCard.textContent = formatearCOP(META_MENSUAL);
  }

  if (avanceCard) {
    avanceCard.textContent = Math.round(porcentaje) + "%";
  }

  if (progresoTexto) {
    progresoTexto.textContent = formatearCOP(ahorro) + " / " + formatearCOP(META_MENSUAL);
  }

  if (progresoFill) {
    progresoFill.style.width = porcentaje + "%";
  }

}

// Muestra el último curso conocido o una invitación a entrar a la sección de cursos.
function actualizarCursoPendiente(usuario) {
  const titulo = document.querySelector("[data-last-course-title]");
  const estado = document.querySelector("[data-last-course-status]");
  const copia = document.querySelector("[data-last-course-copy]");
  const curso = obtenerCursoVisible(usuario);

  if (titulo) {
    titulo.textContent = curso
      ? "Retoma " + curso
      : "Tu siguiente paso esta en Cursos";
  }

  if (estado) {
    estado.textContent = curso
      ? "Continuar desde tu ultimo avance"
      : "Recomendacion activa para hoy";
  }

  if (copia) {
    copia.textContent = curso
      ? "Abre la vista de cursos y sigue exactamente donde lo dejaste la ultima vez."
      : "Aun no encontramos una leccion reciente, pero puedes entrar a cursos y elegir tu proximo avance.";
  }
}



// Normaliza los tips para que la interfaz use siempre las mismas propiedades internas.
function normalizarTips(listaTips) {
  if (!Array.isArray(listaTips)) return [];

  const tipsNormalizados = listaTips
    .map(function (tip) {
      const categoria = String(tip.categoria || tip.tipo || "TIP DEL DIA").trim();
      const titulo = String(tip.titulo || tip.title || "Tip financiero").trim();
      const descripcion = String(
        tip.descripcion || tip.desc || tip.tip || tip.texto || tip.contenido || "",
      ).trim();
      const icono = String(tip.icono || tip.icon || "💡").trim();

      if (!descripcion) return null;

      return {
        icono: icono,
        categoria: categoria.toUpperCase(),
        titulo: titulo,
        descripcion: descripcion,
      };
    })
    .filter(Boolean);

  return tipsNormalizados;
}

// Tips locales de respaldo. Se usan cuando la API no devuelve datos útiles.
function obtenerTipsPorDefecto() {
  return [
    {
      icono: "💡",
      categoria: "AHORRO",
      titulo: "Empieza con una meta pequeña",
      descripcion:
        "Guardar una cantidad alcanzable cada semana ayuda a crear constancia antes de subir la meta.",
    },
    {
      icono: "📊",
      categoria: "PRESUPUESTO",
      titulo: "Revisa tus gastos variables",
      descripcion:
        "Identificar en qué se va el dinero permite ajustar hábitos sin eliminar todo lo que disfrutas.",
    },
    {
      icono: "🎯",
      categoria: "META",
      titulo: "Ponle fecha a tus objetivos",
      descripcion:
        "Una meta con monto y fecha clara es más fácil de seguir que una intención general de ahorrar.",
    },
  ];
}

// Configura la tarjeta de tips, sus botones de navegación y la rotación automática.
function iniciarTarjetaTips(listaTips) {
  const icono = document.querySelector("[data-tip-icono]");
  const categoria = document.querySelector("[data-tip-categoria]");
  const titulo = document.querySelector("[data-tip-titulo]");
  const descripcion = document.querySelector("[data-tip-descripcion]");
  const botonAnterior = document.querySelector("[data-tip-anterior]");
  const botonSiguiente = document.querySelector("[data-tip-siguiente]");

  if (!icono || !categoria || !titulo || !descripcion || !botonAnterior || !botonSiguiente) {
    return;
  }

  const tipsDisponibles = normalizarTips(listaTips);
  const tips = tipsDisponibles.length ? tipsDisponibles : obtenerTipsPorDefecto();

  let indiceActual = 0;
  let rotacionAutomaticaId = null;

  function pintarTip(indice) {
    const tip = tips[indice];
    icono.textContent = tip.icono || "💡";
    categoria.textContent = tip.categoria;
    titulo.textContent = tip.titulo;
    descripcion.textContent = tip.descripcion;
  }

  function avanzarTip() {
    indiceActual = (indiceActual + 1) % tips.length;
    pintarTip(indiceActual);
  }

  function retrocederTip() {
    indiceActual = (indiceActual - 1 + tips.length) % tips.length;
    pintarTip(indiceActual);
  }

  function reiniciarRotacionAutomatica() {
    if (rotacionAutomaticaId) {
      clearInterval(rotacionAutomaticaId);
    }
    rotacionAutomaticaId = setInterval(avanzarTip, INTERVALO_ROTACION_TIPS_MS);
  }

  botonSiguiente.addEventListener("click", function () {
    avanzarTip();
    reiniciarRotacionAutomatica();
  });

  botonAnterior.addEventListener("click", function () {
    retrocederTip();
    reiniciarRotacionAutomatica();
  });

  pintarTip(indiceActual);
  reiniciarRotacionAutomatica();
}

// Las tarjetas aparecen escalonadas con un pequeño retraso entre cada una
function animarTarjetas() {
  const tarjetas = document.querySelectorAll(".inicio-accesos__tarjeta");
  tarjetas.forEach(function (tarjeta, i) {
    tarjeta.style.opacity = "0";
    tarjeta.style.transform = "translateY(20px)";
    tarjeta.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    setTimeout(function () {
      tarjeta.style.opacity = "1";
      tarjeta.style.transform = "translateY(0)";
    }, 100 + i * 130);
  });
}

// Hace que el avatar del header lleve al perfil al hacer clic
function navegarAlPerfil() {
  const avatar = document.querySelector(".inicio-encabezado__avatar");
  if (!avatar) return;
  avatar.style.cursor = "pointer";
  avatar.addEventListener("click", function () {
    window.location.href = "./07-profile.html";
  });
}

// Muestra el indicador de carga general mientras se resuelven usuario y tips.
function mostrarCargandoHome() {
  const bloque = document.querySelector("[data-home-cargando]");
  if (bloque) {
    bloque.hidden = false;
  }
}

// Oculta el indicador de carga cuando la pantalla ya tiene datos o fallback.
function ocultarCargandoHome() {
  const bloque = document.querySelector("[data-home-cargando]");
  if (bloque) {
    bloque.hidden = true;
  }
}

// Hace visible la tarjeta de tips una vez que ya se sabe qué contenido mostrar.
function mostrarTipsHome() {
  const tips = document.querySelector("[data-home-tips]");
  if (tips) {
    tips.hidden = false;
  }
}

// Muestra un mensaje amigable cuando alguna consulta remota no pudo completarse.
function mostrarErrorHome(mensaje) {
  const bloque = document.querySelector("[data-home-error]");
  if (bloque) {
    bloque.textContent = mensaje;
    bloque.hidden = false;
  }
}

// Limpia errores previos al volver a intentar cargar la pantalla.
function ocultarErrorHome() {
  const bloque = document.querySelector("[data-home-error]");
  if (bloque) {
    bloque.hidden = true;
  }
}

// Pequeña pausa visual para que el mensaje de carga no aparezca y desaparezca de golpe.
function esperar(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

// Decide si se trabaja con usuario de sesión, usuario actualizado desde API o invitado.
async function resolverUsuarioActual() {
  const usuarioSesion = obtenerUsuarioSesion();
  if (!usuarioSesion) {
    return { nombre: "Invitado", ahorro: 0 };
  }

  const usuarioAPI = await obtenerUsuarioDesdeAPI(usuarioSesion.email);
  return usuarioAPI || usuarioSesion;
}

// Punto de entrada de Home: carga datos en paralelo, actualiza el DOM y maneja estados visuales.
document.addEventListener("DOMContentLoaded", async function () {
  mostrarCargandoHome();
  ocultarErrorHome();
  const inicioCarga = Date.now();

  try {
    // Usuario y tips no dependen entre sí, por eso se consultan al mismo tiempo.
    const [usuarioActual, tipsDesdeAPI] = await Promise.all([
      resolverUsuarioActual(),
      obtenerTipsMedianteAPI(),
    ]);

    actualizarSaludo(usuarioActual);
    actualizarAhorroMensual(usuarioActual);
    actualizarCursoPendiente(usuarioActual);
    iniciarTarjetaTips(tipsDesdeAPI);
    animarTarjetas();
    navegarAlPerfil();

    if (tipsDesdeAPI === null) {
      mostrarErrorHome("No se pudieron cargar algunos datos. Intenta más tarde.");
    }
  } finally {
    const tiempoTranscurrido = Date.now() - inicioCarga;
    const tiempoRestante = TIEMPO_MINIMO_CARGA_HOME_MS - tiempoTranscurrido;
    if (tiempoRestante > 0) {
      await esperar(tiempoRestante);
    }
    ocultarCargandoHome();
    mostrarTipsHome();
  }
});
