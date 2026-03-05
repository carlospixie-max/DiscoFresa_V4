// maleta-utils.js - Funciones auxiliares

const MaletaUtils = {
    // Convertir archivo a base64
    convertirABase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    // Mostrar mensaje de carga temporal
    mostrarLoading(mensaje = 'Procesando...') {
        const div = document.createElement('div');
        div.id = 'maletaLoading';
        div.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10001;
        `;
        div.innerHTML = mensaje;
        document.body.appendChild(div);
        return div;
    },

    // Ocultar mensaje de carga
    ocultarLoading() {
        const loading = document.getElementById('maletaLoading');
        if (loading) loading.remove();
    },

    // Crear elemento con estilos
    crearElemento(tag, estilos = {}, contenido = '') {
        const el = document.createElement(tag);
        Object.assign(el.style, estilos);
        if (contenido) el.innerHTML = contenido;
        return el;
    },

    // Formatear fecha
    formatearFecha() {
        return new Date().toLocaleDateString('es-ES');
    },

    // Sanitizar nombre de archivo
    sanitizarNombre(nombre) {
        return nombre.replace(/[^a-z0-9]/gi, '_');
    },

    // Leer archivo como arrayBuffer
    leerArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    },

    // Leer archivo como texto
    leerTexto(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    },

    // Crear barra de progreso
    crearBarraProgreso(total, mensaje = 'Procesando...') {
        const overlay = document.createElement('div');
        overlay.id = 'maletaProgreso';
        overlay.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10001;
            min-width: 300px;
            text-align: center;
        `;
        
        overlay.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: bold;">${mensaje}</div>
            <div style="width: 100%; height: 20px; background: #f0f0f0; border-radius: 10px; overflow: hidden;">
                <div id="progresoBarra" style="width: 0%; height: 100%; background: #ff9900; transition: width 0.3s;"></div>
            </div>
            <div id="progresoTexto" style="margin-top: 10px; font-size: 12px; color: #666;">0/${total}</div>
        `;
        
        document.body.appendChild(overlay);
        
        return {
            actualizar: (actual) => {
                const barra = document.getElementById('progresoBarra');
                const texto = document.getElementById('progresoTexto');
                const porcentaje = (actual / total) * 100;
                if (barra) barra.style.width = porcentaje + '%';
                if (texto) texto.textContent = `${actual}/${total}`;
            },
            cerrar: () => {
                const el = document.getElementById('maletaProgreso');
                if (el) el.remove();
            }
        };
    }
};