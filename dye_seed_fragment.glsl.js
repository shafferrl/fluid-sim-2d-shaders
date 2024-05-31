export default /* glsl */ `
uniform sampler2D seedTexture;
uniform vec2 seedTextureRes;
uniform int seedStyle;

vec2 uv_mapped;


void main() {
    
    uv = vec2( gl_FragCoord.x / resolution.x, gl_FragCoord.y / resolution.y );


    float textureAspect = seedTextureRes.x / seedTextureRes.y;
    float aspect = resolution.x / resolution.y;

    if ( aspect > textureAspect ) {
        uv_mapped.x = uv.x;
        float y_diff = resolution.x * ( 1.0 - ( textureAspect / aspect ) );
        uv_mapped.y = uv.y * ( 1.0 - y_diff / resolution.x ) + ( y_diff / resolution.x ) / 2.0;
    }
    else {
        uv_mapped.y = uv.y;
        float x_diff = resolution.y * ( 1.0 - ( aspect / textureAspect ) );
        uv_mapped.x = uv.x * ( 1.0 - x_diff / resolution.y ) + ( x_diff / resolution.y ) / 2.0;
    }


    float modWidthSquares = 30.0;
    float gapWidthSquares = 70.0;

    float modWidthGrid = 8.0;
    float gapWidthGrid = 70.0;


    if ( seedStyle == 0 ) {

        gl_FragColor = vec4( 0, 0, 0, 1 );
    
    }

    else if ( seedStyle == 1 ) {

        if ( mod( gl_FragCoord.x, gapWidthSquares ) < modWidthSquares && mod( gl_FragCoord.y, gapWidthSquares ) < modWidthSquares ) {
            gl_FragColor = vec4( 1, 1, 1, 0 );
        }
        else {
            gl_FragColor = vec4( 0, 0, 0, 1 );
        }

    }

    else if ( seedStyle == 2 ) {

        if ( mod( gl_FragCoord.x, gapWidthSquares * 3.0 ) < modWidthSquares ) {
            if ( mod( gl_FragCoord.y, gapWidthSquares * 3.0 ) < modWidthSquares ) {
                gl_FragColor = vec4( 1, 0, 0, 1 );
            }
            else if ( mod( gl_FragCoord.y + gapWidthSquares, gapWidthSquares * 3.0 ) < modWidthSquares ) {
                gl_FragColor = vec4( 0, 1, 0, 1 );
            }
            else if ( mod( gl_FragCoord.y + 2.0 * gapWidthSquares, gapWidthSquares * 3.0 ) < modWidthSquares ) {
                gl_FragColor = vec4( 0, 0, 1, 1 );
            }
            else {
                gl_FragColor = vec4( 0, 0, 0, 1 );
            }
        }
        else if ( mod( gl_FragCoord.x + gapWidthSquares, gapWidthSquares * 3.0 ) < modWidthSquares ) {
            if ( mod( gl_FragCoord.y, gapWidthSquares * 3.0 ) < modWidthSquares ) {
                gl_FragColor = vec4( 0, 1, 0, 1 );
            }
            else if ( mod( gl_FragCoord.y + gapWidthSquares, gapWidthSquares * 3.0 ) < modWidthSquares ) {
                gl_FragColor = vec4( 0, 0, 1, 1 );
            }
            else if ( mod( gl_FragCoord.y + 2.0 * gapWidthSquares, gapWidthSquares * 3.0 ) < modWidthSquares ) {
                gl_FragColor = vec4( 1, 0, 0, 1 );
            }
            else {
                gl_FragColor = vec4( 0, 0, 0, 1 );
            }
        }
        else if ( mod( gl_FragCoord.x + 2.0 * gapWidthSquares, gapWidthSquares * 3.0 ) < modWidthSquares ) {
            if ( mod( gl_FragCoord.y, gapWidthSquares * 3.0 ) < modWidthSquares ) {
                gl_FragColor = vec4( 0, 0, 1, 1 );
            }
            else if ( mod( gl_FragCoord.y + gapWidthSquares, gapWidthSquares * 3.0 ) < modWidthSquares ) {
                gl_FragColor = vec4( 1, 0, 0, 1 );
            }
            else if ( mod( gl_FragCoord.y + 2.0 * gapWidthSquares, gapWidthSquares * 3.0 ) < modWidthSquares ) {
                gl_FragColor = vec4( 0, 1, 0, 1 );
            }
            else {
                gl_FragColor = vec4( 0, 0, 0, 1 );
            }
        }
        else {
            gl_FragColor = vec4( 0, 0, 0, 1 );
        }

    }

    else if ( seedStyle == 3 ) {

        if ( mod( gl_FragCoord.x, gapWidthGrid ) < modWidthGrid || mod( gl_FragCoord.y, gapWidthGrid ) < modWidthGrid ) {
            gl_FragColor = vec4( 1 );
        }
        else {
            gl_FragColor = vec4( 0, 0, 0, 1 );
        }

    }

    else if ( seedStyle == 4 ) {
    
        if ( mod( gl_FragCoord.x, gapWidthGrid * 3.0 ) < modWidthGrid || mod( gl_FragCoord.y, gapWidthGrid * 3.0 ) < modWidthGrid ) {
            gl_FragColor = vec4( 1, 0, 0, 1 );
        }
        else if ( mod( gl_FragCoord.x + gapWidthGrid, gapWidthGrid * 3.0 ) < modWidthGrid || mod( gl_FragCoord.y + gapWidthGrid, gapWidthGrid * 3.0 ) < modWidthGrid ) {
            gl_FragColor = vec4( 0, 1, 0, 1 );
        }
        else if ( mod( gl_FragCoord.x + 2.0 * gapWidthGrid, gapWidthGrid * 3.0 ) < modWidthGrid || mod( gl_FragCoord.y + 2.0 * gapWidthGrid, gapWidthGrid * 3.0 ) < modWidthGrid ) {
            gl_FragColor = vec4( 0, 0, 1, 1 );
        }
        else {
            gl_FragColor = vec4( 0, 0, 0, 1 );
        }

    }

    else if ( seedStyle == 5 ) {

        gl_FragColor = texture2D( seedTexture, uv_mapped );
        
    }
    
}`