export default /* glsl */ `
uniform vec2 simResolution;
uniform sampler2D stateField;
uniform sampler2D dyeField;
uniform bool isDyeDecay;
uniform vec2 dyePosition;
uniform float splatRadius;
uniform int displayStyle;
uniform float time;
uniform vec4 splatsPos1;
uniform vec4 splatsPos2;
uniform vec4 randSplatColors;
uniform vec4 splatsRadii;

float simScale;


void main() {

    simScale = simResolution.x / resolution.x;

    float dt = 1.0 / 60.0;


    uv = gl_FragCoord.xy / resolution;

    vec4 U_C = bilerp( stateField, gl_FragCoord.xy * ( simResolution / resolution ), simResolution );
    
    vec2 uv_2 = vec2( uv.x - U_C.x * ( resolution.x / simResolution.x ) * dt, uv.y - U_C.y * ( resolution.y / simResolution.y ) * dt );

    vec2 FragCoord_2 = uv_2 * resolution;
    
    vec4 dye_2 = texture2D( dyeField, FragCoord_2 / resolution );
    
    float decayFactor;

    if ( isDyeDecay ) {
        decayFactor = 0.998;
    }
    else {
        decayFactor = 1.0;
    }

    gl_FragColor = vec4( dye_2.r * decayFactor, dye_2.g * decayFactor, dye_2.b * decayFactor, 1 );

    if ( dyePosition.x != 0.0 || dyePosition.y != 0.0 ) {
        float splatAmt =  0.5 * splatInfluence( uv,  dyePosition, splatRadius );

        if ( displayStyle == 0 ) {
            gl_FragColor.rgb = vec3( clamp( gl_FragColor.r + splatAmt, 0.0, 1.0 ), clamp( gl_FragColor.g + splatAmt, 0.0, 1.0 ), clamp( gl_FragColor.b + splatAmt, 0.0, 1.0 ) );
        }

        else if ( displayStyle == 1 ) {
            float colorPeriodFactor = 1000.0;

            vec3 timeColor = angleColor( time / colorPeriodFactor );
            
            vec3 dyeInfluence = vec3( quadBez( splatAmt * timeColor.r ), quadBez( splatAmt * timeColor.g ), quadBez( splatAmt * timeColor.b ) );
            gl_FragColor.rgb = vec3( clamp( gl_FragColor.r + dyeInfluence.r, 0.0, 1.0 ), clamp( gl_FragColor.g + dyeInfluence.g, 0.0, 1.0 ), clamp( gl_FragColor.b + dyeInfluence.b, 0.0, 1.0 ) );

        }
    }

    float dyeRadiusFactor = 2.5;

    if ( splatsPos1.x > 0.0 || splatsPos1.y > 0.0 ) {
        float splat1Infl = splatInfluence( uv, vec2( splatsPos1.x, splatsPos1.y ), splatsRadii.x * dyeRadiusFactor );
        if ( displayStyle == 0 ) {
            gl_FragColor.rgb = vec3( clamp( gl_FragColor.r + splat1Infl, 0.0, 1.0 ), clamp( gl_FragColor.g + splat1Infl, 0.0, 1.0 ), clamp( gl_FragColor.b + splat1Infl, 0.0, 1.0 ) );
        }
        else if ( displayStyle == 1 ) {
            vec3 splat1Color = angleColor( randSplatColors.x );
            gl_FragColor.rgb += vec3( quadBez( splat1Color.r * splat1Infl ), quadBez( splat1Color.g * splat1Infl ), quadBez( splat1Color.b * splat1Infl ) );
        }

        if ( splatsPos1.z > 0.0 || splatsPos1.w > 0.0 ) {
            float splat2Infl = splatInfluence( uv, vec2( splatsPos1.z, splatsPos1.w ), splatsRadii.y * dyeRadiusFactor );
            if ( displayStyle == 0 ) {
                gl_FragColor.rgb = vec3( clamp( gl_FragColor.r + splat2Infl, 0.0, 1.0 ), clamp( gl_FragColor.g + splat2Infl, 0.0, 1.0 ), clamp( gl_FragColor.b + splat2Infl, 0.0, 1.0 ) );
            }
            else if ( displayStyle == 1 ) {
                vec3 splat2Color = angleColor( randSplatColors.y );
                gl_FragColor.rgb += vec3( quadBez( splat2Color.r * splat2Infl ), quadBez( splat2Color.g * splat1Infl ), quadBez( splat2Color.b * splat2Infl ) );
            }

            if ( splatsPos2.x > 0.0 || splatsPos2.y > 0.0 ) {
                float splat3Infl = splatInfluence( uv, vec2( splatsPos2.x, splatsPos2.y ), splatsRadii.z * dyeRadiusFactor );
                if ( displayStyle == 0 ) {
                    gl_FragColor.rgb = vec3( clamp( gl_FragColor.r + splat3Infl, 0.0, 1.0 ), clamp( gl_FragColor.g + splat3Infl, 0.0, 1.0 ), clamp( gl_FragColor.b + splat3Infl, 0.0, 1.0 ) );
                }
                else if ( displayStyle == 1 ) {
                    vec3 splat3Color = angleColor( randSplatColors.z );
                    gl_FragColor.rgb += vec3( quadBez( splat3Color.r * splat3Infl ), quadBez( splat3Color.g * splat3Infl ), quadBez( splat3Color.b * splat3Infl ) );
                }

                if ( splatsPos2.z > 0.0 || splatsPos2.w > 0.0 ) {
                    float splat4Infl = splatInfluence( uv, vec2( splatsPos2.z, splatsPos2.w ), splatsRadii.w * dyeRadiusFactor );
                    if ( displayStyle == 0 ) {
                        gl_FragColor.rgb = vec3( clamp( gl_FragColor.r + splat4Infl, 0.0, 1.0 ), clamp( gl_FragColor.g + splat4Infl, 0.0, 1.0 ), clamp( gl_FragColor.b + splat4Infl, 0.0, 1.0 ) );
                    }
                    else if ( displayStyle == 1 ) {
                        vec3 splat4Color = angleColor( randSplatColors.w );
                        gl_FragColor.rgb += vec3( quadBez( splat4Color.r * splat4Infl ), quadBez( splat4Color.g * splat4Infl ), quadBez( splat4Color.b * splat4Infl ) );
                    }
                }
            }

        }
    }
}`