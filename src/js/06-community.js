document.addEventListener("DOMContentLoaded", function () {
  // JsonPlaceholder entrega publicaciones y usuarios para simular un feed social real.
  const API_POSTS_URL = "https://jsonplaceholder.typicode.com/posts?_limit=4";
  const API_USERS_URL = "https://jsonplaceholder.typicode.com/users";

  const postListContainer = document.querySelector(".post-list");
  const btnNewPost = document.querySelector(".btn-new-post");

  // Consulta publicaciones y autores en paralelo, luego une cada post con su usuario.
  async function obtenerPostsComunidad() {
    const respuestas = await Promise.all([fetch(API_POSTS_URL), fetch(API_USERS_URL)]);
    const postsResponse = respuestas[0];
    const usersResponse = respuestas[1];

    if (!postsResponse.ok || !usersResponse.ok) {
      throw new Error("No se pudo consultar la comunidad.");
    }

    const posts = await postsResponse.json();
    const usuarios = await usersResponse.json();

    return posts.map(function (post) {
      const autor = usuarios.find(function (usuario) {
        return usuario.id === post.userId;
      });

      return {
        id: "api_post_" + post.id,
        title: post.title,
        body: post.body,
        author: autor ? autor.name : "Usuario API",
        time: "API",
        custom: false,
      };
    });
  }

  // Reemplaza el feed por un mensaje de carga o error según el momento.
  function mostrarEstadoComunidad(texto, tipo) {
    if (!postListContainer) return;

    postListContainer.innerHTML = "";

    const tarjeta = document.createElement("article");
    tarjeta.className = "post-card";
    tarjeta.dataset.estado = tipo;

    const titulo = document.createElement("h2");
    titulo.className = "post-title";
    titulo.textContent = texto;

    tarjeta.appendChild(titulo);
    postListContainer.appendChild(tarjeta);
  }

  // Recupera publicaciones creadas por el usuario y guardadas solo en este navegador.
  function obtenerPostsGuardados() {
    return JSON.parse(localStorage.getItem("sparkfi_custom_posts")) || [];
  }

  // Persiste publicaciones personalizadas sin depender de un backend real.
  function guardarPostsPersonalizados(posts) {
    localStorage.setItem("sparkfi_custom_posts", JSON.stringify(posts));
  }

  // Agrega un botón de eliminar a cada post; los posts de API solo se quitan de la vista.
  function inyectarBotonEliminar(tarjetaPost, idUnico, esPersonalizado) {
    tarjetaPost.style.position = "relative";

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.textContent = "x";
    btnEliminar.style.cssText =
      "position:absolute;top:15px;right:15px;background:none;border:none;cursor:pointer;font-weight:700;";

    btnEliminar.addEventListener("click", function () {
      if (!confirm("Deseas eliminar esta publicacion de la pantalla?")) return;

      if (esPersonalizado) {
        // Si el post era local, también se borra de localStorage junto con sus comentarios.
        const postsFiltrados = obtenerPostsGuardados().filter(function (post) {
          return post.id !== idUnico;
        });

        guardarPostsPersonalizados(postsFiltrados);
        localStorage.removeItem("comments_" + idUnico);
      }

      tarjetaPost.remove();
    });

    tarjetaPost.appendChild(btnEliminar);
  }

  // Pinta un comentario individual y le agrega su botón para eliminarlo.
  function pintarComentario(contenedor, texto, indice, idUnico, nodoContador, comentarios) {
    const div = document.createElement("div");
    div.style.cssText =
      "background:white;padding:8px 12px;border-radius:10px;margin-bottom:6px;border:1px solid #e2e8f0;font-size:14px;display:flex;justify-content:space-between;gap:10px;";

    const contenido = document.createElement("span");
    contenido.textContent = "Juan: " + texto;

    const boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = "x";
    boton.style.cssText = "background:none;border:none;cursor:pointer;";

    boton.addEventListener("click", function () {
      // Al borrar un comentario se repinta la lista para mantener índices correctos.
      comentarios.splice(indice, 1);
      localStorage.setItem("comments_" + idUnico, JSON.stringify(comentarios));

      contenedor.innerHTML = "";
      comentarios.forEach(function (comentario, nuevoIndice) {
        pintarComentario(
          contenedor,
          comentario,
          nuevoIndice,
          idUnico,
          nodoContador,
          comentarios,
        );
      });

      nodoContador.textContent = comentarios.length;
    });

    div.appendChild(contenido);
    div.appendChild(boton);
    contenedor.appendChild(div);
  }

  // Activa likes, comentarios y persistencia local para una tarjeta de publicación.
  function configurarInteractividadPost(tarjetaPost, idUnico) {
    const btnLike = tarjetaPost.querySelector(".react-btn");
    const btnComentar = tarjetaPost.querySelector(".comment-btn");
    const contadorLikesTexto = btnLike.querySelector("span");
    const contadorComentariosTexto = btnComentar.querySelector(".comment-count");

    let totalLikes = Number(contadorLikesTexto.textContent) || 0;
    let haDadoLike = false;

    btnLike.addEventListener("click", function () {
      // El like se alterna en memoria para esta sesión de navegación.
      totalLikes += haDadoLike ? -1 : 1;
      haDadoLike = !haDadoLike;
      contadorLikesTexto.textContent = totalLikes;
      btnLike.classList.toggle("activo", haDadoLike);
    });

    const areaComentarios = document.createElement("div");
    areaComentarios.style.cssText =
      "display:none;margin-top:15px;padding:15px;background:#f8faff;border-radius:15px;border:1px solid #e4e7f2;";

    const listaMensajes = document.createElement("div");
    const cajaInput = document.createElement("div");
    cajaInput.style.cssText = "display:flex;gap:10px;margin-top:12px;";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Escribe un comentario...";
    input.style.cssText =
      "flex:1;padding:10px;border-radius:10px;border:1px solid #cbd5e1;outline:none;font-size:14px;";

    const botonPublicar = document.createElement("button");
    botonPublicar.type = "button";
    botonPublicar.textContent = "Publicar";
    botonPublicar.style.cssText =
      "background:#2563eb;color:white;border:none;padding:10px 16px;border-radius:10px;cursor:pointer;font-weight:600;font-size:14px;";

    cajaInput.appendChild(input);
    cajaInput.appendChild(botonPublicar);
    areaComentarios.appendChild(listaMensajes);
    areaComentarios.appendChild(cajaInput);
    tarjetaPost.appendChild(areaComentarios);

    const comentariosGuardados =
      JSON.parse(localStorage.getItem("comments_" + idUnico)) || [];

    comentariosGuardados.forEach(function (texto, indice) {
      pintarComentario(
        listaMensajes,
        texto,
        indice,
        idUnico,
        contadorComentariosTexto,
        comentariosGuardados,
      );
    });

    contadorComentariosTexto.textContent = comentariosGuardados.length;

    btnComentar.addEventListener("click", function () {
      const oculto = areaComentarios.style.display === "none";
      areaComentarios.style.display = oculto ? "block" : "none";
      if (oculto) input.focus();
    });

    function guardarYPublicarComentario() {
      const texto = input.value.trim();
      if (!texto) return;

      // Los comentarios se guardan por id de publicación para no mezclarlos entre posts.
      comentariosGuardados.push(texto);
      localStorage.setItem("comments_" + idUnico, JSON.stringify(comentariosGuardados));

      listaMensajes.innerHTML = "";
      comentariosGuardados.forEach(function (comentario, indice) {
        pintarComentario(
          listaMensajes,
          comentario,
          indice,
          idUnico,
          contadorComentariosTexto,
          comentariosGuardados,
        );
      });

      contadorComentariosTexto.textContent = comentariosGuardados.length;
      input.value = "";
    }

    botonPublicar.addEventListener("click", guardarYPublicarComentario);
    input.addEventListener("keypress", function (evento) {
      if (evento.key === "Enter") guardarYPublicarComentario();
    });
  }

  // Construye una tarjeta completa de post usando createElement para evitar HTML quemado.
  function inyectarNuevoPostAlDOM(data, agregarAlInicio) {
    if (!postListContainer) return;

    const article = document.createElement("article");
    article.className = "post-card";

    const postTop = document.createElement("div");
    postTop.className = "post-top";

    const postMain = document.createElement("div");
    postMain.className = "post-main";

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = (data.author || "U").charAt(0).toUpperCase();

    const contenido = document.createElement("div");
    contenido.className = "post-content";

    const titulo = document.createElement("h2");
    titulo.className = "post-title";
    titulo.textContent = data.title;

    const cuerpo = document.createElement("p");
    cuerpo.className = "post-body";
    cuerpo.textContent = data.body;

    const meta = document.createElement("div");
    meta.className = "post-meta";

    const autor = document.createElement("span");
    autor.className = "post-author";
    autor.textContent = data.author || "Usuario";

    const punto = document.createElement("span");
    punto.className = "post-dot";
    punto.textContent = "-";

    const tiempo = document.createElement("span");
    tiempo.className = "post-time";
    tiempo.textContent = data.time || "Ahora";

    const enlace = document.createElement("a");
    enlace.href = "#";
    enlace.className = "post-link";
    enlace.textContent = "Ver respuestas";
    enlace.addEventListener("click", function (evento) {
      evento.preventDefault();
    });

    const postBottom = document.createElement("div");
    postBottom.className = "post-bottom";

    const btnLike = document.createElement("button");
    btnLike.type = "button";
    btnLike.className = "react-btn";
    btnLike.appendChild(document.createTextNode("Me gusta "));

    const likeCount = document.createElement("span");
    likeCount.textContent = "0";
    btnLike.appendChild(likeCount);

    const btnComment = document.createElement("button");
    btnComment.type = "button";
    btnComment.className = "comment-btn";

    const commentText = document.createElement("span");
    commentText.textContent = "Comentar";

    const commentCount = document.createElement("span");
    commentCount.className = "comment-count";
    commentCount.textContent = "0";

    btnComment.appendChild(commentText);
    btnComment.appendChild(commentCount);

    meta.appendChild(autor);
    meta.appendChild(punto);
    meta.appendChild(tiempo);
    contenido.appendChild(titulo);
    contenido.appendChild(cuerpo);
    contenido.appendChild(meta);
    postMain.appendChild(avatar);
    postMain.appendChild(contenido);
    postTop.appendChild(postMain);
    postTop.appendChild(enlace);
    postBottom.appendChild(btnLike);
    postBottom.appendChild(btnComment);
    article.appendChild(postTop);
    article.appendChild(postBottom);

    if (agregarAlInicio) {
      // Las publicaciones nuevas del usuario se muestran primero.
      postListContainer.insertBefore(article, postListContainer.firstChild);
    } else {
      postListContainer.appendChild(article);
    }

    inyectarBotonEliminar(article, data.id, Boolean(data.custom));
    configurarInteractividadPost(article, data.id);
  }

  // Limpia el feed y pinta publicaciones locales junto con las recibidas desde la API.
  function renderizarFeed(posts) {
    if (!postListContainer) return;

    postListContainer.innerHTML = "";

    posts.forEach(function (post) {
      inyectarNuevoPostAlDOM(post, false);
    });
  }

  // Crea un modal simple para que el usuario agregue una publicación local.
  function abrirFormularioNuevaPublicacion() {
    const modal = document.createElement("div");
    modal.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.6);display:flex;align-items:center;justify-content:center;z-index:9999;font-family:Inter,sans-serif;";

    modal.innerHTML = `
      <div style="background:white;padding:25px;border-radius:20px;width:90%;max-width:520px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);">
        <h3 style="margin-top:0;font-size:20px;color:#1e293b;">Crear nueva publicacion</h3>
        <input type="text" id="modal-title" placeholder="Titulo" style="width:100%;padding:12px;border-radius:10px;border:1px solid #cbd5e1;margin-bottom:12px;box-sizing:border-box;font-size:14px;">
        <textarea id="modal-body" placeholder="Contenido" style="width:100%;height:100px;padding:12px;border-radius:10px;border:1px solid #cbd5e1;margin-bottom:15px;box-sizing:border-box;font-size:14px;font-family:inherit;resize:none;"></textarea>
        <div style="display:flex;justify-content:flex-end;gap:10px;">
          <button id="modal-cancel" type="button" style="background:#f1f5f9;color:#64748b;border:none;padding:10px 18px;border-radius:10px;cursor:pointer;font-weight:600;">Cancelar</button>
          <button id="modal-submit" type="button" style="background:#2563eb;color:white;border:none;padding:10px 18px;border-radius:10px;cursor:pointer;font-weight:600;">Publicar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector("#modal-cancel").addEventListener("click", function () {
      modal.remove();
    });

    modal.querySelector("#modal-submit").addEventListener("click", function () {
      const titulo = modal.querySelector("#modal-title").value.trim();
      const cuerpo = modal.querySelector("#modal-body").value.trim();

      if (!titulo || !cuerpo) {
        alert("Completa todos los campos.");
        return;
      }

      // El post creado no se envía a API; se mantiene como almacenamiento temporal.
      const nuevoPost = {
        id: "custom_post_" + Date.now(),
        title: titulo,
        body: cuerpo,
        author: "Juan",
        time: "Hace un momento",
        custom: true,
      };

      const postsGuardados = obtenerPostsGuardados();
      postsGuardados.push(nuevoPost);
      guardarPostsPersonalizados(postsGuardados);
      inyectarNuevoPostAlDOM(nuevoPost, true);
      modal.remove();
    });
  }

  // Punto de entrada de Comunidad: carga publicaciones, une datos y maneja errores.
  async function cargarFeedComunidad() {
    try {
      mostrarEstadoComunidad("Cargando comunidad...", "cargando");

      const postsApi = await obtenerPostsComunidad();
      const postsGuardados = obtenerPostsGuardados().reverse();
      renderizarFeed(postsGuardados.concat(postsApi));
    } catch (error) {
      mostrarEstadoComunidad(
        "No se pudieron cargar las publicaciones. Intenta mas tarde.",
        "error",
      );
    }
  }

  if (btnNewPost) {
    btnNewPost.addEventListener("click", abrirFormularioNuevaPublicacion);
  }

  cargarFeedComunidad();
});
