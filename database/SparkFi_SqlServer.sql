/* ============================================================
   SparkFi - Base de datos (SQL Server / SSMS)
   Compatible con SQL Server 2016 o superior.
   Ejecutar en SQL Server Management Studio.
   ============================================================ */

-- 1) Crear la base de datos solo si no existe
IF DB_ID('SparkFi') IS NULL
    CREATE DATABASE SparkFi;
GO

USE SparkFi;
GO

-- 2) Borrar tablas si ya existen (en orden inverso a las dependencias),
--    para poder volver a ejecutar el script sin errores.
DROP TABLE IF EXISTS UsuarioLogros;
DROP TABLE IF EXISTS Comentarios;
DROP TABLE IF EXISTS Publicaciones;
DROP TABLE IF EXISTS ProgresoRetos;
DROP TABLE IF EXISTS ProgresoCursos;
DROP TABLE IF EXISTS Lecciones;
DROP TABLE IF EXISTS Ahorros;
DROP TABLE IF EXISTS Logros;
DROP TABLE IF EXISTS Retos;
DROP TABLE IF EXISTS Cursos;
DROP TABLE IF EXISTS Administradores;
DROP TABLE IF EXISTS Usuarios;
GO

/* ============================================================
   3) TABLAS INDEPENDIENTES (no dependen de otras)
   ============================================================ */

-- Tabla: Usuarios
CREATE TABLE Usuarios (
    IdUsuario       INT IDENTITY(1,1) PRIMARY KEY,
    NombreCompleto  NVARCHAR(100) NOT NULL,
    Correo          VARCHAR(100)  NOT NULL UNIQUE,
    Contrasena      VARCHAR(255)  NOT NULL,
    Nivel           INT           NOT NULL DEFAULT 1,
    FechaRegistro   DATETIME2     NOT NULL DEFAULT SYSDATETIME()
);
GO

-- Tabla: Cursos
CREATE TABLE Cursos (
    IdCurso      INT IDENTITY(1,1) PRIMARY KEY,
    NombreCurso  NVARCHAR(150) NOT NULL,
    Descripcion  NVARCHAR(300) NULL,
    Imagen       VARCHAR(300)  NULL
);
GO

-- Tabla: Retos
CREATE TABLE Retos (
    IdReto        INT IDENTITY(1,1) PRIMARY KEY,
    NombreReto    NVARCHAR(150) NOT NULL,
    Descripcion   NVARCHAR(300) NULL,
    MontoObjetivo DECIMAL(10,2) NULL
);
GO

-- Tabla: Logros
CREATE TABLE Logros (
    IdLogro     INT IDENTITY(1,1) PRIMARY KEY,
    NombreLogro NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(200) NULL,
    Icono       VARCHAR(300)  NULL
);
GO

-- Tabla: Administradores
CREATE TABLE Administradores (
    IdAdmin        INT IDENTITY(1,1) PRIMARY KEY,
    NombreCompleto NVARCHAR(100) NOT NULL,
    Correo         VARCHAR(100)  NOT NULL UNIQUE,
    Contrasena     VARCHAR(255)  NOT NULL,
    Telefono       VARCHAR(20)   NULL,
    Rol            NVARCHAR(50)  NOT NULL DEFAULT 'ADMIN',
    Activo         BIT           NOT NULL DEFAULT 1,
    FechaCreacion  DATETIME2     NOT NULL DEFAULT SYSDATETIME()
);
GO

/* ============================================================
   4) TABLAS DEPENDIENTES (con llaves foráneas)
   ============================================================ */

-- Tabla: Ahorros
CREATE TABLE Ahorros (
    IdAhorro      INT IDENTITY(1,1) PRIMARY KEY,
    IdUsuario     INT NOT NULL,
    Monto         DECIMAL(10,2) NOT NULL DEFAULT 0,
    FechaRegistro DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Ahorros_Usuarios FOREIGN KEY (IdUsuario)
        REFERENCES Usuarios(IdUsuario) ON DELETE CASCADE
);
GO

