document.addEventListener('DOMContentLoaded', () => {
    const API_COMUNIDAD_URL = 'https://api.sparkfi.com/v1/posts';
    const postListContainer = document.querySelector('.post-list');
    const btnNewPost = document.querySelector('.btn-new-post');

    async function cargarFeedComunidad() {
        console.log("â³ SparkFi API: Sincronizando feed social...");
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            inicializarComunidad();
        } catch (error) {
            inicializarComunidad();
        }
    }

    function inicializarComunidad() {
        const postsExistentes = document.querySelectorAll('.post-card');
        postsExistentes.forEach((post, indice) => {
            const idPost = `html_post_${indice}`;
            const contadorComentariosTexto = post.querySelector('.comment-count') || post.querySelectorAll('.comment-btn span')[2];
            if (contadorComentariosTexto) contadorComentariosTexto.innerText = "0";

            inyectarBotonEliminar(post, idPost, false);
            configurarInteractividadPost(post, idPost);
        });

        let nuevosPostsGuardados = JSON.parse(localStorage.getItem('sparkfi_custom_posts')) || [];
        nuevosPostsGuardados.reverse().forEach((postData) => {
            inyectarNuevoPostAlDOM(postData, false);
        });

        if (btnNewPost) {
            btnNewPost.addEventListener('click', abrirFormularioNuevaPublicacion);
        }
    }

    function inyectarBotonEliminar(tarjetaPost, idUnico, esPersonalizado) {
        tarjetaPost.style.position = "relative";
        const btnEliminar = document.createElement('button');
        btnEliminar.innerHTML = "ðŸ—‘ï¸";
        btnEliminar.style.cssText = "position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 16px; cursor: pointer; opacity: 0.4; transition: all 0.2s; padding: 5px; z-index: 10;";
        
        btnEliminar.onmouseover = () => { btnEliminar.style.opacity = "1"; btnEliminar.style.transform = "scale(1.15)"; };
        btnEliminar.onmouseout = () => { btnEliminar.style.opacity = "0.4"; btnEliminar.style.transform = "scale(1)"; };

        btnEliminar.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("Â¿Deseas eliminar esta publicaciÃ³n de la pantalla?")) {
                if (esPersonalizado) {
                    let postsGuardados = JSON.parse(localStorage.getItem('sparkfi_custom_posts')) || [];
                    postsGuardados = postsGuardados.filter(p => p.id !== idUnico);
                    localStorage.setItem('sparkfi_custom_posts', JSON.stringify(postsGuardados));
                    localStorage.removeItem(`comments_${idUnico}`);
                }
                tarjetaPost.style.transition = "all 0.3s ease";
                tarjetaPost.style.opacity = "0";
                setTimeout(() => tarjetaPost.remove(), 300);
            }
        });
        tarjetaPost.appendChild(btnEliminar);
    }

    function configurarInteractividadPost(tarjetaPost, idUnico) {
        const btnLike = tarjetaPost.querySelector('.react-btn');
        const btnComentar = tarjetaPost.querySelector('.comment-btn');
        const contadorLikesTexto = btnLike.querySelector('span');
        const contadorComentariosTexto = btnComentar.querySelector('.comment-count') || btnComentar.querySelectorAll('span')[2];

        let totalLikes = parseInt(contadorLikesTexto.innerText) || 0;
        let haDadoLike = false;

        if (btnLike) {
            btnLike.addEventListener('click', () => {
                if (!haDadoLike) {
                    totalLikes++; contadorLikesTexto.innerText = totalLikes;
                    btnLike.style.background = "#e0f2fe"; btnLike.style.color = "#2563eb"; haDadoLike = true;
                } else {
                    totalLikes--; contadorLikesTexto.innerText = totalLikes;
                    btnLike.style.background = ""; btnLike.style.color = ""; haDadoLike = false;
                }
            });
        }

        const areaComentarios = document.createElement('div');
        areaComentarios.style.cssText = "display: none; margin-top: 15px; padding: 15px; background: #f8faff; border-radius: 15px; border: 1px solid #e4e7f2;";
        const listaMensajes = document.createElement('div');
        const cajaInput = document.createElement('div');
        cajaInput.style.cssText = "display: flex; gap: 10px; margin-top: 12px;";
        cajaInput.innerHTML = `
            <input type="text" placeholder="Escribe un comentario..." style="flex: 1; padding: 10px; border-radius: 10px; border: 1px solid #cbd5e1; outline: none; font-size: 14px;">
            <button style="background: #2563eb; color: white; border: none; padding: 10px 16px; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 14px;">Publicar</button>
        `;

        areaComentarios.appendChild(listaMensajes);
        areaComentarios.appendChild(cajaInput);
        tarjetaPost.appendChild(areaComentarios);

        let comentariosGuardados = JSON.parse(localStorage.getItem(`comments_${idUnico}`)) || [];
        comentariosGuardados.forEach((texto, index) => pintarComentarioUnico(listaMensajes, texto, index, idUnico, contadorComentariosTexto, comentariosGuardados));
        contadorComentariosTexto.innerText = comentariosGuardados.length;

        if (btnComentar) {
            btnComentar.addEventListener('click', () => {
                const oculto = areaComentarios.style.display === 'none';
                areaComentarios.style.display = oculto ? 'block' : 'none';
                if (oculto) cajaInput.querySelector('input').focus();
            });
        }

        const botonPublicar = cajaInput.querySelector('button');
        const inputTexto = cajaInput.querySelector('input');

        function guardarYPublicarComentario() {
            const texto = inputTexto.value.trim();
            if (texto !== "") {
                comentariosGuardados.push(texto);
                localStorage.setItem(`comments_${idUnico}`, JSON.stringify(comentariosGuardados));
                
                // Repintar lista para actualizar los Ã­ndices de borrado correctamente
                listaMensajes.innerHTML = "";
                comentariosGuardados.forEach((t, i) => pintarComentarioUnico(listaMensajes, t, i, idUnico, contadorComentariosTexto, comentariosGuardados));
                
                contadorComentariosTexto.innerText = comentariosGuardados.length;
                inputTexto.value = "";
            }
        }

        botonPublicar.addEventListener('click', guardarYPublicarComentario);
        inputTexto.addEventListener('keypress', (e) => { if (e.key === 'Enter') guardarYPublicarComentario(); });
    }

    function pintarComentarioUnico(contenedor, texto, indiceElemento, idUnico, nodoContador, arrayCompleto) {
        const div = document.createElement('div');
        div.style.cssText = "background: white; padding: 8px 12px; border-radius: 10px; margin-bottom: 6px; border: 1px solid #e2e8f0; font-size: 14px; display: flex; justify-content: space-between; align-items: center;";
        div.innerHTML = `
            <span><strong>Juan:</strong> <span>${texto}</span></span>
            <button class="btn-del-comment" style="background:none; border:none; cursor:pointer; opacity:0.3; font-size:12px; padding:2px;">ðŸ—‘ï¸</button>
        `;

        const btnDel = div.querySelector('.btn-del-comment');
        btnDel.onmouseover = () => btnDel.style.opacity = "1";
        btnDel.onmouseout = () => btnDel.style.opacity = "0.3";
        
        btnDel.addEventListener('click', () => {
            if(confirm("Â¿Quieres eliminar este comentario?")) {
                arrayCompleto.splice(indiceElemento, 1);
                localStorage.setItem(`comments_${idUnico}`, JSON.stringify(arrayCompleto));
                
                // Refrescar el Ã¡rea de comentarios del post de forma limpia
                contenedor.innerHTML = "";
                arrayCompleto.forEach((t, i) => pintarComentarioUnico(contenedor, t, i, idUnico, nodoContador, arrayCompleto));
                nodoContador.innerText = arrayCompleto.length;
            }
        });

        contenedor.appendChild(div);
    }

    function abrirFormularioNuevaPublicacion() {
        const modal = document.createElement('div');
        modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.6); display: flex; align-items: center; justify-content: center; z-index: 9999; font-family: 'Inter', sans-serif;";
        
        let avatarSeleccionado = "ðŸš€";

        modal.innerHTML = `
            <div style="background: white; padding: 25px; border-radius: 20px; width: 90%; max-width: 550px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); max-height: 90vh; overflow-y: auto;">
                <h3 style="margin-top: 0; font-size: 20px; color: #1e293b; margin-bottom: 12px;">Crear nueva publicaciÃ³n</h3>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 6px;">Elige tu perfil/avatar y mira su significado:</label>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px;">
                    <div class="avatar-option" data-emoji="ðŸš€" style="display: flex; align-items: center; gap: 8px; padding: 8px; border: 2px solid #2563eb; border-radius: 10px; cursor: pointer; background: #eff6ff; font-size: 13px;">
                        <span>ðŸš€</span> <strong>Inversionista Pro</strong>
                    </div>
                    <div class="avatar-option" data-emoji="ðŸ’°" style="display: flex; align-items: center; gap: 8px; padding: 8px; border: 2px solid #e2e8f0; border-radius: 10px; cursor: pointer; font-size: 13px;">
                        <span>ðŸ’°</span> <strong>Ahorrador Nato</strong>
                    </div>
                    <div class="avatar-option" data-emoji="ðŸ“ˆ" style="display: flex; align-items: center; gap: 8px; padding: 8px; border: 2px solid #e2e8f0; border-radius: 10px; cursor: pointer; font-size: 13px;">
                        <span>ðŸ“ˆ</span> <strong>Crecimiento</strong>
                    </div>
                    <div class="avatar-option" data-emoji="ðŸ’¡" style="display: flex; align-items: center; gap: 8px; padding: 8px; border: 2px solid #e2e8f0; border-radius: 10px; cursor: pointer; font-size: 13px;">
                        <span>ðŸ’¡</span> <strong>Tengo una Idea/Duda</strong>
                    </div>
                    <div class="avatar-option" data-emoji="ðŸŽ¯" style="display: flex; align-items: center; gap: 8px; padding: 8px; border: 2px solid #e2e8f0; border-radius: 10px; cursor: pointer; font-size: 13px;">
                        <span>ðŸŽ¯</span> <strong>Meta Cumplida</strong>
                    </div>
                    <div class="avatar-option" data-emoji="ðŸ’Ž" style="display: flex; align-items: center; gap: 8px; padding: 8px; border: 2px solid #e2e8f0; border-radius: 10px; cursor: pointer; font-size: 13px;">
                        <span>ðŸ’Ž</span> <strong>Consejo de Oro</strong>
                    </div>
                    <div class="avatar-option" data-emoji="ðŸ¦Š" style="display: flex; align-items: center; gap: 8px; padding: 8px; border: 2px solid #e2e8f0; border-radius: 10px; cursor: pointer; font-size: 13px;">
                        <span>ðŸ¦Š</span> <strong>Estratega</strong>
                    </div>
                    <div class="avatar-option" data-emoji="ðŸ§™â€â™‚ï¸" style="display: flex; align-items: center; gap: 8px; padding: 8px; border: 2px solid #e2e8f0; border-radius: 10px; cursor: pointer; font-size: 13px;">
                        <span>ðŸ§™â€â™‚ï¸</span> <strong>Mago Presupuesto</strong>
                    </div>
                </div>

                <input type="text" id="modal-title" placeholder="Â¿CuÃ¡l es el tÃ­tulo?" style="width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #cbd5e1; margin-bottom: 12px; outline: none; box-sizing: border-box; font-size: 14px;">
                <textarea id="modal-body" placeholder="Escribe tu contenido aquÃ­..." style="width: 100%; height: 80px; padding: 12px; border-radius: 10px; border: 1px solid #cbd5e1; margin-bottom: 15px; outline: none; resize: none; box-sizing: border-box; font-size: 14px; font-family: inherit;"></textarea>
                
                <div style="display: flex; justify-content: flex-end; gap: 10px;">
                    <button id="modal-cancel" style="background: #f1f5f9; color: #64748b; border: none; padding: 10px 18px; border-radius: 10px; cursor: pointer; font-weight: 600;">Cancelar</button>
                    <button id="modal-submit" style="background: #2563eb; color: white; border: none; padding: 10px 18px; border-radius: 10px; cursor: pointer; font-weight: 600;">Publicar ahora ðŸš€</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const opcionesAvatar = modal.querySelectorAll('.avatar-option');
        opcionesAvatar.forEach(opt => {
            opt.addEventListener('click', () => {
                opcionesAvatar.forEach(o => { o.style.borderColor = "#e2e8f0"; o.style.background = "none"; });
                opt.style.borderColor = "#2563eb";
                opt.style.background = "#eff6ff";
                avatarSeleccionado = opt.getAttribute('data-emoji');
            });
        });

        modal.querySelector('#modal-cancel').addEventListener('click', () => modal.remove());
        modal.querySelector('#modal-submit').addEventListener('click', () => {
            const titulo = document.getElementById('modal-title').value.trim();
            const cuerpo = document.getElementById('modal-body').value.trim();

            if (titulo !== "" && cuerpo !== "") {
                const nuevoPostObjeto = {
                    id: 'custom_post_' + Date.now(),
                    title: titulo,
                    body: cuerpo,
                    author: "Juan",
                    time: "Hace un momento",
                    avatar: avatarSeleccionado
                };

                let postsGuardados = JSON.parse(localStorage.getItem('sparkfi_custom_posts')) || [];
                postsGuardados.push(nuevoPostObjeto);
                localStorage.setItem('sparkfi_custom_posts', JSON.stringify(postsGuardados));

                inyectarNuevoPostAlDOM(nuevoPostObjeto, true);
                modal.remove();
            } else {
                alert("Completa todos los campos.");
            }
        });
    }

    function inyectarNuevoPostAlDOM(data, agregarAlInicio) {
        if (!postListContainer) return;

        const article = document.createElement('article');
        article.className = "post-card";
        const emojiAvatar = data.avatar || "ðŸš€";

        article.innerHTML = `
            <div class="post-top">
              <div class="post-main">
                <div class="avatar" style="background: #eff6ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 45px; height: 45px; font-size: 22px; border: 1px solid #bfdbfe;">
                    ${emojiAvatar}
                </div>
                <div class="post-content">
                  <h2 class="post-title">${data.title}</h2>
                  <p class="post-body">${data.body}</p>
                  <div class="post-meta">
                    <span class="post-author">${data.author} (TÃº)</span>
                    <span class="post-dot">â€¢</span>
                    <span class="post-time">${data.time}</span>
                  </div>
                </div>
              </div>
              <a href="#" class="post-link" onclick="event.preventDefault();">Ver respuestas</a>
            </div>
            <div class="post-bottom">
              <button class="react-btn">ðŸ‘ <span>0</span></button>
              <button class="comment-btn">
                <span class="comment-icon">ðŸ’¬</span>
                <span>Comentar</span>
                <span class="comment-count">0</span>
              </button>
            </div>
        `;

        if (agregarAlInicio) {
            postListContainer.insertBefore(article, postListContainer.firstChild);
        } else {
            postListContainer.appendChild(article);
        }

        inyectarBotonEliminar(article, data.id, true);
        configurarInteractividadPost(article, data.id);
    }

    cargarFeedComunidad();
});