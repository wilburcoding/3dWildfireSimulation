let data = []
let wind = 50
let windDir = 0
let cDirection = ""
let burned = 0
let burning = 0
let rand = (x, y) => x + (y - x + 1) * crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32 | 0
var highest = 0;
var clickMode = 1;
var reverse = false;
let dynamicTexture;
let dynamicTexture2;
let big = false;
let sBoxes = []
let change = 0;
let smokeE = true;
function numToCompass(num) {
  num += 180
  let val = Math.floor((num / 22.5) + .5)
  let arr = ["N", "NNW", "NW", "WNW", "W", "WSW", "SW", "SSW", "S", "SSE", "SE", "ESE", "E", "ENE", "NE", "NNE"]
  return arr[(val % 16)]
}
let paused = true;
function randF(min, max) {
  return Math.random() * (max - min) + min;
}
let trend = rand(-2, 2)

noise.seed(Math.random());
wind = rand(10, 100)
windDir = rand(0, 360)
trend = rand(-2, 2)
cDirection = numToCompass(windDir)
let boxes = {}
let smoke = {}
var m = rand(20, 45)
var line;
console.log(data)
var text;
const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
const createScene = function() {
  // Creates a basic Babylon Scene object
  const scene = new BABYLON.Scene(engine);
  // Creates and positions a free camera
  const camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, new BABYLON.Vector3(-30, 40, -80), scene);

  //const camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(-30, 40, -90), scene);
  camera.attachControl(canvas, true);
  // Targets the camera to scene origin
  camera.setTarget(new BABYLON.Vector3(-30, 0, -36));
  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);
  // Creates a light, aiming 0,1,0 - to the sky
  const light = new BABYLON.HemisphericLight("light",
    new BABYLON.Vector3(0, 1, 0), scene);
  // Dim the light a small amount - 0 to 1
  light.intensity = 0.7;
  // Built-in 'sphere' shape.
  let index = 0;
  const green = new BABYLON.Color4(2 / 255, (145 + (100 - 100) /*fuel*/) / 255, 0, 1)
  let exbox = BABYLON.MeshBuilder.CreateBox("box", { width: 18, height: 2, depth: 10, updatable: true });
  let wind = BABYLON.MeshBuilder.CreateBox("box", { width: 10, height: 2, depth: 10, updatable: true });

  exbox.position = new BABYLON.Vector3(-41, 0, -56)
  wind.position = new BABYLON.Vector3(-26, 0, -56)
  dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", { width: 400, height: 300 }, scene, false);
  dynamicTexture2 = new BABYLON.DynamicTexture("DynamicTexture2", { width: 400, height: 100 }, scene, false);

  const mat = new BABYLON.StandardMaterial("mat", scene);
  const mat2 = new BABYLON.StandardMaterial("mat2", scene);
  mat2.diffuseTexture = dynamicTexture2;

  mat.diffuseTexture = dynamicTexture;
  dynamicTexture2.drawText("40 mph N", null, null, "40px solid monospace", "#000000", "#ffffff", true);

  dynamicTexture.drawText("3d WildFire Simulation", null, null, "30px solid sans serif", "#000000", "#ffffff", true);
  mat.backFaceCulling = false
  mat2.backFaceCulling = false //!NOTE HERE
  dynamicTexture2.wAng = BABYLON.Tools.ToRadians(90)

  dynamicTexture.wAng = BABYLON.Tools.ToRadians(90)
  exbox.material = mat;
  wind.material = mat2;

  for (let i = 0; i < 30; i++) {
    data.push([])
    for (let j = 0; j < 30; j++) {
      let dat = { fuel: null, fireIntensity: null, box: null }
      const box = BABYLON.MeshBuilder.CreateBox(i + "-" + j, { width: 1, height: 5, faceColors: [green, green, green, green, green, green], updatable: true });
      box.updatable = true;
      box.isVisible = true;
      box.position = new BABYLON.Vector3(i - 15, 0, j - 15);
      dat.fuel = 100 - (Math.abs(noise.simplex2(i / m, j / m)) * 80) + (Math.random() * 10)
      dat.height = Math.abs(noise.simplex2(i / m, j / m)) * 14 + (Math.random() / 2.3) - 9;
      dat.fireIntensity = 0
      dat.index = index;
      if (dat.height > highest) {
        highest = dat.height
      }
      boxes[index] = box
      index++;

      data[i].push(dat)
    }

  }
  // const ground = BABYLON.MeshBuilder.CreateGround("ground", 
  // {width: 99, height: 99}, scene);
  data[rand(10, 20)][rand(10, 20)].fireIntensity = 40
  scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
      case BABYLON.PointerEventTypes.POINTERDOWN:
        var nameSplit = String(pointerInfo.pickInfo.pickedMesh.name).split("-")
        let listItems = [];
        if (!big) {
          listItems.push([parseInt(nameSplit[0]), parseInt(nameSplit[1])])
        } else {
          var origLoc = [parseInt(nameSplit[0]), parseInt(nameSplit[1])]
          for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
              var newLoc = [origLoc[0] + i, origLoc[1] + j]
              if (newLoc[0] >= 0 && newLoc[0] < 30 && newLoc[1] >= 0 && newLoc[1] < 30) {
                listItems.push([newLoc[0], newLoc[1]])
              }
            }

          }
        }
        for (var item of listItems) {
          var dat = data[item[0]][item[1]]
          var add = (paused ? 10 : 30)
          if (clickMode == 2) {
            if (reverse) {
              dat.fireIntensity -= add;
              if (dat.fireIntensity < 0) {
                dat.fireIntensity = 0;
              }
            } else {
              dat.fireIntensity += add;
              if (dat.fireIntensity > 100) {
                dat.fireIntensity = 100;
              }
            }
          } else if (clickMode == 3) {
            if (reverse) {
              dat.fuel -= add;
              if (dat.fuel < 0) {
                dat.fuel = 0;
              }
            } else {
              dat.fuel += add;
              if (dat.fuel > 100) {
                dat.fuel = 100;
              }
            }
          } else if (clickMode == 4) {
            if (dat.fireIntensity > 0) {
              dat.fireIntensity -= add;
              if (dat.fireIntensity > 100) {
                dat.fireIntensity = 100;
              }
            }
            if (dat.fuel < 100) {
              dat.fuel += add;
              if (dat.fuel > 100) {
                dat.fuel = 100;
              }
            }
          }
        }
        break;
    }
  });
  scene.onKeyboardObservable.add((kbInfo) => {
    switch (kbInfo.type) {
      case BABYLON.KeyboardEventTypes.KEYDOWN:
        switch (kbInfo.event.key) {
          case "2":
            clickMode = 2;
            break
          case "1":
            clickMode = 1;
            break
          case "3":
            clickMode = 3;
            break
          case "4":
            clickMode = 4;
            break
          case " ":
            paused = !paused;
            break
          case "=":
            big = !big;
            break
          case "s":
            smokeE = !smokeE
            for (const item of Object.keys(smoke)) {
              smoke[item].box.isVisible = smokeE;
            }

            break
          case "\\":
            for (let i = 0; i < 30; i++) {
              for (let j = 0; j < 30; j++) {
                data[i][j].fireIntensity = 0;
                data[i][j].fuel = 100 - (Math.abs(noise.simplex2(i / m, j / m)) * 80) + (Math.random() * 10)
              }
            }
            break
          case "9":
            change = -2
            break
          case "0":
            change = 2
            break
          case "`":
            reverse = !reverse
            break
        }
        break;
    }
  });

  return scene;
};