-- Tabla: Lecciones
CREATE TABLE Lecciones (
    IdLeccion INT IDENTITY(1,1) PRIMARY KEY,
    IdCurso   INT NOT NULL,
    Titulo    NVARCHAR(150) NOT NULL,
    Contenido NVARCHAR(MAX) NULL,            -- antes era TEXT / NVARCHAR(MAX)
    VideoURL  VARCHAR(300)  NULL,
    CONSTRAINT FK_Lecciones_Cursos FOREIGN KEY (IdCurso)
        REFERENCES Cursos(IdCurso) ON DELETE CASCADE
);
GO

-- Tabla: ProgresoCursos
CREATE TABLE ProgresoCursos (
    IdProgreso INT IDENTITY(1,1) PRIMARY KEY,
    IdUsuario  INT NOT NULL,
    IdCurso    INT NOT NULL,
    Porcentaje INT NOT NULL DEFAULT 0,
    CONSTRAINT FK_ProgresoCursos_Usuarios FOREIGN KEY (IdUsuario)
        REFERENCES Usuarios(IdUsuario) ON DELETE CASCADE,
    CONSTRAINT FK_ProgresoCursos_Cursos FOREIGN KEY (IdCurso)
        REFERENCES Cursos(IdCurso),
    CONSTRAINT CK_ProgresoCursos_Porcentaje CHECK (Porcentaje BETWEEN 0 AND 100)
);
GO

-- Tabla: ProgresoRetos
CREATE TABLE ProgresoRetos (
    IdProgresoReto INT IDENTITY(1,1) PRIMARY KEY,
    IdUsuario      INT NOT NULL,
    IdReto         INT NOT NULL,
    MontoActual    DECIMAL(10,2) NOT NULL DEFAULT 0,
    Completado     BIT NOT NULL DEFAULT 0,    -- antes era BOOLEAN
    CONSTRAINT FK_ProgresoRetos_Usuarios FOREIGN KEY (IdUsuario)
        REFERENCES Usuarios(IdUsuario) ON DELETE CASCADE,
    CONSTRAINT FK_ProgresoRetos_Retos FOREIGN KEY (IdReto)
        REFERENCES Retos(IdReto)
);
GO

-- Tabla: Publicaciones
CREATE TABLE Publicaciones (
    IdPublicacion    INT IDENTITY(1,1) PRIMARY KEY,
    IdUsuario        INT NOT NULL,
    Titulo           NVARCHAR(200) NOT NULL,
    Contenido        NVARCHAR(MAX) NULL,
    FechaPublicacion DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Publicaciones_Usuarios FOREIGN KEY (IdUsuario)
        REFERENCES Usuarios(IdUsuario) ON DELETE CASCADE
);
GO

-- Tabla: Comentarios
CREATE TABLE Comentarios (
    IdComentario    INT IDENTITY(1,1) PRIMARY KEY,
    IdPublicacion   INT NOT NULL,
    IdUsuario       INT NOT NULL,
    Comentario      NVARCHAR(MAX) NULL,
    FechaComentario DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Comentarios_Publicaciones FOREIGN KEY (IdPublicacion)
        REFERENCES Publicaciones(IdPublicacion) ON DELETE CASCADE,
    -- Sin CASCADE aquí para evitar el error de "múltiples rutas de cascada"
    CONSTRAINT FK_Comentarios_Usuarios FOREIGN KEY (IdUsuario)
        REFERENCES Usuarios(IdUsuario)
);
GO

-- Tabla: UsuarioLogros (relación muchos a muchos entre Usuarios y Logros)
CREATE TABLE UsuarioLogros (
    IdUsuarioLogro INT IDENTITY(1,1) PRIMARY KEY,
    IdUsuario      INT NOT NULL,
    IdLogro        INT NOT NULL,
    FechaObtenido  DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_UsuarioLogros_Usuarios FOREIGN KEY (IdUsuario)
        REFERENCES Usuarios(IdUsuario) ON DELETE CASCADE,
    CONSTRAINT FK_UsuarioLogros_Logros FOREIGN KEY (IdLogro)
        REFERENCES Logros(IdLogro)
);
GO

