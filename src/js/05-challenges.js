document.addEventListener('DOMContentLoaded', () => {
    const API_RETOS_URL = 'https://api.sparkfi.com/v1/challenges';
    const metaTotal = 50000;

    // --- MANEJO DE DATOS PERSISTENTES (LOCALSTORAGE) ---
    let ahorroActual = parseFloat(localStorage.getItem('sparkfi_ahorro_actual')) || 25000;
    let contadorDepositos = parseInt(localStorage.getItem('sparkfi_contador_depositos')) || 0;
    let retosAceptadosIds = JSON.parse(localStorage.getItem('sparkfi_retos_aceptados')) || [];

    const challengeSection = document.querySelector('.challenge');
    const barraFill = document.querySelector('.progress-fill');
    const textoProgreso = document.querySelector('.progress-text');
    const botonesUnirse = document.querySelectorAll('.btn-join');
    const listaLogros = document.querySelectorAll('.achievement');

    async function cargarModuloRetos() {
        console.log("â³ SparkFi API: Sincronizando tus metas de ahorro...");
        try {
            await new Promise(resolve => setTimeout(resolve, 600));
            inicializarRetos();
        } catch (error) {
            inicializarRetos();
        }
    }

    function inicializarRetos() {
        // 1. IntegraciÃ³n limpia del botÃ³n de depÃ³sitos
        if (challengeSection && !document.getElementById('btn-depositar-dinamico')) {
            const btnSimulador = document.createElement('button');
            btnSimulador.id = "btn-depositar-dinamico";
            configurarBotonDepositoTexto(btnSimulador);
            btnSimulador.style.cssText = "background: #16a34a; color: white; border: none; padding: 12px 16px; border-radius: 12px; cursor: pointer; font-weight: bold; font-family: 'Inter', sans-serif; font-size: 14px; margin-top: 15px; width: 100%; transition: all 0.3s ease; box-shadow: 0 4px 6px -1px rgba(22, 163, 74, 0.2);";
            
            challengeSection.appendChild(btnSimulador);

            btnSimulador.addEventListener('click', () => {
                if (ahorroActual < metaTotal) {
                    contadorDepositos++;
                    localStorage.setItem('sparkfi_contador_depositos', contadorDepositos);
                    actualizarGraficaProgreso(5000);
                    configurarBotonDepositoTexto(btnSimulador);
                }
            });
        }

        // 2. IntegraciÃ³n limpia del botÃ³n para Restaurar/Reiniciar ahorros
        if (textoProgreso && !document.getElementById('btn-reset-sparkfi')) {
            if (textoProgreso.parentElement) {
                textoProgreso.parentElement.style.position = "relative";
            }
            
            const btnReset = document.createElement('button');
            btnReset.id = "btn-reset-sparkfi";
            btnReset.innerHTML = "ðŸ”„ Reiniciar Ahorros";
            btnReset.style.cssText = "background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 11px; font-weight: 600; font-family: 'Inter', sans-serif; margin-left: 15px; transition: background 0.2s;";
            
            btnReset.onmouseover = () => btnReset.style.background = "#dc2626";
            btnReset.onmouseout = () => btnReset.style.background = "#ef4444";
            
            btnReset.addEventListener('click', () => {
                if(confirm("Â¿Quieres restablecer el simulador a sus valores iniciales?")) {
                    localStorage.removeItem('sparkfi_ahorro_actual');
                    localStorage.removeItem('sparkfi_contador_depositos');
                    localStorage.removeItem('sparkfi_retos_aceptados');
                    alert("Progreso restaurado con Ã©xito.");
                    window.location.reload();
                }
            });
            
            textoProgreso.after(btnReset);
        }

        actualizarGraficaProgreso(0);
        reconstruirYVincularRetosOriginales();
    }

    function configurarBotonDepositoTexto(boton) {
        if (ahorroActual >= metaTotal) {
            boton.innerText = "Â¡Meta Cumplida! ðŸ† Reto Finalizado";
            boton.style.background = "linear-gradient(135deg, #eab308, #ca8a04)";
            boton.style.boxShadow = "0 4px 12px rgba(234, 179, 8, 0.4)";
            boton.style.cursor = "default";
        } else {
            boton.innerText = contadorDepositos > 0 
                ? `ðŸ’° DepÃ³sito #${contadorDepositos} registrado (+$5.000)`
                : "ðŸ’° Registrar depÃ³sito (+$5.000)";
            boton.style.background = "#16a34a";
            boton.style.cursor = "pointer";
        }
    }

    function actualizarGraficaProgreso(incremento) {
        ahorroActual += incremento;
        if (ahorroActual > metaTotal) ahorroActual = metaTotal;

        localStorage.setItem('sparkfi_ahorro_actual', ahorroActual);

        const porcentaje = (ahorroActual / metaTotal) * 100;
        if (barraFill) barraFill.style.width = `${porcentaje}%`;

        if (textoProgreso) {
            textoProgreso.innerText = `Progreso: $${ahorroActual.toLocaleString()} / $${metaTotal.toLocaleString()}`;
        }

        // IluminaciÃ³n dinÃ¡mica de logros
        if (ahorroActual >= 35000 && listaLogros[1]) {
            iluminarLogroConColor(listaLogros[1], "#2563eb", "#dbeafe", "ðŸŽ‰ Â¡Inversor Novato!");
        } else if (listaLogros[1]) {
            restaurarLogroAGris(listaLogros[1], "Inversor novato", "Alcanza los $35,000 en ahorros.");
        }

        if (ahorroActual >= metaTotal && listaLogros[2]) {
            iluminarLogroConColor(listaLogros[2], "#16a34a", "#dcfce7", "ðŸ† Â¡Maestro del Ahorro!");
        } else if (listaLogros[2]) {
            restaurarLogroAGris(listaLogros[2], "Maestro del ahorro", "Completa el 100% de tu meta activa.");
        }
    }

    function iluminarLogroConColor(nodoLogro, colorFuerte, colorFondo, nuevoTitulo) {
        nodoLogro.classList.remove('achievement-inactive');
        nodoLogro.classList.add('achievement-active');
        nodoLogro.style.border = `2px solid ${colorFuerte}`;
        nodoLogro.style.background = "#ffffff";
        nodoLogro.style.transform = "scale(1.03)";
        nodoLogro.style.boxShadow = `0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -4px ${colorFuerte}33`;

        const iconContainer = nodoLogro.querySelector('.achievement-icon') || nodoLogro.querySelector('div');
        if (iconContainer) { iconContainer.style.background = colorFondo; iconContainer.style.color = colorFuerte; }
        const label = nodoLogro.querySelector('.achievement-label');
        if (label) { label.innerText = nuevoTitulo; label.style.color = colorFuerte; label.style.fontWeight = "800"; }
        const hint = nodoLogro.querySelector('.achievement-hint');
        if (hint) hint.innerText = "Â¡Completado y validado! âœ”";
    }

    function restaurarLogroAGris(nodoLogro, tituloOriginal, pistaOriginal) {
        nodoLogro.classList.remove('achievement-active');
        nodoLogro.classList.add('achievement-inactive');
        nodoLogro.style.border = ""; nodoLogro.style.background = ""; nodoLogro.style.transform = ""; nodoLogro.style.boxShadow = "";
        const iconContainer = nodoLogro.querySelector('.achievement-icon') || nodoLogro.querySelector('div');
        if (iconContainer) { iconContainer.style.background = ""; iconContainer.style.color = ""; }
        const label = nodoLogro.querySelector('.achievement-label');
        if (label) { label.innerText = tituloOriginal; label.style.color = ""; label.style.fontWeight = ""; }
        const hint = nodoLogro.querySelector('.achievement-hint');
        if (hint) hint.innerText = pistaOriginal;
    }

    // Vincula eventos manteniendo toda tu grilla de retos intacta sin quitar nada
    function reconstruirYVincularRetosOriginales() {
        botonesUnirse.forEach((boton, indice) => {
            const idUnicoReto = `reto_base_index_${indice}`;
            
            // Si ya estaba guardado en LocalStorage como aceptado, actualizar estado visual inmediatamente
            if (retosAceptadosIds.includes(idUnicoReto)) {
                const tarjetaReto = boton.closest('.challenge-card') || boton.parentElement;
                const tituloReto = tarjetaReto.querySelector('h3')?.innerText || "Reto Activo";
                const bonoDinero = (indice === 0) ? 3000 : 5000;

                marcarBotonComoAceptado(boton, bonoDinero);
                crearTarjetaActivaEnPantalla(tituloReto);
            }

            // Configurar el click para los que no se han aceptado aÃºn
            boton.addEventListener('click', () => {
                if (!retosAceptadosIds.includes(idUnicoReto)) {
                    retosAceptadosIds.push(idUnicoReto);
                    localStorage.setItem('sparkfi_retos_aceptados', JSON.stringify(retosAceptadosIds));
                    
                    const tarjetaReto = boton.closest('.challenge-card') || boton.parentElement;
                    const tituloReto = tarjetaReto.querySelector('h3')?.innerText || "Reto Financiero";
                    const bonoDinero = (indice === 0) ? 3000 : 5000;

                    marcarBotonComoAceptado(boton, bonoDinero);
                    actualizarGraficaProgreso(bonoDinero);
                    crearTarjetaActivaEnPantalla(tituloReto);
                    
                    const btnDep = document.getElementById('btn-depositar-dinamico');
                    if(btnDep) configurarBotonDepositoTexto(btnDep);
                }
            });
        });
    }

    function marcarBotonComoAceptado(boton, bono) {
        boton.innerText = `Aceptado (+ $${bono.toLocaleString()}) âœ”`;
        boton.style.background = "#f1f5f9";
        boton.style.color = "#94a3b8";
        boton.disabled = true;
    }

    function crearTarjetaActivaEnPantalla(titulo) {
        if (challengeSection) {
            // Validar que no se duplique visualmente en la misma sesiÃ³n
            const existentes = challengeSection.querySelectorAll('.replica-retos-dinamica');
            let yaExiste = false;
            existentes.forEach(el => {
                if(el.innerText.includes(titulo)) yaExiste = true;
            });
            
            if(!yaExiste) {
                const replicaActiva = document.createElement('div');
                replicaActiva.className = "replica-retos-dinamica";
                replicaActiva.style.cssText = "background: #ffffff; border: 2px dashed #2563eb; padding: 12px; border-radius: 14px; margin-top: 10px;";
                replicaActiva.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <span style="background: #e0f2fe; color: #0369a1; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 10px; display: inline-block; margin-bottom: 3px;">RETO ADQUIRIDO ðŸ”¥</span>
                            <h4 style="margin: 0; font-size: 14px; color: #1e293b;">${titulo}</h4>
                        </div>
                        <span style="font-size: 18px;">âš¡</span>
                    </div>
                `;
                challengeSection.appendChild(replicaActiva);
            }
        }
    }

    cargarModuloRetos();
});