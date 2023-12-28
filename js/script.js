/*
script for the motorpool tool
*/

// this function has to open the json file
async function openJson(pathToFile) {
	this;
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
	// create objects corresponding to the factions and eras, empty them
	let factionDiv = document.getElementById("factions");
	let eraDiv = document.getElementById("eras");

	// removes all of the DOM elements inside the div with id="factions"
	for (const child of factionDiv.children) {
		child.remove();
	}

	// removes all of the DOM elements inside the div with id="eras"
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

	// remove all of the DOM elements inside the div with id="eras"
	let eraDiv = document.getElementById("eras");
	for (const child of eraDiv.children) {
		child.remove();
	}

	/* create buttons for every faction in side
    for (elm = 0; elm < factionList.length; elm++) {
        createButton(factionList[elm], "factions", "beforeend", eras);
    } 
    */
}

// create eras based on the called faction
function eras(faction) {
	this;
}

/*
parses motorpool and factions json and returns several objects.
objects:
- list of factions for every side
- list of eras for every faction
- something that stores motorpool data

generated object 1: dict of dicts. structure: {side1:{faction1:{era1, era2, era3, era4}, faction2:{era1}}, side2:{faction1}}
*/
function parseData(path1, path2) {
	this;
}
