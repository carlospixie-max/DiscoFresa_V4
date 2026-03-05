// ==========================================
// CLASE PLATO - Encapsula todo lo relacionado con un plato
// ==========================================

class Plato {
    constructor(numero, audioContext) {
        this.numero = numero;
        this.audioContext = audioContext;
        this.audio = document.getElementById(CONFIG.SELECTORS.AUDIO(numero));
        
        // Estado
        this.isPlaying = false;
        this.stopCount = 0;
        this.isDragging = false;
        this.stopFadeOut = null;
        
        // Nodos de audio
        this.nodes = {};
        
        // Elementos DOM cacheados
        this.elements = {};
        this.cacheElements();
        
        // Inicializar
        this.initAudioNodes();
        this.initEvents();
        this.initProgressBar();
        this.initDiscoProgress();
    }
    
    cacheElements() {
        const s = CONFIG.SELECTORS;
        this.elements = {
            disco: document.getElementById(s.DISCO(this.numero)),
            playBtn: document.getElementById(s.PLAY_BTN(this.numero)),
            stopBtn: document.getElementById(s.STOP_BTN(this.numero)),
            fileInput: document.getElementById(s.FILE_INPUT(this.numero)),
            infoTrack: document.getElementById(s.INFO_TRACK(this.numero)),
            label: document.getElementById(s.LABEL(this.numero)),
            gain: document.getElementById(s.GAIN(this.numero)),
            gainVal: document.getElementById(s.GAIN_VAL(this.numero)),
            gainFill: document.getElementById(s.GAIN_FILL(this.numero)),
            vol: document.getElementById(s.VOL(this.numero)),
            volVal: document.getElementById(s.VOL_VAL(this.numero)),
            volFill: document.getElementById(s.VOL_FILL(this.numero)),
            eqLow: document.getElementById(s.EQ_LOW(this.numero)),
            eqMid: document.getElementById(s.EQ_MID(this.numero)),
            eqHigh: document.getElementById(s.EQ_HIGH(this.numero)),
            eqLowVal: document.getElementById(s.EQ_LOW_VAL(this.numero)),
            eqMidVal: document.getElementById(s.EQ_MID_VAL(this.numero)),
            eqHighVal: document.getElementById(s.EQ_HIGH_VAL(this.numero)),
            eqLowFill: document.getElementById(s.EQ_LOW_FILL(this.numero)),
            eqMidFill: document.getElementById(s.EQ_MID_FILL(this.numero)),
            eqHighFill: document.getElementById(s.EQ_HIGH_FILL(this.numero)),
            pitch: document.getElementById(s.PITCH(this.numero)),
            pitchVal: document.getElementById(s.PITCH_VAL(this.numero)),
            pitchFill: document.getElementById(s.PITCH_FILL(this.numero)),
            rpmDisplay: document.getElementById(s.RPM_DISPLAY(this.numero)),
            progressBar: document.getElementById(s.PROGRESS_BAR(this.numero)),
            progressFill: document.getElementById(s.PROGRESS_FILL(this.numero)),
            progressCurrent: document.getElementById(s.PROGRESS_CURRENT(this.numero)),
            progressTotal: document.getElementById(s.PROGRESS_TOTAL(this.numero)),
            discoProgressContainer: document.getElementById(s.DISCO_PROGRESS_CONTAINER(this.numero)),
            discoProgressPoint: document.getElementById(s.DISCO_PROGRESS_POINT(this.numero)),
            btnSuperior: document.getElementById(`btn-superior${this.numero}`),
        };
    }
    