function update() {
  if (change != 0) {
    wind = wind + change
    change = 0;
  }
  if (wind < 0) {
    wind = 0;
  }
  cDirection = numToCompass(windDir)
  dynamicTexture2.__value = text;
  dynamicTexture2.drawText(wind + " mph ", null, null, "bold 30px Arial", "#000000", "#ffffff", true);
  dynamicTexture2.update();
  dynamicTexture.__value = text;
  var font = "bold 20px Arial"
  var modes = ["None", "Fire", "Fuel", "Rain"]
  dynamicTexture.drawText("", 0, 0, font, "black", "white", true, true);
  dynamicTexture.drawText("3D Wildfire Sim " + (paused ? "[PAUSED]" : ""), 10, 60, "bold 30px Arial", "black", "white", true, true);
  dynamicTexture.drawText("Tool: " + modes[clickMode - 1] + (reverse ? ", Reversed" : ", Normal") + (big ? ", Big" : ", Small"), 10, 100, font, "black", null, true, true);
  dynamicTexture.drawText("Burning: " + burning + " acres", 10, 140, font, "black", null, true, true);
  dynamicTexture.drawText("Burned: " + burned + " acres", 10, 180, font, "black", null, true, true);
  dynamicTexture.drawText("Smoke: " + (smokeE ? "Enabled" : "Disabled"), 10, 220, font, "black", null, true, true);
  
  dynamicTexture.update();
  burned = 0;
  burning = 0;
  for (const item of Object.keys(smoke)) {
    if (paused) {
      break;
    }
    let ite = smoke[item]
    var i = smoke[item].x;
    var j = smoke[item].y;
    let loc = Math.floor(rand(1, 4))
    let chLoc = [i, j]
    if (cDirection == "N") {
      if (loc == 1) {
        chLoc = [i - 1, j - 1]
      } else if (loc == 2 || loc == 4) {
        chLoc = [i, j - 1]
      } else {
        chLoc = [i + 1, j - 1]
      }
    } else if (cDirection == "NNE") {
      if (loc == 1 || loc == 2) {
        chLoc = [i, j - 1]
      } else if (loc == 4) {
        chLoc = [i + 1, j - 1]
      } else {
        chLoc = [i + 1, j]
      }
    } else if (cDirection == "NE") {
      if (loc == 1) {
        chLoc = [i, j - 1]
      } else if (loc == 2 || loc == 4) {
        chLoc = [i + 1, j - 1]
      } else {
        chLoc = [i + 1, j]
      }
    } else if (cDirection == "ENE") {
      if (loc == 1 || loc == 4) {
        chLoc = [i + 1, j]
      } else if (loc == 2) {
        chLoc = [i + 1, j - 1]
      } else {
        chLoc = [i, j - 1]
      }
    } else if (cDirection == "E") {
      if (loc == 1) {
        chLoc = [i + 1, j - 1]
      } else if (loc == 2 || loc == 4) {
        chLoc = [i + 1, j]
      } else {
        chLoc = [i + 1, j + 1]
      }
    } else if (cDirection == "ESE") {
      if (loc == 1 || loc == 4) {
        chLoc = [i + 1, j]
      } else if (loc == 2) {
        chLoc = [i + 1, j + 1]
      } else {
        chLoc = [i, j + 1]
      }
    } else if (cDirection == "SE") {
      if (loc == 1) {
        chLoc = [i + 1, j]
      } else if (loc == 2 || loc == 4) {
        chLoc = [i + 1, j + 1]
      } else {
        chLoc = [i, j + 1]
      }
    } else if (cDirection == "SSE") {
      if (loc == 1 || loc == 4) {
        chLoc = [i - 1, j + 1]
      } else if (loc == 2) {
        chLoc = [i, j + 1]
      } else {
        chLoc = [i + 1, j + 1]
      }
    } else if (cDirection == "S") {
      if (loc == 1) {
        chLoc = [i - 1, j + 1]
      } else if (loc == 2 || loc == 4) {
        chLoc = [i, j + 1]
      } else {
        chLoc = [i + 1, j + 1]
      }
    } else if (cDirection == "SSW") {
      if (loc == 1 || loc == 2) {
        chLoc = [i, j + 1]
      } else if (loc == 4) {
        chLoc = [i - 1, j + 1]
      } else {
        chLoc = [i - 1, j]
      }
    } else if (cDirection == "SW") {
      if (loc == 1) {
        chLoc = [i, j + 1]
      } else if (loc == 2 || loc == 4) {
        chLoc = [i - 1, j + 1]
      } else {
        chLoc = [i - 1, j]
      }
    } else if (cDirection == "WSW") {
      if (loc == 1) {
        chLoc = [i - 1, j + 1]
      } else if (loc == 4) {
        chLoc = [i - 1, j]
      } else {
        chLoc = [i - 1, j - 1]
      }
    } else if (cDirection == "W") {
      if (loc == 1) {
        chLoc = [i - 1, j + 1]
      } else if (loc == 2 || loc == 4) {
        chLoc = [i - 1, j]
      } else {
        chLoc = [i - 1, j - 1]
      }
    } else if (cDirection == "WNW") {
      if (loc == 1 || loc == 2) {
        chLoc = [i - 1, j]
      } else if (loc == 4) {
        chLoc = [i - 1, j - 1]
      } else {
        chLoc = [i, j - 1]
      }
    } else if (cDirection == "NW") {
      if (loc == 1) {
        chLoc = [i - 1, j]
      } else if (loc == 2 || loc == 4) {
        chLoc = [i - 1, j - 1]
      } else {
        chLoc = [i, j - 1]
      }
    } else if (cDirection == "NNW") {
      if (loc == 1) {
        chLoc = [i - 1, j]
      } else if (loc == 2) {
        chLoc = [i - 1, j - 1]
      } else {
        chLoc = [i, j - 1]
      }
    }
    if (ite.intensity == 0) {

      smoke[item].box.dispose()
      delete smoke[item]
      continue
    }
    if (chLoc[0] >= -25 && chLoc[0] < 25 && chLoc[1] >= -25 && chLoc[1] < 25) {



      let b = ite.box
      var positions = smoke[item].box.getVerticesData(BABYLON.VertexBuffer.PositionKind);
      let ce = [];
      for (var k = 0; k < positions.length; k++) {
        ce.push((255 - (ite.intensity * 5)) / 255, (255 - (ite.intensity * 4)) / 255, (255 - (ite.intensity * 4)) / 255, 1);
      }
      ite.intensity -= randF(0.5, 2);
      if (ite.intensity > 33) {
        ite.intensity = 33
      }
      if (ite.intensity < 0) {
        ite.intensity = 0;
      }
      smoke[item].it += 1;
      if (smoke[item].he > 10) {
        smoke[item].he -= 0.5;
      } else {
        smoke[item].he += 1.1;
      }
      if (ite.it == 1) {
        smoke[item].box.isVisible = smokeE;
        smoke[item].it = 0
        smoke[item].x = chLoc[0]
        smoke[item].y = chLoc[1]
        smoke[item].box.scaling.y = (ite.intensity + 0.5) / 13
        smoke[item].box.position = new BABYLON.Vector3(chLoc[0] - 35, smoke[item].he, chLoc[1] - 35);
      }
      smoke[item].box.setVerticesData(BABYLON.VertexBuffer.ColorKind, ce);
      smoke[item] = ite


    } else {

      smoke[item].box.dispose()
      delete smoke[item]
    }


  }
  for (let i = 0; i < 30; i++) {
    for (let j = 0; j < 30; j++) {
      itData = new Object(data[i][j])
      if (itData.fireIntensity != 0 && !paused) {
        if (itData.fireIntensity > itData.fuel || itData.fuel < 20) {
          itData.fireIntensity = itData.fireIntensity - randF(1, 4)
        } else {
          itData.fireIntensity = itData.fireIntensity + rand(1, 2) + ((wind / 30))
        }
        if (itData.fireIntensity > 100) {
          itData.fireIntensity = 100
        }
        if (itData.fireIntensity < 0) {
          itData.fireIntensity = 0
        }
        itData.fuel = itData.fuel - itData.fireIntensity / 30
        if (itData.fuel < 0) {
          itData.fireIntensity = 0
        }
        if (itData.fuel > 100) {
          itData.fuel = 100
        }
        data[i][j] = itData
        //Add smoke
        var filter = Object.keys(smoke).filter((d) => smoke[d].x == i - 15 && smoke[d].y == j - 15)
        if (filter.length > 0) {
          for (let item of filter) {
            if (itData.fireIntensity > 20) {
              smoke[item].intensity += (itData.fireIntensity / 5)
              var intensity = smoke[item].intensity
              var positions = smoke[item].box.getVerticesData(BABYLON.VertexBuffer.PositionKind);
              let ce = []
              for (var k = 0; k < positions.length; k++) {
                ce.push((255 - (intensity * 5)) / 255, (255 - (intensity * 4)) / 255, (255 - (intensity * 4)) / 255, 1);
              }
              smoke[item].box.scaling.y = (intensity + 0.5) / 17
              smoke[item].box.setVerticesData(BABYLON.VertexBuffer.ColorKind, ce);

            }
          }

        } else {
          const w = new BABYLON.Color4(1, 1, 1, 1);
          var dat = {}
          dat.x = i - 15;
          dat.y = j - 15
          dat.intensity = (itData.fireIntensity / 5)
          const box = BABYLON.MeshBuilder.CreateBox(i + "-" + j + rand(0, 1000000), { width: 1, height: 1, faceColors: [w, w, w, w, w, w], updatable: true });
          dat.he = itData.fireIntensity / 80 + itData.height + 5;
          box.position = new BABYLON.Vector3(dat.x - 35, dat.he, dat.y - 35);
          box.updatable = true;
          box.isVisible = smokeE;
          dat.it = 0;
          var intensity = dat.intensity
          var positions = box.getVerticesData(BABYLON.VertexBuffer.PositionKind);
          let ce = []
          for (var k = 0; k < positions.length; k++) {
            ce.push((255 - (intensity * 5)) / 255, (255 - (intensity * 4)) / 255, (255 - (intensity * 4)) / 255, 1);
          }
          box.scaling.y = (intensity + 0.5) / 17
          box.setVerticesData(BABYLON.VertexBuffer.ColorKind, ce);
          dat.box = box;
          smoke[i + "-" + j + rand(0, 1000000)] = dat;
        }
        if (rand(1, 30) < (((wind / 7)) + 1) + (itData.fireIntensity / 40) && itData.fireIntensity > 30) {
          let loc = Math.floor(rand(1, 4))
          let chLoc = [-5, -5]
          if (cDirection == "N") {
            if (loc == 1) {
              chLoc = [i - 1, j - 1]
            } else if (loc == 2 || loc == 4) {
              chLoc = [i, j - 1]
            } else {
              chLoc = [i + 1, j - 1]
            }
          } else if (cDirection == "NNE") {
            if (loc == 1 || loc == 2) {
              chLoc = [i, j - 1]
            } else if (loc == 4) {
              chLoc = [i + 1, j - 1]
            } else {
              chLoc = [i + 1, j]
            }
          } else if (cDirection == "NE") {
            if (loc == 1) {
              chLoc = [i, j - 1]
            } else if (loc == 2 || loc == 4) {
              chLoc = [i + 1, j - 1]
            } else {
              chLoc = [i + 1, j]
            }
          } else if (cDirection == "ENE") {
            if (loc == 1 || loc == 4) {
              chLoc = [i + 1, j]
            } else if (loc == 2) {
              chLoc = [i + 1, j - 1]
            } else {
              chLoc = [i, j - 1]
            }
          } else if (cDirection == "E") {
            if (loc == 1) {
              chLoc = [i + 1, j - 1]
            } else if (loc == 2 || loc == 4) {
              chLoc = [i + 1, j]
            } else {
              chLoc = [i + 1, j + 1]
            }
          } else if (cDirection == "ESE") {
            if (loc == 1 || loc == 4) {
              chLoc = [i + 1, j]
            } else if (loc == 2) {
              chLoc = [i + 1, j + 1]
            } else {
              chLoc = [i, j + 1]
            }
          } else if (cDirection == "SE") {
            if (loc == 1) {
              chLoc = [i + 1, j]
            } else if (loc == 2 || loc == 4) {
              chLoc = [i + 1, j + 1]
            } else {
              chLoc = [i, j + 1]
            }
          } else if (cDirection == "SSE") {
            if (loc == 1 || loc == 4) {
              chLoc = [i - 1, j + 1]
            } else if (loc == 2) {
              chLoc = [i, j + 1]
            } else {
              chLoc = [i + 1, j + 1]
            }
          } else if (cDirection == "S") {
            if (loc == 1) {
              chLoc = [i - 1, j + 1]
            } else if (loc == 2 || loc == 4) {
              chLoc = [i, j + 1]
            } else {
              chLoc = [i + 1, j + 1]
            }
          } else if (cDirection == "SSW") {
            if (loc == 1 || loc == 2) {
              chLoc = [i, j + 1]
            } else if (loc == 4) {
              chLoc = [i - 1, j + 1]
            } else {
              chLoc = [i - 1, j]
            }
          } else if (cDirection == "SW") {
            if (loc == 1) {
              chLoc = [i, j + 1]
            } else if (loc == 2 || loc == 4) {
              chLoc = [i - 1, j + 1]
            } else {
              chLoc = [i - 1, j]
            }
          } else if (cDirection == "WSW") {
            if (loc == 1) {
              chLoc = [i - 1, j + 1]
            } else if (loc == 4) {
              chLoc = [i - 1, j]
            } else {
              chLoc = [i - 1, j - 1]
            }
          } else if (cDirection == "W") {
            if (loc == 1) {
              chLoc = [i - 1, j + 1]
            } else if (loc == 2 || loc == 4) {
              chLoc = [i - 1, j]
            } else {
              chLoc = [i - 1, j - 1]
            }
          } else if (cDirection == "WNW") {
            if (loc == 1 || loc == 2) {
              chLoc = [i - 1, j]
            } else if (loc == 4) {
              chLoc = [i - 1, j - 1]
            } else {
              chLoc = [i, j - 1]
            }
          } else if (cDirection == "NW") {
            if (loc == 1) {
              chLoc = [i - 1, j]
            } else if (loc == 2 || loc == 4) {
              chLoc = [i - 1, j - 1]
            } else {
              chLoc = [i, j - 1]
            }
          } else if (cDirection == "NNW") {
            if (loc == 1) {
              chLoc = [i - 1, j]
            } else if (loc == 2) {
              chLoc = [i - 1, j - 1]
            } else {
              chLoc = [i, j - 1]
            }
          }
          if (Math.floor(rand(0, 80 - (itData.fireIntensity / 40))) == 0) {
            chLoc = [i + Math.floor(rand(-1, 1)), j + Math.floor(rand(-1, 1))]
          }
          if (chLoc[0] >= 0 && chLoc[0] < 30 && chLoc[1] >= 0 && chLoc[1] < 30) {
            if (data[chLoc[0]][chLoc[1]].fuel > 0) {
              data[chLoc[0]][chLoc[1]].fireIntensity = data[chLoc[0]][chLoc[1]].fireIntensity + 5 + ((data[chLoc[0]][chLoc[1]].height - itData.height) / 20)
            }
          }
        }
      }
      //console.log(itData.box)
      //itData.box.dispose();
      if (rand(1, 900) == 2 && !paused) {

        if (trend == -2) {
          windDir = windDir + randF(-1, 0)
        } else if (trend == -1) {
          windDir = windDir + randF(-0.3, 0.1)
        } else if (trend == 0) {
          windDir = windDir + randF(-0.3, 0.3)
        } else if (trend == 1) {
          windDir = windDir + randF(-0.1, 0.3)
        } else {
          windDir = windDir + randF(0, 0.6)
        }
        if (rand(1, 5) == 1) {
          trend = trend + randF(-2, 2)
        }
        if (trend < -2) {
          trend = -2
        } else if (trend > 2) {
          trend = 2
        }
      }
      if (rand(1, 800) == 5 && !paused) {
        wind = wind + Math.round(randF(-1, 1))
      }
      if (wind < 0) {
        wind = 0
      }

      var c;
      boxes[itData.index].position = new BABYLON.Vector3(i - 50, itData.fireIntensity / 80 + itData.height, j - 50);
      if (itData.fireIntensity > 0) {
        c = new BABYLON.Color4(1, 1 - (1 * (itData.fireIntensity / 100)), 0.63)
        //itData.box = BABYLON.MeshBuilder.CreateBox("box", {width:1, height:1, faceColors:[c,c,c,c,c,c]});
        const b = boxes[itData.index]
        var positions = b.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        let ce = [];
        for (var k = 0; k < positions.length; k++) {
          ce.push(1, 1 - (1 * (itData.fireIntensity / 100)), 0.63, 1);
        }
        b.setVerticesData(BABYLON.VertexBuffer.ColorKind, ce);

      } else {
        c = new BABYLON.Color4(114 / 255 + (30.0 / 255 * (itData.fuel / 100)), 100 / 255 + (150.0 / 255 * (itData.fuel / 100)), 110 / 255 + (10.0 / 255 * (itData.fuel / 100)))
        const b = boxes[itData.index]
        var positions = boxes[itData.index].getVerticesData(BABYLON.VertexBuffer.PositionKind);
        let ce = [];
        for (var k = 0; k < positions.length; k++) {
          if (itData.fuel > 95) {
            ce.push(15 / 255, 136 / 255, 0 / 255, 1);
          } else if (itData.fuel > 90) {
            ce.push(18 / 255, 142 / 255, 3 / 255, 1);
          } else if (itData.fuel > 85) {
            ce.push(23 / 255, 153 / 255, 8 / 255, 1);
          } else if (itData.fuel > 80) {
            ce.push(27 / 255, 168 / 255, 10 / 255, 1);
          } else if (itData.fuel > 75) {
            ce.push(32 / 255, 175 / 255, 15 / 255, 1);
          } else if (itData.fuel > 70) {
            ce.push(38 / 255, 189 / 255, 20 / 255, 1);
          } else if (itData.fuel > 65) {
            ce.push(47 / 255, 196 / 255, 27 / 255, 1);
          } else if (itData.fuel > 60) {
            ce.push(55 / 255, 206 / 255, 37 / 255, 1);
          } else if (itData.fuel > 55) {
            ce.push(65 / 255, 212 / 255, 46 / 255, 1);
          } else if (itData.fuel > 50) {
            ce.push(73 / 255, 220 / 255, 56 / 255, 1);
          } else if (itData.fuel > 45) {
            ce.push(100 / 255, 220 / 255, 87 / 255, 1);
          } else if (itData.fuel > 40) {
            ce.push(120 / 255, 220 / 255, 107 / 255, 1);
          } else if (itData.fuel > 30) {
            ce.push(148 / 255, 212 / 255, 140 / 255, 1);
          } else if (itData.fuel > 20) {
            ce.push(148 / 255, 188 / 255, 146 / 255, 1);
          } else if (itData.fuel > 10) {
            ce.push(141 / 255, 157 / 255, 140 / 255, 1);
          } else {
            ce.push(121 / 255, 126 / 255, 121 / 255, 1);
          }
        }
        b.setVerticesData(BABYLON.VertexBuffer.ColorKind, ce);
      }
      if (itData.fuel < 20 && itData.fireIntensity == 0) {
        burned = burned + 1
      } else {
        if (itData.fireIntensity > 0) {
          burning += 1
        }
      }


    }


  }
}
const scene = createScene(); //Call the createScene function
// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function() {
  update();
  scene.render();
});
// Watch for browser/canvas resize events
window.addEventListener("resize", function() {
  engine.resize();
});