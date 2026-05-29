# SparkFi — Plataforma Educativa de Finanzas Personales

SparkFi es un prototipo de aplicación web orientada a la educación financiera personal. Ofrece una experiencia interactiva con cursos, retos, gamificación y seguimiento visual del progreso. Está construida íntegramente con tecnologías web fundamentales (HTML, CSS y JavaScript), **sin frameworks ni herramientas de build**, y todas sus pantallas consumen datos en tiempo real desde **APIs REST** mediante `fetch` y `async/await`.

---

## Tabla de contenidos

- [Vista previa](#vista-previa)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Integración con APIs](#integración-con-apis)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Instalación y uso](#instalación-y-uso)
- [Credenciales de prueba](#credenciales-de-prueba)
- [Navegación](#navegación)
- [Diseño visual](#diseño-visual)

---

## Vista previa

| Login | Registro | Home | Cursos |
|-------|----------|------|--------|
| ![Login](src/images/mockups/01-login.png) | ![Registro](src/images/mockups/02-create-account.png) | ![Home](src/images/mockups/03-home.png) | ![Cursos](src/images/mockups/04-courses.png) |

| Retos | Comunidad | Perfil | Configuración |
|-------|-----------|--------|---------------|
| ![Retos](src/images/mockups/05-challenges.png) | ![Comunidad](src/images/mockups/06-community.png) | ![Perfil](src/images/mockups/07-profile.png) | ![Configuración](src/images/mockups/08-settings.png) |

---

## Características

- **Portada institucional dinámica** — los integrantes del equipo se cargan desde una API y se renderizan como tarjetas con sus pantallas asignadas.
- **Autenticación contra API** — el login valida correo y contraseña consultando usuarios reales, con límite de 3 intentos, bloqueo del formulario y sesión persistida en `sessionStorage`.
- **Registro con `POST`** — crea cuentas nuevas en el backend, valida el formulario en el cliente y evita correos duplicados antes de enviar.
- **Dashboard personalizado** — saludo según la hora, datos del usuario traídos de la API y tarjeta de "tips financieros" rotativa con respaldo local si la API falla.
- **Cursos interactivos** — catálogo cargado desde API, búsqueda en tiempo real, filtrado por tema y seguimiento de progreso por lección.
- **Retos financieros** — transforma datos de una API pública en desafíos, con barra de progreso, depósitos simulados y logros desbloqueables (persistidos en `localStorage`).
- **Comunidad social** — feed de publicaciones que combina datos de API con posts propios, likes y comentarios guardados localmente.
- **Perfil de usuario** — estadísticas (cursos, retos, ahorro) consumidas desde API con animación de contadores.
- **Configuración** — preferencias de cuenta y notificaciones sincronizadas con API y `localStorage`.
- **Estados de carga y error** — cada pantalla muestra mensajes de "Cargando…" y maneja fallos de red con avisos amigables al usuario.
- **Diseño responsive** — adaptado para móvil, tablet y escritorio.

---

## Tecnologías

| Tecnología | Uso |
|------------|-----|
| HTML5 | Estructura semántica de las vistas |
| CSS3 | Estilos, layout y responsividad |
| JavaScript (Vanilla) | Interactividad y lógica del cliente |
| Fetch API + `async/await` | Consumo de servicios REST |
| MockAPI | Backend simulado (usuarios, cursos, tips, perfil, configuración, estudiantes) |
| JSONPlaceholder | API pública para retos y comunidad |
| `sessionStorage` / `localStorage` | Persistencia de sesión y datos del navegador |
| Google Fonts (Inter) | Tipografía del sistema |

> No requiere instalación de paquetes ni herramientas de construcción (build tools).

---

## Integración con APIs

Todas las pantallas obtienen sus datos de servicios REST externos usando `fetch` y `async/await`, con manejo de errores mediante `try/catch` y estados de carga visibles para el usuario.

| Pantalla | API | Operación | Qué hace |
|----------|-----|-----------|----------|
| Portada (`index`) | MockAPI · `students` | `GET` | Lista los integrantes del equipo y sus pantallas asignadas |
| Login | MockAPI · `users` | `GET` | Valida credenciales y guarda la sesión |
| Registro | MockAPI · `users` | `GET` + `POST` | Verifica correos duplicados y crea la cuenta nueva |
| Home | MockAPI · `users` + `Tips` | `GET` (en paralelo) | Refresca datos del usuario y muestra tips rotativos |
| Cursos | MockAPI · `Courses` | `GET` | Carga el catálogo de cursos y lecciones |
| Retos | JSONPlaceholder · `todos` | `GET` | Transforma tareas genéricas en retos financieros |
| Comunidad | JSONPlaceholder · `posts` + `users` | `GET` (en paralelo) | Construye el feed uniendo cada post con su autor |
| Perfil | MockAPI · `Profile` | `GET` | Muestra estadísticas del usuario |
| Configuración | MockAPI · `Settings` | `GET` | Sincroniza las preferencias de la cuenta |

**Conceptos aplicados:**

- Peticiones `GET` y `POST` con cabeceras y cuerpo JSON.
- Peticiones en paralelo con `Promise.all` (Home y Comunidad).
- Manejo de errores con `try/catch` y mensajes claros al usuario.
- Estados de carga (`Cargando…`) con un tiempo mínimo para evitar parpadeos.
- Datos de respaldo (*fallback*) cuando la API no responde (p. ej. los tips del Home).
- Normalización de datos para tolerar distintos nombres de campos.
- Persistencia local con `sessionStorage` y `localStorage`.

> **Tip para demostrar el manejo de errores:** abre la vista de Cursos con el parámetro `?simularErrorCursos=1` en la URL para forzar un fallo de carga y ver el mensaje de error.

---

## Estructura del proyecto

```
sparkFi/
├── index.html                  # Punto de entrada y portada del proyecto
├── src/
│   ├── html/
│   │   ├── 01-login.html
│   │   ├── 02-create-account.html
│   │   ├── 03-home.html
│   │   ├── 04-courses.html
│   │   ├── 05-challenges.html
│   │   ├── 06-community.html
│   │   ├── 07-profile.html
│   │   └── 08-settings.html
│   ├── css/
│   │   ├── index.css           # Estilos globales compartidos
│   │   ├── 01-login.css
│   │   ├── 02-create-account.css
│   │   └── ...                 # Un archivo por vista
│   ├── js/
│   │   ├── index.js            # Carga de estudiantes (API)
│   │   ├── 01-login.js         # Lógica de cada vista + llamadas a la API
│   │   ├── 02-create-account.js
│   │   └── ...                 # Un archivo por vista
│   └── images/
│       └── mockups/            # Capturas de diseño (PNG)
```

**Convención de nombres:** los archivos usan prefijos de dos dígitos (`01-`, `02-`, ...) para mantener un orden lógico y evitar conflictos de ordenamiento alfabético en proyectos con múltiples vistas.

---

## Instalación y uso

**Requisitos previos:** [VS Code](https://code.visualstudio.com/) con la extensión [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) y conexión a internet (las pantallas consumen APIs en línea).

```bash
# 1. Clonar el repositorio
git clone https://github.com/usuario/sparkfi.git

# 2. Entrar al directorio
cd sparkfi
```

Luego, dentro de VS Code:

1. Abrir la carpeta del proyecto
2. Hacer clic derecho sobre `index.html`
3. Seleccionar **"Open with Live Server"**

El navegador abrirá la portada del proyecto. Desde allí se puede revisar la asignación de pantallas por integrante o entrar al login.

---

## Credenciales de prueba

Para explorar la aplicación sin necesidad de registrarse, se pueden usar las siguientes credenciales (validadas contra la API de usuarios):

| Campo | Valor |
|-------|-------|
| Correo | `admin@sparkfi.com` |
| Contraseña | `sparkfi123` |

También puedes crear tu propia cuenta desde la pantalla de **Registro**: se guardará en el backend y podrás iniciar sesión con ella.

---

## Navegación

| # | Vista | Ruta |
|---|-------|------|
| 01 | Login | `src/html/01-login.html` |
| 02 | Registro | `src/html/02-create-account.html` |
| 03 | Home / Dashboard | `src/html/03-home.html` |
| 04 | Cursos | `src/html/04-courses.html` |
| 05 | Retos | `src/html/05-challenges.html` |
| 06 | Comunidad | `src/html/06-community.html` |
| 07 | Perfil | `src/html/07-profile.html` |
| 08 | Configuración | `src/html/08-settings.html` |

---

## Diseño visual

### Paleta de colores

| Variable | Hex | Uso |
|----------|-----|-----|
| Verde principal | `#22D74F` | Acciones primarias, éxito |
| Verde suave | `#00D369` | Acentos secundarios |
| Azul primario | `#006AF8` | Botones, enlaces |
| Azul fuerte | `#0A3DFE` | Énfasis y hover |
| Amarillo | `#FFD838` | Alertas, logros |
| Fondo general | `#F7F9FF` | Background de la app |
| Superficie | `#FFFFFF` | Tarjetas y modales |
| Bordes | `#E4E7F2` | Separadores y outlines |
| Texto principal | `#181F34` | Títulos y cuerpo |
| Texto secundario | `#3C4A5F` | Subtítulos y etiquetas |

### Tipografía

**Inter** — Google Fonts  
Usada en todos los pesos desde `Regular 400` hasta `Bold 700` según jerarquía visual.
