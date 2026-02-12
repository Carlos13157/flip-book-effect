$('.flipbook').turn();

        // Lógica del Modal
        const modelModal = document.getElementById('modelModal');
        const openModelButton = document.getElementById('openModelModal');
        const closeButton = document.getElementsByClassName('close-button')[0];
        const aframeSceneContainer = document.getElementById('aframe-scene-container');

        let aframeScene = null; // Variable para almacenar la escena A-Frame

        function createAFrameScene() {
            if (aframeScene) return;

            aframeSceneContainer.innerHTML = `
                <a-scene embedded
                         ar-mode-ui="enabled: true"         <!-- Muestra el botón AR si compatible -->
                         vr-mode-ui="enabled: false"        <!-- NUNCA muestra el botón VR -->
                         renderer="logarithmicDepthBuffer: true; antialias: true;"
                         shadow="type: pcfsoft"
                         style="width: 100%; height: 100%;">

                    <a-assets>
                        <a-asset-item id="mapa-glb" src="MapaTEXTURAS.glb"></a-asset-item>
                    </a-assets>

                    <!-- Cámara con controles de arrastrar y rotar (look-controls) y zoom (mouse-wheel-zoom) -->
                    <!-- Necesitamos el componente mouse-wheel-zoom (ver más abajo) para el zoom con rueda del ratón -->
                    <a-entity camera
                              position="0 1.6 4" <!-- Posición inicial de la cámara para que el modelo esté a la vista -->
                              look-controls="reverseMouseDrag: true"  <!-- Permite arrastrar para rotar -->
                              mouse-wheel-zoom="min: 1; max: 10; factor: 0.1"> <!-- Componente para zoom -->
                    </a-entity>

                    <!-- Modelo GLB -->
                    <a-entity gltf-model="#mapa-glb"
                              id="my-model"
                              position="0 1 0" <!-- Ajusta esta posición para centrar tu modelo -->
                              scale="1 1 1"
                              shadow></a-entity>

                    <!-- Entorno con luces (similar al ejemplo de A-Frame model-viewer) -->
                    <a-entity environment="preset: default;
                                           lighting: point;
                                           shadow: true;
                                           lightPosition: 0 5 0;"></a-entity>

                    <!-- Puedes agregar luces adicionales si el modelo lo requiere -->
                    <!-- <a-entity light="type: ambient; color: #BBB"></a-entity> -->
                    <!-- <a-entity light="type: directional; color: #FFF; intensity: 0.6; castShadow: true" position="-0.5 1 1"></a-entity> -->

                </a-scene>
            `;
            aframeScene = aframeSceneContainer.querySelector('a-scene');

            // Añadir el componente de zoom con rueda de ratón (necesario para el zoom)
            // Este es un componente simple, puedes añadirlo a tu JS o como un archivo aparte
            if (!AFRAME.components['mouse-wheel-zoom']) {
                 AFRAME.registerComponent('mouse-wheel-zoom', {
                    schema: {
                        property: {type: 'string', default: 'position.z'},
                        min: {type: 'number', default: 1},
                        max: {type: 'number', default: 10},
                        factor: {type: 'number', default: 0.1}
                    },
                    init: function () {
                        this.onWheel = this.onWheel.bind(this);
                        window.addEventListener('wheel', this.onWheel);
                    },
                    onWheel: function (evt) {
                        let currentPos = this.el.object3D.position.z;
                        let newPos = currentPos + evt.deltaY * this.data.factor;
                        newPos = Math.max(this.data.min, Math.min(this.data.max, newPos));
                        this.el.object3D.position.z = newPos;
                    },
                    remove: function () {
                        window.removeEventListener('wheel', this.onWheel);
                    }
                });
            }
        }

        function destroyAFrameScene() {
            if (aframeScene) {
                aframeScene.pause(); // Pausar la escena
                aframeScene.remove(); // Eliminar la escena del DOM
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