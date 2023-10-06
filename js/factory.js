AFRAME.registerComponent("transports", {
  init: async function () {

    //Get the compund details of the vehicle
    var compounds = await this.getCompounds();

    var barcodes = Object.keys(compounds);

    barcodes.map(barcode => {
      var vehicle = compounds[barcode];

      //Call the function
      this.createTransports(vehicle);
    });

  },
  getCompounds: function () {
    return fetch("js/compoundList.json")
      .then(res => res.json())
      .then(data => data);
  },
  getVehicleColors: function () {
    return fetch("js/vehicleColors.json")
      .then(res => res.json())
      .then(data => data);
  },
  createTransports: async function (vehicle) {

    //Vehicle data
    var vehicleName = vehicle.vehicle_name;
    var barcodeValue = vehicle.barcode_value;
    var numOfElectron = vehicle.number_of_electron;

    //Get the color of the vehicle
    var colors = await this.getVehicleColors();

    //Scene
    var scene = document.querySelector("a-scene");

    //Add marker entity for BARCODE marker
    var marker = document.createVehicle("a-marker");

    marker.setAttribute("id", `marker-${barcodeValue}`);
    marker.setAttribute("type", "barcode");
    marker.setAttribute("vehicle_name", vehicleName);
    marker.setAttribute("value", barcodeValue);

    scene.appendChild(marker);

    var transport = document.createVehicle("a-entity");
    transport.setAttribute("id", `${vehicleName}-${barcodeValue}`);
    marker.appendChild(transport);

    //Create transport card
    var card = document.createVehicle("a-entity");
    card.setAttribute("id", `card-${vehicleName}`);
    card.setAttribute("geometry", {
      primitive: "plane",
      width: 1,
      height: 1
    });

    card.setAttribute("material", {
      src: `./assets/atom_cards/card_${vehicleName}.png`
    });

    card.setAttribute("position", { x: 0, y: 0, z: 0 });
    card.setAttribute("rotation", { x: -90, y: 0, z: 0 });

    transport.appendChild(card);

    //Create train
    var trainRadius = 0.2;
    var train = document.createVehicle("a-entity");
    train.setAttribute("id", `train-${vehicleName}`);
    train.setAttribute("gltf-model", "#ogre");

    train.setAttribute("scale", "color", "1 1 1");
    train.setAttribute("position", { x: 0, y: 1, z: 0 });

    train.setAttribute("rotation", { x: 0, y: 0, z: 0 });

    var trainName = document.createVehicle("a-entity");
    trainName.setAttribute("id", `train-name-${vehicleName}`);
    trainName.setAttribute("position", { x: 0, y: 0.21, z: -0.06 });
    trainName.setAttribute("rotation", { x: -90, y: 0, z: 0 });
    trainName.setAttribute("text", {
      font: "monoid",
      width: 3,
      color: "black",
      align: "center",
      value: vehicleName
    });

    train.appendChild(trainName);

    transport.appendChild(train);
  }
});