    initAudioNodes() {
        try {
            this.nodes.source = this.audioContext.createMediaElementSource(this.audio);
            this.nodes.gain = this.audioContext.createGain();
            this.nodes.lowFilter = this.audioContext.createBiquadFilter();
            this.nodes.midFilter = this.audioContext.createBiquadFilter();
            this.nodes.highFilter = this.audioContext.createBiquadFilter();
            
            // Configurar filtros EQ
            const eq = CONFIG.EQ;
            this.nodes.lowFilter.type = 'lowshelf';
            this.nodes.lowFilter.frequency.value = eq.LOW_FREQ;
            this.nodes.lowFilter.gain.value = CONFIG.AUDIO.EQ_DEFAULT;
            
            this.nodes.midFilter.type = 'peaking';
            this.nodes.midFilter.frequency.value = eq.MID_FREQ;
            this.nodes.midFilter.Q.value = eq.MID_Q;
            this.nodes.midFilter.gain.value = CONFIG.AUDIO.EQ_DEFAULT;
            
            this.nodes.highFilter.type = 'highshelf';
            this.nodes.highFilter.frequency.value = eq.HIGH_FREQ;
            this.nodes.highFilter.gain.value = CONFIG.AUDIO.EQ_DEFAULT;
            
            // Conectar cadena de audio
            this.nodes.source.connect(this.nodes.gain);
            this.nodes.gain.connect(this.nodes.lowFilter);
            this.nodes.lowFilter.connect(this.nodes.midFilter);
            this.nodes.midFilter.connect(this.nodes.highFilter);
            this.nodes.highFilter.connect(this.audioContext.destination);
            
            // Valores iniciales
            this.nodes.gain.gain.value = 1;
            this.audio.volume = CONFIG.AUDIO.VOLUMEN_DEFAULT / 100;
            this.audio.playbackRate = CONFIG.AUDIO.PITCH_DEFAULT;
            
        } catch (error) {
            console.error(`Error inicializando audio del plato ${this.numero}:`, error);
        }
    }
    
