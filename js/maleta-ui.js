// maleta-ui.js - Interfaz de usuario (botones, modal, grids)

function MaletaUI(gestor) {
    return {
        crearBoton() {
            const contenedor = document.querySelector('#bibliotecaMusical > div:nth-child(4)');
            if (!contenedor) return;
            
            const boton = MaletaUtils.crearElemento('button', {
                background: '#ff9900',
                color: 'white',
                border: 'none',
                padding: '5px 12px',
                borderRadius: '15px',
                cursor: 'pointer',
                marginLeft: '10px',
                fontSize: '11px'
            }, '📚 Colecciones');
            
            boton.id = 'btnColecciones';
            boton.addEventListener('click', () => gestor.abrirModal());
            contenedor.appendChild(boton);
        },

        crearModal() {
            const overlay = MaletaUtils.crearElemento('div', {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: '0',
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none',
                zIndex: '9999'
            });
            overlay.id = 'modalColeccionesOverlay';

            const modal = MaletaUtils.crearElemento('div', {
                background: 'white',
                borderRadius: '24px',
                padding: '40px',
                width: '90%',
                maxWidth: '1400px',
                height: '90vh',
                maxHeight: '900px',
                overflowY: 'auto',
                transform: 'scale(0.95)',
                transition: 'transform 0.3s ease',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            });
            modal.id = 'modalColecciones';

            // Título
            const titulo = MaletaUtils.crearElemento('h2', {
                color: '#ff4444',
                fontSize: '18px',
                margin: '0 0 20px 0',
                textAlign: 'center',
                letterSpacing: '1px'
            }, '📚 GESTOR DE COLECCIONES');
            modal.appendChild(titulo);

            // Sección botones álbum
            const contenedorAlbumes = MaletaUtils.crearElemento('div', {
                display: 'flex',
                gap: '10px',
                marginBottom: '15px'
            });

            const btnGuardarAlbum = MaletaUtils.crearElemento('button', {
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                flex: '1',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'opacity 0.2s'
            }, '💾 Guardar álbum');
            btnGuardarAlbum.addEventListener('mouseenter', () => btnGuardarAlbum.style.opacity = '0.9');
            btnGuardarAlbum.addEventListener('mouseleave', () => btnGuardarAlbum.style.opacity = '1');
            btnGuardarAlbum.addEventListener('click', () => gestor.guardarAlbum());

            const btnCargarAlbum = MaletaUtils.crearElemento('button', {
                background: '#8b5cf6',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                flex: '1',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'opacity 0.2s'
            }, '📂 Cargar álbum');
            btnCargarAlbum.addEventListener('mouseenter', () => btnCargarAlbum.style.opacity = '0.9');
            btnCargarAlbum.addEventListener('mouseleave', () => btnCargarAlbum.style.opacity = '1');
            btnCargarAlbum.addEventListener('click', () => gestor.cargarAlbum());

            contenedorAlbumes.appendChild(btnGuardarAlbum);
            contenedorAlbumes.appendChild(btnCargarAlbum);
            modal.appendChild(contenedorAlbumes);

            // Sección carga archivos
            const contenedorCarga = MaletaUtils.crearElemento('div', {
                display: 'flex',
                gap: '10px',
                marginBottom: '15px'
            });

            const btnCargarCarpeta = MaletaUtils.crearElemento('button', {
                background: '#ff9900',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                flex: '1',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'opacity 0.2s'
            }, '📁 Cargar carpeta');
            btnCargarCarpeta.addEventListener('mouseenter', () => btnCargarCarpeta.style.opacity = '0.9');
            btnCargarCarpeta.addEventListener('mouseleave', () => btnCargarCarpeta.style.opacity = '1');
            btnCargarCarpeta.addEventListener('click', () => gestor.cargarCarpeta());

            const btnCargarCanciones = MaletaUtils.crearElemento('button', {
                background: '#ff9900',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                flex: '1',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'opacity 0.2s'
            }, '🎵 Cargar canciones');
            btnCargarCanciones.addEventListener('mouseenter', () => btnCargarCanciones.style.opacity = '0.9');
            btnCargarCanciones.addEventListener('mouseleave', () => btnCargarCanciones.style.opacity = '1');
            btnCargarCanciones.addEventListener('click', () => gestor.cargarCancionesSueltas());

            const btnCargarColecciones = MaletaUtils.crearElemento('button', {
                background: '#ff9900',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                flex: '1',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'opacity 0.2s'
            }, '📚 Cargar colecciones');
            btnCargarColecciones.addEventListener('mouseenter', () => btnCargarColecciones.style.opacity = '0.9');
            btnCargarColecciones.addEventListener('mouseleave', () => btnCargarColecciones.style.opacity = '1');
            btnCargarColecciones.addEventListener('click', () => gestor.cargarColeccionesDesdeCarpeta());

            contenedorCarga.appendChild(btnCargarCarpeta);
            contenedorCarga.appendChild(btnCargarCanciones);
            contenedorCarga.appendChild(btnCargarColecciones);
            modal.appendChild(contenedorCarga);

            // Botón colección local
            const btnNueva = MaletaUtils.crearElemento('button', {
                background: '#ff4444',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                width: '100%',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '20px',
                transition: 'opacity 0.2s'
            }, '➕ Guardar en colección (local)');
            btnNueva.addEventListener('mouseenter', () => btnNueva.style.opacity = '0.9');
            btnNueva.addEventListener('mouseleave', () => btnNueva.style.opacity = '1');
            btnNueva.addEventListener('click', () => gestor.nuevaColeccion());
            modal.appendChild(btnNueva);

            // Lista colecciones
            gestor.listaContainer = MaletaUtils.crearElemento('div', {
                marginBottom: '20px',
                maxHeight: '400px',
                overflowY: 'auto'
            });
            gestor.listaContainer.id = 'listaColecciones';
            modal.appendChild(gestor.listaContainer);

            // Título discos
            const discosTitulo = MaletaUtils.crearElemento('div', {
                fontSize: '14px',
                color: '#ff4444',
                fontWeight: 'bold',
                margin: '20px 0 15px 0',
                textTransform: 'uppercase',
                letterSpacing: '1px'
            }, '📀 MI COLECCIÓN');
            modal.appendChild(discosTitulo);

            // Grid discos
            gestor.discosGrid = MaletaUtils.crearElemento('div', {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '15px',
                marginBottom: '20px',
                maxHeight: '400px',
                overflowY: 'auto',
                padding: '10px',
                background: '#f8f9fa',
                borderRadius: '12px'
            });
            gestor.discosGrid.id = 'discosGrid';
            modal.appendChild(gestor.discosGrid);

            // Botón cerrar
            const btnCerrar = MaletaUtils.crearElemento('button', {
                background: '#f0f0f0',
                color: '#666',
                border: 'none',
                padding: '10px',
                borderRadius: '12px',
                width: '100%',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'opacity 0.2s'
            }, 'Cerrar');
            btnCerrar.addEventListener('mouseenter', () => btnCerrar.style.opacity = '0.9');
            btnCerrar.addEventListener('mouseleave', () => btnCerrar.style.opacity = '1');
            btnCerrar.addEventListener('click', () => gestor.cerrarModal());
            modal.appendChild(btnCerrar);

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            gestor.overlay = overlay;
            gestor.modal = modal;

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) gestor.cerrarModal();
            });
        },

        abrirModal() {
            gestor.modalVisible = true;
            gestor.actualizarLista();
            gestor.overlay.style.pointerEvents = 'all';
            gestor.overlay.style.opacity = '1';
            gestor.modal.style.transform = 'scale(1)';
        },

        cerrarModal() {
            gestor.modalVisible = false;
            gestor.overlay.style.opacity = '0';
            gestor.modal.style.transform = 'scale(0.95)';
            setTimeout(() => {
                if (!gestor.modalVisible) {
                    gestor.overlay.style.pointerEvents = 'none';
                }
            }, 300);
        }
    };
}