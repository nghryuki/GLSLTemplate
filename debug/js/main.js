"use strict";

var GlslParam = function GlslParam() {
    this.timeSpeed = 1000;
    this.isDebug = true;
};
var _glslParam = void 0;
var _glslParamGUI = void 0;

var _threeScene = void 0;
var _threeCamera = void 0;
var _threeRenderer = void 0;

var _cvs = void 0;
var _cvsWrap = void 0;

var _isShaderLoaded = false;
var _uniforms = {
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
var _mousePos = { x: 0, y: 0 };
var _startTime = 0;

/* 
    threejs geometry
*/
var _screen = void 0;

/* 
    DOM loaded
*/
document.addEventListener("DOMContentLoaded", awake);
function awake() {
    //
    _startTime = Date.now();
}

/* 
    contents loaded
*/
window.addEventListener("load", start);
function start() {
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
function update() {
    //
    reloadUniforms();

    //
    window.requestAnimationFrame(update);
}

/* 
    canvas sizing
*/
function cvsSizing() {
    console.log('cvs sizing');

    _cvs.style.width = _cvsWrap.getBoundingClientRect().width.toString() + "px";
    _cvs.style.height = _cvsWrap.getBoundingClientRect().height.toString() + "px";
}

/* 
    dat.gui init
*/
function datInit() {
    _glslParam = new GlslParam();
    _glslParamGUI = new dat.GUI();
    _glslParamGUI.add(_glslParam, 'timeSpeed', 10, 2000);
    _glslParamGUI.add(_glslParam, 'isDebug').onChange(function () {});
}

/* 
    threejs init
*/
function threeInit() {
    console.log('three init');

    // scene
    _threeScene = new THREE.Scene();

    // camera
    _threeCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    _threeCamera.position.set(0, 0, 200);
    _threeCamera.lookAt(new THREE.Vector3(0, 0, 0));

    // renderer
    _threeRenderer = new THREE.WebGLRenderer({
        canvas: _cvs
    });
    _threeRenderer.setSize(window.innerWidth, window.innerHeight);

    // light
    var directionalLight = new THREE.DirectionalLight(0xFFFFFF);
    directionalLight.position.set(1, 1, 1);
    _threeScene.add(directionalLight);
    //
    var ambientLight = new THREE.AmbientLight(0xFFFFFF);
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
function shaderLoad() {
    var url = location.href;

    // vert
    var vertContent = void 0;
    var vertObj = new XMLHttpRequest();
    vertObj.open('get', url + '/_shader/main.vert', true);
    vertObj.onreadystatechange = processResultVert;
    function processResultVert() {
        if (vertObj.readyState == 4) {
            if (vertObj.status == 200 || vertObj.status == 201) {
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
    var fragContent = void 0;
    var fragObj = new XMLHttpRequest();
    fragObj.open('get', url + '/_shader/main.frag', true);
    fragObj.onreadystatechange = processResultFrag;
    function processResultFrag() {
        if (fragObj.readyState == 4) {
            if (fragObj.status == 200 || fragObj.status == 201) {
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

    function shaderLoaded() {
        if (vertContent == null || fragContent == null) return;

        console.log('shader load comp;');

        _isShaderLoaded = true;

        // make screen
        var geometry = new THREE.PlaneGeometry(1200, 1200, 32);
        var material = new THREE.ShaderMaterial({
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
function reloadUniforms() {
    if (!_isShaderLoaded) return;

    // console.log('reload uniforms');

    // mouse position
    _uniforms.u_mouse.value = new THREE.Vector2(_mousePos.x, _mousePos.y);

    // time
    var elapsedMilliseconds = Date.now() - _startTime;
    var elapsedSeconds = elapsedMilliseconds / _glslParam.timeSpeed;
    _uniforms.u_time.value = elapsedSeconds;

    _threeRenderer.render(_threeScene, _threeCamera);
}

/* 
    threejs resizing
*/
function threeResizing() {
    console.log('three resizing');

    var w = window.innerWidth;
    var h = window.innerHeight;

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
function resize() {
    cvsSizing();

    threeResizing();
}

/* 
    mosue move
*/
function mouseMove(e) {
    e = event || window.event;
    _mousePos = { x: e.clientX, y: e.clientY };
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uZXM2Il0sIm5hbWVzIjpbIkdsc2xQYXJhbSIsInRpbWVTcGVlZCIsImlzRGVidWciLCJfZ2xzbFBhcmFtIiwiX2dsc2xQYXJhbUdVSSIsIl90aHJlZVNjZW5lIiwiX3RocmVlQ2FtZXJhIiwiX3RocmVlUmVuZGVyZXIiLCJfY3ZzIiwiX2N2c1dyYXAiLCJfaXNTaGFkZXJMb2FkZWQiLCJfdW5pZm9ybXMiLCJ1X3Jlc29sdXRpb24iLCJ0eXBlIiwidmFsdWUiLCJUSFJFRSIsIlZlY3RvcjIiLCJ1X21vdXNlIiwidV90aW1lIiwiTnVtYmVyIiwiX21vdXNlUG9zIiwieCIsInkiLCJfc3RhcnRUaW1lIiwiX3NjcmVlbiIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImF3YWtlIiwiRGF0ZSIsIm5vdyIsIndpbmRvdyIsInN0YXJ0IiwiZ2V0RWxlbWVudEJ5SWQiLCJjdnNTaXppbmciLCJkYXRJbml0IiwidGhyZWVJbml0IiwicmVzaXplIiwibW91c2VNb3ZlIiwidXBkYXRlIiwicmVsb2FkVW5pZm9ybXMiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjb25zb2xlIiwibG9nIiwic3R5bGUiLCJ3aWR0aCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInRvU3RyaW5nIiwiaGVpZ2h0IiwiZGF0IiwiR1VJIiwiYWRkIiwib25DaGFuZ2UiLCJTY2VuZSIsIlBlcnNwZWN0aXZlQ2FtZXJhIiwiaW5uZXJXaWR0aCIsImlubmVySGVpZ2h0IiwicG9zaXRpb24iLCJzZXQiLCJsb29rQXQiLCJWZWN0b3IzIiwiV2ViR0xSZW5kZXJlciIsImNhbnZhcyIsInNldFNpemUiLCJkaXJlY3Rpb25hbExpZ2h0IiwiRGlyZWN0aW9uYWxMaWdodCIsImFtYmllbnRMaWdodCIsIkFtYmllbnRMaWdodCIsInNoYWRlckxvYWQiLCJyZW5kZXIiLCJ1cmwiLCJsb2NhdGlvbiIsImhyZWYiLCJ2ZXJ0Q29udGVudCIsInZlcnRPYmoiLCJYTUxIdHRwUmVxdWVzdCIsIm9wZW4iLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJwcm9jZXNzUmVzdWx0VmVydCIsInJlYWR5U3RhdGUiLCJzdGF0dXMiLCJyZXNwb25zZVRleHQiLCJzaGFkZXJMb2FkZWQiLCJzZW5kIiwiZnJhZ0NvbnRlbnQiLCJmcmFnT2JqIiwicHJvY2Vzc1Jlc3VsdEZyYWciLCJnZW9tZXRyeSIsIlBsYW5lR2VvbWV0cnkiLCJtYXRlcmlhbCIsIlNoYWRlck1hdGVyaWFsIiwidmVydGV4U2hhZGVyIiwiZnJhZ21lbnRTaGFkZXIiLCJ1bmlmb3JtcyIsIk1lc2giLCJ0aHJlZVJlc2l6aW5nIiwiZWxhcHNlZE1pbGxpc2Vjb25kcyIsImVsYXBzZWRTZWNvbmRzIiwidyIsImgiLCJzZXRQaXhlbFJhdGlvIiwiZGV2aWNlUGl4ZWxSYXRpbyIsImFzcGVjdCIsInVwZGF0ZVByb2plY3Rpb25NYXRyaXgiLCJlIiwiZXZlbnQiLCJjbGllbnRYIiwiY2xpZW50WSJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxZQUFZLFNBQVpBLFNBQVksR0FDaEI7QUFDSSxTQUFLQyxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsU0FBS0MsT0FBTCxHQUFlLElBQWY7QUFDSCxDQUpEO0FBS0EsSUFBSUMsbUJBQUo7QUFDQSxJQUFJQyxzQkFBSjs7QUFFQSxJQUFJQyxvQkFBSjtBQUNBLElBQUlDLHFCQUFKO0FBQ0EsSUFBSUMsdUJBQUo7O0FBRUEsSUFBSUMsYUFBSjtBQUNBLElBQUlDLGlCQUFKOztBQUVBLElBQUlDLGtCQUFrQixLQUF0QjtBQUNBLElBQUlDLFlBQVk7QUFDWkMsa0JBQWM7QUFDVkMsY0FBTSxNQURJO0FBRVZDLGVBQU8sSUFBSUMsTUFBTUMsT0FBVjtBQUZHLEtBREY7QUFLWkMsYUFBUztBQUNMSixjQUFNLE1BREQ7QUFFTEMsZUFBTyxJQUFJQyxNQUFNQyxPQUFWO0FBRkYsS0FMRztBQVNaRSxZQUFRO0FBQ0pMLGNBQU0sR0FERjtBQUVKQyxlQUFPLElBQUlLLE1BQUo7QUFGSDtBQVRJLENBQWhCO0FBY0EsSUFBSUMsWUFB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c0JBQXNCNUYsV0FBV0YsU0FBdEQ7QUFDQVUsY0FBVU8sTUFBVixDQUFpQkosS0FBakIsR0FBeUJrRixjQUF6Qjs7QUFFQXpGLG1CQUFlNkQsTUFBZixDQUFzQi9ELFdBQXRCLEVBQW1DQyxZQUFuQztBQUNIOztBQUdEOzs7QUFHQSxTQUFTd0YsYUFBVCxHQUNBO0FBQ0lyRCxZQUFRQyxHQUFSLENBQVksZ0JBQVo7O0FBRUEsUUFBSXVELElBQUluRSxPQUFPd0IsVUFBZjtBQUNBLFFBQUk0QyxJQUFJcEUsT0FBT3lCLFdBQWY7O0FBRUE7QUFDQTVDLGNBQVVDLFlBQVYsQ0FBdUJFLEtBQXZCLEdBQStCLElBQUlDLE1BQU1DLE9BQVYsQ0FBa0JpRixDQUFsQixFQUFxQkMsQ0FBckIsQ0FBL0I7O0FBRUEzRixtQkFBZTRGLGFBQWYsQ0FBNkJyRSxPQUFPc0UsZ0JBQXBDO0FBQ0E3RixtQkFBZXVELE9BQWYsQ0FBdUJtQyxDQUF2QixFQUEwQkMsQ0FBMUI7O0FBRUE1RixpQkFBYStGLE1BQWIsR0FBc0JKLElBQUlDLENBQTFCO0FBQ0E1RixpQkFBYWdHLHNCQUFiOztBQUVBL0YsbUJBQWU2RCxNQUFmLENBQXNCL0QsV0FBdEIsRUFBbUNDLFlBQW5DO0FBQ0g7O0FBSUQ7O0FBRUE7OztBQUdBLFNBQVM4QixNQUFULEdBQ0E7QUFDSUg7O0FBRUE2RDtBQUNIOztBQUdEOzs7QUFHQSxTQUFTekQsU0FBVCxDQUFtQmtFLENBQW5CLEVBQ0E7QUFDQ0EsUUFBSUMsU0FBUzFFLE9BQU8wRSxLQUFwQjtBQUNBcEYsZ0JBQVksRUFBRUMsR0FBR2tGLEVBQUVFLE9BQVAsRUFBZ0JuRixHQUFHaUYsRUFBRUcsT0FBckIsRUFBWjtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgR2xzbFBhcmFtID0gZnVuY3Rpb24oKVxue1xuICAgIHRoaXMudGltZVNwZWVkID0gMTAwMDtcbiAgICB0aGlzLmlzRGVidWcgPSB0cnVlO1xufTtcbmxldCBfZ2xzbFBhcmFtO1xubGV0IF9nbHNsUGFyYW1HVUk7XG5cbmxldCBfdGhyZWVTY2VuZTtcbmxldCBfdGhyZWVDYW1lcmE7XG5sZXQgX3RocmVlUmVuZGVyZXI7XG5cbmxldCBfY3ZzO1xubGV0IF9jdnNXcmFwO1xuXG5sZXQgX2lzU2hhZGVyTG9hZGVkID0gZmFsc2U7XG5sZXQgX3VuaWZvcm1zID0ge1xuICAgIHVfcmVzb2x1dGlvbjoge1xuICAgICAgICB0eXBlOiBcInZlYzJcIixcbiAgICAgICAgdmFsdWU6IG5ldyBUSFJFRS5WZWN0b3IyKClcbiAgICB9LFxuICAgIHVfbW91c2U6IHtcbiAgICAgICAgdHlwZTogXCJ2ZWMyXCIsXG4gICAgICAgIHZhbHVlOiBuZXcgVEhSRUUuVmVjdG9yMigpXG4gICAgfSxcbiAgICB1X3RpbWU6IHtcbiAgICAgICAgdHlwZTogXCJmXCIsXG4gICAgICAgIHZhbHVlOiBuZXcgTnVtYmVyKClcbiAgICB9XG59O1xubGV0IF9tb3VzZVBvcyA9IHsgeDogMCwgeTogMCB9O1xubGV0IF9zdGFydFRpbWUgPSAwO1xuXG4vKiBcbiAgICB0aHJlZWpzIGdlb21ldHJ5XG4qL1xubGV0IF9zY3JlZW47XG5cblxuLyogXG4gICAgRE9NIGxvYWRlZFxuKi9cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGF3YWtlKTtcbmZ1bmN0aW9uIGF3YWtlKClcbntcbiAgICAvL1xuICAgIF9zdGFydFRpbWUgPSBEYXRlLm5vdygpO1xufVxuXG5cbi8qIFxuICAgIGNvbnRlbnRzIGxvYWRlZFxuKi9cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBzdGFydCk7XG5mdW5jdGlvbiBzdGFydCgpXG57XG4gICAgLy9cbiAgICBfY3ZzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjdnNcIik7XG4gICAgX2N2c1dyYXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN2c1dyYXBcIik7XG4gICAgY3ZzU2l6aW5nKCk7XG5cbiAgICAvL1xuICAgIGRhdEluaXQoKTtcblxuICAgIC8vXG4gICAgdGhyZWVJbml0KCk7XG5cbiAgICAvL1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHJlc2l6ZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdXNlTW92ZSk7XG5cbiAgICAvL1xuICAgIHVwZGF0ZSgpO1xufVxuXG5cbi8qIFxuICAgIHVwZGF0ZVxuKi9cbmZ1bmN0aW9uIHVwZGF0ZSgpXG57XG4gICAgLy9cbiAgICByZWxvYWRVbmlmb3JtcygpO1xuXG4gICAgLy9cbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG59XG5cblxuLyogXG4gICAgY2FudmFzIHNpemluZ1xuKi9cbmZ1bmN0aW9uIGN2c1NpemluZygpXG57XG4gICAgY29uc29sZS5sb2coJ2N2cyBzaXppbmcnKTtcbiAgICBcbiAgICBfY3ZzLnN0eWxlLndpZHRoID0gX2N2c1dyYXAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGgudG9TdHJpbmcoKSArIFwicHhcIjtcbiAgICBfY3ZzLnN0eWxlLmhlaWdodCA9IF9jdnNXcmFwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodC50b1N0cmluZygpICsgXCJweFwiO1xufVxuXG5cbi8qIFxuICAgIGRhdC5ndWkgaW5pdFxuKi9cbmZ1bmN0aW9uIGRhdEluaXQoKVxue1xuICAgIF9nbHNsUGFyYW0gPSBuZXcgR2xzbFBhcmFtKCk7XG4gICAgX2dsc2xQYXJhbUdVSSA9IG5ldyBkYXQuR1VJKCk7XG4gICAgX2dsc2xQYXJhbUdVSS5hZGQoX2dsc2xQYXJhbSwgJ3RpbWVTcGVlZCcsIDEwLCAyMDAwKTtcbiAgICBfZ2xzbFBhcmFtR1VJLmFkZChfZ2xzbFBhcmFtLCAnaXNEZWJ1ZycpLm9uQ2hhbmdlKCgpID0+XG4gICAge1xuICAgICAgICBcbiAgICB9KTtcbn1cblxuXG4vKiBcbiAgICB0aHJlZWpzIGluaXRcbiovXG5mdW5jdGlvbiB0aHJlZUluaXQoKVxue1xuICAgIGNvbnNvbGUubG9nKCd0aHJlZSBpbml0Jyk7XG5cbiAgICAvLyBzY2VuZVxuICAgIF90aHJlZVNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cbiAgICAvLyBjYW1lcmFcbiAgICBfdGhyZWVDYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoIDc1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMC4xLCAxMDAwMCApO1xuICAgIF90aHJlZUNhbWVyYS5wb3NpdGlvbi5zZXQoMCwgMCwgMjAwKTtcbiAgICBfdGhyZWVDYW1lcmEubG9va0F0KG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApKTtcblxuICAgIC8vIHJlbmRlcmVyXG4gICAgX3RocmVlUmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcihcbiAgICAgICAge1xuICAgICAgICAgICAgY2FudmFzOiBfY3ZzXG4gICAgICAgIH0pO1xuICAgIF90aHJlZVJlbmRlcmVyLnNldFNpemUoIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQgKTtcblxuICAgIC8vIGxpZ2h0XG4gICAgbGV0IGRpcmVjdGlvbmFsTGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweEZGRkZGRik7XG4gICAgZGlyZWN0aW9uYWxMaWdodC5wb3NpdGlvbi5zZXQoMSwgMSwgMSk7XG4gICAgX3RocmVlU2NlbmUuYWRkKGRpcmVjdGlvbmFsTGlnaHQpO1xuICAgIC8vXG4gICAgbGV0IGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHhGRkZGRkYpO1xuICAgIGFtYmllbnRMaWdodC5wb3NpdGlvbi5zZXQoMCwgMSwgMCk7XG4gICAgX3RocmVlU2NlbmUuYWRkKGFtYmllbnRMaWdodCk7XG5cbiAgICAvL1xuICAgIHNoYWRlckxvYWQoKTtcblxuICAgIC8vIOWIneWbnuWun+ihjFxuICAgIF90aHJlZVJlbmRlcmVyLnJlbmRlcihfdGhyZWVTY2VuZSwgX3RocmVlQ2FtZXJhKTtcbn1cblxuXG4vKiBcbiAgICBzaGFkZXIgbG9hZFxuKi9cbmZ1bmN0aW9uIHNoYWRlckxvYWQoKVxue1xuICAgIGxldCB1cmwgPSBsb2NhdGlvbi5ocmVmO1xuXG4gICAgLy8gdmVydFxuICAgIGxldCB2ZXJ0Q29udGVudDtcbiAgICBsZXQgdmVydE9iaiA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHZlcnRPYmoub3BlbignZ2V0JywgdXJsICsgJy9fc2hhZGVyL21haW4udmVydCcsIHRydWUpO1xuICAgIHZlcnRPYmoub25yZWFkeXN0YXRlY2hhbmdlID0gcHJvY2Vzc1Jlc3VsdFZlcnQ7XG4gICAgZnVuY3Rpb24gcHJvY2Vzc1Jlc3VsdFZlcnQoKVxuICAgIHtcbiAgICAgICAgaWYodmVydE9iai5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgICAgIGlmKHZlcnRPYmouc3RhdHVzID09IDIwMCB8fCB2ZXJ0T2JqLnN0YXR1cyA9PSAyMDEpIHtcbiAgICAgICAgICAgICAgICAvLyDjg6rjgq/jgqjjgrnjg4jjga7lh6bnkIZcbiAgICAgICAgICAgICAgICB2ZXJ0Q29udGVudCA9IHRoaXMucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd2ZXJ0IDogJywgdmVydENvbnRlbnQpO1xuICAgICAgICAgICAgICAgIHNoYWRlckxvYWRlZCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyDjgqjjg6njg7zlh6bnkIZcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgdmVydE9iai5zZW5kKG51bGwpO1xuICAgIFxuICAgIC8vIGZyYWdcbiAgICBsZXQgZnJhZ0NvbnRlbnQ7XG4gICAgbGV0IGZyYWdPYmogPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICBmcmFnT2JqLm9wZW4oJ2dldCcsIHVybCArICcvX3NoYWRlci9tYWluLmZyYWcnLCB0cnVlKTtcbiAgICBmcmFnT2JqLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IHByb2Nlc3NSZXN1bHRGcmFnO1xuICAgIGZ1bmN0aW9uIHByb2Nlc3NSZXN1bHRGcmFnKClcbiAgICB7XG4gICAgICAgIGlmKGZyYWdPYmoucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgICAgICBpZihmcmFnT2JqLnN0YXR1cyA9PSAyMDAgfHwgZnJhZ09iai5zdGF0dXMgPT0gMjAxKSB7XG4gICAgICAgICAgICAgICAgLy8g44Oq44Kv44Ko44K544OI44Gu5Yem55CGXG4gICAgICAgICAgICAgICAgZnJhZ0NvbnRlbnQgPSB0aGlzLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZnJhZyA6ICcsIGZyYWdDb250ZW50KTtcbiAgICAgICAgICAgICAgICBzaGFkZXJMb2FkZWQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8g44Ko44Op44O85Yem55CGXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGZyYWdPYmouc2VuZChudWxsKTtcbiAgICBcbiAgICBcbiAgICBmdW5jdGlvbiBzaGFkZXJMb2FkZWQoKVxuICAgIHtcbiAgICAgICAgaWYodmVydENvbnRlbnQgPT0gbnVsbCB8fCBmcmFnQ29udGVudCA9PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgY29uc29sZS5sb2coJ3NoYWRlciBsb2FkIGNvbXA7Jyk7XG4gICAgICAgIFxuXG4gICAgICAgIF9pc1NoYWRlckxvYWRlZCA9IHRydWU7XG4gICAgICAgIFxuICAgICAgICAvLyBtYWtlIHNjcmVlblxuICAgICAgICBsZXQgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSgxMjAwLCAxMjAwLCAzMik7XG4gICAgICAgIGxldCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5TaGFkZXJNYXRlcmlhbCh7XG4gICAgICAgICAgICB2ZXJ0ZXhTaGFkZXI6IHZlcnRDb250ZW50LFxuICAgICAgICAgICAgZnJhZ21lbnRTaGFkZXI6IGZyYWdDb250ZW50LFxuICAgICAgICAgICAgLy8gdmVydGV4U2hhZGVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInZzXCIpLnRleHRDb250ZW50LFxuICAgICAgICAgICAgLy8gZnJhZ21lbnRTaGFkZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZnNcIikudGV4dENvbnRlbnQsXG4gICAgICAgICAgICB1bmlmb3JtczogX3VuaWZvcm1zXG4gICAgICAgIH0pO1xuXG4gICAgICAgIF9zY3JlZW4gPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgICBfdGhyZWVTY2VuZS5hZGQoX3NjcmVlbik7XG5cbiAgICAgICAgdGhyZWVSZXNpemluZygpO1xuICAgIFxuICAgICAgICBfdGhyZWVSZW5kZXJlci5yZW5kZXIoX3RocmVlU2NlbmUsIF90aHJlZUNhbWVyYSk7XG4gICAgfVxufVxuXG5cbi8qIFxuICAgIHJlbG9hZCB1bmlmb3Jtc1xuKi9cbmZ1bmN0aW9uIHJlbG9hZFVuaWZvcm1zKClcbntcbiAgICBpZighX2lzU2hhZGVyTG9hZGVkKSByZXR1cm47XG5cbiAgICAvLyBjb25zb2xlLmxvZygncmVsb2FkIHVuaWZvcm1zJyk7XG5cbiAgICAvLyBtb3VzZSBwb3NpdGlvblxuICAgIF91bmlmb3Jtcy51X21vdXNlLnZhbHVlID0gbmV3IFRIUkVFLlZlY3RvcjIoX21vdXNlUG9zLngsIF9tb3VzZVBvcy55KTtcbiAgICAgICAgXG4gICAgLy8gdGltZVxuICAgIGxldCBlbGFwc2VkTWlsbGlzZWNvbmRzID0gRGF0ZS5ub3coKSAtIF9zdGFydFRpbWU7XG4gICAgbGV0IGVsYXBzZWRTZWNvbmRzID0gZWxhcHNlZE1pbGxpc2Vjb25kcyAvIF9nbHNsUGFyYW0udGltZVNwZWVkO1xuICAgIF91bmlmb3Jtcy51X3RpbWUudmFsdWUgPSBlbGFwc2VkU2Vjb25kcztcbiAgICBcbiAgICBfdGhyZWVSZW5kZXJlci5yZW5kZXIoX3RocmVlU2NlbmUsIF90aHJlZUNhbWVyYSk7XG59XG5cblxuLyogXG4gICAgdGhyZWVqcyByZXNpemluZ1xuKi9cbmZ1bmN0aW9uIHRocmVlUmVzaXppbmcoKVxue1xuICAgIGNvbnNvbGUubG9nKCd0aHJlZSByZXNpemluZycpO1xuXG4gICAgbGV0IHcgPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICBsZXQgaCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgIC8vIHJlc29sdXRpb25cbiAgICBfdW5pZm9ybXMudV9yZXNvbHV0aW9uLnZhbHVlID0gbmV3IFRIUkVFLlZlY3RvcjIodywgaCk7XG5cbiAgICBfdGhyZWVSZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICBfdGhyZWVSZW5kZXJlci5zZXRTaXplKHcsIGgpO1xuXG4gICAgX3RocmVlQ2FtZXJhLmFzcGVjdCA9IHcgLyBoO1xuICAgIF90aHJlZUNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cbiAgICBfdGhyZWVSZW5kZXJlci5yZW5kZXIoX3RocmVlU2NlbmUsIF90aHJlZUNhbWVyYSk7XG59XG5cblxuXG4vLyAtLS0gZXZlbnQgLS0tIC8vXG5cbi8qIFxuICAgIHdpbmRvdyByZXNpemVkXG4qL1xuZnVuY3Rpb24gcmVzaXplKClcbntcbiAgICBjdnNTaXppbmcoKTtcbiAgICBcbiAgICB0aHJlZVJlc2l6aW5nKCk7XG59XG5cblxuLyogXG4gICAgbW9zdWUgbW92ZVxuKi9cbmZ1bmN0aW9uIG1vdXNlTW92ZShlKVxue1xuXHRlID0gZXZlbnQgfHwgd2luZG93LmV2ZW50O1x0XG5cdF9tb3VzZVBvcyA9IHsgeDogZS5jbGllbnRYLCB5OiBlLmNsaWVudFkgfTtcbn0iXX0=
