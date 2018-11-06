let GlslParam = function()
{
    this.w = 1334;
    this.h = 750;
    this.boxRotationX = 0.5;
    this.boxRotationY = 0.5;
    this.isDebug = true;
};
let _glslParam;
let _glslParamGUI;

let _threeScene;
let _threeCamera;
let _threeRenderer;

let _cvs;
let _cvsWrap;

/* 
    threejs geometry
*/
let _box;
let _screen;


/* 
    DOM loaded
*/
document.addEventListener("DOMContentLoaded", awake);
function awake()
{

}


/* 
    contents loaded
*/
window.addEventListener("load", start);
function start()
{
    //
    _cvs = document.getElementById("cvs");
    _cvsWrap = document.getElementById("cvsWrap");
    cvsSizing();

    //
    datInit();

    //
    threeInit();

    //
    window.addEventListener("resize", resize);
}


/* 
    window resized
*/
function resize()
{
    cvsSizing();
    
    threeResizing();
}


/* 
    canvas sizing
*/
function cvsSizing()
{
    console.log('cvs sizing');
    
    _cvs.style.width = _cvsWrap.getBoundingClientRect().width.toString() + "px";
    _cvs.style.height = _cvsWrap.getBoundingClientRect().height.toString() + "px";
}


/* 
    dat.gui init
*/
function datInit()
{
    _glslParam = new GlslParam();
    _glslParamGUI = new dat.GUI();
    _glslParamGUI.add(_glslParam, 'w', 0, 1920).onChange(() =>
    {

    });
    _glslParamGUI.add(_glslParam, 'h', 0, 1080).onChange(() =>
    {

    });
    _glslParamGUI.add(_glslParam, 'boxRotationX', 0, 5).onChange(() =>
    {
        _box.rotation.x = _glslParam.boxRotationX;
        _threeRenderer.render(_threeScene, _threeCamera);
    });
    _glslParamGUI.add(_glslParam, 'boxRotationY', 0, 5).onChange(() =>
    {
        _box.rotation.y = _glslParam.boxRotationY;
        _threeRenderer.render(_threeScene, _threeCamera);
    });
    _glslParamGUI.add(_glslParam, 'isDebug').onChange(() =>
    {
        console.log("param sw : ", _glslParam.isDebug);
        
    });
}


/* 
    threejs init
*/
function threeInit()
{
    console.log('three init');

    // scene
    _threeScene = new THREE.Scene();

    // camera
    _threeCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
    _threeCamera.position.set(0, 0, 200);
    _threeCamera.lookAt(new THREE.Vector3(0, 0, 0));

    // renderer
    _threeRenderer = new THREE.WebGLRenderer(
        {
            canvas: _cvs
        });
    _threeRenderer.setSize( window.innerWidth, window.innerHeight );

    // light
    let directionalLight = new THREE.DirectionalLight(0xFFFFFF);
    directionalLight.position.set(1, 1, 1);
    _threeScene.add(directionalLight);
    //
    let ambientLight = new THREE.AmbientLight(0xFFFFFF);
    ambientLight.position.set(0, 1, 0);
    _threeScene.add(ambientLight);

    // ---
    // make object
    let geometry;
    let material;

    // box
    geometry = new THREE.BoxGeometry(100, 100, 100);
    material = new THREE.MeshStandardMaterial({color: 0x0000FF, ambient: 0xFF00FF});
    _box = new THREE.Mesh(geometry, material);
    // _threeScene.add(_box);

    // screen
    geometry = new THREE.PlaneGeometry(120, 120, 32);
    let uniforms = {
        u_resolution: {
            type: "vec2",
            value: new THREE.Vector2(_cvs.style.width, _cvs.style.height)
        },
        u_mouse: {
            type: "vec2",
            value: new THREE.Vector2()
        },
        u_time: {
            type: "f",
            value: new Number()
        }
    }
    material = new THREE.MeshStandardMaterial({color: 0xFFFF00, side: THREE.DoubleSide});
    let httpObj = new XMLHttpRequest();
    httpObj.open('get', '../_shader/main.vert', true);
    httpObj.onreadystatechange = processResult;
    function processResult()
    {
        if(httpObj.readyState == 4) {
            if(httpObj.status == 200 || httpObj.status == 201) {
                // リクエストの処理
                console.log('heloo');
                console.log('getget : ', this.responseText);
            } else {
                // エラー処理
            }
        }
    };
    httpObj.send(null);
    // material = new THREE.ShaderMaterial({
    //     vertexShader: document.getElementById("vs").textContent,
    //     fragmentShader: document.getElementById("fs").textContent,
    //     uniforms: uniforms
    // });
    _screen = new THREE.Mesh(geometry, material);
    _threeScene.add(_screen);

    // 初回実行
    _threeRenderer.render(_threeScene, _threeCamera);
}


/* 
    threejs resizing
*/
function threeResizing()
{
    console.log('three resizing');

    let w = window.innerWidth;
    let h = window.innerHeight;

    _threeRenderer.setPixelRatio(window.devicePixelRatio);
    _threeRenderer.setSize(w, h);

    _threeCamera.aspect = w / h;
    _threeCamera.updateProjectionMatrix();

    _threeRenderer.render(_threeScene, _threeCamera);
}