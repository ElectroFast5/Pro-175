var a = ["H", "Li", "Na", "K"]
var b = ["F", "Cl", "Br", "I"]

var vehiclesArray = [];

AFRAME.registerComponent("markerhandler", {
  init: async function () {
    var compounds = await this.getCompounds();

    this.el.addEventListener("markerFound", () => {
      var vehicleName = this.el.getAttribute("vehicle_name");
      var barcodeValue = this.el.getAttribute("value");
      vehiclesArray.push({ vehicle_name: vehicleName, barcode_value: barcodeValue });

      // Changing Compound Visiblity
      compounds[barcodeValue]["compounds"].map(item => {
        var compound = document.querySelector(`#${item.compound_name}-${barcodeValue}`);
        compound.setAttribute("visible", false);
      });

      // Changing Atom Visiblity
      var transport = document.querySelector(`#${vehicleName}-${barcodeValue}`);
      transport.setAttribute("visible", true);
    });

    this.el.addEventListener("markerLost", () => {
      var vehicleName = this.el.getAttribute("vehicle_name");
      var index = vehiclesArray.findIndex(x => x.vehicle_name === vehicleName);
      if (index > -1) {
        vehiclesArray.splice(index, 1);
      }
    });
  },


  tick: function () {
    if(vehiclesArray.length > 1) {
      var messageText = document.querySelector("#message-text")
      var length = vehiclesArray.length
      var distance = null
      var compound = this.getCompound()
      if(length == 2) {
        var marker1 = document.querySelector(`#marker-${vehiclesArray[0].barcode_value}`)
        var marker2 = document.querySelector(`#marker-${vehiclesArray[1].barcode_value}`)
        distance = this.getDistance(marker1, marker2)
        if(distance < 1.25) {
          if(compound != undefined) {
            this.showCompound(compound)
          } else {
            messageText.setAttribute("visible", true)
          }
        } else {
          messageText.setAttribute("visible", false)
        }
      }
    }
  },

  //Calculate distance between two position markers
  getDistance: function (elA, elB) {
    return elA.object3D.position.distanceTo(elB.object3D.position)
  },
  
  getCompound: function () {
    for(var el of vehiclesArray) {
      if(a.includes(el.vehicle_name)) {
        var compound = el.vehicle_name
        for(var i of vehiclesArray) {
          if (b.includes(i.vehicle_name)) {
            compound += i.vehicle_name
            return {name: compound, value: el.barcode_value}
          } 
        }
      }
    }
  },

  showCompound: function (compound) {
    //Hide vehicles
    vehiclesArray.map(item => {
      var el = document.querySelector(`#${item.vehicle_name}-${item.barcode_value}`);
      el.setAttribute("visible", false);
    });
    //Show Compound
    var compound = document.querySelector(`#${compound.name}-${compound.value}`);
    compound.setAttribute("visible", true)
    compound.setAttribute("gltf-model", "#train2")
    compound.setAttribute("scale", "1 1 1")
  },
  getCompounds: function () {
    // NOTE: Use ngrok server to get json values
    return fetch("js/compoundList.json")
      .then(res => res.json())
      .then(data => data);
  },
});
