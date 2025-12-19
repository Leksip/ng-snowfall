# ng-snowfall

Beautiful interactive snowfall component for Angular with mouse wind effect. Snowflakes react to mouse movement creating a realistic wind effect.

## Features

- ❄️ Beautiful animated snowfall
- 🖱️ Interactive mouse wind effect - snowflakes react to cursor movement
- 🏔️ Snow accumulation at the bottom with natural drifts
- ⚡ Optimized performance with no memory leaks
- 🎨 Fully configurable

## Installation

```bash
npm install ng-snowfall
```

## Usage

### 1. Import the module

```typescript
import { SnowfallModule } from 'ng-snowfall';

@NgModule({
  imports: [
    SnowfallModule
  ]
})
export class AppModule { }
```

### 2. Add component to your template

```html
<ng-snowfall></ng-snowfall>
```

### 3. Configure (optional)

```html
<ng-snowfall [config]="snowfallConfig"></ng-snowfall>
```

```typescript
snowfallConfig = {
  maxSnowflakes: 400,           // Maximum number of snowflakes (default: 400)
  accumulationRate: 0.6,        // Snow accumulation speed (default: 0.6)
  maxAccumulationHeight: 150,   // Maximum snow height in pixels (default: 150)
  mouseInfluenceRadius: 250,    // Mouse wind effect radius (default: 250)
  windForce: 20,                // Wind force strength (default: 20)
  windDecay: 0.85,              // Wind decay rate (default: 0.85)
  windInertia: 0.15,            // Wind inertia (default: 0.15)
  windFriction: 0.92            // Wind friction (default: 0.92)
};
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxSnowflakes` | number | 400 | Maximum number of snowflakes on screen |
| `accumulationRate` | number | 0.6 | Speed of snow accumulation at the bottom |
| `maxAccumulationHeight` | number | 150 | Maximum height of accumulated snow in pixels |
| `mouseInfluenceRadius` | number | 250 | Radius of mouse wind effect in pixels |
| `windForce` | number | 20 | Strength of wind effect |
| `windDecay` | number | 0.85 | How fast wind decays when mouse stops (0-1) |
| `windInertia` | number | 0.15 | Wind inertia - delay in snowflake reaction (0-1) |
| `windFriction` | number | 0.92 | Friction applied to snowflake wind velocity (0-1) |

## Examples

### Basic usage

```html
<ng-snowfall></ng-snowfall>
```

### Custom configuration

```typescript
import { Component } from '@angular/core';
import { SnowfallConfig } from 'ng-snowfall';

@Component({
  selector: 'app-root',
  template: '<ng-snowfall [config]="config"></ng-snowfall>'
})
export class AppComponent {
  config: SnowfallConfig = {
    maxSnowflakes: 300,
    accumulationRate: 0.4,
    windForce: 15
  };
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Requirements

- Angular 16+ or 17+ or 18+

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
