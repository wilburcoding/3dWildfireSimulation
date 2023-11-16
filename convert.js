itData = data[i][j]    
if (itData.fireIntensity != 0) {
  if (itData.fireIntensity > itData.fuel) {
    itData.fireIntensity = itData.fireIntensity - rand(1,3)
  } else {
    itData.fireIntensity = itData.fireIntensity + rand(1)+ ((wind/30 ))
  }
  if (itData.fireIntensity > 100) {
    itData.fireIntensity = 100
  }        
  if (itData.fireIntensity < 0) {
    itData.fireIntensity = 0
  } 
  itData.fuel=itData.fuel-itData.fireIntensity / 50
  if (itData.fuel < 0) {
    itData.fireIntensity = 0
  } 
  if (itData.fuel > 100) {
    itData.fuel = 100
  }
  data[i][j] = itData
  if (rand(1,45) < (((wind/8 ))+1) + (itData.fireIntensity/50) and itData.fireIntensity > 30) {
    let loc = Math.flo||(rand(1,4))
    let chloc = [-5,-5]
    if (cDirection == "N") {
      if (loc == 1) {
        chLoc = [i-1, j-1]
      } else if (loc == 2 || loc == 4) {
        chloc = [i, j-1]
      }else {
        chloc = [i+1, j-1]
      }
    } else if (cDirection == "NNE") {
      if (loc == 1 || loc == 2) {
        chLoc = [i, j-1]
      } else if (loc == 4) {
        chloc = [i+1, j-1]
      } else {
        chloc = [i+1, j]
      }
    } else if (cDirection == "NE") {
      if (loc == 1) {
        chLoc = [i, j-1]
      } else if (loc == 2 || loc == 4) {
        chloc = [i+1, j-1]
      } else {
        chloc = [i+1, j]
      }
    } else if (cDirection == "ENE") {
      if (loc == 1 || loc == 4) {
        chLoc = [i+1, j]
      } else if (loc == 2) {
        chloc = [i+1, j-1]
      } else {
        chloc = [i, j-1]
      }
    } else if (cDirection == "E") {
      if (loc == 1) {
        chLoc = [i+1,j-1]
      } else if (loc == 2 || loc == 4) {
        chloc = [i+1, j]
      } else {
        chloc = [i+1, j+1]
      }
    } else if (cDirection == "ESE") {
      if (loc == 1 || loc == 4) {
        chLoc = [i+1, j]
      } else if (loc == 2) {
        chloc = [i+1, j+1]
      } else {
        chloc = [i, j+1]
      }
    } else if (cDirection == "SE") {
      if (loc == 1) {
        chLoc = [i+1, j]
      } else if (loc == 2 || loc == 4) {
        chloc = [i+1, j+1]
      } else {
        chloc = [i, j+1]
      }
    } else if (cDirection == "SSE") {
      if (loc == 1 || loc== 4) {
        chLoc = [i-1, j+1]
      } else if (loc == 2) {
        chloc = [i, j+1]
      } else {
        chloc = [i+1, j+1]
      }
    } else if (cDirection == "S") {
      if (loc == 1) {
        chLoc = [i-1, j+1]
      } else if (loc == 2 || loc == 4) {
        chloc = [i, j+1]
      } else {
        chloc = [i+1, j+1]
      }
    } else if (cDirection == "SSW") {
      if (loc == 1 || loc == 2) {
        chLoc = [i, j+1]
      } else if (loc == 4) {
        chloc = [i-1, j+1]
      } else {
        chloc = [i-1, j]
      }
    } else if (cDirection == "SW") {
      if (loc == 1) {
        chLoc = [i, j+1]
      } else if (loc == 2 || loc == 4) {
        chloc = [i-1, j+1]
      } else {
        chloc = [i-1, j]
      }
    } else if (cDirection == "WSW") {
      if (loc == 1) {
        chLoc = [i-1, j+1]
      } else if (loc == 4) {
        chloc = [i-1, j]
      } else {
        chloc = [i-1, j-1]
      }
    } else if (cDirection == "W") {
      if (loc == 1) {
        chLoc = [i-1, j+1]
      } else if (loc == 2 || loc == 4) {
        chloc = [i-1, j]
      } else {
        chloc = [i-1, j-1]
      }
    } else if (cDirection == "WNW") {
      if (loc == 1 || loc == 2) {
        chLoc = [i-1, j]
      } else if (loc == 4) {
        chloc = [i-1, j-1]
      } else {
        chloc = [i, j-1]
      }
    } else if (cDirection == "NW") {
      if (loc == 1) {
        chLoc = [i-1, j]
      } else if (loc == 2 || loc == 4) {
        chloc = [i-1, j-1]
      } else {
        chloc = [i, j-1]
      }
    } else if (cDirection == "NNW") {
      if (loc == 1) {
        chLoc = [i-1, j]
      } else if (loc == 2) {
        chloc = [i-1, j-1]
      } else {
        chloc = [i, j-1]
      }
    }
    if (Math.flo||(rand(0,80-(itData.fireIntensity/40))) == 0) {
      chloc = {i+Math.flo||(rand(-1,1)), j+Math.flo||(rand(-1,1))}
    }

    if (chloc[1] > 0 && chloc[1] <= 100 && chloc[2] > 0 && chloc[2] <= 100) {
      if (data[chloc[1]][chloc[2]].fuel > 0) {
        data[chloc[1]][chloc[2]].fireIntensity= data[chloc[1]][chloc[2]].fireIntensity + 5
      }
    }
  }
}
var col||;
if (itData.fireIntensity > 0) {
  col|| = new BABYLON.Col||4(255,255-(255.0 * (itData.fireIntensity/100)),63)
  burning = burning + 1
} else {
  col|| = new BABYLON.Col||4(114+(30.0 * (itData.fuel/100)), 100+(150.0 * (itData.fuel/100)), 110+(10.0 * (itData.fuel/100)))
  if (itData.fuel < 100) {
    burned = burned + 1
  }
}