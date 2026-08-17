import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = (a_pos + 1.0) * 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 v_uv;
uniform float u_time;
uniform vec2 u_res;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = v_uv;                      // y: 0 bottom, 1 top
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  float t = u_time * 0.05;

  // Silky aurora ribbons: horizontally stretched, double domain warp
  vec2 q = vec2(p.x * 0.85, p.y * 2.3);
  vec2 warp = vec2(
    fbm(q * 1.1 + vec2(t * 0.9, -t * 0.30)),
    fbm(q * 1.1 + vec2(5.2 - t * 0.4, 1.3 + t * 0.55))
  );
  float f  = fbm(q * 1.6 + 2.2 * warp + vec2(t * 0.50, -t * 0.20));
  float f2 = fbm(q * 3.2 + 3.0 * warp.yx + vec2(-t * 0.75, t * 0.35));

  // Ridge the noise into broad silky curtains instead of a fog or thin veins.
  float ribbon  = max(1.0 - abs(f  - 0.52) * 2.2, 0.0);
  float ribbon2 = max(1.0 - abs(f2 - 0.50) * 2.5, 0.0);
  ribbon  = ribbon  * ribbon;
  ribbon2 = ribbon2 * ribbon2 * ribbon2;

  // Curtains drift across the upper sky and the outer thirds; the reading
  // column stays near-black so body text keeps its contrast.
  float sky = smoothstep(0.10, 0.72, uv.y);
  float side = smoothstep(0.08, 0.46, abs(uv.x - 0.5));
  float mask = sky * (0.13 + 0.87 * side) * 0.88;
  float energy = ribbon * mask;

  vec3 base   = vec3(0.078, 0.106, 0.082);  // #141B15
  vec3 forest = vec3(0.196, 0.267, 0.204);  // #324434
  vec3 sage   = vec3(0.365, 0.478, 0.365);
  vec3 amber  = vec3(1.000, 0.651, 0.118);  // #FFA61E

  vec3 c = base;
  c = mix(c, forest, clamp(energy * 1.15, 0.0, 1.0));
  c = mix(c, sage,   clamp(ribbon2 * mask * 0.50, 0.0, 1.0));
  // A thin warm rim only where both ribbon layers peak — the orange reads as
  // light catching an edge, never as a wash.
  c = mix(c, amber,  clamp(ribbon2 * ribbon * mask * 0.26, 0.0, 1.0));

  // Sparse twinkling stars, upper sky only
  vec2 sp = uv * u_res / 3.0;
  vec2 cell = floor(sp);
  float h = hash(cell);
  if (h > 0.9982) {
    float twinkle = 0.5 + 0.5 * sin(u_time * (0.8 + hash(cell + 7.0) * 1.6) + hash(cell + 3.0) * 6.2831);
    float dot_ = smoothstep(0.42, 0.05, length(fract(sp) - 0.5));
    c += dot_ * twinkle * sky * 0.55 * vec3(0.85, 0.85, 1.0);
  }

  // Gentle corner falloff only — the aurora lives at the edges, so a
  // conventional vignette would erase it.
  float vig = smoothstep(1.05, 0.55, length((uv - 0.5) * vec2(1.0, 1.15)));
  c *= mix(0.92, 1.0, vig);
  c += (hash(gl_FragCoord.xy + fract(u_time)) - 0.5) / 255.0;

  gl_FragColor = vec4(c, 1.0);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function buildProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export default function WindBackground() {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) {
      setSupported(false);
      return;
    }
    setSupported(true);

    const program = buildProgram(gl);
    if (!program) {
      setSupported(false);
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Single full-screen triangle
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_res");

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas || !gl) return;
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    }
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    const start = performance.now();
    let lastDraw = 0;

    function frame(now: number) {
      if (!gl) return;
      if (document.hidden) {
        raf = requestAnimationFrame(frame);
        return;
      }
      // Cap to ~60fps to match the page motion budget in the spec.
      if (now - lastDraw >= 16) {
        lastDraw = now;
        gl.uniform1f(uTime, (now - start) / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, [reduce]);

  if (reduce || supported === false) {
    return <div className="wind-bg fallback" aria-hidden="true" role="presentation" />;
  }
  return (
    <div className="wind-bg" aria-hidden="true" role="presentation">
      <canvas ref={canvasRef} />
    </div>
  );
}
