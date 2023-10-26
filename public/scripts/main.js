const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class SearchFeature {
  constructor() {
    this.form = document.querySelector("#search-form");
    this.tanggal = document.querySelector("#tanggal");
    this.waktu = document.querySelector("#waktu");
    this.transmision = document.querySelector("#transmision");
    this.penumpang = document.querySelector("#penumpang");

    this.tanggal.value = params.tanggal;
    this.waktu.value = params.waktu;
    this.transmision.value = params.transmision;
    this.penumpang.value = params.jml_penumpang;

    console.log(`params : ${JSON.stringify(params)}`);
  }

  _populateCars = (cars) => {
    return cars.map((car) => {
      const isPositive = getRandomInt(0, 1) === 1;
      const timeAt = new Date();
      const mutator = getRandomInt(1000000, 100000000);
      const availableAt = new Date(
        timeAt.getTime() + (isPositive ? mutator : -1 * mutator),
      ).toISOString();

      return {
        ...car,
        availableAt,
      };
    });
  };

  async fetchCars() {
    const carsLocal = window.localStorage.getItem("cars");
    if (carsLocal) {
      return JSON.parse(carsLocal);
    }

    const response = await fetch(
      "https://raw.githubusercontent.com/fnurhidayat/probable-garbanzo/main/data/cars.min.json",
    );
    const body = this._populateCars(await response.json());
    console.log(`cars data ${JSON.stringify(carsLocal)}`);
    window.localStorage.setItem("cars", JSON.stringify(body));
    return body;
  }

  async filterCars() {
    const cars = await this.fetchCars();
    const tanggal = this.tanggal.value;
    const waktu = this.waktu.value;

    const availableCars = cars.filter((car) => {
      const carTanggal = car.availableAt.split("T")[0];
      const carWaktu = new Date(car.availableAt).getHours();

      if (carTanggal === tanggal && carWaktu <= +waktu) {
        return true;
      }
      return false;
    });
    return availableCars;
  }
}

class Car {
  static list = [];

  static init(cars) {
    this.list = cars.map((i) => new this(i));
  }

  constructor({
    id,
    plate,
    manufacture,
    model,
    image,
    rentPerDay,
    capacity,
    description,
    transmission,
    available,
    type,
    year,
    options,
    specs,
    availableAt,
  }) {
    this.id = id;
    this.plate = plate;
    this.manufacture = manufacture;
    this.model = model;
    this.image = image;
    this.rentPerDay = rentPerDay;
    this.capacity = capacity;
    this.description = description;
    this.transmission = transmission;
    this.available = available;
    this.type = type;
    this.year = year;
    this.options = options;
    this.specs = specs;
    this.availableAt = availableAt;
  }

  render() {
    return `<div class="card rounded overflow-hidden">
    <img src="${this.image}" alt="" height="200">
    <div class="card-body">
        <h3 class="fs-6">${this.manufacture} ${this.model} / ${this.type}</h3>
        <h3 class="fs-5 fw-bold">Rp. ${this.rentPerDay} / hari</h3>${this.description}</p>
        <div style="list-style: none; margin-top: -15px;">
            <div class="d-flex gap-2 align-items-center" style="margin-bottom: -15px;">
                <span class="bi bi-people"></span>
                <p style="margin-top: 12px;">${this.capacity} Orang</p>
            </div>
            <div class="d-flex gap-2 align-items-center" style="margin-bottom: -15px;">
                <span class="bi bi-geo"></span>
                <p style="margin-top: 12px;">${this.transmission}</p>
            </div>
            <div class="d-flex gap-2 align-items-center" style="margin-bottom: -15px;">
                <span class="bi bi-calendar"></span>
                <p style="margin-top: 12px;">Tahun ${this.year}</p>
            </div>
        </div>
        <button class="col-lg-12 btn btn-green">Pilih Mobil</button>
    </div>
</div>`;
  }
}

class Main {
  constructor() {
    this.result = document.querySelector("#result");
    this.alertSection = document.getElementById(`alert-result`);
  }

  init() {
    const searchFeature = new SearchFeature();
    searchFeature.filterCars().then((availableCars) => {
      if (availableCars.length <= 0) {
        return this.alertSection.classList.remove("visually-hidden");
      }
      this.alertSection.classList.add("visually-hidden");
      Car.init(availableCars);
      const cars = Car.list.map((car) => car.render());
      this.result.innerHTML = cars.join("\n");
    });
  }
}

const main = new Main();
main.init();
