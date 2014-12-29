//@author tiheikka / titta.heikkala@theqtcompany.com

Qt.include("three.js")

var camera, scene, renderer, particles, geometry, material, i, h, color, colors = [], sprite, size;

var particlesCanvas;

var mouseX = 0, mouseY = 0;


function log(message) {
    if (canvas3d.logAllCalls)
        console.log(message)
}

function initGL(canvas, eventSource) {
    log("initGL ENTER...");

    particlesCanvas = canvas;

    camera = new THREE.PerspectiveCamera( 50, canvas.width / canvas.height, 1, 3000 );
    camera.position.z = 1400;

    scene = new THREE.Scene();

    geometry = new THREE.Geometry();

    sprite = THREE.ImageUtils.loadTexture( "textures/sprites/ball.png" );

    for ( i = 0; i < 5000; i ++ ) {

        var vertex = new THREE.Vector3();
        vertex.x = 2000 * Math.random() - 1000;
        vertex.y = 2000 * Math.random() - 1000;
        vertex.z = 2000 * Math.random() - 1000;

        geometry.vertices.push( vertex );

        colors[ i ] = new THREE.Color( 0xffffff );
        colors[ i ].setHSL( ( vertex.x + 1000 ) / 2000, 1, 0.5 );

    }

    geometry.colors = colors;

    material = new THREE.PointCloudMaterial( { size: 85, map: sprite, vertexColors: THREE.VertexColors, transparent: true } );
    material.color.setHSL( 1.0, 0.2, 0.7 );

    particles = new THREE.PointCloud( geometry, material );
    particles.sortParticles = true;

    scene.add( particles );

    //

    renderer = new THREE.Canvas3DRenderer(
                { canvas: canvas, antialias: true, clearAlpha: 1, devicePixelRatio: canvas.devicePixelRatio });
    renderer.setSize( canvas.width, canvas.height );

    eventSource.mouseMove.connect(onDocumentMouseMove);
}

function onCanvasResize(canvas) {
    if (camera === undefined) return;

    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();

    renderer.setSize( canvas.width, canvas.height );


}

function onDocumentMouseMove( x, y ) {

    mouseX = x - particlesCanvas.width / 2;
    mouseY = y - particlesCanvas.height / 2;

}
function renderGL(canvas) {
    log("renderGL ENTER...");

    var time = Date.now() * 0.00005;

    camera.position.x += ( mouseX - camera.position.x ) * 0.05;
    camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

    camera.lookAt( scene.position );

    h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
    material.color.setHSL( h, 1.0, 0.6 );

    renderer.render( scene, camera );

    log("renderGL EXIT...");
}