
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.141592653589793
#define PI2 PI * 2.

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float drawCircle(vec2 st, vec2 centerPos, float rad, float bokashi) {
	float dist = distance(st, centerPos);
    return smoothstep(rad-(bokashi/2.), rad+(bokashi/2.), dist);
}

float f01(float time) {
    return max((cos(time) + 1.) / 2., 0.0);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    
    float pt = 1.;
    float speed = 0.3;
    
    
    for ( float i = 0.; i < 50.; i++) {
			float delay = i * 0.2;
     	 pt *= drawCircle(st, vec2(cos(speed * (u_time + delay)) * 0.4 + 0.5,  cos(speed * (u_time + delay) * 2. + PI / 2.) * 0.03 + 0.5), 0.002,  f01(speed * (u_time + delay) * 2. + PI * 4. / 2.) * 0.1) ;
    }
    
    pt = 1. - pt;
    
    float r = (255. - 0.) / 255.;
    float g = (255. - 137.) / 255.;
    float b = (255. - 123.) / 255.;
    vec3 color = vec3(r*pt,g*pt, b*pt);
    color = 1. - color;
    gl_FragColor = vec4(color,1.0);
}