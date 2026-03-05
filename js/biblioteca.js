// biblioteca.js - Módulo de biblioteca musical para Disco Fresa
// Versión 2.2 - Modo automático simplificado sin crossfade

class BibliotecaMusical {
    constructor() {
        this.canciones = [];
        this.cancionArrastrada = null;
        this.indiceArrastrado = null;
        this.modoAutomatico = false;
        this.indiceActual = 0;
        this.platoActivo = 1;
        this.platoIndices = { 1: null, 2: null };
        
        this.init();
    }
    
    init() {
        this.crearHTML();
        this.cacheElementos();
        this.initEventos();
        this.initPlatoDrop();
        this.initModoAutomatico();
        this.initEventosGlobales();
    }
    
    crearHTML() {
        if (document.getElementById('bibliotecaMusical')) return;
        
        const maleta = document.querySelector('.consola-maleta');
        if (!maleta) return;
        
const html = `
    <div id="bibliotecaMusical" style="margin: 15px 0; background: #f5f5f5; border-radius: 12px; padding: 15px; border: 1px solid #e0e0e0;">
        <div style="font-size: 14px; color: #ff4444; margin-bottom: 15px; font-weight: bold; text-align: center; text-transform: uppercase; letter-spacing: 1px;">
            MALETA DE DISCOS
        </div>
        
        <!-- DOS CUADRADOS -->
        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
            <!-- Cuadrado izquierdo - Portada -->
            <div id="cuadradoPortadaPrincipal" style="width: 200px; height: 200px; background: #f0f0f0; border: 2px solid #e0e0e0; border-radius: 10px; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer;">
                <span style="color: #999; font-size: 12px;">portada</span>
            </div>
            
            <!-- Cuadrado derecho - Información del álbum -->
            <div id="cuadradoInfoAlbum" style="width: 200px; height: 200px; background: #f0f0f0; border: 2px solid #e0e0e0; border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; padding: 10px; box-sizing: border-box;">
                <div style="font-weight: bold; color: #ff4444; margin-bottom: 5px;">ÁLBUM</div>
                <div id="albumTitulo" style="font-size: 14px; text-align: center; font-weight: bold;">-</div>
                <div id="albumArtista" style="font-size: 12px; text-align: center; color: #666;">-</div>
                <div id="albumAnno" style="font-size: 11px; text-align: center; color: #999; margin-top: 5px;">-</div>
            </div>
        </div>
        
        <input type="file" id="fileInputBiblioteca" style="display: none;" multiple accept="audio/*">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 10px 0; font-size: 12px;">
            <span><strong><span id="totalCancionesBib">0</span> canciones</strong></span>
            <div style="display: flex; gap: 8px;">
                <button id="btnMaleta" style="background: #ff9900; color: white; border: none; padding: 5px 12px; border-radius: 15px; cursor: pointer; font-size: 11px;">📁 Maleta</button>
                <button id="limpiarBiblioteca" style="background: #ff4444; color: white; border: none; padding: 5px 12px; border-radius: 15px; cursor: pointer; font-size: 11px;">🗑️ Limpiar</button>
            </div>
        </div>
        
        <div id="songListBiblioteca" style="background: white; border-radius: 10px; padding: 10px; max-height: 400px; min-height: 300px; overflow-y: auto; border: 1px solid #ddd;">
            <div style="text-align: center; color: #999; padding: 20px;">
                📀 Arrastra archivos para comenzar
            </div>
        </div>
        
        <p style="font-size: 11px; color: #666; margin-top: 8px; text-align: center;">
            <small>Arrastra canciones a los platos para cargarlas</small>
        </p>
    </div>
`;
        
        const creditos = maleta.querySelector('.maleta-footer');
        if (creditos) {
            creditos.insertAdjacentHTML('beforebegin', html);
        } else {
            maleta.insertAdjacentHTML('beforeend', html);
        }
    }
    
    cacheElementos() {
        this.elements = {
            fileInput: document.getElementById('fileInputBiblioteca'),
            songList: document.getElementById('songListBiblioteca'),
            totalSpan: document.getElementById('totalCancionesBib'),
            limpiarBtn: document.getElementById('limpiarBiblioteca'),
            btnMaleta: document.getElementById('btnMaleta')
        };
    }
    
