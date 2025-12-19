import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, Input } from '@angular/core';

export interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  settled: boolean;
  windVelocityX: number;
  windVelocityY: number;
}

/**
 * Configuration interface for the snowfall component.
 * All properties are optional and will use default values if not provided.
 */
export interface SnowfallConfig {
  /**
   * Maximum number of snowflakes on the screen at once.
   * @default 400
   */
  maxSnowflakes?: number;
  
  /**
   * Rate at which snow accumulates on the ground (0-1).
   * Higher values create faster accumulation.
   * @default 0.6
   */
  accumulationRate?: number;
  
  /**
   * Maximum height of snow accumulation in pixels.
   * @default 50
   */
  maxAccumulationHeight?: number;
  
  /**
   * Radius in pixels around the mouse cursor that influences snowflakes.
   * Larger values create a wider wind effect area.
   * @default 250
   */
  mouseInfluenceRadius?: number;
  
  /**
   * Strength of the wind effect created by mouse movement.
   * Higher values create stronger wind forces.
   * @default 20
   */
  windForce?: number;
  
  /**
   * Rate at which wind velocity decays when mouse stops moving (0-1).
   * Higher values mean wind stops faster.
   * @default 0.85
   */
  windDecay?: number;
  
  /**
   * Inertia factor for wind velocity changes (0-1).
   * Higher values make wind changes smoother but slower.
   * @default 0.15
   */
  windInertia?: number;
  
  /**
   * Friction applied to snowflake wind velocity (0-1).
   * Higher values create more resistance to wind movement.
   * @default 0.92
   */
  windFriction?: number;
}

