/*
console.log("script loaded!");
let div = document.createElement("div");
console.log(body);

add function: read json and output faction list for each side, 
era list for each faction and the motorpool data in an as of yet undefined form
*/

let body = document.getElementById("body");

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

	for (i = 0; i < eraList.length; i++) {
		var button = document.createElement("button");
		button.setAttribute("id", eraList[i]);
		button.setAttribute("type", "button");
		button.innerText = eraList[i];
		erasDiv.insertAdjacentElement("beforeend", button);
	}
}

sides(["BLUFOR", "OPFOR", "INDEP", "CIVILIAN"]);
