// maleta.js - Orquestador principal

class GestorColecciones {
    constructor(biblioteca) {
        // Inicializar con el core
        const core = MaletaCore(biblioteca);
        
        // Asignar propiedades básicas
        this.biblioteca = core.biblioteca;
        this.colecciones = core.colecciones;
        this.modalVisible = core.modalVisible;
        this.overlay = core.overlay;
        this.modal = core.modal;
        this.listaContainer = core.listaContainer;
        this.discosGrid = core.discosGrid;
        
        // Métodos del core
        this.cargarColecciones = core.cargarColecciones.bind(this);
        this.guardarColecciones = core.guardarColecciones.bind(this);
        this.init = core.init.bind(this);
        
        // UI
        const ui = MaletaUI(this);
        this.crearBoton = ui.crearBoton.bind(this);
        this.crearModal = ui.crearModal.bind(this);
        this.abrirModal = ui.abrirModal.bind(this);
        this.cerrarModal = ui.cerrarModal.bind(this);
        
        // Colecciones locales
        const colecciones = MaletaColecciones(this);
        this.actualizarLista = colecciones.actualizarLista.bind(this);
        this.nuevaColeccion = colecciones.nuevaColeccion.bind(this);
        this.cargarColeccion = colecciones.cargarColeccion.bind(this);
        this.eliminarColeccion = colecciones.eliminarColeccion.bind(this);
        
        // Carga de archivos
        const cargar = MaletaCargar(this);
        this.cargarCarpeta = cargar.cargarCarpeta.bind(this);
        this.cargarCancionesSueltas = cargar.cargarCancionesSueltas.bind(this);
        
        // Guardar álbum
        const guardar = MaletaGuardar(this);
        this.guardarAlbum = guardar.guardarAlbum.bind(this);
        
        // Cargar álbum
        const cargarAlbum = MaletaCargarAlbum(this);
        this.cargarAlbum = cargarAlbum.cargarAlbum.bind(this);
        
        // Cargar colecciones desde carpeta
        const cargarColecciones = MaletaCargarColecciones(this);
        this.cargarColeccionesDesdeCarpeta = cargarColecciones.cargarColeccionesDesdeCarpeta.bind(this);
        
        // Iniciar
        this.init();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (window.biblioteca) {
        window.gestorColecciones = new GestorColecciones(window.biblioteca);
    } else {
        const checkBiblioteca = setInterval(() => {
            if (window.biblioteca) {
                window.gestorColecciones = new GestorColecciones(window.biblioteca);
                clearInterval(checkBiblioteca);
            }
        }, 100);
    }
});