    initEvents() {
        // Botón superior (cargar archivo)
        this.elements.btnSuperior.addEventListener('click', () => {
            this.elements.fileInput.click();
        });
        
        // Input de archivo
        this.elements.fileInput.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                this.cargarArchivo(e.target.files[0]);
            }
        });
        
        // Play
        this.elements.playBtn.addEventListener('click', () => this.togglePlay());
        
        // Stop
        this.elements.stopBtn.addEventListener('click', () => this.handleStop());
        
        // Ganancia
        this.elements.gain.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            this.nodes.gain.gain.value = Math.pow(10, val / 20);
            this.elements.gainVal.textContent = val.toFixed(1);
            this.updateFill(this.elements.gainFill, val, CONFIG.EQ.GANANCIA_MIN, CONFIG.EQ.GANANCIA_MAX);
        });
        
        // Volumen
        this.elements.vol.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            this.audio.volume = val / 100;
            this.elements.volVal.textContent = val;
            this.elements.volFill.style.width = val + '%';
            this.elements.volFill.style.left = '0%';
        });
        
        // EQ Low
        this.elements.eqLow.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            this.nodes.lowFilter.gain.value = val;
            this.elements.eqLowVal.textContent = val.toFixed(1);
            this.updateEQFill(this.elements.eqLowFill, val);
        });
        
        // EQ Mid
        this.elements.eqMid.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            this.nodes.midFilter.gain.value = val;
            this.elements.eqMidVal.textContent = val.toFixed(1);
            this.updateEQFill(this.elements.eqMidFill, val);
        });
        
        // EQ High
        this.elements.eqHigh.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            this.nodes.highFilter.gain.value = val;
            this.elements.eqHighVal.textContent = val.toFixed(1);
            this.updateEQFill(this.elements.eqHighFill, val);
        });
        
        // Pitch
        this.elements.pitch.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            this.audio.playbackRate = val;
            const porcentaje = ((val - 1) * 100).toFixed(1);
            const signo = porcentaje > 0 ? '+' : '';
            this.elements.pitchVal.textContent = `${signo}${porcentaje}`;
            
            const rpm = (CONFIG.AUDIO.RPM_BASE * val).toFixed(1);
            this.elements.rpmDisplay.textContent = `${rpm} RPM`;
            
            this.updatePitchFill(val);
        });
        
        // Evento cuando termina la canción
        this.audio.addEventListener('ended', () => {
            this.isPlaying = false;
            this.elements.playBtn.classList.remove('reproduciendo');
            this.elements.disco.classList.remove('girando');
            this.stopCount = 0;
            this.elements.stopBtn.classList.remove('parando');
            if (this.stopFadeOut) {
                clearInterval(this.stopFadeOut);
                this.stopFadeOut = null;
            }
            
            // Notificar a la biblioteca
            window.dispatchEvent(new CustomEvent('cancionTermino', { 
                detail: { plato: this.numero } 
            }));
        });
    }
    
    async togglePlay() {
        if (!this.audio.src) return;
        
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
            this.elements.playBtn.classList.remove('reproduciendo');
            this.elements.disco.classList.remove('girando');
            this.stopCount = 0;
            
            window.dispatchEvent(new CustomEvent('cancionPauso', { 
                detail: { plato: this.numero } 
            }));
        } else {
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            await this.audio.play();
            this.isPlaying = true;
            this.elements.playBtn.classList.add('reproduciendo');
            this.elements.disco.classList.add('girando');
            this.stopCount = 0;
            
            window.dispatchEvent(new CustomEvent('cancionEmpezo', { 
                detail: { plato: this.numero } 
            }));
        }
    }
    
    handleStop() {
        if (!this.audio.src) return;
        
        this.stopCount++;
        
        if (this.isPlaying && !this.stopFadeOut) {
            // Primer click: fade out suave
            this.fadeOut(CONFIG.TIMING.FADE_OUT_STOP);
        } else if (!this.isPlaying && this.stopCount === 2) {
            // Segundo click cuando está parado: resetear a 0
            this.audio.currentTime = 0;
            this.stopCount = 0;
        } else if (this.stopFadeOut && this.stopCount === 2) {
            // Segundo click durante fade: parar inmediatamente
            clearInterval(this.stopFadeOut);
            this.stopFadeOut = null;
            this.audio.pause();
            this.audio.currentTime = 0;
            this.audio.playbackRate = CONFIG.AUDIO.PITCH_DEFAULT;
            this.isPlaying = false;
            this.elements.playBtn.classList.remove('reproduciendo');
            this.elements.disco.classList.remove('girando');
            this.elements.stopBtn.classList.remove('parando');
            
            // Resetear pitch UI
            this.elements.pitch.value = CONFIG.AUDIO.PITCH_DEFAULT;
            this.elements.pitch.dispatchEvent(new Event('input'));
            this.updatePitchFill(CONFIG.AUDIO.PITCH_DEFAULT);
            
            this.stopCount = 0;
        }
    }
    
    fadeOut(duracion) {
        const audio = this.audio;
        const btn = this.elements.playBtn;
        const stopBtn = this.elements.stopBtn;
        const disco = this.elements.disco;
        
        const originalRate = audio.playbackRate;
        const steps = CONFIG.TIMING.STOP_STEPS;
        let step = 0;
        const stepTime = duracion / steps;
        
        const originalGain = this.nodes.gain.gain.value;
        
        stopBtn.classList.add('parando');
        
        this.stopFadeOut = setInterval(() => {
            step++;
            const progress = step / steps;
            
            audio.playbackRate = originalRate * (1 - progress * 0.8);
            this.nodes.gain.gain.value = originalGain * (1 - progress);
            
            if (step >= steps) {
                clearInterval(this.stopFadeOut);
                this.stopFadeOut = null;
                stopBtn.classList.remove('parando');
                
                audio.pause();
                audio.currentTime = 0;
                
                // Restaurar valores
                audio.playbackRate = originalRate;
                this.nodes.gain.gain.value = originalGain;
                
                this.isPlaying = false;
                btn.classList.remove('reproduciendo');
                disco.classList.remove('girando');
                this.stopCount = 0;
                
                window.dispatchEvent(new CustomEvent('cancionTermino', { 
                    detail: { plato: this.numero } 
                }));
            }
        }, stepTime);
    }
    
    cargarArchivo(archivo) {
        // Limpiar fade anterior si existe
        if (this.stopFadeOut) {
            clearInterval(this.stopFadeOut);
            this.stopFadeOut = null;
            this.elements.stopBtn.classList.remove('parando');
        }
        
        const url = URL.createObjectURL(archivo);
        this.audio.src = url;
        this.audio.load();
        
        // Actualizar info
        this.elements.infoTrack.innerHTML = ` ${archivo.name}`;
        
        // Resetear estado
        this.isPlaying = false;
        this.elements.playBtn.classList.remove('reproduciendo');
        this.elements.disco.classList.remove('girando');
        this.stopCount = 0;
        
        // Resetear pitch
        this.elements.pitch.value = CONFIG.AUDIO.PITCH_DEFAULT;
        this.elements.pitch.dispatchEvent(new Event('input'));
        this.updatePitchFill(CONFIG.AUDIO.PITCH_DEFAULT);
        
        // Resetear punto de progreso
        this.elements.discoProgressPoint.style.right = '0%';
        
        // Limpiar imagen anterior
        this.elements.label.innerHTML = '🍓';
        
        // Extraer metadatos
        if (typeof jsmediatags !== 'undefined') {
            jsmediatags.read(archivo, {
                onSuccess: (tag) => {
                    if (tag.tags.picture) {
                        const picture = tag.tags.picture;
                        const base64 = this.arrayBufferToBase64(picture.data);
                        this.elements.label.innerHTML = 
                            `<img src="data:${picture.format};base64,${base64}" style="width: 100%; height: 100%; object-fit: cover;">`;
                    }
                }
            });
        }
        
        // NOTIFICACIÓN A BIBLIOTECA ELIMINADA - causaba duplicados
        // La carga a biblioteca se maneja desde biblioteca.js directamente
    }
    
    initProgressBar() {
        // Click en barra de progreso
        this.elements.progressBar.addEventListener('click', (e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            if (this.audio.duration) {
                this.audio.currentTime = pos * this.audio.duration;
            }
        });
    }
    
    initDiscoProgress() {
        const container = this.elements.discoProgressContainer;
        const punto = this.elements.discoProgressPoint;
        
        const updatePosition = (clientX) => {
            const rect = container.getBoundingClientRect();
            let pos = (clientX - rect.left) / rect.width;
            pos = Math.max(0, Math.min(1, pos));
            
            // Invertir: izquierda = final, derecha = inicio
            const audioProgress = 1 - pos;
            
            punto.style.right = (audioProgress * 100) + '%';
            
            if (this.audio.duration) {
                this.audio.currentTime = audioProgress * this.audio.duration;
            }
            
            this.elements.progressFill.style.width = (audioProgress * 100) + '%';
            this.elements.progressCurrent.textContent = this.formatTime(this.audio.currentTime);
        };
        
        const handleStart = (e) => {
            if (!this.audio.src || !this.audio.duration) return;
            this.isDragging = true;
            container.classList.add('dragging');
            e.preventDefault();
            
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            if (clientX) updatePosition(clientX);
        };
        
        const handleMove = (e) => {
            if (!this.isDragging) return;
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            if (clientX) updatePosition(clientX);
        };
        
        const handleEnd = () => {
            if (this.isDragging) {
                this.isDragging = false;
                container.classList.remove('dragging');
            }
        };
        
        // Eventos
        container.addEventListener('mousedown', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        
        container.addEventListener('touchstart', handleStart, { passive: false });
        document.addEventListener('touchmove', handleMove, { passive: false });
        document.addEventListener('touchend', handleEnd);
        
        container.addEventListener('click', (e) => {
            if (!this.audio.src || !this.audio.duration) return;
            updatePosition(e.clientX);
            e.stopPropagation();
        });
    }
    
    updateProgress() {
        if (this.audio.duration && !this.isDragging) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            
            this.elements.progressFill.style.width = progress + '%';
            this.elements.progressCurrent.textContent = this.formatTime(this.audio.currentTime);
            this.elements.progressTotal.textContent = this.formatTime(this.audio.duration);
            
            // Actualizar punto en el disco
            this.elements.discoProgressPoint.style.right = progress + '%';
        }
    }
    
    // Utilidades UI
