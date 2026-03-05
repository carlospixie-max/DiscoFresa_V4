# 🍓 DISCO FRESA

Reproductor de audio dual con estilo vinilo. Desarrollado por Carlos Sánchez Sanz.

**Versión:** 2.1  
**Fecha:** 1 de marzo de 2026  
**Contacto:** carlospixie@gmail.com  
**GitHub:** [@carlospixie-max](https://github.com/carlospixie-max)
https://carlospixie-max.github.io/disco-fresa-v2/

---

## 📝 Descripción

**Disco Fresa** es un reproductor de música con interfaz de tocadiscos. Permite manejar dos platos independientes, cada uno con sus propios controles de reproducción, volumen, ecualizador y pitch. Incluye una biblioteca musical ("maleta de discos") y un modo automático para reproducción continua.

Funciona como Progressive Web App (PWA): se puede instalar en el dispositivo y usarla sin la interfaz del navegador.

---

## ✨ Características

- **Dos platos** independientes con controles PLAY/STOP
- **Controles por plato:**
  - Volumen
  - Ganancia (-12dB a +12dB)
  - Ecualizador de 3 bandas (LOW, MID, HIGH)
  - Pitch (velocidad, 0.90x a 1.10x)
- **Visualización decorativa de RPM** (45 RPM base)
- **Barra de progreso** con navegación por clic
- **Punto de progreso** interactivo en el borde del disco
- **Carga de archivos:**
  - Arrastrar y soltar directamente en los platos
  - Arrastrar y soltar múltiples archivos a la biblioteca
- **Biblioteca musical** ("Maleta de discos"):
  - Lista de canciones con miniaturas de carátulas (si están en metadatos)
  - Reordenar canciones arrastrándolas
  - Eliminar canciones individualmente o limpiar toda la biblioteca
- **Modo Automático:**
  - Reproducción secuencial de toda la biblioteca
  - Alterna automáticamente entre los dos platos
  - Precarga la siguiente canción mientras suena la actual
- **PWA**: instalable en móviles y escritorio

---

## 🚀 Tecnologías

- HTML5
- CSS3 (animaciones, flexbox, grid)
- JavaScript ES6+ (clases, módulos)
- Web Audio API (procesamiento de audio en tiempo real)
- jsmediatags (lectura de metadatos ID3 para carátulas)
- PWA (manifest.json)

---

## 📁 Estructura del proyecto

```
disco-fresa/
├── Index.html
├── manifest.json
├── icon-128x128.png
├── css/
│   └── styles.css
├── js/
│   ├── config.js
│   ├── biblioteca.js
│   ├── app.js
│   └── main.js
└── README.md
```

---

## 🎮 Cómo usar

### Cargar música
- Arrastra archivos de audio al área **"Maleta de discos"** (centro)
- O arrastra archivos directamente a cualquiera de los **platos**
- También puedes hacer clic en el botón superior 📀 de cada plato para seleccionar un archivo

### Reproducir
- Pulsa **PLAY** en el plato que quieras reproducir
- El disco comenzará a girar y se mostrará el tiempo transcurrido

### Detener
- **Primer click en STOP:** fade out suave de 9 segundos
- **Segundo click en STOP (mientras está parado):** reset a 0
- **Segundo click en STOP (durante el fade):** parada inmediata

### Navegar por la canción
- Haz clic en la **barra de progreso** inferior para saltar a otro punto
- O arrastra el **punto amarillo** en el borde del disco

### Ajustar sonido
Cada plato tiene sus propios controles:
- **Volumen:** de 0 a 100
- **Ganancia:** de -12 a +12 dB
- **Ecualizador:** LOW (250 Hz), MID (2000 Hz), HIGH (5000 Hz)
- **Pitch:** de 0.90 a 1.10 (afecta velocidad y tono)

### Biblioteca
- Las canciones aparecen en la maleta central con su número, nombre, formato y duración
- Si el archivo tiene carátula incrustada, se muestra una miniatura
- Para **reordenar**, arrastra una canción y suéltala entre otras
- Para **eliminar una canción**, haz clic en 🗑️
- Botón **"Limpiar"** para vaciar toda la biblioteca

### Modo Automático
1. Mueve el interruptor de **Manual** a **Auto** (en el centro)
2. La biblioteca comenzará a reproducirse desde la primera canción en el plato 1
3. Cuando termine, pasará automáticamente al plato 2 con la siguiente canción
4. El sistema precarga la siguiente mientras suena la actual
5. Para salir, vuelve a poner el interruptor en Manual

### PWA (instalación)
- En Chrome/Edge: aparece un icono en la barra de direcciones para instalar
- En Safari: usar "Compartir" > "Agregar a pantalla de inicio"
- Una vez instalada, se abre sin interfaz de navegador (modo standalone)

---

## ⚙️ Configuración

El archivo `js/config.js` centraliza todos los parámetros ajustables:

```javascript
TIMING: {
    FADE_OUT_STOP: 9000,      // Duración del fade al pulsar STOP (ms)
    STOP_STEPS: 90             // Pasos para el fade
}

AUDIO: {
    RPM_BASE: 45,              // RPM base (se multiplica por pitch)
    PITCH_MIN: 0.90,
    PITCH_MAX: 1.10,
    VOLUMEN_DEFAULT: 70
}

EQ: {
    LOW_FREQ: 250,             // Frecuencia para banda baja
    MID_FREQ: 2000,            // Frecuencia para banda media
    HIGH_FREQ: 5000,           // Frecuencia para banda alta
    MID_Q: 1                    // Factor Q para filtro peaking
}
```

---

## 👨‍💻 Autor

**Carlos Sánchez Sanz**  
📧 carlospixie@gmail.com  
🐙 [github.com/carlospixie-max](https://github.com/carlospixie-max)

---

🍓 **Hecho con fresa y código** 🍓
