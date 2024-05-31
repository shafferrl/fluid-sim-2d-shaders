export default /* glsl */ `
uniform float time;
uniform float refScale;
uniform int solveType;
uniform sampler2D stateField;
uniform float viscosity;

void main() {

    float scale;
    
    if ( resolution.x > resolution.y ) {
        scale = ( refScale / resolution.x );
    }
    else {
        scale = ( refScale / resolution.y );
    }

    // pseudo-viscosity
    float nu = viscosity;

    uv = gl_FragCoord.xy / resolution;
    vec2 uv_R = vec2( ( gl_FragCoord.x + 1.0 ) / resolution.x, gl_FragCoord.y / resolution.y );
    vec2 uv_L = vec2( ( gl_FragCoord.x - 1.0 ) / resolution.x, gl_FragCoord.y / resolution.y );
    vec2 uv_T = vec2( gl_FragCoord.x / resolution.x, ( gl_FragCoord.y + 1.0 ) / resolution.y );
    vec2 uv_B = vec2( gl_FragCoord.x / resolution.x, ( gl_FragCoord.y - 1.0 ) / resolution.y );

    float dt = 1.0 / 60.0;

    vec4 state_R = texture2D( stateField, uv_R );
    vec4 state_L = texture2D( stateField, uv_L );
    vec4 state_T = texture2D( stateField, uv_T );
    vec4 state_B = texture2D( stateField, uv_B );

    vec4 state_C = texture2D( stateField, uv );

    // pressure solver
    if ( solveType == 0 ) {

        // interior
        if ( gl_FragCoord.x != 0.5 && gl_FragCoord.x != resolution.x - 0.5 && gl_FragCoord.y != 0.5 && gl_FragCoord.y != resolution.y - 0.5 ) {

            float p_R = state_R.b;
            float p_L = state_L.b;
            float p_T = state_T.b;
            float p_B = state_B.b;

            float nablaW_C = state_C.a;

            float alpha = pow( scale, 2.0 );
            float beta = 4.0;

            float pNext = ( p_R + p_L + p_T + p_B - alpha * nablaW_C ) / beta;

            gl_FragColor = vec4( state_C.r, state_C.g, pNext, state_C.a );
        }

        // boundaries
        else {
            if ( gl_FragCoord.x == 0.5 ) {

                gl_FragColor = vec4( state_C.r, state_C.g, state_R.b, state_C.a );
            }
            else if ( gl_FragCoord.x == resolution.x - 0.5 ) {

                gl_FragColor = vec4( state_C.r, state_C.g, state_L.b, state_C.a );
            }
            if ( gl_FragCoord.y == 0.5 ) {
                
                gl_FragColor = vec4( state_C.r, state_C.g, state_T.b, state_C.a );
            }
            else if ( gl_FragCoord.y == resolution.y - 0.5 ) {

                gl_FragColor = vec4( state_C.r, state_C.g, state_B.b, state_C.a );
            }
        }
    }

    // velocity viscous diffusion solver
    else if ( solveType == 1 ) {

        float alpha = pow( scale, 2.0 ) / ( nu * dt );
        float beta = 4.0 + alpha;
        
        vec2 U_R = vec2( state_R.x, state_R.y );
        vec2 U_L = vec2( state_L.x, state_L.y );
        vec2 U_T = vec2( state_T.x, state_T.y );
        vec2 U_B = vec2( state_B.x, state_B.y );
        
        vec2 U_C = vec2( state_C.x, state_C.y );

        vec2 U_k = ( U_R + U_L + U_T + U_B + alpha * U_C ) / beta;

        // interior
        if ( gl_FragCoord.x != 0.5 && gl_FragCoord.x != resolution.x - 0.5 && gl_FragCoord.y != 0.5 && gl_FragCoord.y != resolution.y - 0.5 ) {

            gl_FragColor = vec4( U_k.x, U_k.y, state_C.b, state_C.a );

        }
        // boundaries
        else {
            if ( gl_FragCoord.x == 0.5 || gl_FragCoord.x == resolution.x - 0.5 ) {

                float U_u;
                
                if ( gl_FragCoord.x == 0.5 ) {
                    U_u = -1.0 * state_R.x;
                }
                else {
                    U_u = -1.0 * state_L.x;
                }
                
                gl_FragColor = vec4( U_u, U_k.y, state_C.b, state_C.a );

            }
            if ( gl_FragCoord.y == 0.5 || gl_FragCoord.y == resolution.y - 0.5 ) {

                float U_v;
                
                if ( gl_FragCoord.y == 0.5 ) {
                    U_v = -1.0 * state_T.y;
                }
                else {
                    U_v = -1.0 * state_B.y;
                }
                
                gl_FragColor = vec4( U_k.x, U_v, state_C.b, state_C.a );
                
            }
        }
    }

}`