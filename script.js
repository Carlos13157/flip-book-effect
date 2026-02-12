$('.flipbook').turn();

        // Lógica del Modal
        const modelModal = document.getElementById('modelModal');
        const openModelButton = document.getElementById('openModelModal');
        const closeButton = document.getElementsByClassName('close-button')[0];
        const aframeSceneContainer = document.getElementById('aframe-scene-container');

        let aframeScene = null; // Variable para almacenar la escena A-Frame

        function createAFrameScene() {
            // Si la escena ya existe, no la crees de nuevo
            if (aframeScene) return;

            aframeSceneContainer.innerHTML = `
                <a-scene embedded
                         ar-mode-ui="enabled: true"  <!-- Asegura que el botón AR se muestre si es compatible -->
                         vr-mode-ui="enabled: false" <!-- Deshabilita el botón VR si no lo necesitas -->
                         style="width: 100%; height: 100%;"
                         shadow="type: pcfsoft"  <!-- Sombras para mejor realismo -->
                         renderer="logarithmicDepthBuffer: true; antialias: true;"> <!-- Mejoras de renderizado -->

                    <a-assets>
                        <a-asset-item id="mapa-glb" src="MapaTEXTURAS.glb"></a-asset-item>
                        <!-- Puedes añadir un environment map si tienes uno para la iluminación, como en model-viewer -->
                        <!-- <img id="sky" src="path/to/your/sky.hdr" crossorigin="anonymous"> -->
                    </a-assets>

                    <!-- Modelo GLB -->
                    <a-entity gltf-model="#mapa-glb"
                              id="my-model"
                              position="0 0 0"
                              scale="1 1 1"
                              shadow></a-entity> <!-- Habilita sombras en el modelo -->

                    <!-- Cámara con controles de órbita (como en model-viewer) -->
                    <a-entity camera
                              orbit-controls="target: #my-model; minDistance: 1; maxDistance: 10; initialPosition: 0 1.5 4;"
                              position="0 1.6 0"></a-entity> <!-- Posición inicial de la cámara -->

                    <!-- Luces -->
                    <a-entity light="type: ambient; color: #BBB"></a-entity>
                    <a-entity light="type: directional; color: #FFF; intensity: 0.6; castShadow: true" position="-0.5 1 1"></a-entity>
                    <!-- Puedes añadir más luces si el modelo lo requiere, por ejemplo una hemisferica o una de foco -->

                    <!-- Un plano para recibir sombras (opcional, para ver sombras en el "suelo") -->
                    <!-- <a-plane rotation="-90 0 0" width="10" height="10" color="#7BC8A4" shadow="receive: true"></a-plane> -->

                </a-scene>
            `;
            aframeScene = aframeSceneContainer.querySelector('a-scene');
        }

        function destroyAFrameScene() {
            if (aframeScene) {
                // Detener la escena de A-Frame antes de eliminarla
                // Esto es importante para liberar listeners y recursos correctamente
                aframeScene.pause();
                aframeScene.remove(); // Un método más limpio para eliminar la escena del DOM
                aframeScene = null;
                aframeSceneContainer.innerHTML = '';
            }
        }

        // El modal no se muestra por defecto al cargar la página
        modelModal.style.display = "none";

        openModelButton.onclick = function() {
            modelModal.style.display = "flex"; // Usamos 'flex' para centrar con justify/align-items
            createAFrameScene(); // Crear la escena cuando el modal se abre
        }

        closeButton.onclick = function() {
            modelModal.style.display = "none";
            destroyAFrameScene(); // Destruir la escena cuando el modal se cierra
        }

        window.onclick = function(event) {
            if (event.target == modelModal) {
                modelModal.style.display = "none";
                destroyAFrameScene(); // Destruir la escena si se hace clic fuera del modal
            }
        }