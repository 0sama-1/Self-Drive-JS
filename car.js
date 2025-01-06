class Car {
  constructor(x, y, width, height, acceleration=0.2, friction=0.05) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = acceleration;
    this.maxSpeed = 3;
    this.friction = friction;
    this.angle = 0;

    this.damaged = false;

    this.sensor = new Sensor(this);
    this.controls = new Controls();
  }

  update(roadBorders) {
    if(!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders);
    }
    this.sensor.update(roadBorders);
  }

  // Used to determine the points of the car for collision detection:
  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    // Top Right Point:
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad
    });

    // Top Left Point:
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad
    });

    // Bottom Right Point:
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
    });

    // Bottom Left Point:
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
    });
      return points;
    }
  
  #assessDamage(roadBorders) {
    for(let i = 0; i < roadBorders.length; i++) {
      if(polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    return false;
  }
  draw(ctx) {
    /**
     * Old method:
    // ctx.save();
    // ctx.translate(this.x, this.y);
    // ctx.rotate(-this.angle);

    // ctx.beginPath();
    // ctx.rect(
    //   -this.width/2,
    //   -this.height/2,
    //   this.width,
    //   this.height
    // );
     */ 

    // ctx.fill();
    // ctx.restore();

    ctx.fillStyle = this.damaged ? 'grey' : 'black';

    // New method (with using the corner points):
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for(let i = 0; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();

    this.sensor.draw(ctx);
  }

  #move() {
    /**
     //DELETE LATER
     //Should do? (Indicate death in the NN model):
     if(this.damaged) {
       this.speed = 0;
       return;
     }
     */

    if(this.controls.forward) {
      this.speed += this.acceleration;
    }

    if(this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    if(this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    } else if(this.speed < -this.maxSpeed/2) {
      this.speed = -this.maxSpeed/2;
    }

    if(this.speed > 0) {
      this.speed -= this.friction;
    }

    if(this.speed < 0) {
      this.speed += this.friction;
    }

    if(Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }
    
    if(this.speed != 0) {
      const flip = this.speed>0 ? 1 : -1;
      if(this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if(this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }


    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }
}