// maleta-colecciones.js - Gestión de colecciones en localStorage

function MaletaColecciones(gestor) {
    return {
        actualizarLista() {
            if (!gestor.listaContainer) return;
            
            if (gestor.colecciones.length === 0) {
                gestor.listaContainer.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">No hay colecciones guardadas</div>';
                return;
            }
            
            let html = '';
            gestor.colecciones.forEach((coleccion, index) => {
                html += `
                    <div style="background: #f8f9fa; padding: 12px; margin: 8px 0; border-radius: 12px; border: 1px solid #dee2e6; display: flex; justify-content: space-between; align-items: center;">
                        <div style="flex: 1; cursor: pointer;" onclick="gestorColecciones.cargarColeccion(${index})">
                            <div style="font-weight: bold; color: #333;">${coleccion.nombre}</div>
                            <div style="font-size: 11px; color: #666;">${coleccion.canciones.length} canciones - ${coleccion.fecha}</div>
                        </div>
                        <button onclick="gestorColecciones.eliminarColeccion(${index})" style="background: transparent; color: #ff4444; border: none; cursor: pointer; font-size: 18px;">🗑️</button>
                    </div>
                `;
            });
            
            gestor.listaContainer.innerHTML = html;
        },

        nuevaColeccion() {
            const nombre = prompt('Nombre de la colección:');
            if (!nombre) return;
            
            const canciones = gestor.biblioteca.canciones.map(c => ({
                id: c.id,
                nombre: c.nombre,
                archivo: c.archivo,
                url: c.url,
                tipo: c.tipo,
                duracion: c.duracion,
                caratula: c.caratula
            }));
            
            if (canciones.length === 0) {
                alert('No hay canciones en la maleta');
                return;
            }
            
            const coleccion = {
                id: Date.now().toString(),
                nombre: nombre,
                fecha: MaletaUtils.formatearFecha(),
                canciones: canciones
            };
            
            gestor.colecciones.push(coleccion);
            gestor.guardarColecciones();
            this.actualizarLista();
        },

        cargarColeccion(index) {
            const coleccion = gestor.colecciones[index];
            if (!coleccion) return;
            
            gestor.biblioteca.canciones = [];
            coleccion.canciones.forEach(c => {
                gestor.biblioteca.canciones.push(c);
            });
            
            gestor.biblioteca.actualizarLista();
            gestor.cerrarModal();
        },

        eliminarColeccion(index) {
            if (!confirm('¿Eliminar esta colección?')) return;
            gestor.colecciones.splice(index, 1);
            gestor.guardarColecciones();
            this.actualizarLista();
        }
    };
}