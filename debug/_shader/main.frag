#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {

    // -1 - 0 - 1
    vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    
    // 0 - 1
    vec2 pp = gl_FragCoord.xy / u_resolution.xy;
    
    vec3 color = vec3(0.0);
    color = vec3(pp.x, pp.y, abs(sin(u_time)));

    gl_FragColor = vec4(color, 1.0);
}