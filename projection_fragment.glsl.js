export default /* glsl */ `
uniform float refScale;
uniform sampler2D stateField;

void main() {

    float scale;

    if ( resolution.x > resolution.y ) {
        scale = refScale / resolution.x;
    }
    else {
        scale = refScale / resolution.y;
    }

    uv = gl_FragCoord.xy / resolution;
    vec2 uv_R = vec2( ( gl_FragCoord.x + 1.0 ) / resolution.x, gl_FragCoord.y / resolution.y );
    vec2 uv_L = vec2( ( gl_FragCoord.x - 1.0 ) / resolution.x, gl_FragCoord.y / resolution.y );
    vec2 uv_T = vec2( gl_FragCoord.x / resolution.x, ( gl_FragCoord.y + 1.0 ) / resolution.y );
    vec2 uv_B = vec2( gl_FragCoord.x / resolution.x, ( gl_FragCoord.y - 1.0 ) / resolution.y );

    vec4 state_R = texture2D( stateField, uv_R );
    vec4 state_L = texture2D( stateField, uv_L );
    vec4 state_T = texture2D( stateField, uv_T );
    vec4 state_B = texture2D( stateField, uv_B );

    vec4 state_C = texture2D( stateField, uv );

    vec2 W_U = vec2( state_C.x, state_C.y );
    
    vec2 nablap = 0.5 * vec2( state_R.b - state_L.b, state_T.b - state_B.b );

    vec2 U_C = W_U - ( 1.0 / scale / 2.0 ) * nablap;
    
    gl_FragColor = vec4( U_C.x, U_C.y, state_C.b, state_C.a );
    
}`