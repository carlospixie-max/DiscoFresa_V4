// maleta-cargar-colecciones.js - VERSIÓN FINAL SIMPLIFICADA

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
                        
                        const discoElement = document.createElement('div');
                        discoElement.style.cssText = `
                            cursor: pointer;
                            text-align: center;
                            width: 120px;
                            margin-bottom: 10px;
                        `;
                        
                        discoElement.addEventListener('click', () => {
                            gestor.cargarDisco(disco);
                        });
                        
                        discoElement.innerHTML = `
                            <div style="width: 120px; height: 120px; border-radius: 8px; overflow: hidden; border: 2px solid #e0e0e0;">
                                <img src="${portadaUrl}" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <div style="font-size: 11px; font-weight: bold; margin-top: 5px;">${nombreDisco}</div>
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