/* ============================================================
   5) ÍNDICES recomendados sobre las llaves foráneas
      (mejoran el rendimiento de los JOIN y los filtros)
   ============================================================ */
CREATE INDEX IX_Ahorros_IdUsuario          ON Ahorros(IdUsuario);
CREATE INDEX IX_Lecciones_IdCurso          ON Lecciones(IdCurso);
CREATE INDEX IX_ProgresoCursos_IdUsuario   ON ProgresoCursos(IdUsuario);
CREATE INDEX IX_ProgresoCursos_IdCurso     ON ProgresoCursos(IdCurso);
CREATE INDEX IX_ProgresoRetos_IdUsuario    ON ProgresoRetos(IdUsuario);
CREATE INDEX IX_ProgresoRetos_IdReto       ON ProgresoRetos(IdReto);
CREATE INDEX IX_Publicaciones_IdUsuario    ON Publicaciones(IdUsuario);
CREATE INDEX IX_Comentarios_IdPublicacion  ON Comentarios(IdPublicacion);
CREATE INDEX IX_Comentarios_IdUsuario      ON Comentarios(IdUsuario);
CREATE INDEX IX_UsuarioLogros_IdUsuario    ON UsuarioLogros(IdUsuario);
CREATE INDEX IX_UsuarioLogros_IdLogro      ON UsuarioLogros(IdLogro);
GO

PRINT 'Base de datos SparkFi creada correctamente.';
GO

/* ============================================================
   6) DATOS DE EJEMPLO
      (para que las consultas de abajo devuelvan resultados
       reales durante la exposición)
   ============================================================ */

-- Usuarios (los Id se generan solos: 1..5)
INSERT INTO Usuarios (NombreCompleto, Correo, Contrasena, Nivel) VALUES
('Brayan Ciro',     'brayan@sparkfi.com',   'sparkfi123', 3),
('Emmanuel Gomez',  'emmanuel@sparkfi.com', 'sparkfi123', 2),
('Santiago Varela', 'santiago@sparkfi.com', 'sparkfi123', 1),
('Ana Torres',      'ana@sparkfi.com',      'sparkfi123', 2),
('Carlos Ruiz',     'carlos@sparkfi.com',   'sparkfi123', 1);

-- Cursos (Id 1..5)
INSERT INTO Cursos (NombreCurso, Descripcion, Imagen) VALUES
('Introduccion al ahorro',    'Aprende a guardar dinero cada mes',        'ahorro.png'),
('Presupuesto basico',        'Organiza tus ingresos y gastos',           'presupuesto.png'),
('Fundamentos de inversion',  'Primeros pasos para invertir',             'inversion.png'),
('Fondo de emergencia',       'Crea tu colchon financiero',               'fondo.png'),
('Metodo 50/30/20',           'Distribuye tu dinero de forma inteligente','metodo.png');

-- Lecciones (solo para los cursos 1, 2 y 3; los cursos 4 y 5 quedan sin lecciones a propósito)
INSERT INTO Lecciones (IdCurso, Titulo, Contenido, VideoURL) VALUES
(1, 'Por que ahorrar',        'El ahorro como habito.',          'https://video/1'),
(1, 'Ahorro automatico',      'Programa transferencias.',         'https://video/2'),
(2, 'Registrar gastos',       'Anota todo lo que gastas.',        'https://video/3'),
(3, 'Riesgo y rentabilidad',  'Relacion entre riesgo y ganancia.','https://video/4');

-- Retos (Id 1..4)
INSERT INTO Retos (NombreReto, Descripcion, MontoObjetivo) VALUES
('Reto de las 52 semanas',    'Ahorra de forma creciente cada semana', 1000000),
('Adios gastos hormiga',      'Elimina pequenos gastos diarios',          50000),
('Ahorra tu sueldo extra',    'Guarda ingresos adicionales',             200000),
('Sin compras impulsivas',    'Una semana sin compras innecesarias',     100000);

