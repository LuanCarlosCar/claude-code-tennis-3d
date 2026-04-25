import * as THREE from 'three'
import { type ColorMaskUniforms } from '@/lib/colorMaskStore'

export function attachColorReplaceShader(
  material: THREE.MeshStandardMaterial,
  uniforms: ColorMaskUniforms,
) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTargetColor = uniforms.uTargetColor
    shader.uniforms.uAccentColor = uniforms.uAccentColor
    shader.uniforms.uReplaceStrength = uniforms.uReplaceStrength
    shader.uniforms.uThreshold = uniforms.uThreshold
    shader.uniforms.uSoftness = uniforms.uSoftness
    shader.uniforms.uAccentThreshold = uniforms.uAccentThreshold
    shader.uniforms.uAccentSoftness = uniforms.uAccentSoftness

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `#include <common>
      uniform vec3 uTargetColor;
      uniform vec3 uAccentColor;
      uniform float uReplaceStrength;
      uniform float uThreshold;
      uniform float uSoftness;
      uniform float uAccentThreshold;
      uniform float uAccentSoftness;
      `,
    )

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `
      #ifdef USE_MAP
        vec4 sampledDiffuseColor = texture2D( map, vMapUv );
        vec3 srcRgb = sampledDiffuseColor.rgb;

        float lum = dot(srcRgb, vec3(0.299, 0.587, 0.114));
        float darkMask = 1.0 - smoothstep(uThreshold - uSoftness, uThreshold + uSoftness, lum);

        float maxC = max(max(srcRgb.r, srcRgb.g), srcRgb.b);
        float minC = min(min(srcRgb.r, srcRgb.g), srcRgb.b);
        float sat = maxC > 0.0 ? (maxC - minC) / maxC : 0.0;
        float accentMask = smoothstep(uAccentThreshold - uAccentSoftness, uAccentThreshold + uAccentSoftness, sat);

        accentMask *= (1.0 - darkMask);

        vec3 afterDark = mix(srcRgb, uTargetColor, darkMask * uReplaceStrength);
        vec3 afterAccent = mix(afterDark, uAccentColor, accentMask * uReplaceStrength);

        sampledDiffuseColor.rgb = afterAccent;
        diffuseColor *= sampledDiffuseColor;
      #endif
      `,
    )
  }
  material.needsUpdate = true
}
