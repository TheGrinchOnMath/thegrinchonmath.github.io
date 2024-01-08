/*
console.log("script loaded!");
let div = document.createElement("div");
console.log(body);

add function: read json and output faction list for each side, 
era list for each faction and the motorpool data in an as of yet undefined form
*/

const body = document.getElementById("body");
body.innerHTML = "<p>script.js loaded successfully</p>";

const vehiclePath = "./json/motorpool.json";
const factionsPath = "./json/factions.json";


async function openJson(path) {
	const request = path;
	const response = await fetch(request);
	const data = await response.json();
	console.log(data);
	return data;
}

function parse(vehiclePath, factionsPath) {
	// create objects from json files at vehiclePath and factionPath
	const vehicleDataRaw = require(vehiclePath);
	const factionsDataRaw = require(factionsPath);
	const vehicleMap = new Map();
	/*
	for (i = o; i < vehicleDataRaw.length; i++) {
	
	}
	*/
	console.log(vehicleDataRaw[100], "\n", factionsDataRaw[0]);
}

// this function creates buttons inside the sides div corresponding to the strings inside the list given to the function
function sides(sideList) {
	let factions = document.getElementById("factions");
	let eras = document.getElementById("eras");
	if (factions != null) {
		//same here
	}
	if (eras != null) {
		//add expression that hides the eras div and empties it of its contents
	}
	if (document.getElementById("sides") == null) {
		let sidesDiv = document.createElement("div");
		sidesDiv.setAttribute("id", "sides");
	}
	body.insertAdjacentElement("beforeend", sidesDiv);
	for (i = 0; i < sideList.length; i++) {
		var button = document.createElement("button");
		button.setAttribute("id", sideList[i]);
		button.setAttribute("type", "button");
		button.innerText = sideList[i];
		sidesDiv.insertAdjacentElement("beforeend", button);
	}
}

// the input needs to be changed to the side
function factions(factionsList) {
	let eras = document.getElementById("eras");
	let factionsDiv = document.createElement("div");
	if (document.getElementByID("factions") == null) {
		factionsDiv.setAttribute("id", "factions");
		body.insertAdjacentElement("beforeend", factionsDiv);
	}
	for (i = 0; i < factionsList.length; i++) {
		var button = document.createElement("button");
		button.setAttribute("id", factionsList[i]);
		button.setAttribute("type", "button");
		button.innerText = factionsList[i];
		factionsDiv.insertAdjacentElement("beforeend", button);
	}
	factionsDiv.hidden = false;
}

function eras(eraList) {
	let erasDiv = document.createElement("div");
	if (document.getElementById("eras") == null)
		erasDiv.setAttribute("id", "eras");
	body.insertAdjacentElement("beforeend", erasDiv);

	// add a button for every era in the list
	for (i = 0; i < eraList.length; i++) {
		var button = document.createElement("button");
		button.setAttribute("id", eraList[i]);
		button.setAttribute("type", "button");
		button.innerText = eraList[i];
		erasDiv.insertAdjacentElement("beforeend", button);
	}
}

//sides(["BLUFOR", "OPFOR", "INDEP", "CIVILIAN"]);
//parse(vehiclePath, factionsPath);
openJson(vehiclePath);
