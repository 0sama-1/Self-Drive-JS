// Stretch the road across the page:
const carCanvas = document.getElementById('carCanvas');
const networkCanvas = document.getElementById('networkCanvas');
carCanvas.width = 400;
networkCanvas.width = 500;

// Drawing Contexts
const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width/2, carCanvas.width * 0.9);
// const car = new Car(road.getLaneCenter(1), 100, 30, 50, 'AI');
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY'),
  new Car(road.getLaneCenter(0), -300, 30, 50, 'DUMMY'),
  new Car(road.getLaneCenter(2), -300, 30, 50, 'DUMMY'),
];

const N = 100;
const cars = generateCars(N);
let bestCar = cars[0];
if(localStorage.getItem('bestBrain')) {
  for(let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(
      localStorage.getItem('bestBrain')
    );
    if(i !== 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.05);
    }
  }
}

animate();

function save() {
  localStorage.setItem('bestBrain', 
    JSON.stringify(bestCar.brain)
  );
}

function discard() {
  localStorage.removeItem('bestBrain');
}

function generateCars(N) {
  const cars = [];
  for(let i = 0; i < N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, 'AI'));
  }
  return cars;
}

function animate(time) {
  traffic.forEach(car => car.update(road.borders, []));
  // car.update(road.borders, traffic);
  cars.forEach(car => car.update(road.borders, traffic));

  // You can base the best car based on other parameters.
    // This is called a fitness funciton
  bestCar = cars.find(
    c => c.y == Math.min(
      ...cars.map(c => c.y)
    )
  );
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;
  
  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height*0.9);

  road.draw(carCtx);
  traffic.forEach(car => car.draw(carCtx));
  carCtx.globalAlpha = 0.2;
  // car.draw(carCtx);
  cars.forEach(car => car.draw(carCtx));
  
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, true);

  carCtx.restore();

  // networkCtx.lineDashOffset = -time/50;
  Visualiser.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}

