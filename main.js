// Stretch the road across the page:
const carCanvas = document.getElementById('carCanvas');
const networkCanvas = document.getElementById('networkCanvas');
carCanvas.width = 400;
networkCanvas.width = 500;

// Drawing Contexts
const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width/2, carCanvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, 'AI');
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY'),
];

animate();

function animate(time) {
  traffic.forEach(car => car.update(road.borders, []));
  car.update(road.borders, traffic);
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;
  
  carCtx.save();
  carCtx.translate(0, -car.y + carCanvas.height*0.9);

  road.draw(carCtx);
  traffic.forEach(car => car.draw(carCtx));
  car.draw(carCtx);

  carCtx.restore();

  networkCtx.lineDashOffset = -time/50;
  Visualiser.drawNetwork(networkCtx, car.brain);
  requestAnimationFrame(animate);
}

