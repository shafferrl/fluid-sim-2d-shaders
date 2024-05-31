export default /* glsl */ `
#define E 2.718281828459045
#define PI 3.141592653589793
#define PI2 6.283185307179586

uniform vec2 resolution;

vec2 uv;

// Quadratic Bezier curve adjustment
float quadBez( float value ) {
    return - value + 2.0 * sqrt( value );
}

// Bilinear interpolation
vec4 bilerp( sampler2D field, vec2 coord, vec2 bilerpRes ) {

    vec2 coord_LB = vec2( floor( coord.x - 0.5 ) + 0.5, floor( coord.y - 0.5 ) + 0.5 );
    vec2 coord_LT = vec2( floor( coord.x - 0.5 ) + 0.5, floor( coord.y - 0.5 ) + 1.5 );
    vec2 coord_RT = vec2( floor( coord.x - 0.5 ) + 1.5, floor( coord.y - 0.5 ) + 1.5 );
    vec2 coord_RB = vec2( floor( coord.x - 0.5 ) + 1.5, floor( coord.y - 0.5 ) + 0.5 );

    float a_LB = ( coord.x - coord_LB.x ) * ( coord.y - coord_LB.y );
    float a_LT = ( coord.x - coord_LT.x ) * ( coord_LT.y - coord.y );
    float a_RT = ( coord_RT.x - coord.x ) * ( coord_RT.y - coord.y );
    float a_RB = ( coord_RB.x - coord.x ) * ( coord.y - coord_RB.y );

    vec4 x_LB = texture2D( field, vec2( coord_LB.x / bilerpRes.x, coord_LB.y / bilerpRes.y ) );
    vec4 x_LT = texture2D( field, vec2( coord_LT.x / bilerpRes.x, coord_LT.y / bilerpRes.y ) );
    vec4 x_RT = texture2D( field, vec2( coord_RT.x / bilerpRes.x, coord_RT.y / bilerpRes.y ) );
    vec4 x_RB = texture2D( field, vec2( coord_RB.x / bilerpRes.x, coord_RB.y / bilerpRes.y ) );

    return x_LB * a_RT + x_LT * a_RB + x_RT * a_LB + x_RB * a_LT;

}

// Color-code by angle
vec3 angleColor( float colorAngle, float colorPowerFactor ) {

    float redFactor = pow( 0.5 * ( cos( colorAngle ) + 1.0 ), colorPowerFactor );
    float grnFactor = pow( 0.5 * ( cos( colorAngle - 2.0 * PI / 3.0 ) + 1.0 ), colorPowerFactor );
    float bluFactor = pow( 0.5 * ( cos( colorAngle - 4.0 * PI / 3.0 ) + 1.0 ), colorPowerFactor );

    return vec3( redFactor, grnFactor, bluFactor );
}

// Overloaded function
vec3 angleColor( float colorAngle ) {

    float colorPowerFactor = 6.0;

    float redFactor = pow( 0.5 * ( cos( colorAngle ) + 1.0 ), colorPowerFactor );
    float grnFactor = pow( 0.5 * ( cos( colorAngle - 2.0 * PI / 3.0 ) + 1.0 ), colorPowerFactor );
    float bluFactor = pow( 0.5 * ( cos( colorAngle - 4.0 * PI / 3.0 ) + 1.0 ), colorPowerFactor );

    return vec3( redFactor, grnFactor, bluFactor );

}

// Gaussian splat
vec2 splatInfluence( vec2 frag_uv, vec2 splat_uv, vec2 velocity, float sigma ) {
    float splat_dev;
    if ( resolution.x > resolution.y ) {
        splat_dev = sqrt( pow( frag_uv.x - splat_uv.x, 2.0 ) + pow( ( frag_uv.y - splat_uv.y ) * resolution.y / resolution.x , 2.0 ) );
    }
    else {
        splat_dev = sqrt( pow( ( frag_uv.x - splat_uv.x ) * resolution.x / resolution.y, 2.0 ) + pow( ( frag_uv.y - splat_uv.y ) , 2.0 ) );
    }
    float g_mean = ( 1.0 / ( sigma * sqrt( PI2 ) ) );
    float inflncFullScalar = clamp( 1.0 * ( 1.0 / g_mean ) * ( 1.0 / ( sigma * sqrt( PI2 ) ) ) * pow( E, -0.5 * ( pow( splat_dev, 2.0 ) / pow( sigma, 2.0 ) ) ), 0.0, 1.0 );

    vec2 splatInfl;

    if ( velocity.x >= 0.0 ) {
        splatInfl.x = min( ( velocity.x ), 1.0 ) * inflncFullScalar;
    }
    else {
        splatInfl.x = -1.0 * min( ( abs( velocity.x ) ), 1.0 ) * inflncFullScalar;
    }
    if ( velocity.y >= 0.0 ) {
        splatInfl.y = min( ( velocity.y ), 1.0 ) * inflncFullScalar;
    }
    else {
        splatInfl.y = -1.0 * min( ( abs( velocity.y ) ), 1.0 ) * inflncFullScalar;
    }

    return splatInfl;
}

// Overloaded function
float splatInfluence( vec2 frag_uv, vec2 splat_uv, float sigma ) {

    float splat_dev;
    if ( resolution.x > resolution.y ) {
        splat_dev = 0.875 * sqrt( pow( frag_uv.x - splat_uv.x, 2.0 ) + pow( ( frag_uv.y - splat_uv.y ) * resolution.y / resolution.x , 2.0 ) );
    }
    else {
        splat_dev = 0.875 * sqrt( pow( ( frag_uv.x - splat_uv.x ) * resolution.x / resolution.y, 2.0 ) + pow( ( frag_uv.y - splat_uv.y ) , 2.0 ) );
    }
    float g_mean = ( 1.0 / ( sigma * sqrt( PI2 ) ) );
    return clamp( 1.0 * ( 1.0 / g_mean ) * ( 1.0 / ( sigma * sqrt( PI2 ) ) ) * pow( E, -0.5 * ( pow( splat_dev, 2.0 ) / pow( sigma, 2.0 ) ) ), 0.0, 1.0 );

}`