// config.js - Configuración centralizada de Disco Fresa

const CONFIG = {
    // Tiempos (en milisegundos)
    TIMING: {
        FADE_OUT_STOP: 9000,      // Fade out al pulsar STOP
        CROSSFADE_ANTICIPACION: 8000,  // Segundos antes del final para iniciar crossfade
        CROSSFADE_FADE_OUT: 10000,       // Duración del fade out en crossfade
        CROSSFADE_FADE_IN: 3000,         // Duración del fade in en crossfade
        STOP_STEPS: 90,           // Pasos para el fade de stop
        CROSSFADE_OUT_STEPS: 100, // Pasos para fade out de crossfade
        CROSSFADE_IN_STEPS: 30,   // Pasos para fade in de crossfade
    },
    
    // Audio
    AUDIO: {
        RPM_BASE: 45,
        PITCH_MIN: 0.90,
        PITCH_MAX: 1.10,
        PITCH_DEFAULT: 1.0,
        VOLUMEN_DEFAULT: 70,
        GANANCIA_DEFAULT: 0,
        EQ_DEFAULT: 0,
    },
    
    // Frecuencias del ecualizador
    EQ: {
        LOW_FREQ: 250,
        MID_FREQ: 2000,
        HIGH_FREQ: 5000,
        MID_Q: 1,
        GANANCIA_MIN: -12,
        GANANCIA_MAX: 12,
    },
    
    // Posición del punto de progreso en el disco
    DISCO_PROGRESS: {
        LEFT: '75%',      // Posición desde la izquierda
        WIDTH: '25%',     // Ancho del área de progreso
    },
    
    // Selectores DOM
    SELECTORS: {
        PLATOS: [1, 2],
        AUDIO: (n) => `audio${n}`,
        DISCO: (n) => `disco${n}`,
        PLAY_BTN: (n) => `play${n}`,
        STOP_BTN: (n) => `stop${n}`,
        FILE_INPUT: (n) => `file${n}`,
        INFO_TRACK: (n) => `infoTrack${n}`,
        LABEL: (n) => `label${n}`,
        GAIN: (n) => `gain${n}`,
        GAIN_VAL: (n) => `gain${n}-val`,
        GAIN_FILL: (n) => `gain${n}-fill`,
        VOL: (n) => `vol${n}`,
        VOL_VAL: (n) => `vol${n}-val`,
        VOL_FILL: (n) => `vol${n}-fill`,
        EQ_LOW: (n) => `eq${n}-low`,
        EQ_MID: (n) => `eq${n}-mid`,
        EQ_HIGH: (n) => `eq${n}-high`,
        EQ_LOW_VAL: (n) => `eq${n}-low-val`,
        EQ_MID_VAL: (n) => `eq${n}-mid-val`,
        EQ_HIGH_VAL: (n) => `eq${n}-high-val`,
        EQ_LOW_FILL: (n) => `eq${n}-low-fill`,
        EQ_MID_FILL: (n) => `eq${n}-mid-fill`,
        EQ_HIGH_FILL: (n) => `eq${n}-high-fill`,
        PITCH: (n) => `pitch${n}`,
        PITCH_VAL: (n) => `pitch${n}-val`,
        PITCH_FILL: (n) => `pitch${n}-fill`,
        RPM_DISPLAY: (n) => `rpm${n}`,
        PROGRESS_BAR: (n) => `progress-bar${n}`,
        PROGRESS_FILL: (n) => `progress-fill${n}`,
        PROGRESS_CURRENT: (n) => `progress-current${n}`,
        PROGRESS_TOTAL: (n) => `progress-total${n}`,
        DISCO_PROGRESS_CONTAINER: (n) => `discoProgress${n}`,
        DISCO_PROGRESS_POINT: (n) => `discoProgressPoint${n}`,
    }
};

// Exportar para usar en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