@Component({
  selector: 'ng-snowfall',
  templateUrl: './snowfall.component.html',
  styleUrls: ['./snowfall.component.scss']
})
export class SnowfallComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  @Input() config: SnowfallConfig = {};

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private animationFrameId?: number;
  private snowflakes: Snowflake[] = [];
  private snowAccumulation: number[] = [];
  
  // Конфигурируемые параметры с дефолтными значениями
  private maxSnowflakes: number = 400;
  private accumulationRate: number = 0.6;
  private maxAccumulationHeight: number = 50; // Ограничено до 50 пикселей
  private mouseInfluenceRadius: number = 250;
  private windForce: number = 20;
  private windDecay: number = 0.85;
  private windInertia: number = 0.15;
  private windFriction: number = 0.92;
  
  private mouseX: number = -1000;
  private mouseY: number = -1000;
  private prevMouseX: number = -1000;
  private prevMouseY: number = -1000;
  private mouseVelocityX: number = 0;
  private mouseVelocityY: number = 0;
  private lastMouseUpdate: number = 0;
  private prevMouseTime: number = performance.now();
  private lastMouseMovement: number = 0;

  ngOnInit(): void {
    // Применяем конфигурацию если она предоставлена
    if (this.config) {
      if (this.config.maxSnowflakes !== undefined) {
        this.maxSnowflakes = this.config.maxSnowflakes;
      }
      if (this.config.accumulationRate !== undefined) {
        this.accumulationRate = this.config.accumulationRate;
      }
      if (this.config.maxAccumulationHeight !== undefined) {
        this.maxAccumulationHeight = this.config.maxAccumulationHeight;
      }
      if (this.config.mouseInfluenceRadius !== undefined) {
        this.mouseInfluenceRadius = this.config.mouseInfluenceRadius;
      }
      if (this.config.windForce !== undefined) {
        this.windForce = this.config.windForce;
      }
      if (this.config.windDecay !== undefined) {
        this.windDecay = this.config.windDecay;
      }
      if (this.config.windInertia !== undefined) {
        this.windInertia = this.config.windInertia;
      }
      if (this.config.windFriction !== undefined) {
        this.windFriction = this.config.windFriction;
      }
    }
  }

  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement;
    const context = this.canvas.getContext('2d');
    if (!context) {
      console.error('Failed to get 2d context for snowfall canvas');
      return;
    }
    this.ctx = context;
    this.resizeCanvas();
    this.createSnowflakes();
    this.animate();

    window.addEventListener('resize', this.handleResize);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseleave', this.handleMouseLeave);
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== undefined) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
    
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseleave', this.handleMouseLeave);
    
    this.snowflakes = [];
    this.snowAccumulation = [];
    
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas?.width || 0, this.canvas?.height || 0);
    }
  }

  private handleResize = (): void => {
    this.resizeCanvas();
  };

  private handleMouseMove = (event: MouseEvent): void => {
    const now = performance.now();
    
    this.prevMouseX = this.mouseX;
    this.prevMouseY = this.mouseY;
    
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    
    if (this.prevMouseX !== -1000 && this.prevMouseY !== -1000) {
      const deltaTime = Math.max((now - this.prevMouseTime) / 16, 0.1);
      const dx = this.mouseX - this.prevMouseX;
      const dy = this.mouseY - this.prevMouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0.1) {
        const normalizedDx = dx / distance;
        const normalizedDy = dy / distance;
        const speed = distance / deltaTime;
        const windSpeed = Math.min(speed * 0.25, 35);
        
        this.mouseVelocityX = normalizedDx * windSpeed;
        this.mouseVelocityY = normalizedDy * windSpeed;
        this.lastMouseMovement = now;
      } else {
        this.mouseVelocityX = 0;
        this.mouseVelocityY = 0;
      }
    }
    
    this.prevMouseTime = now;
    this.lastMouseUpdate = now;
  };

  private handleMouseLeave = (): void => {
    this.mouseX = -1000;
    this.mouseY = -1000;
    this.prevMouseX = -1000;
    this.prevMouseY = -1000;
    this.mouseVelocityX *= this.windDecay;
    this.mouseVelocityY *= this.windDecay;
  };

  private resizeCanvas(): void {
    if (!this.canvas) return;
    
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    this.snowAccumulation = new Array(Math.ceil(this.canvas.width)).fill(0);
  }

  private createSnowflakes(): void {
    this.snowflakes = [];
    for (let i = 0; i < this.maxSnowflakes; i++) {
      this.snowflakes.push(this.createSnowflake());
    }
  }

  private createSnowflake(): Snowflake {
    const width = this.canvas?.width || window.innerWidth;
    const height = this.canvas?.height || window.innerHeight;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3 + 1,
      speed: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.3,
      settled: false,
      windVelocityX: 0,
      windVelocityY: 0
    };
  }

  private animate = (): void => {
    if (!this.ctx || !this.canvas) {
      return;
    }
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawSnowAccumulation();

    const windSpeed = Math.sqrt(
      this.mouseVelocityX * this.mouseVelocityX + 
      this.mouseVelocityY * this.mouseVelocityY
    );
    const hasWind = windSpeed > 0.5 && this.mouseX !== -1000 && this.mouseY !== -1000;
    const timeSinceLastMovement = performance.now() - this.lastMouseMovement;
    const windActive = windSpeed < 0.5 || timeSinceLastMovement > 50;
    
    let windDirX = 0;
    let windDirY = 0;
    if (hasWind) {
      windDirX = this.mouseVelocityX / windSpeed;
      windDirY = this.mouseVelocityY / windSpeed;
    }

    for (let i = 0; i < this.snowflakes.length; i++) {
      const snowflake = this.snowflakes[i];
      if (snowflake.settled) {
        continue;
      }

      const groundLevel = this.canvas.height - this.getSnowHeightAt(snowflake.x);
      
      if (snowflake.y >= groundLevel - snowflake.radius) {
        snowflake.settled = true;
        this.accumulateSnow(snowflake.x);
        snowflake.y = -10;
        snowflake.x = Math.random() * this.canvas.width;
        snowflake.settled = false;
      } else {
        snowflake.y += snowflake.speed;
        snowflake.x += Math.sin(snowflake.y * 0.01) * 0.5;
        
        if (hasWind) {
          const dx = snowflake.x - this.mouseX;
          const dy = snowflake.y - this.mouseY;
          const distanceToMouse = Math.sqrt(dx * dx + dy * dy);
          const projectionLength = dx * windDirX + dy * windDirY;
          const perpendicularDistance = Math.sqrt(
            Math.max(0, distanceToMouse * distanceToMouse - projectionLength * projectionLength)
          );
          const maxPerpendicularDistance = Math.min(
            this.mouseInfluenceRadius * 0.3,
            this.mouseInfluenceRadius * 0.3 + projectionLength * 0.4
          );
          
          if (projectionLength > 0 && projectionLength < this.mouseInfluenceRadius && 
              perpendicularDistance < maxPerpendicularDistance) {
            const normalizedProjection = projectionLength / this.mouseInfluenceRadius;
            const normalizedPerpendicular = perpendicularDistance / maxPerpendicularDistance;
            const windStrength = (1 - normalizedProjection) * (1 - normalizedPerpendicular);
            const windForce = this.windForce * windStrength * Math.min(windSpeed / 10, 2.5);
            const horizontalForce = windForce * (1 + Math.abs(windDirX) * 0.5);
            const verticalForce = windForce * Math.abs(windDirY) * 0.3;
            const targetVelocityX = windDirX * horizontalForce;
            const targetVelocityY = windDirY * verticalForce;
            
            snowflake.windVelocityX += (targetVelocityX - snowflake.windVelocityX) * this.windInertia;
            snowflake.windVelocityY += (targetVelocityY - snowflake.windVelocityY) * this.windInertia;
            
            snowflake.x += snowflake.windVelocityX;
            snowflake.y += snowflake.windVelocityY;
            
            snowflake.windVelocityX *= this.windFriction;
            snowflake.windVelocityY *= this.windFriction;
          }
        }
        
        if (!hasWind) {
          snowflake.windVelocityX *= this.windFriction;
          snowflake.windVelocityY *= this.windFriction;
        }
      }

      if (snowflake.x > this.canvas.width) {
        snowflake.x = 0;
      } else if (snowflake.x < 0) {
        snowflake.x = this.canvas.width;
      }

      this.ctx.beginPath();
      this.ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${snowflake.opacity})`;
      this.ctx.fill();
    }
    
    if (windActive) {
      this.mouseVelocityX *= this.windDecay;
      this.mouseVelocityY *= this.windDecay;
      
      if (windSpeed < 0.1) {
        this.mouseVelocityX = 0;
        this.mouseVelocityY = 0;
      }
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private getSnowHeightAt(x: number): number {
    const index = Math.floor(x);
    if (index >= 0 && index < this.snowAccumulation.length) {
      return this.snowAccumulation[index];
    }
    return 0;
  }

  private accumulateSnow(x: number): void {
    const index = Math.floor(x);
    if (index >= 0 && index < this.snowAccumulation.length) {
      const spread = 20;
      for (let i = Math.max(0, index - spread); i <= Math.min(this.snowAccumulation.length - 1, index + spread); i++) {
        const distance = Math.abs(i - index);
        const weight = Math.pow(1 - distance / spread, 2);
        if (weight > 0) {
          const amount = this.accumulationRate * weight;
          this.snowAccumulation[i] = Math.min(
            this.maxAccumulationHeight,
            this.snowAccumulation[i] + amount
          );
        }
      }
    }
    
    if (Math.random() > 0.7) {
      this.smoothDrifts();
    }
  }
  
  private smoothDrifts(): void {
    if (this.snowAccumulation.length < 3) return;
    
    const length = this.snowAccumulation.length;
    let prev = this.snowAccumulation[0];
    let current = this.snowAccumulation[1];
    
    for (let i = 1; i < length - 1; i++) {
      const next = this.snowAccumulation[i + 1];
      const smoothed = prev * 0.2 + current * 0.6 + next * 0.2;
      prev = current;
      current = next;
      this.snowAccumulation[i] = smoothed;
    }
  }

  private drawSnowAccumulation(): void {
    if (this.snowAccumulation.length === 0) return;

    this.ctx.beginPath();
    this.ctx.moveTo(0, this.canvas.height);

    for (let x = 0; x < this.canvas.width; x++) {
      const index = Math.floor(x);
      const nextIndex = Math.min(index + 1, this.snowAccumulation.length - 1);
      const fraction = x - index;
      const height1 = index < this.snowAccumulation.length ? this.snowAccumulation[index] : 0;
      const height2 = nextIndex < this.snowAccumulation.length ? this.snowAccumulation[nextIndex] : 0;
      const height = height1 * (1 - fraction) + height2 * fraction;
      const y = this.canvas.height - height;
      this.ctx.lineTo(x, y);
    }

    this.ctx.lineTo(this.canvas.width, this.canvas.height);
    this.ctx.closePath();

    const gradient = this.ctx.createLinearGradient(
      0,
      this.canvas.height - this.maxAccumulationHeight,
      0,
      this.canvas.height
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');

    this.ctx.fillStyle = gradient;
    this.ctx.fill();

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let x = 0; x < this.canvas.width; x += 8) {
      const index = Math.floor(x);
      if (index < this.snowAccumulation.length && this.snowAccumulation[index] > 0) {
        const height = this.snowAccumulation[index];
        const y = this.canvas.height - height;
        this.ctx.fillRect(x, y, 2, 2);
      }
    }
  }
}