    initEventos() {
        const { fileInput, limpiarBtn, btnMaleta } = this.elements;
        
        document.addEventListener('dragover', (e) => e.preventDefault());
        document.addEventListener('drop', (e) => e.preventDefault());
        
        // Evento para el botón Maleta
        if (btnMaleta) {
            btnMaleta.addEventListener('click', () => {
                if (window.gestorColecciones) {
                    window.gestorColecciones.abrirModal();
                }
            });
        }
        
        fileInput.addEventListener('change', (e) => {
            this.procesarArchivos(Array.from(e.target.files));
            fileInput.value = '';
        });
        
        limpiarBtn?.addEventListener('click', () => this.limpiar());
    }
    
    initEventosGlobales() {
        window.addEventListener('cancionTermino', (e) => {
            console.log('Canción terminó en plato:', e.detail.plato);
            if (this.modoAutomatico) {
                this.siguienteCancion(e.detail.plato);
            }
            this.actualizarLista();
        });
        
            window.addEventListener('cancionEmpezo', () => {
                this.actualizarLista();
        });
    
            window.addEventListener('cancionPauso', () => {
                this.actualizarLista();
        });
    }
  
    initPlatoDrop() {
        [1, 2].forEach(num => {
            const plato = document.querySelector(`.consola[data-plato="${num}"] .plato`);
            if (!plato) return;
            
            plato.addEventListener('dragover', (e) => {
                e.preventDefault();
                plato.style.opacity = '0.8';
                plato.style.border = '3px solid #ff9900';
            });
            
            plato.addEventListener('dragleave', () => {
                plato.style.opacity = '1';
                plato.style.border = '2px solid #333';
            });
            
            plato.addEventListener('drop', (e) => {
                e.preventDefault();
                plato.style.opacity = '1';
                plato.style.border = '2px solid #333';
                
                const index = parseInt(e.dataTransfer.getData('text/plain'));
                if (!isNaN(index) && this.canciones[index]) {
                    this.cargarEnPlato(this.canciones[index], num);
                }
            });
        });
    }
    
