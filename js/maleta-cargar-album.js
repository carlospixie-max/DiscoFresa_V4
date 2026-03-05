// maleta-cargar-album.js - Cargar archivo .disco completo

function MaletaCargarAlbum(gestor) {
    return {
        cargarAlbum() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.disco';
            input.style.display = 'none';
            
            input.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                try {
                    const loading = MaletaUtils.mostrarLoading('📀 Cargando álbum...');
                    
                    const zip = new JSZip();
                    const contenido = await zip.loadAsync(file);
                    
                    // Leer metadatos
                    const metadatosFile = contenido.files['metadatos.json'];
                    if (!metadatosFile) throw new Error('No es un archivo .disco válido');
                    
                    const metadatosTexto = await metadatosFile.async('string');
                    const metadatos = JSON.parse(metadatosTexto);
                    
                    // Leer orden
                    let orden = [];
                    if (contenido.files['orden.json']) {
                        const ordenTexto = await contenido.files['orden.json'].async('string');
                        orden = JSON.parse(ordenTexto);
                    }
                    
                    // Extraer archivos de audio
                    const canciones = [];
                    const archivosAudio = Object.keys(contenido.files)
                        .filter(name => name.startsWith('audio/') && !name.endsWith('/'));
                    
                    for (const nombreArchivo of archivosAudio) {
                        const archivoZip = contenido.files[nombreArchivo];
                        const arrayBuffer = await archivoZip.async('arrayBuffer');
                        
                        const nombreOriginal = nombreArchivo.split('/').pop();
                        const archivo = new File([arrayBuffer], nombreOriginal, { type: 'audio/mpeg' });
                        
                        const metadata = metadatos.find(m => m.archivoNombre === nombreOriginal) || {
                            nombre: nombreOriginal.replace('.mp3', ''),
                            tipo: 'MP3',
                            duracion: '0:00'
                        };
                        
                        canciones.push({
                            id: Date.now() + Math.random(),
                            nombre: metadata.nombre,
                            archivo: archivo,
                            url: URL.createObjectURL(archivo),
                            tipo: metadata.tipo || 'MP3',
                            duracion: metadata.duracion || '0:00',
                            titulo: metadata.titulo,
                            artista: metadata.artista,
                            album: metadata.album,
                            año: metadata.año,
                            caratula: metadata.caratula
                        });
                    }
                    
                    // Reordenar según orden.json
                    if (orden.length === canciones.length) {
                        const cancionesReordenadas = [];
                        orden.forEach(index => {
                            cancionesReordenadas.push(canciones[index]);
                        });
                        gestor.biblioteca.canciones = cancionesReordenadas;
                    } else {
                        gestor.biblioteca.canciones = canciones;
                    }
                    
                    gestor.biblioteca.actualizarLista();
                    
                    // Mostrar portada
                    const cuadradoPortada = document.getElementById('cuadradoPortadaPrincipal');
                    if (cuadradoPortada) {
                        if (contenido.files['portada.jpg']) {
                            const portadaBlob = await contenido.files['portada.jpg'].async('blob');
                            const portadaUrl = URL.createObjectURL(portadaBlob);
                            cuadradoPortada.innerHTML = `<img src="${portadaUrl}" style="width: 100%; height: 100%; object-fit: cover;">`;
                        } else {
                            cuadradoPortada.innerHTML = `<img src="assets/portada_fresa.jpg" style="width: 100%; height: 100%; object-fit: cover;">`;
                        }
                    }
                    
                    MaletaUtils.ocultarLoading();
                    gestor.cerrarModal();
                    
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error al cargar el álbum');
                    MaletaUtils.ocultarLoading();
                }
            });
            
            document.body.appendChild(input);
            input.click();
            setTimeout(() => document.body.removeChild(input), 1000);
        }
    };
}