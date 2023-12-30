/*
script for the motorpool tool
*/

/*
below function parses motorpool and factions json and returns several objects.
objects:
- list of factions for every side
- list of variants for every faction
- something that stores motorpool data

generated object 1: dict of dicts. structure: {side1:{faction1:{era1, era2, era3, era4}, faction2:{era1}}, side2:{faction1}}
*/
async function parse(factionsPath, motorpoolPath = null) {
	// parse factions Json
	const request = await fetch(factionsPath);
	const response = await request.json();

	// create a list of blufor factions
	parseFactions(response);
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
		buttonExists &&
		id != null &&
		parent != null &&
		func != null &&
		params != null
	) {
		let parent = document.getElementById(parent);

		// create button and set attributes, add event listener (replaces onclick + its better)
		let button = document.createElement("button");
		button.setAttribute("id", id);
		button.setAttribute("type", "button");
		button.addEventListener("click", function () {
			func, params;
		});

		// add button inside the parent div
		parent.insertAdjacentElement(position, button);
	} else {
		console.log("ERROR: wrong input, aborting...");
		return;
	}
}

/* 
is called upon loading the page. creates side buttons
*/
function initSides(sideList) {
	// create objects corresponding to the factions and variants, empty them
	let factionDiv = document.getElementById("factions");
	let eraDiv = document.getElementById("variants");

	// removes all of the DOM elements inside the div with id="factions"
	for (const child of factionDiv.children) {
		child.remove();
	}

	// removes all of the DOM elements inside the div with id="variants"
	for (const child of eraDiv.children) {
		child.remove();
	}

	// iterate through sideList, create buttons for each side
	for (elm = 0; elm < sideList.length; elm++) {
		createButton(
			sideList[elm],
			"sides",
			"beforeend",
			factions /* add the input for the factions function here */
		);
	}
}

/*
sides() is called when a side button is clicked

function sides() {

}
*/

// create factions based on which side was called
function factions(side) {
	// removes all of the DOM elements inside the div with id="factions"
	let factionDiv = document.getElementById("factions");
	for (const child of factionDiv.children) {
		child.remove();
	}

	// remove all of the DOM elements inside the div with id="variants"
	let eraDiv = document.getElementById("variantsf");
	for (const child of eraDiv.children) {
		child.remove();
	}

	/* create buttons for every faction in side
    for (elm = 0; elm < factionList.length; elm++) {
        createButton(factionList[elm], "factions", "beforeend", variants);
    } 
    */
}

// create variants based on the called faction
function variants(faction) {
	this;
}

//----------VARIABLES----------//
const factionsPath = "../json/factions.json";
const motorpoolPath = "../json/motorpool.json";
//-----------------------------//

//------------TESTING BELOW HERE FOR READABILITY--------------//

parse(factionsPath);
