// Stretch the road across the page:
const canvas = document.getElementById('myCanvas');
canvas.width = 400;

// Used to draw in the canvas:
const ctx = canvas.getContext('2d');
const road = new Road(canvas.width/2, canvas.width*0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50);

const animate = () => {
  car.update(road.borders);
  canvas.height = window.innerHeight;
  
  ctx.save();
  ctx.translate(0, -car.y + canvas.height*0.9);

  road.draw(ctx);
  car.draw(ctx);

  ctx.restore();
  requestAnimationFrame(animate);
}


animate();