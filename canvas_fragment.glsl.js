export default /* glsl */ `
uniform vec2 simResolution;
uniform sampler2D rtTexture;
uniform int displayStyle;

vec2 uv_mapped;
vec2 sim_FragFrac;

void main() {

    sim_FragFrac = vec2( 1.0 / simResolution.x, 1.0 / simResolution.y );

    uv = vec2( gl_FragCoord.x / resolution.x, gl_FragCoord.y / resolution.y );
    
    uv_mapped = vec2( uv.x * ( 1.0 - 2.0 * sim_FragFrac.x ) + sim_FragFrac.x, uv.y * ( 1.0 - 2.0 * sim_FragFrac.y ) + sim_FragFrac.y );

    vec4 texel = texture2D( rtTexture, uv_mapped );

    if ( displayStyle == 0 || displayStyle == 1 ) {
        
        gl_FragColor = vec4( texel.r, texel.g, texel.b, 1 );

    }

    else if ( displayStyle == 2 ) {

        vec3 velColor = angleColor( atan( texel.y, texel.x ), 3.0 );
        float vMag = sqrt( pow( texel.x, 2.0 ) + pow( texel.y, 2.0 ) );

        gl_FragColor = ( 0.875 * pow( simResolution.x, 0.125 ) ) * vec4( quadBez( vMag * velColor.r ), quadBez( vMag * velColor.g ), quadBez( vMag * velColor.b ), 1.0 );

    }

}
`