// Stretch the road across the page:
const canvas = document.getElementById('myCanvas');
canvas.width = 400;

const animate = () => {
  car.update();
  canvas.height = window.innerHeight;
  car.draw(ctx);
  requestAnimationFrame(animate);
}

// Used to draw in the canvas:
const ctx = canvas.getContext('2d');
const car = new Car(200, 100, 30, 50);

car.draw(ctx);

animate();


