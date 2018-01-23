const BASE_URL = "https://tsimobile.viarail.ca/data/allData.json"
const fetch = require('node-fetch')
const getAllData = ()=>{
return fetch(BASE_URL, {
  method: "GET",
  headers: {
    'Content-Type': 'application/json'
  }
}).then(res => res.json())
}

const STATIONS = {
  VANCOUVER:{
    lat: 49.2736,
    long: -123.1207
  },
  KAMLOOPS:{
    lat: 50.6786,
    long: -120.3297
  },
  JASPER:{
    lat: 52.8761,
    long:-118.0797
  },
  EDMONTON:{
    lat: 53.5788,
    long: -113.5308
  },
  SASKATOON:{
    lat: 52.1053,
    long:-106.7383
  },
  WINNIPEG:{
    lat: 48.8888,
    long: -97.1342
  },
  SUDBURY:{
    lat: 46.5242,
    long: -80.9017
  },
  TORONTO:{
    lat: 43.6453,
    long: -79.3806
  },
}

// currentElement[1]['long'] < longitude && nextElement[1]['long'] > longitude
function getNextCity(longitude, direction){
  const stationsArray = Object.entries(STATIONS)
  function testStations(longitude, direction, currIndex){
    if(currIndex === stationsArray.length){
      return "Not moving"
    } else if(stationsArray[currIndex][1]['long'] < longitude && stationsArray[currIndex+1][1]['long'] > longitude){
      return direction === 'WEST' ? stationsArray[currIndex][0] : stationsArray[currIndex + 1][0]
    } else {
      return testStations(longitude, direction, currIndex +1)
    }
  }
  return testStations(longitude, direction, 0)
}

function assignInterval(longitude, direction){
  const nextCity = getNextCity(longitude,direction )
  const nextCityLongitude = STATIONS[nextCity]['long']
  const longitudinalDiff = Math.abs(nextCityLongitude - longitude)
  if(longitudinalDiff > 1){
    return 60*60*1000
  } else if(longitudinalDiff > 0.5) {
    return 5*60*1000
  } else {
    return 10*1000
  }
}
let interval = 3000

async function queryViaRail(){
  const data = await getAllData()
  console.log(data)
  const trainLongitude = data['1 (01-20)']['lng']
  const trainDirection = data['1 (01-20)']['direction']
  const nextStation = getNextCity(trainLongitude, trainDirection)
  console.log(trainLongitude)
  interval = assignInterval(trainLongitude, trainDirection)
  console.log(`Querying again in ${interval}`)
  return trainLongitude

}

// This function is buggy... fix it before proceeding
function hasLeftStation(initialize = false, initialStation){
  let hasLeft = initialize
  let lastStation = initialStation

  return (longitude, nextStation, dir) => {
    let direction = dir
    if(direction === 'WEST' && longitude < STATIONS[lastStation]['long']){
      hasLeft = true
    } else if(direction ==='EAST' && longitude > STATIONS[lastStation]['long']) {
      hasLeft = true
    } else {
      hasLeft = false
    }
    return hasLeft
  }
}

function hasArrived(longitude, nextCity, direction){
  if((direction === 'WEST' && longitude > STATIONS[nextCity]['long']) || (direction ==='EAST' && longitude < STATIONS[nextCity]['long'])){
    if(Math.abs(longitude - STATIONS[nextCity]['long']) < 0.001){
      return true
    } else {
      return false
    }
  }
}

function main(){

  const queryEveryThree = setInterval(queryViaRail, interval)

}

main()

// (12-30)
// :
// departed
// :
// true
// direction
// :
// 284
// lat
// :
// 48.5014
// lng
// :
// -82.8739
// speed
// :
// 82
// times
// :
// Array(21)
// 0
// :
// {station: "OBA", estimated: "2017-12-31T21:51:53Z", scheduled: "2017-12-31T18:51:00Z", eta: "1h28", diff: "bad", …}
// 1
// :
// {station: "HORNEPAYNE", estimated: "2017-12-31T22:40:53Z", scheduled: "2017-12-31T19:40:00Z", eta: "2h17", diff: "bad", …}
// 2
// :
// {station: "HILLSPORT", estimated: "&mdash;", scheduled: "2017-12-31T21:28:00Z", eta: "&mdash;", diff: "goo", …}
// 3
// :
// {station: "CARAMAT", estimated: "&mdash;", scheduled: "2017-12-31T22:18:00Z", eta: "&mdash;", diff: "goo", …}
// 4
// :
// {station: "LONGLAC", estimated: "&mdash;", scheduled: "2017-12-31T22:49:00Z", eta: "&mdash;", diff: "goo", …}
// 5
// :
// {station: "NAKINA", estimated: "&mdash;", scheduled: "2017-12-31T23:29:00Z", eta: "&mdash;", diff: "goo", …}
// 6
// :
// {station: "AUDEN", estimated: "&mdash;", scheduled: "2018-01-01T00:41:00Z", eta: "&mdash;", diff: "goo", …}
// 7
// :
// {station: "FERLAND", estimated: "&mdash;", scheduled: "2018-01-01T01:32:00Z", eta: "&mdash;", diff: "goo", …}
// 8
// :
// {station: "MUD RIVER", estimated: "&mdash;", scheduled: "2018-01-01T01:42:00Z", eta: "&mdash;", diff: "goo", …}
// 9
// :
// {station: "ARMSTRONG", estimated: "&mdash;", scheduled: "2018-01-01T02:31:00Z", eta: "&mdash;", diff: "goo", …}
// 10
// :
// {station: "COLLINS", estimated: "&mdash;", scheduled: "2018-01-01T03:10:00Z", eta: "&mdash;", diff: "goo", …}
// 11
// :
// {station: "ALLANWATER BRIDGE", estimated: "&mdash;", scheduled: "2018-01-01T03:48:00Z", eta: "&mdash;", diff: "goo", …}
// 12
// :
// {station: "FLINDT LANDING", estimated: "&mdash;", scheduled: "2018-01-01T04:05:00Z", eta: "&mdash;", diff: "goo", …}
// 13
// :
// {station: "SAVANT LAKE", estimated: "&mdash;", scheduled: "2018-01-01T04:18:00Z", eta: "&mdash;", diff: "goo", …}
// 14
// :
// {station: "SIOUX LOOKOUT", estimated: "&mdash;", scheduled: "2018-01-01T05:39:00Z", eta: "&mdash;", diff: "goo", …}
// 15
// :
// {station: "RICHAN", estimated: "&mdash;", scheduled: "2018-01-01T07:28:00Z", eta: "&mdash;", diff: "goo", …}
// 16
// :
// {station: "RED LAKE ROAD", estimated: "&mdash;", scheduled: "2018-01-01T08:09:00Z", eta: "&mdash;", diff: "goo", …}
// 17
// :
// {station: "CANYON", estimated: "&mdash;", scheduled: "2018-01-01T08:40:00Z", eta: "&mdash;", diff: "goo", …}
// 18
// :
// {station: "FARLANE", estimated: "&mdash;", scheduled: "2018-01-01T09:19:00Z", eta: "&mdash;", diff: "goo", …}
// 19
// :
// {station: "REDDITT", estimated: "&mdash;", scheduled: "2018-01-01T09:37:00Z", eta: "&mdash;", diff: "goo", …}
// 20
// :
// {station: "MINAKI", estimated: "&mdash;", scheduled: "2018-01-01T10:03:00Z", eta: "&mdash;", diff: "goo", …}



module.exports = {
  getAllData: getAllData,
  stations: STATIONS
}
