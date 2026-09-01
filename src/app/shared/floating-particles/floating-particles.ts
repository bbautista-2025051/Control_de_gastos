import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from "@angular/core";

const COLORS = ["16, 185, 129", "34, 211, 238", "167, 139, 250"];

interface Particle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
  phase: number;
  color: string;
  alpha: number;
}

@Component({
  selector: "app-floating-particles",
  template: `
    <canvas class="particles-canvas" #canvas aria-hidden="true"></canvas>
  `,
  styles: [
    `
      :host {
        position: absolute;
        inset: 0;
        display: block;
        pointer-events: none;
      }

      .particles-canvas {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class FloatingParticles implements AfterViewInit, OnDestroy {
  @ViewChild("canvas", { static: true })
  private readonly canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly count = 24;
  private rafId = 0;
  private particles: Particle[] = [];
  private dispose?: () => void;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    const parent = canvas.parentElement;

    const resize = () => {
      if (!parent) {
        return;
      }
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;

      this.particles = [];
      for (let i = 0; i < this.count; i++) {
        this.particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 1 + Math.random() * 2,
          speed: 0.12 + Math.random() * 0.35,
          drift: 0.2 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          color: COLORS[i % COLORS.length],
          alpha: 0.25 + Math.random() * 0.55,
        });
      }
    };

    const tick = (time: number) => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of this.particles) {
        p.y -= p.speed;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }

        const sway = Math.sin(time / 900 + p.phase) * p.drift;
        context.beginPath();
        context.arc(p.x + sway, p.y, p.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        context.shadowBlur = 8;
        context.shadowColor = `rgba(${p.color}, 0.8)`;
        context.fill();
      }

      this.rafId = requestAnimationFrame(tick);
    };

    resize();
    this.rafId = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);

    this.dispose = () => {
      cancelAnimationFrame(this.rafId);
      window.removeEventListener("resize", resize);
    };
  }

  ngOnDestroy(): void {
    this.dispose?.();
  }
}
