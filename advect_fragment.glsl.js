export default /* glsl */ `
uniform float refScale;
uniform sampler2D stateField;
uniform vec2 splatPosition;
uniform vec2 splatVelocity;
uniform float splatRadius;
uniform vec4 splat1;
uniform vec4 splat2;
uniform vec4 splat3;
uniform vec4 splat4;
uniform vec4 splatsRadii;

float dt;


void main() {

    dt = 1.0 / 60.0;

    uv = gl_FragCoord.xy / resolution;

    float scale;
    if ( resolution.x > resolution.y ) {
        scale = ( refScale / resolution.x );
    }
    else {
        scale = ( refScale / resolution.y );
    }

    vec4 U = texture2D( stateField, uv );

    vec2 uv_0 = vec2( uv.x - U.x * scale * dt, uv.y - U.y * scale * dt );
    

    vec2 ij_0 = uv_0 * resolution;

    vec4 U_0_tex = bilerp( stateField, ij_0, resolution );

    vec2 U_0 = U_0_tex.xy;
    

    gl_FragColor.xy = U_0;
    

    gl_FragColor.xy += splatInfluence( uv, splatPosition, splatVelocity, splatRadius );

    if ( splat1.x > 0.0 || splat1.y > 0.0 ) {
        gl_FragColor.xy += splatInfluence( uv, vec2( splat1.x, splat1.y ), vec2( splat1.z, splat1.w ), splatsRadii[ 0 ] );

        if ( splat2.x > 0.0 || splat2.y > 0.0 ) {
            gl_FragColor.xy += splatInfluence( uv, vec2( splat2.x, splat2.y ), vec2( splat2.z, splat2.w ), splatsRadii[ 1 ] );

            if ( splat3.x > 0.0 || splat3.y > 0.0 ) {
                gl_FragColor.xy += splatInfluence( uv, vec2( splat3.x, splat3.y ), vec2( splat3.z, splat3.w ), splatsRadii[ 2 ] );

                if ( splat4.x > 0.0 || splat4.y > 0.0 ) {
                    gl_FragColor.xy += splatInfluence( uv, vec2( splat4.x, splat4.y ), vec2( splat4.z, splat4.w ), splatsRadii[ 3 ] );
                }
            }
        }
    }
    

    gl_FragColor = 0.9995 * vec4( gl_FragColor.x, gl_FragColor.y, 0, 0 );
    
   
}`