-- Logros (Id 1..4)
INSERT INTO Logros (NombreLogro, Descripcion, Icono) VALUES
('Primer ahorro',     'Realizaste tu primer ahorro',     'star.png'),
('Inversor novato',   'Completaste un curso de inversion','rocket.png'),
('Maestro del ahorro','Cumpliste una meta de ahorro',     'trophy.png'),
('Constancia semanal','Ahorraste 4 semanas seguidas',     'fire.png');

-- Ahorros (el usuario 5 queda sin ahorros a propósito)
INSERT INTO Ahorros (IdUsuario, Monto) VALUES
(1, 200000), (1, 150000), (1, 150000),   -- Brayan  = 500.000
(2, 100000), (2, 50000),                 -- Emmanuel= 150.000
(3, 30000),                              -- Santiago=  30.000
(4, 250000), (4, 300000);                -- Ana     = 550.000

-- Progreso en cursos
INSERT INTO ProgresoCursos (IdUsuario, IdCurso, Porcentaje) VALUES
(1, 1, 100), (1, 2, 60),
(2, 1, 40),
(3, 3, 20),
(4, 1, 100), (4, 2, 100);

-- Progreso en retos
INSERT INTO ProgresoRetos (IdUsuario, IdReto, MontoActual, Completado) VALUES
(1, 1, 500000, 0),
(1, 2, 50000,  1),
(2, 2, 30000,  0),
(4, 1, 1000000,1);

-- Publicaciones de la comunidad
INSERT INTO Publicaciones (IdUsuario, Titulo, Contenido) VALUES
(1, 'Como empezaron a ahorrar?', 'Cuentenme sus trucos para ahorrar.'),
(2, 'Mi experiencia 50/30/20',   'Me funciono muy bien este metodo.'),
(4, 'Logre mi fondo de emergencia','Por fin tengo 3 meses de gastos guardados.');

-- Comentarios
INSERT INTO Comentarios (IdPublicacion, IdUsuario, Comentario) VALUES
(1, 2, 'Yo empece guardando 10.000 diarios.'),
(1, 4, 'El ahorro automatico es clave.'),
(2, 1, 'Voy a probar ese metodo, gracias!');

-- Logros obtenidos por los usuarios
INSERT INTO UsuarioLogros (IdUsuario, IdLogro) VALUES
(1, 1), (1, 2),
(2, 1),
(4, 1), (4, 3);

-- Administrador
INSERT INTO Administradores (NombreCompleto, Correo, Contrasena, Telefono) VALUES
('Soporte SparkFi', 'admin@sparkfi.com', 'admin123', '3001234567');
GO

/* ============================================================
   7) 10 CONSULTAS (QUERYS) DE EJEMPLO
      Cada punto demuestra un concepto distinto de SQL.
      Tip: selecciona una consulta y presiona F5 para ejecutarla sola.
   ============================================================ */

-- ===================================================================
-- PUNTO 1: SELECT básico con ORDER BY
-- Lista todos los usuarios registrados, del más nuevo al más antiguo.
-- ===================================================================
SELECT IdUsuario, NombreCompleto, Correo, Nivel, FechaRegistro
FROM Usuarios
ORDER BY FechaRegistro DESC;
GO

-- ===================================================================
-- PUNTO 2: WHERE + LIKE (filtros)
-- Busca usuarios de nivel mayor a 1 cuyo correo sea de "@sparkfi.com".
-- ===================================================================
SELECT NombreCompleto, Correo, Nivel
FROM Usuarios
WHERE Nivel > 1
  AND Correo LIKE '%@sparkfi.com';
GO

-- ===================================================================
-- PUNTO 3: INNER JOIN entre 3 tablas
-- Muestra qué usuario está estudiando qué curso y su porcentaje.
-- ===================================================================
SELECT u.NombreCompleto AS Usuario,
       c.NombreCurso     AS Curso,
       pc.Porcentaje
FROM ProgresoCursos pc
INNER JOIN Usuarios u ON u.IdUsuario = pc.IdUsuario
INNER JOIN Cursos   c ON c.IdCurso   = pc.IdCurso
ORDER BY u.NombreCompleto;
GO

