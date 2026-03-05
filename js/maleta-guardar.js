// maleta-guardar.js - Guardar álbum en formato .disco

function MaletaGuardar(gestor) {
    return {
        async guardarAlbum() {
            const cancionesActuales = gestor.biblioteca.canciones;
            
            if (cancionesActuales.length === 0) {
                alert('No hay canciones en la maleta');
                return;
            }
            
            // Crear modal personalizado
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            `;
            
            const modal = document.createElement('div');
            modal.style.cssText = `
                background: white;
                border-radius: 24px;
                padding: 24px;
                max-width: 450px;
                width: 90%;
                box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            `;
            
            // Título
            const titulo = document.createElement('h2');
            titulo.innerHTML = '💾 GUARDAR ÁLBUM';
            titulo.style.cssText = `
                color: #10b981;
                font-size: 18px;
                margin: 0 0 20px 0;
                text-align: center;
                letter-spacing: 1px;
            `;
            modal.appendChild(titulo);
            
            // Campo nombre
            const labelNombre = document.createElement('div');
            labelNombre.style.cssText = `
                font-size: 14px;
                color: #333;
                margin-bottom: 5px;
                font-weight: bold;
            `;
            labelNombre.textContent = 'Nombre del álbum:';
            modal.appendChild(labelNombre);
            
            const inputNombre = document.createElement('input');
            inputNombre.type = 'text';
            inputNombre.value = 'Álbum sin título';
            inputNombre.style.cssText = `
                width: 100%;
                padding: 10px;
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                font-size: 14px;
                margin-bottom: 20px;
                box-sizing: border-box;
            `;
            modal.appendChild(inputNombre);
            
            // Campo artista
            const labelArtista = document.createElement('div');
            labelArtista.style.cssText = `
                font-size: 14px;
                color: #333;
                margin-bottom: 5px;
                font-weight: bold;
            `;
            labelArtista.textContent = 'Artista:';
            modal.appendChild(labelArtista);
            
            const inputArtista = document.createElement('input');
            inputArtista.type = 'text';
            inputArtista.value = cancionesActuales[0]?.artista || 'Artista desconocido';
            inputArtista.style.cssText = `
                width: 100%;
                padding: 10px;
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                font-size: 14px;
                margin-bottom: 20px;
                box-sizing: border-box;
            `;
            modal.appendChild(inputArtista);
            
            // Sección portada
            const labelPortada = document.createElement('div');
            labelPortada.style.cssText = `
                font-size: 14px;
                color: #333;
                margin-bottom: 5px;
                font-weight: bold;
            `;
            labelPortada.textContent = 'Portada:';
            modal.appendChild(labelPortada);
            
            // Cuadrado de portada
            const cuadroPortada = document.createElement('div');
            cuadroPortada.style.cssText = `
                width: 120px;
                height: 120px;
                background: white;
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                margin: 10px 0 20px 0;
                position: relative;
                overflow: hidden;
            `;
            
            // Contenedor interior
            const contenedorInterior = document.createElement('div');
            contenedorInterior.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                width: 100%;
            `;
            
            const xContainer = document.createElement('div');
            xContainer.style.cssText = `
                position: relative;
                width: 40px;
                height: 40px;
                margin-bottom: 8px;
            `;
            
            const linea1 = document.createElement('div');
            linea1.style.cssText = `
                position: absolute;
                width: 100%;
                height: 2px;
                background: #ff4444;
                top: 50%;
                left: 0;
                transform: translateY(-50%) rotate(45deg);
            `;
            
            const linea2 = document.createElement('div');
            linea2.style.cssText = `
                position: absolute;
                width: 100%;
                height: 2px;
                background: #ff4444;
                top: 50%;
                left: 0;
                transform: translateY(-50%) rotate(-45deg);
            `;
            
            xContainer.appendChild(linea1);
            xContainer.appendChild(linea2);
            contenedorInterior.appendChild(xContainer);
            
            const textoPortada = document.createElement('span');
            textoPortada.style.cssText = `
                font-size: 11px;
                color: #666;
                text-align: center;
            `;
            textoPortada.textContent = 'haz clic para seleccionar';
            contenedorInterior.appendChild(textoPortada);
            
            cuadroPortada.appendChild(contenedorInterior);
            
            let portadaSeleccionada = null;
            let portadaBase64 = null;
            
            cuadroPortada.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.style.display = 'none';
                
                input.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        portadaSeleccionada = file;
                        
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            portadaBase64 = e.target.result;
                            
                            cuadroPortada.innerHTML = '';
                            cuadroPortada.style.background = `url('${e.target.result}') center/cover`;
                            
                            const btnQuitar = document.createElement('div');
                            btnQuitar.style.cssText = `
                                position: absolute;
                                top: 5px;
                                right: 5px;
                                width: 25px;
                                height: 25px;
                                background: rgba(255,68,68,0.9);
                                color: white;
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                cursor: pointer;
                                font-size: 16px;
                                z-index: 10;
                            `;
                            btnQuitar.innerHTML = '✕';
                            btnQuitar.addEventListener('click', (e) => {
                                e.stopPropagation();
                                portadaSeleccionada = null;
                                portadaBase64 = null;
                                cuadroPortada.innerHTML = '';
                                cuadroPortada.style.background = 'white';
                                cuadroPortada.appendChild(contenedorInterior);
                            });
                            
                            cuadroPortada.appendChild(btnQuitar);
                        };
                        reader.readAsDataURL(file);
                    }
                });
                
                document.body.appendChild(input);
                input.click();
                setTimeout(() => document.body.removeChild(input), 1000);
            });
            
            modal.appendChild(cuadroPortada);
            
            // Sección PDF
            const labelPDF = document.createElement('div');
            labelPDF.style.cssText = `
                font-size: 14px;
                color: #333;
                margin-bottom: 5px;
                font-weight: bold;
            `;
            labelPDF.textContent = 'Libreto:';
            modal.appendChild(labelPDF);
            
            const contenedorPDF = document.createElement('div');
            contenedorPDF.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 20px;
            `;
            
            const btnPDF = document.createElement('button');
            btnPDF.innerHTML = '📄 Añadir libreto PDF';
            btnPDF.style.cssText = `
                background: #f0f0f0;
                color: #333;
                border: 2px solid #e0e0e0;
                padding: 10px 15px;
                border-radius: 10px;
                font-size: 13px;
                cursor: pointer;
                flex: 1;
            `;
            
            let pdfSeleccionado = null;
            
            const textoPDF = document.createElement('span');
            textoPDF.style.cssText = `
                font-size: 12px;
                color: #10b981;
                min-width: 80px;
            `;
            
            btnPDF.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.pdf';
                input.style.display = 'none';
                
                input.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        pdfSeleccionado = file;
                        textoPDF.innerHTML = '✓ libreto.pdf';
                    }
                });
                
                document.body.appendChild(input);
                input.click();
                setTimeout(() => document.body.removeChild(input), 1000);
            });
            
            const btnQuitarPDF = document.createElement('button');
            btnQuitarPDF.innerHTML = '✕';
            btnQuitarPDF.style.cssText = `
                background: #ff4444;
                color: white;
                border: none;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            btnQuitarPDF.addEventListener('click', () => {
                pdfSeleccionado = null;
                textoPDF.innerHTML = '';
            });
            
            contenedorPDF.appendChild(btnPDF);
            contenedorPDF.appendChild(textoPDF);
            contenedorPDF.appendChild(btnQuitarPDF);
            modal.appendChild(contenedorPDF);
            
            // Botones acción
            const contenedorBotones = document.createElement('div');
            contenedorBotones.style.cssText = `
                display: flex;
                gap: 10px;
                margin-top: 20px;
            `;
            
            const btnGuardar = document.createElement('button');
            btnGuardar.innerHTML = 'GUARDAR';
            btnGuardar.style.cssText = `
                background: #10b981;
                color: white;
                border: none;
                padding: 12px;
                border-radius: 12px;
                flex: 2;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
            `;
            
            const btnCancelar = document.createElement('button');
            btnCancelar.innerHTML = 'CANCELAR';
            btnCancelar.style.cssText = `
                background: #f0f0f0;
                color: #666;
                border: none;
                padding: 12px;
                border-radius: 12px;
                flex: 1;
                font-size: 14px;
                cursor: pointer;
            `;
            
            contenedorBotones.appendChild(btnGuardar);
            contenedorBotones.appendChild(btnCancelar);
            modal.appendChild(contenedorBotones);
            
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
            
            btnGuardar.addEventListener('click', async () => {
                const nombreAlbum = inputNombre.value.trim() || 'Álbum sin título';
                const artistaAlbum = inputArtista.value.trim() || 'Artista desconocido';
                
                try {
                    const loading = MaletaUtils.mostrarLoading('💾 Guardando álbum...');
                    
                    const zip = new JSZip();
                    const audioFolder = zip.folder('audio');
                    const metadatos = [];
                    
                    for (let i = 0; i < cancionesActuales.length; i++) {
                        const cancion = cancionesActuales[i];
                        
                        if (cancion.archivo) {
                            const arrayBuffer = await MaletaUtils.leerArrayBuffer(cancion.archivo);
                            audioFolder.file(cancion.archivo.name, arrayBuffer);
                        }
                    
                        metadatos.push({
                            id: cancion.id,
                            nombre: cancion.nombre,
                            archivoNombre: cancion.archivo.name,
                            tipo: cancion.tipo,
                            duracion: cancion.duracion,
                            titulo: cancion.titulo || cancion.nombre,
                            artista: cancion.artista || artistaAlbum,
                            album: cancion.album || nombreAlbum,
                            año: cancion.año || new Date().getFullYear()
                        });
                    }
                    
                    const vistaPrevia = {
                        nombre: nombreAlbum,
                        artista: artistaAlbum,
                        portada: portadaBase64,
                        totalCanciones: cancionesActuales.length,
                        fechaCreacion: new Date().toISOString(),
                        id: Date.now().toString()
                    };
                    
                    zip.file('vistaprevia.json', JSON.stringify(vistaPrevia));
                    
                    if (portadaSeleccionada) {
                        const arrayBuffer = await MaletaUtils.leerArrayBuffer(portadaSeleccionada);
                        zip.file('portada.jpg', arrayBuffer);
                    }
                    
                    if (pdfSeleccionado) {
                        const arrayBuffer = await MaletaUtils.leerArrayBuffer(pdfSeleccionado);
                        zip.file('libreto.pdf', arrayBuffer);
                    }
                    
                    zip.file('metadatos.json', JSON.stringify(metadatos, null, 2));
                    
                    const orden = cancionesActuales.map((_, index) => index);
                    zip.file('orden.json', JSON.stringify(orden, null, 2));
                    
                    const contenido = await zip.generateAsync({ type: 'blob' });
                    const url = URL.createObjectURL(contenido);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${MaletaUtils.sanitizarNombre(nombreAlbum)}.disco`;
                    a.click();
                    URL.revokeObjectURL(url);
                    
                    MaletaUtils.ocultarLoading();
                    document.body.removeChild(overlay);
                    
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error al guardar el álbum');
                    document.body.removeChild(overlay);
                }
            });
            
            btnCancelar.addEventListener('click', () => {
                document.body.removeChild(overlay);
            });
        }
    };
}