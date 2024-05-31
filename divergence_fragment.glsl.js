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
    
    float divW_u;
    float divW_v;

    vec4 state_R = texture2D( stateField, uv_R );
    vec4 state_L = texture2D( stateField, uv_L );
    vec4 state_T = texture2D( stateField, uv_T );
    vec4 state_B = texture2D( stateField, uv_B );

    vec4 state_C = texture2D( stateField, uv );

    
    if ( gl_FragCoord.x > 0.5 && gl_FragCoord.y > 0.5 && gl_FragCoord.x < resolution.x - 0.5 && gl_FragCoord.y < resolution.y - 0.5 ) {

        divW_u = ( state_R.x - state_L.x );
        divW_v = ( state_T.y - state_B.y );
        

    }
    else if ( gl_FragCoord.x == 0.5 && gl_FragCoord.y > 0.5 && gl_FragCoord.y < resolution.y - 0.5 ) {
        
        divW_u = state_R.x;
        divW_v = 0.0;

    }
    else if ( gl_FragCoord.x == resolution.x - 0.5 && gl_FragCoord.y > 0.5 && gl_FragCoord.y < resolution.y - 0.5 ) {

        divW_u = state_L.x;
        divW_u = 0.0;

    }
    else if ( gl_FragCoord.y == 0.5 && gl_FragCoord.x > 0.5 && gl_FragCoord.x < resolution.x - 0.5 ) {

        divW_u = 0.0;
        divW_v = state_T.y;

    }
    else if ( gl_FragCoord.y == resolution.y - 0.5 && gl_FragCoord.x > 0.5 && gl_FragCoord.x < resolution.x - 0.5 ) {

        divW_u = 0.0;
        divW_v = state_B.y;
        
    }
    else if ( gl_FragCoord.x == 0.5 && gl_FragCoord.y == 0.5 ) {

        divW_u = 0.0;
        divW_v = 0.0;

    }
    else if ( gl_FragCoord.x == 0.5 && gl_FragCoord.y == resolution.y - 0.5 ) {

        divW_u = 0.0;
        divW_v = 0.0;

    }
    else if ( gl_FragCoord.x == resolution.x - 0.5 && gl_FragCoord.y == resolution.y - 0.5 ) {

        divW_u = 0.0;
        divW_v = 0.0;

    }
    else if ( gl_FragCoord.x == resolution.x - 0.5 && gl_FragCoord.y == 0.5 ) {

        divW_u = 0.0;
        divW_v = 0.0;

    }

    float divW = ( 1.0 / scale / 2.0 ) * ( divW_u + divW_v );

    gl_FragColor = vec4( state_C.r, state_C.g, 0.0, divW );
    
}`