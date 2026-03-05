// maleta-cargar-colecciones.js - VERSIÓN CORREGIDA

function MaletaCargarColecciones(gestor) {
    return {
        async cargarColeccionesDesdeCarpeta() {
            const input = document.createElement('input');
            input.type = 'file';
            input.webkitdirectory = true;
            input.style.display = 'none';
            
            input.addEventListener('change', async (e) => {
                const files = Array.from(e.target.files);
                const discos = files.filter(f => f.name.toLowerCase().endsWith('.disco'));
                
                if (discos.length === 0) {
                    alert('No se encontraron archivos .disco');
                    return;
                }
                
                gestor.discosGrid.innerHTML = '';
                
                for (const disco of discos) {
                    try {
                        const zip = new JSZip();
                        const contenido = await zip.loadAsync(disco);
                        
                        const nombreDisco = disco.name.replace('.disco', '');
                        let portadaUrl = 'assets/portada_fresa.jpg';
                        
                        if (contenido.files['portada.jpg']) {
                            const portadaBlob = await contenido.files['portada.jpg'].async('blob');
                            portadaUrl = URL.createObjectURL(portadaBlob);
                        }
                        
                        // Mostrar info del álbum
if (contenido.files['metadatos.json']) {
    try {
        const metadatosTexto = await contenido.files['metadatos.json'].async('string');
        const metadatos = JSON.parse(metadatosTexto);
        
        if (metadatos.length > 0) {
            const albumTitulo = document.getElementById('albumTitulo');
            const albumArtista = document.getElementById('albumArtista');
            const albumAnno = document.getElementById('albumAnno');
            
            if (albumTitulo) albumTitulo.textContent = metadatos[0].album || metadatos[0].titulo || 'Álbum';
            if (albumArtista) albumArtista.textContent = metadatos[0].artista || 'Artista';
            if (albumAnno) albumAnno.textContent = metadatos[0].año || '';
        }
    } catch (e) {
        console.warn('No se pudieron leer los metadatos del álbum');
    }
}
                        
                        const discoElement = document.createElement('div');
                        discoElement.style.cssText = `
                            cursor: pointer;
                            text-align: center;
                            width: 120px;
                            margin-bottom: 10px;
                        `;
                        
                        discoElement.addEventListener('click', async () => {
                            try {
                                const arrayBuffer = await disco.arrayBuffer();
                                const zip = new JSZip();
                                const contenido = await zip.loadAsync(arrayBuffer);
                                
                                const archivosAudio = Object.keys(contenido.files)
                                    .filter(name => name.startsWith('audio/') && !name.endsWith('/'));
                                
                                const audioFiles = [];
                                for (const nombreArchivo of archivosAudio) {
                                    const archivoZip = contenido.files[nombreArchivo];
                                    const buffer = await archivoZip.async('arrayBuffer');
                                    const nombreOriginal = nombreArchivo.split('/').pop();
                                    const file = new File([buffer], nombreOriginal, { type: 'audio/mpeg' });
                                    audioFiles.push(file);
                                }
                                
                                await window.biblioteca.procesarArchivos(audioFiles);
                                
                                if (contenido.files['portada.jpg']) {
                                    const portadaBlob = await contenido.files['portada.jpg'].async('blob');
                                    const portadaUrl = URL.createObjectURL(portadaBlob);
                                    
                                    const nuevasCanciones = window.biblioteca.canciones.slice(-audioFiles.length);
                                    nuevasCanciones.forEach(cancion => {
                                        cancion.caratula = portadaUrl;
                                    });
                                    
                                    const cuadradoPortada = document.getElementById('cuadradoPortadaPrincipal');
                                    if (cuadradoPortada) {
                                        cuadradoPortada.innerHTML = `<img src="${portadaUrl}" style="width: 100%; height: 100%; object-fit: cover;">`;
                                    }
                                }
                                
                                window.biblioteca.actualizarLista();
                                window.gestorColecciones.cerrarModal();
                                
                            } catch (error) {
                                console.error('Error:', error);
                                alert('Error al cargar el disco');
                            }
                        });
                        
                        discoElement.innerHTML = `
                            <div style="width: 120px; height: 120px; border-radius: 8px; overflow: hidden; border: 2px solid #e0e0e0;">
                                <img src="${portadaUrl}" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <div style="font-size: 11px; font-weight: bold; margin-top: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${nombreDisco}">
                                ${nombreDisco}
                            </div>
                        `;
                        
                        gestor.discosGrid.appendChild(discoElement);
                    } catch (error) {
                        console.error('Error con disco:', disco.name, error);
                    }
                }
            });
            
            document.body.appendChild(input);
            input.click();
            setTimeout(() => document.body.removeChild(input), 1000);
        }
    };
}
