/*
script for the motorpool tool
*/

//Global Variables
let factionsTree = null,
	motorpoolMap = null;

async function parse(factionsPath, motorpoolPath) {
	factionsTree = await parseJson(factionsPath);
	motorpoolMap = await parseMotorpool(parseJson(motorpoolPath));

	let sides = new Array();
	for (let side in factionsTree) {
		sides.push(side);
	}
	initSides(sides);
	initFactions("blufor");
	variants(factionsTree.blufor[0]);
}

async function parseJson(path) {
	// parse factions Json
	const request = await fetch(path);
	const response = await request.json();

	// create a list of blufor factions
	return response;
}

// this function parses the json obj to get a dict.
function parseFactions(json) {
	const sides = { blufor: {}, opfor: {}, indep: {} }; // JSON contains: side:faction:variants/name:motorpool/name/era:vehicles:vehicle
	// sides should look like this: sides.blufor.factionName.variant
	// sides.blufor["woodland modern"] = []
	// sides.blufor.["woodland modern"].push([])
	// fill blufor with data
	for (let ctr = 0; ctr < json.blufor.length; ctr++) {
		let name = json.blufor[ctr].name;
		let id = name;
		id.replace(" ", "_");
		sides.blufor[id] = [];
		for (let count = 0; count < json.blufor[ctr].variants.length; count++)
			sides.blufor[id].push([
				json.blufor[ctr].variants[count].name,
				json.blufor[ctr].variants[count].era,
			]);
	}
	console.log(sides.blufor);
	// json.side[index].name gets the faction name

	/*
	add here: some kind of loop contraption that reads the json and fills the required data into sides. the idea is to make the data easily accessible later.
	*/

	return sides;
}

//this function parses the motorpool json obj into a map obj, with the ID being the name,
//and the other informations inside a list being the value
function parseMotorpool(json) {
	out = new Map();
	for (let i = 0; i < json.length; i++) {
		Map[json[i].id] = [
			json[i].name,
			json[i].type,
			json[i].crew,
			json[i].passengers,
			json[i].cargo,
			json[i].turrets,
		];
	}
	return out;
}

/* 
this function is dedicated to creating a button DOM in the html
the context manager uses context as input, and the function then takes input:data and can be called using context.input
*/
function createButton(id, parent, position, func, params) {
	// check if the button already exists
	let buttonExists = !!document.getElementById(id);

	// this if condition checks if some variables are given
	if (
		/*buttonExists &&*/
		id != null &&
		parent != null &&
		func != null &&
		params != null
	) {
		let parentDOM = document.getElementById(parent);

		// create button and set attributes, add event listener (replaces onclick + its better)
		let button = document.createElement("button");
		button.setAttribute("id", id);
		button.setAttribute("type", "button");
		button.addEventListener("click", function () {
			func(params);
		});
		button.innerText = id;

		// add button inside the parent div
		parentDOM.insertAdjacentElement(position, button);
	} else {
		console.log("ERROR: wrong input, aborting...");
		return;
	}
}

/* removes all children of a DOM element. Modified code from: https://stackoverflow.com/a/3955238
calling node.children and iterating does not work, 
but checking if the node has a child and then deleting the last child works really well
*/
function removeChildren(id) {
	const node = document.getElementById(id);
	while (node.firstChild) {
		node.removeChild(node.lastChild);
	}
}

/* 
is called upon loading the page. creates side buttons
*/
function initSides(sideList) {
	// removes all of the DOM elements inside the div with id="factions"
	removeChildren("variants");

	// removes all of the DOM elements inside the div with id="variants"
	removeChildren("variants");

	// iterate through sideList, create buttons for each side
	for (let elm = 0; elm < sideList.length; elm++) {
		let side = sideList[elm];
		createButton(side, "sides", "beforeend", initFactions, side);
	}
}

/*
sides() is called when a side button is clicked

function sides() {

}
*/

// create factions based on which side was called
function initFactions(side) {
	// removes all of the DOM elements inside the div with id="factions"
	removeChildren("factions");

	// remove all of the DOM elements inside the div with id="variants"
	removeChildren("variants");

	for (let i = 0; i < factionsTree[side].length; i++) {
		
	}
	
	let sideData = factionsTree[side];
	let factionList = [];
	

	for (let t = 0; t < sideData.length; t++) {
		factionList.push(sideData[t]);
	}
	console.log(sideData, "\n", factionList, "\n", sideData == factionList);


	for (let elm = 0; elm < factionList.length; elm++) {
		let faction = factionList[elm];
		let id = faction.name;
		createButton(id, "factions", "beforeend", variants, faction);
	}
}

// create variants based on the called faction
function variants(faction) {
	// remove all of the DOM elements inside the div with id="variants"
	removeChildren("variants");

	console.log(faction);
}

//----------VARIABLES----------//
const factionsPath = "../json/factions.json";
const motorpoolPath = "../json/motorpool.json";
//-----------------------------//

//------------TESTING BELOW HERE FOR READABILITY--------------//

parse(factionsPath, motorpoolPath);
