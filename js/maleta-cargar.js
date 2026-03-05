// maleta-cargar.js - Carga de archivos de audio (carpetas y canciones sueltas)

function MaletaCargar(gestor) {
    return {
        cargarCarpeta() {
            const input = document.createElement('input');
            input.type = 'file';
            input.webkitdirectory = true;
            input.multiple = true;
            input.style.display = 'none';
            
            input.addEventListener('change', async (e) => {
                const files = Array.from(e.target.files);
                
                const audioFiles = files.filter(file => 
                    file.type.startsWith('audio/') || 
                    file.name.match(/\.(mp3|wav|ogg|m4a|flac)$/i)
                );
                
                if (audioFiles.length === 0) {
                    alert('No se encontraron archivos de audio en la carpeta');
                    return;
                }
                
                const loading = MaletaUtils.mostrarLoading('📀 Procesando archivos...');
                await gestor.biblioteca.procesarArchivos(audioFiles);
                MaletaUtils.ocultarLoading();
                gestor.cerrarModal();
            });
            
            document.body.appendChild(input);
            input.click();
            setTimeout(() => document.body.removeChild(input), 1000);
        },

        cargarCancionesSueltas() {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.accept = 'audio/*';
            input.style.display = 'none';
            
            input.addEventListener('change', async (e) => {
                const files = Array.from(e.target.files);
                
                if (files.length === 0) return;
                
                const loading = MaletaUtils.mostrarLoading('🎵 Procesando canciones...');
                await gestor.biblioteca.procesarArchivos(files);
                MaletaUtils.ocultarLoading();
                gestor.cerrarModal();
            });
            
            document.body.appendChild(input);
            input.click();
            setTimeout(() => document.body.removeChild(input), 1000);
        }
    };
}