-- ===================================================================
-- PUNTO 4: Función de agregación SUM + GROUP BY
-- Calcula cuánto ha ahorrado en total cada usuario.
-- ===================================================================
SELECT u.NombreCompleto AS Usuario,
       SUM(a.Monto)     AS TotalAhorrado
FROM Ahorros a
INNER JOIN Usuarios u ON u.IdUsuario = a.IdUsuario
GROUP BY u.NombreCompleto
ORDER BY TotalAhorrado DESC;
GO

-- ===================================================================
-- PUNTO 5: GROUP BY + HAVING
-- Muestra solo los usuarios cuyo ahorro total supera los 200.000.
-- (HAVING filtra DESPUÉS de agrupar; WHERE filtra antes)
-- ===================================================================
SELECT u.NombreCompleto AS Usuario,
       SUM(a.Monto)     AS TotalAhorrado
FROM Ahorros a
INNER JOIN Usuarios u ON u.IdUsuario = a.IdUsuario
GROUP BY u.NombreCompleto
HAVING SUM(a.Monto) > 200000;
GO

-- ===================================================================
-- PUNTO 6: TOP + ORDER BY (ranking)
-- Top 3 de usuarios que más han ahorrado.
-- ===================================================================
SELECT TOP 3
       u.NombreCompleto AS Usuario,
       SUM(a.Monto)     AS TotalAhorrado
FROM Ahorros a
INNER JOIN Usuarios u ON u.IdUsuario = a.IdUsuario
GROUP BY u.NombreCompleto
ORDER BY TotalAhorrado DESC;
GO

-- ===================================================================
-- PUNTO 7: LEFT JOIN + COUNT
-- Cuenta cuántos logros tiene cada usuario, INCLUYENDO a los que
-- aún no tienen ninguno (aparecen con 0).
-- ===================================================================
SELECT u.NombreCompleto        AS Usuario,
       COUNT(ul.IdLogro)       AS CantidadLogros
FROM Usuarios u
LEFT JOIN UsuarioLogros ul ON ul.IdUsuario = u.IdUsuario
GROUP BY u.NombreCompleto
ORDER BY CantidadLogros DESC;
GO

-- ===================================================================
-- PUNTO 8: Subconsulta con NOT EXISTS
-- Lista los cursos que TODAVÍA no tienen lecciones cargadas.
-- ===================================================================
SELECT c.NombreCurso
FROM Cursos c
WHERE NOT EXISTS (
    SELECT 1
    FROM Lecciones l
    WHERE l.IdCurso = c.IdCurso
);
GO

-- ===================================================================
-- PUNTO 9: CASE (columna calculada)
-- Muestra el avance de cada usuario en sus retos y lo clasifica
-- como "Completado" o "En progreso".
-- ===================================================================
SELECT u.NombreCompleto AS Usuario,
       r.NombreReto     AS Reto,
       pr.MontoActual,
       r.MontoObjetivo,
       CASE WHEN pr.Completado = 1 THEN 'Completado'
            ELSE 'En progreso'
       END AS Estado
FROM ProgresoRetos pr
INNER JOIN Usuarios u ON u.IdUsuario = pr.IdUsuario
INNER JOIN Retos    r ON r.IdReto    = pr.IdReto
ORDER BY u.NombreCompleto;
GO

-- ===================================================================
-- PUNTO 10: Reporte con varios JOIN y COUNT
-- Resumen de actividad en la comunidad: cuántas publicaciones y
-- cuántos comentarios ha hecho cada usuario.
-- ===================================================================
SELECT u.NombreCompleto                       AS Usuario,
       COUNT(DISTINCT p.IdPublicacion)        AS Publicaciones,
       COUNT(DISTINCT com.IdComentario)       AS Comentarios
FROM Usuarios u
LEFT JOIN Publicaciones p   ON p.IdUsuario   = u.IdUsuario
LEFT JOIN Comentarios   com ON com.IdUsuario = u.IdUsuario
GROUP BY u.NombreCompleto
ORDER BY Publicaciones DESC, Comentarios DESC;
GO