    handleDrop(e) {
        e.preventDefault();
        
        const index = e.dataTransfer.getData('text/plain');
        
        if (index) {
            const cancionIndex = parseInt(index);
            if (this.canciones[cancionIndex] && !this.canciones.some(c => c.id === this.canciones[cancionIndex].id)) {
                this.canciones.push(this.canciones[cancionIndex]);
                this.actualizarLista();
            }
        } else {
            const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('audio/'));
            if (files.length) this.procesarArchivos(files);
        }
    }
    
    async procesarArchivos(files) {
        const archivosAudio = files.filter(f => f.type.startsWith('audio/'));
        
        for (const file of archivosAudio) {
            const cancion = await this.crearCancion(file);
            this.canciones.push(cancion);
        }
        
        this.actualizarLista();
    }
    
    crearCancion(file) {
        return new Promise((resolve) => {
            const url = URL.createObjectURL(file);
            const tempAudio = new Audio();
            tempAudio.src = url;
            
            let caratula = null;
            let caratulaLista = false;
            
            if (typeof jsmediatags !== 'undefined') {
                try {
                    jsmediatags.read(file, {
                        onSuccess: (tag) => {
                            if (tag.tags?.picture) {
                                caratula = this.arrayBufferToBase64(tag.tags.picture.data);
                                caratula = `data:${tag.tags.picture.format};base64,${caratula}`;
                            }
                            caratulaLista = true;
                        },
                        onError: () => { caratulaLista = true; }
                    });
                } catch (e) {
                    caratulaLista = true;
                }
            } else {
                caratulaLista = true;
            }
            
            const completar = () => {
                const cancion = {
                    id: Date.now() + Math.random(),
                    nombre: file.name.replace(/\.[^/.]+$/, ""),
                    archivo: file,
                    url: url,
                    tipo: file.type.split('/')[1].toUpperCase(),
                    duracion: this.formatTime(tempAudio.duration),
                    caratula: caratula
                };
                URL.revokeObjectURL(url);
                resolve(cancion);
            };
            
            tempAudio.onloadedmetadata = () => {
                if (caratulaLista) completar();
                else setTimeout(completar, 300);
            };
            
            tempAudio.onerror = () => {
                const cancion = {
                    id: Date.now() + Math.random(),
                    nombre: file.name.replace(/\.[^/.]+$/, ""),
                    archivo: file,
                    url: url,
                    tipo: file.type.split('/')[1].toUpperCase(),
                    duracion: '--:--',
                    caratula: caratula
                };
                URL.revokeObjectURL(url);
                resolve(cancion);
            };
        });
    }
    
    actualizarLista() {
        const { songList, totalSpan } = this.elements;
        
        if (!songList) return;
        
        if (this.canciones.length === 0) {
            songList.innerHTML = `<div style="text-align: center; color: #999; padding: 20px;">📀 Arrastra archivos para comenzar</div>`;
            if (totalSpan) totalSpan.textContent = '0';
            return;
        }
        
            // OBTENER AUDIOS DESDE CONSOLADJ, NO DEL DOM
const plato1 = window.consolaDJ?.getPlato(1);
const plato2 = window.consolaDJ?.getPlato(2);
const audio1 = plato1?.audio;
const audio2 = plato2?.audio;
        
        let html = '';
        this.canciones.forEach((cancion, index) => {
            const style = this.getEstiloCancion(index, audio1, audio2);
            const miniatura = cancion.caratula 
                ? `<img src="${cancion.caratula}" style="width: 100%; height: 100%; object-fit: cover;">`
                : `<span style="font-size: 16px;">🎵</span>`;
            
            html += `
                <div class="song-item" draggable="true" 
                     data-index="${index}"
                     ondragstart="biblioteca.dragStart(event, ${index})"
                     ondragend="biblioteca.dragEnd(event)"
                     ondragover="biblioteca.dragOver(event)"
                     ondrop="biblioteca.dropSong(event, ${index})"
                     style="background: #f8f9fa; padding: 8px; margin: 6px 0; border-radius: 8px; border: 1px solid #dee2e6; display: flex; align-items: center; cursor: move; gap: 8px;">
                    
                    <span class="song-number" style="width: 24px; height: 24px; ${style.numero} color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; flex-shrink: 0;">
                        ${index + 1}
                    </span>
                    
                    <div style="width: 35px; height: 35px; background: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; border: 1px solid #ddd;">
                        ${miniatura}
                    </div>
                    
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-weight: bold; color: #333; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${cancion.nombre}">
                            ${cancion.nombre}
                        </div>
                        <div style="font-size: 11px; color: #666; display: flex; gap: 10px;">
                            <span>${cancion.tipo}</span>
                            <span>${cancion.duracion}</span>
                        </div>
                    </div>
                    
                    <button onclick="biblioteca.eliminarCancion(${index})" 
                            style="background: transparent; color: #ff4444; border: none; padding: 5px; cursor: pointer; font-size: 16px; flex-shrink: 0;">
                        🗑️
                    </button>
                </div>
            `;
        });
        
        songList.innerHTML = html;
        if (totalSpan) totalSpan.textContent = this.canciones.length;
    }
    
    getEstiloCancion(index, audio1, audio2) {
        const sonando1 = this.platoIndices[1] === index && audio1 && !audio1.paused && !audio1.ended;
        const sonando2 = this.platoIndices[2] === index && audio2 && !audio2.paused && !audio2.ended;
        
        if (sonando1 || sonando2) {
            return { numero: 'background: #ffd700;' }; // amarillo cuando suena
        }

        return { numero: 'background: #ff9900;' };
    }
    
    dragStart(e, index) {
        this.cancionArrastrada = this.canciones[index];
        this.indiceArrastrado = index;
        e.target.style.opacity = '0.5';
        e.dataTransfer.setData('text/plain', index.toString());
        e.dataTransfer.effectAllowed = 'move';
    }
    
    dragEnd(e) {
        e.target.style.opacity = '1';
    }
    
    dragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }
    
    dropSong(e, targetIndex) {
        e.preventDefault();
        
        if (this.indiceArrastrado === null || this.indiceArrastrado === targetIndex) return;
        
        const oldIndices = { ...this.platoIndices };
        
        const [removed] = this.canciones.splice(this.indiceArrastrado, 1);
        this.canciones.splice(targetIndex, 0, removed);
        
        const actualizarIndice = (old) => {
            if (old === null) return null;
            if (old === this.indiceArrastrado) return targetIndex;
            if (old > this.indiceArrastrado && old <= targetIndex) return old - 1;
            if (old < this.indiceArrastrado && old >= targetIndex) return old + 1;
            return old;
        };
        
        this.platoIndices[1] = actualizarIndice(oldIndices[1]);
        this.platoIndices[2] = actualizarIndice(oldIndices[2]);
        
        if (this.modoAutomatico) {
            this.indiceActual = actualizarIndice(this.indiceActual);
        }
        
        this.indiceArrastrado = null;
        this.actualizarLista();
    }
    
    cargarEnPlato(cancion, platoNum) {
        const plato = window.consolaDJ.getPlato(platoNum);
        if (!plato || !cancion.archivo) {
            console.error(`No se puede cargar: plato ${platoNum} no disponible o sin archivo`);
            return;
        }
        
        // Verificar si la canción ya está en la biblioteca para evitar duplicados
        const yaExiste = this.canciones.some(c => c.id === cancion.id);
        if (!yaExiste) {
            // Solo añadir si no existe (por si acaso)
            this.canciones.push(cancion);
            this.actualizarLista();
        }
        
        plato.cargarArchivo(cancion.archivo);
        
        const infoTrack = document.getElementById(`infoTrack${platoNum}`);
        const label = document.getElementById(`label${platoNum}`);
        
        if (infoTrack) infoTrack.innerHTML = ` ${cancion.nombre}`;
        
        if (label && cancion.caratula) {
            label.innerHTML = `<img src="${cancion.caratula}" style="width: 100%; height: 100%; object-fit: cover;" draggable="false">`;
        }
        const index = this.canciones.findIndex(c => c.id === cancion.id);
        this.platoIndices[platoNum] = index;
        console.log(`Cargada "${cancion.nombre}" en plato ${platoNum}, índice ${index}`);
    
        // Si estamos en modo automático y el usuario carga un disco manualmente
        if (this.modoAutomatico) {
            // Este plato pasa a ser el siguiente en reproducirse
            this.platoActivo = platoNum;
            console.log(`Modo auto: disco manual cargado en plato ${platoNum}, será el siguiente en reproducirse`);
    }
}

    // ==================== MODO AUTOMÁTICO SIMPLIFICADO ====================
    
    initModoAutomatico() {
        const selector = document.getElementById('selectorModoRange');
        const thumb = document.getElementById('selectorModoThumb');
        const fill = document.getElementById('selectorModoFill');
        
        if (!selector) return;
        
        const actualizarUI = (modoAuto) => {
            if (modoAuto) {
                thumb.style.left = '100%';
                fill.style.width = '50%';
                fill.style.left = '50%';
            } else {
                thumb.style.left = '0%';
                fill.style.width = '50%';
                fill.style.left = '0';
            }
        };
        
        selector.addEventListener('input', (e) => {
            const valor = parseInt(e.target.value);
            const modoAuto = valor === 1;
            
            actualizarUI(modoAuto);
            
            if (this.modoAutomatico && !modoAuto) {
                this.modoAutomatico = false;
            } else if (!this.modoAutomatico && modoAuto) {
                this.modoAutomatico = true;
                if (this.canciones.length > 0) {
                    this.iniciarModoAutomatico();
                }
            }
        });
    }
    
    iniciarModoAutomatico() {
        console.log('🎵 INICIANDO MODO AUTOMÁTICO');
        
        this.indiceActual = 0;
        this.platoActivo = 1;
        
        // Limpiar ambos platos
        this.limpiarPlato(1);
        this.limpiarPlato(2);
        
        // Cargar primera canción en plato 1
        console.log(`Cargando canción 0 en plato 1: ${this.canciones[0].nombre}`);
        this.cargarEnPlato(this.canciones[0], 1);
        
        this.actualizarLista();
        
        // Reproducir plato 1
        setTimeout(() => {
            const plato1 = window.consolaDJ.getPlato(1);
            if (plato1) {
                console.log('Reproduciendo plato 1');
                plato1.reproducir();
            }
        }, 500);
    }
    
    siguienteCancion(platoQueTermino) {
        console.log(`\n=== SIGUIENTE CANCIÓN ===`);
        console.log(`Plato que terminó: ${platoQueTermino}`);
        console.log(`Índice actual antes: ${this.indiceActual}`);
        
        // Avanzar al siguiente índice
        this.indiceActual++;
        
        // Verificar si hay más canciones
        if (this.indiceActual >= this.canciones.length) {
            console.log('Fin de la colección');
            this.modoAutomatico = false;
            // Resetear UI del selector
            const selector = document.getElementById('selectorModoRange');
            const thumb = document.getElementById('selectorModoThumb');
            const fill = document.getElementById('selectorModoFill');
            if (selector) selector.value = 0;
            if (thumb) thumb.style.left = '0%';
            if (fill) {
                fill.style.width = '50%';
                fill.style.left = '0';
            }
            return;
        }
        
        // Determinar el otro plato (el que va a reproducir)
        const otroPlato = platoQueTermino === 1 ? 2 : 1;
        
        console.log(`Nuevo índice: ${this.indiceActual}`);
        console.log(`Canción a reproducir: ${this.canciones[this.indiceActual].nombre}`);
        console.log(`Se reproducirá en plato: ${otroPlato}`);
        
        // Cargar la siguiente canción en el plato que va a reproducir
        this.cargarEnPlato(this.canciones[this.indiceActual], otroPlato);
        
        // Reproducir el otro plato
        const platoObj = window.consolaDJ.getPlato(otroPlato);
        if (platoObj) {
            setTimeout(() => {
                console.log(`Iniciando reproducción en plato ${otroPlato}`);
                platoObj.reproducir();
            }, 100);
        }
        
        // === PRECARGA: Calcular índice del siguiente disco y cargarlo en el plato que terminó ===
        const siguienteIndice = this.indiceActual + 1;
        
        if (siguienteIndice < this.canciones.length) {
            console.log(`Programando precarga en plato ${platoQueTermino} para índice ${siguienteIndice} en 5 segundos`);
            
            setTimeout(() => {
                // Solo cargar si seguimos en modo automático y no se ha cambiado manualmente
                if (this.modoAutomatico && this.platoIndices[platoQueTermino] !== siguienteIndice) {
                    console.log(`Precargando "${this.canciones[siguienteIndice].nombre}" en plato ${platoQueTermino}`);
                    this.cargarEnPlato(this.canciones[siguienteIndice], platoQueTermino);
                }
            }, 5000); // 5 segundos de delay
        }
        
        this.platoActivo = otroPlato;
        this.actualizarLista();
    }
    
    limpiarPlato(numero) {
        const plato = window.consolaDJ.getPlato(numero);
        if (plato) {
            plato.audio.pause();
            plato.audio.currentTime = 0;
            plato.audio.src = '';
            plato.isPlaying = false;
            plato.stopCount = 0;
            if (plato.stopFadeOut) {
                clearInterval(plato.stopFadeOut);
                plato.stopFadeOut = null;
            }
            
            plato.elements.disco.classList.remove('girando');
            plato.elements.playBtn.classList.remove('reproduciendo');
            plato.elements.stopBtn.classList.remove('parando');
            plato.elements.infoTrack.innerHTML = '<span class="sin-cargar">❌ Sin disco</span>';
            plato.elements.label.innerHTML = '🎵';
        }
        
        this.platoIndices[numero] = null;
    }
    
    // ==================== LIMPIEZA ====================
    
    limpiar() {
        if (this.canciones.length === 0) return;
        if (!confirm('¿Eliminar todas las canciones?')) return;
        
        this.canciones.forEach(c => {
            if (c.url) URL.revokeObjectURL(c.url);
        });
        
        this.canciones = [];
        this.platoIndices = { 1: null, 2: null };
        this.indiceActual = 0;
        
        this.actualizarLista();
    }
    
    eliminarCancion(index) {
        if (!confirm('¿Eliminar esta canción de la maleta?')) return;
        
        const cancion = this.canciones[index];
        if (cancion?.url) URL.revokeObjectURL(cancion.url);
        
        [1, 2].forEach(plato => {
            if (this.platoIndices[plato] === index) {
                this.platoIndices[plato] = null;
            } else if (this.platoIndices[plato] > index) {
                this.platoIndices[plato]--;
            }
        });
        
        this.canciones.splice(index, 1);
        
        if (this.modoAutomatico) {
            if (this.canciones.length === 0) {
                this.indiceActual = 0;
            } else {
                this.indiceActual = Math.min(this.indiceActual, this.canciones.length - 1);
            }
        }
        
        this.actualizarLista();
    }
    
    // ==================== UTILIDADES ====================
    
    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.biblioteca = new BibliotecaMusical();
});