updateFill(element, val, min, max) {
    const rango = max - min; // 24
    const porcentaje = ((val - min) / rango); // 0 a 1
    
    // Para controles centrados (0 en medio)
    if (val === 0) {
        element.style.left = '50%';
        element.style.width = '0%';
    } else if (val > 0) {
        // De 50% a la derecha
        const ancho = (val / max) * 50; // proporción de la mitad derecha
        element.style.left = '50%';
        element.style.width = ancho + '%';
    } else {
        // De 50% a la izquierda
        const ancho = (Math.abs(val) / Math.abs(min)) * 50; // proporción de la mitad izquierda
        element.style.left = (50 - ancho) + '%';
        element.style.width = ancho + '%';
    }
}
    
    updateEQFill(element, val) {
        if (val >= 0) {
            const ancho = (val / 12) * 50;
            element.style.left = '50%';
            element.style.width = ancho + '%';
        } else {
            const ancho = (Math.abs(val) / 12) * 50;
            element.style.left = (50 - ancho) + '%';
            element.style.width = ancho + '%';
        }
    }
    
    updatePitchFill(val) {
        const fill = this.elements.pitchFill;
        const max = CONFIG.AUDIO.PITCH_MAX;
        const min = CONFIG.AUDIO.PITCH_MIN;
        const MAX_WIDTH = 50;
        
        if (val >= 1.0) {
            let ancho = ((val - 1.0) / (max - 1.0)) * MAX_WIDTH;
            ancho = Math.min(ancho, MAX_WIDTH);
            fill.style.left = '50%';
            fill.style.width = ancho + '%';
        } else {
            let ancho = ((1.0 - val) / (1.0 - min)) * MAX_WIDTH;
            ancho = Math.min(ancho, MAX_WIDTH);
            fill.style.left = (50 - ancho) + '%';
            fill.style.width = ancho + '%';
        }
    }
    
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
    
    // Métodos públicos para la biblioteca
    reproducir() {
        if (!this.isPlaying) {
            this.elements.playBtn.click();
        }
    }
    
    pausar() {
        if (this.isPlaying) {
            this.elements.playBtn.click();
        }
    }
    
    cargarCancion(cancion) {
        if (cancion.archivo) {
            this.cargarArchivo(cancion.archivo);
        }
    }
    
    getTiempoRestante() {
        if (!this.audio.duration) return 0;
        return this.audio.duration - this.audio.currentTime;
    }
    
    hacerFadeIn(duracion) {
        const steps = 30;
        const stepTime = duracion / steps;
        const volumenFinal = parseInt(this.elements.vol.value) / 100;
        const incremento = volumenFinal / steps;
        let step = 0;
        
        this.audio.volume = 0;
        
        const interval = setInterval(() => {
            step++;
            const nuevoVolumen = Math.min(volumenFinal, this.audio.volume + incremento);
            this.audio.volume = nuevoVolumen;
            
            if (step >= steps || nuevoVolumen >= volumenFinal) {
                clearInterval(interval);
                this.audio.volume = volumenFinal;
            }
        }, stepTime);
    }
    
    hacerFadeOut(duracion, callback) {
        const volumenInicial = this.audio.volume;
        const steps = 100;
        const stepTime = duracion / steps;
        const decremento = volumenInicial / steps;
        let step = 0;
        
        const interval = setInterval(() => {
            step++;
            const nuevoVolumen = Math.max(0, this.audio.volume - decremento);
            this.audio.volume = nuevoVolumen;
            
            if (step >= steps || nuevoVolumen <= 0) {
                clearInterval(interval);
                if (callback) callback();
            }
        }, stepTime);
    }
}

// ==========================================
// CLASE PRINCIPAL - ConsolaDJ
// ==========================================

class ConsolaDJ {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.platos = {};
        
        // Crear instancias de platos
        CONFIG.SELECTORS.PLATOS.forEach(num => {
            this.platos[num] = new Plato(num, this.audioContext);
        });
        
        // Inicializar contexto suspendido (política de autoplay)
        this.audioContext.suspend();
        
        // Iniciar loop de actualización de progreso
        this.iniciarUpdateLoop();
    }
    
    iniciarUpdateLoop() {
        const update = () => {
            Object.values(this.platos).forEach(plato => plato.updateProgress());
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    }
    
    getPlato(numero) {
        return this.platos[numero];
    }
}
