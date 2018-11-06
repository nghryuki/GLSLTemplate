let GlslParam = function()
{
    this.timeSpeed = 1000;
    this.isDebug = true;
};
let _glslParam;
let _glslParamGUI;

let _threeScene;
let _threeCamera;
let _threeRenderer;

let _cvs;
let _cvsWrap;

let _isShaderLoaded = false;
let _uniforms = {
    u_resolution: {
        type: "vec2",
        value: new THREE.Vector2()
    },
    u_mouse: {
        type: "vec2",
        value: new THREE.Vector2()
    },
    u_time: {
        type: "f",
        value: new Number()
    }
};
let _mousePos = { x: 0, y: 0 };
let _startTime = 0;

/* 
    threejs geometry
*/
let _screen;


/* 
    DOM loaded
*/
document.addEventListener("DOMContentLoaded", awake);
function awake()
{
    //
    _startTime = Date.now();
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
    window.addEventListener('mousemove', mouseMove);

    //
    update();
}


/* 
    update
*/
function update()
{
    //
    reloadUniforms();

    //
    window.requestAnimationFrame(update);
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
    _glslParamGUI.add(_glslParam, 'timeSpeed', 10, 2000);
    _glslParamGUI.add(_glslParam, 'isDebug').onChange(() =>
    {
        
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

    //
    shaderLoad();

    // 初回実行
    _threeRenderer.render(_threeScene, _threeCamera);
}


/* 
    shader load
*/
function shaderLoad()
{
    let url = location.href;

    // vert
    let vertContent;
    let vertObj = new XMLHttpRequest();
    vertObj.open('get', url + '/_shader/main.vert', true);
    vertObj.onreadystatechange = processResultVert;
    function processResultVert()
    {
        if(vertObj.readyState == 4) {
            if(vertObj.status == 200 || vertObj.status == 201) {
                // リクエストの処理
                vertContent = this.responseText;
                console.log('vert : ', vertContent);
                shaderLoaded();
            } else {
                // エラー処理
            }
        }
    };
    vertObj.send(null);
    
    // frag
    let fragContent;
    let fragObj = new XMLHttpRequest();
    fragObj.open('get', url + '/_shader/main.frag', true);
    fragObj.onreadystatechange = processResultFrag;
    function processResultFrag()
    {
        if(fragObj.readyState == 4) {
            if(fragObj.status == 200 || fragObj.status == 201) {
                // リクエストの処理
                fragContent = this.responseText;
                console.log('frag : ', fragContent);
                shaderLoaded();
            } else {
                // エラー処理
            }
        }
    };
    fragObj.send(null);
    
    
    function shaderLoaded()
    {
        if(vertContent == null || fragContent == null) return;

        console.log('shader load comp;');
        

        _isShaderLoaded = true;
        
        // make screen
        let geometry = new THREE.PlaneGeometry(1200, 1200, 32);
        let material = new THREE.ShaderMaterial({
            vertexShader: vertContent,
            fragmentShader: fragContent,
            // vertexShader: document.getElementById("vs").textContent,
            // fragmentShader: document.getElementById("fs").textContent,
            uniforms: _uniforms
        });

        _screen = new THREE.Mesh(geometry, material);
        _threeScene.add(_screen);

        threeResizing();
    
        _threeRenderer.render(_threeScene, _threeCamera);
    }
}


/* 
    reload uniforms
*/
function reloadUniforms()
{
    if(!_isShaderLoaded) return;

    // console.log('reload uniforms');

    // mouse position
    _uniforms.u_mouse.value = new THREE.Vector2(_mousePos.x, _mousePos.y);
        
    // time
    let elapsedMilliseconds = Date.now() - _startTime;
    let elapsedSeconds = elapsedMilliseconds / _glslParam.timeSpeed;
    _uniforms.u_time.value = elapsedSeconds;
    
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

    // resolution
    _uniforms.u_resolution.value = new THREE.Vector2(w, h);

    _threeRenderer.setPixelRatio(window.devicePixelRatio);
    _threeRenderer.setSize(w, h);

    _threeCamera.aspect = w / h;
    _threeCamera.updateProjectionMatrix();

    _threeRenderer.render(_threeScene, _threeCamera);
}



// --- event --- //

/* 
    window resized
*/
function resize()
{
    cvsSizing();
    
    threeResizing();
}


/* 
    mosue move
*/
function mouseMove(e)
{
	e = event || window.event;	
	_mousePos = { x: e.clientX, y: e.clientY };
}