// maleta-core.js - Núcleo de la clase (constructor, propiedades, init)

function MaletaCore(biblioteca) {
    return {
        biblioteca: biblioteca,
        colecciones: [],
        modalVisible: false,
        overlay: null,
        modal: null,
        listaContainer: null,
        discosGrid: null,

        init() {
            this.cargarColecciones();
            this.crearBoton();
            this.crearModal();
        },

        cargarColecciones() {
            const guardadas = localStorage.getItem('discoFresa_colecciones');
            if (guardadas) {
                this.colecciones = JSON.parse(guardadas);
            }
        },

        guardarColecciones() {
            localStorage.setItem('discoFresa_colecciones', JSON.stringify(this.colecciones));
        }
    };
}