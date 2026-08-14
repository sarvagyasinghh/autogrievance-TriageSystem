import React, { useEffect, useRef } from 'react';

interface CanvasShaderBgProps {
  showParticles?: boolean;
}

export const CanvasShaderBg: React.FC<CanvasShaderBgProps> = ({ showParticles = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 a0 = x - floor(x + 0.5);
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = v_texCoord;
        float t = u_time * 0.06;
        
        float n1 = snoise(uv * 2.5 + vec2(t, t * 0.4));
        float n2 = snoise(uv * 4.0 - vec2(t * 0.5, n1 * 0.4));
        float n3 = snoise(uv * 1.8 + vec2(n2, t * 0.8));
        
        // Sophisticated Dark palette: Pitch Obsidian, Deep Crimson, and Charcoal Shadow
        vec3 col1 = vec3(0.02, 0.02, 0.02); 
        vec3 col2 = vec3(0.15, 0.02, 0.02);   
        vec3 col3 = vec3(0.04, 0.04, 0.04); 
        
        float mixVal = smoothstep(-1.0, 1.0, n3);
        vec3 finalCol = mix(col1, mix(col3, col2, n1 * 0.3 + 0.3), mixVal * 0.25);
        
        // Subtle interactive glow from mouse
        float d = length(uv - (u_mouse / u_resolution));
        finalCol += vec3(0.18, 0.03, 0.03) * exp(-d * 3.5) * 0.15;
        
        gl_FragColor = vec4(finalCol, 1.0);
      }
    `;

    function compileShader(type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    const vertexShader = compileShader(gl.VERTEX_SHADER, vs);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vertexShader);
    gl.attachShader(prog, fragmentShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = window.innerHeight - e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;

    const render = (time: number) => {
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, time * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {showParticles && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00daf8]/5 via-transparent to-transparent pointer-events-none" />
      )}
    </div>
  );
};
