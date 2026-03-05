# 💿 .disco - El formato que organiza tu música en álbumes

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Licencia](https://img.shields.io/badge/licencia-CC%20BY--NC%204.0-green)
![Estado](https://img.shields.io/badge/estado-producción-success)

## 📋 Descripción

**.disco** es un formato de archivo contenedor para álbumes musicales que mantiene **canciones, carátulas y metadatos** en un solo archivo. A diferencia de los MP3 sueltos o los ZIP que hay que descomprimir, .disco se abre directamente en nuestro reproductor mostrando el álbum completo con su carátula y todas las canciones ordenadas.

### 🎯 El problema que soluciona

| Problema | Solución .disco |
|----------|-----------------|
| Los reproductores mezclan música con audios de WhatsApp, grabaciones y basura | ✅ Solo escanea archivos .disco (colecciones limpias) |
| Los álbumes descargados vienen en ZIP con archivos sueltos | ✅ Un archivo = un álbum completo |
| Las carátulas se pierden o hay que asociarlas manualmente | ✅ Carátula del álbum + carátulas individuales |
| El orden de las canciones se pierde al copiar | ✅ Orden guardado en playlist.json |
| Compartir un álbum son 15 archivos | ✅ Un solo archivo .disco |

---

## ✨ Características

### 🎨 Visual
- ✅ Muestra carátula del álbum al cargar
- ✅ Cada canción muestra su mini carátula (extraída de metadatos ID3)
- ✅ Interfaz limpia y responsive
- ✅ Galería visual de álbumes

### 🎵 Reproductor
- ✅ Reproduce MP3 directamente desde el .disco
- ✅ Controles: play/pausa, siguiente, anterior
- ✅ Detección automática de fin de canción
- ✅ Reproducción en segundo plano

### 📊 Organización
- ✅ Lista todas las canciones del álbum
- ✅ Extrae metadatos ID3 (título, artista, año, género)
- ✅ Reordenamiento por arrastre
- ✅ Guarda el orden personalizado en playlist.json
- ✅ Carga automática del orden guardado

### 📁 Formatos soportados
- ✅ Entrada: .disco (recomendado) y .zip
- ✅ Audio: MP3 (con metadatos ID3)
- ✅ Imágenes: JPG, PNG (carátulas)
- ✅ Metadatos: JSON (interno)

---

## 🚀 Cómo usar

### Instalación

1. Descarga el reproductor desde [nuestra web](https://discoformat.com)
2. Abre `index.html` en tu navegador
3. ¡Ya puedes cargar tus archivos .disco!

### Uso básico

```javascript
// 1. Selecciona un archivo .disco
const input = document.getElementById('archivoZip');
input.click();

// 2. El reproductor muestra automáticamente:
//    - Carátula del álbum
//    - Lista de canciones con mini carátulas
//    - Metadatos de cada canción

// 3. Reproduce haciendo clic en cualquier canción