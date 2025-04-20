class Car {
  #brand;
  #model;
  speed = 0;
  isTrunkOpen = true;

  constructor(carDetails) {
    this.#brand = carDetails.brand;
    this.#model = carDetails.model;
  }

  displayInfo() {
    console.log(
      `${this.#brand} ${this.#model} ${this.speed} ${this.isTrunkOpen}`
    );
  }

  go() {
    if (this.isTrunkOpen === false) {
      if (this.speed < 200) {
        this.speed += 5;
        this.displayInfo();
      }
    } else {
      console.log("Trunk is open");
    }
  }

  brake() {
    if (this.speed > 4) {
      this.speed -= 5;
    }
  }

  openTrunk() {
    if (this.speed > 0) {
      console.log("Car is moving can't open trunk");
      this.displayInfo();
    } else {
      this.isTrunkOpen = true;
    }
  }

  closeTrunk() {
    this.isTrunkOpen = false;
  }
}

class RaceCar extends Car {
  acceleration;

  constructor(carDetails) {
    super(carDetails);
    this.acceleration = carDetails.acceleration;
  }

  go() {
    if (this.speed < 300) {
      this.speed += this.acceleration;
      this.displayInfo();
    }
  }
}

const car1 = new Car({
  brand: "Toyota",
  model: "Corolla",
});

const car2 = new Car({
  brand: "Tesla",
  model: "3",
});

const car3 = new RaceCar({
  brand: "McLaren",
  model: "F1",
  acceleration: 20,
});
