/*
script for the motorpool tool
*/

//Global Variables
let factionsTree = null,
	motorpoolMap = new Map(),
	motorpoolTree = null;

let inputCounter = { passengers: 0, crew: 0, cargo: 0, turrets: [] };

async function parse(factionsPath, motorpoolPath) {
	factionsTree = await parseJson(factionsPath);
	motorpoolTree = await parseJson(motorpoolPath);

	//----------test----------//
	//console.log(motorpoolTree[0]);
	//------------------------//
	let sides = new Array();
	for (let side in factionsTree) {
		sides.push(side);
	}

	for (let i = 0; i < motorpoolTree.length; i++) {
		const motorpool = motorpoolTree[i];
		motorpoolMap.set(motorpool.id, [
			motorpool.name,
			motorpool.type,
			motorpool.crew,
			motorpool.passengers,
			motorpool.cargo,
			motorpool.turrets,
		]);
	}

	initSides(sides);
}

async function parseJson(path) {
	// parse factions Json
	const request = await fetch(path);
	const response = await request.json();

	// create a list of blufor factions
	return response;
}

/* 
this function is dedicated to creating a button DOM in the html
the context manager uses context as input, and the function then takes 
input:data and can be called using context.input
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

function image(id, parent, position, url) {
	// get the node of the parent, create image node
	const parentDOM = document.getElementById(parent);
	let imageDOM = document.createElement("img");

	// set attributes
	imageDOM.setAttribute("id", id);
	imageDOM.setAttribute("src", url);

	// add image to parent DOM
	parentDOM.insertAdjacentElement(position, imageDOM);
}

function randomImage(id, parent, position) {
	// get the node of the parent, create image node
	const parentDOM = document.getElementById(parent);
	let imageDOM = document.createElement("img");

	// set attributes
	imageDOM.setAttribute("id", id);
	imageDOM.setAttribute("src", "https://cataas.com/cat?width=256&height=256");

	parentDOM.insertAdjacentElement(position, imageDOM);
}

function fillData(vehicles) {
	const contentDiv = document.getElementById("content");

	for (let j = 0; j < vehicles.length; j++) {
		//console.log(vehicles[j].id, vehicles[j].cargo);
		//console.log(motorpoolMap.get(vehicles[j].id));

		const data = motorpoolMap.get(vehicles[j].id);
		// avoid errors cropping up when data is undefined
		if (data == undefined) {
			console.log(data, vehicles[j].id, motorpoolMap.get(vehicles[j].id));
			console.log(vehicles[13]);
			console.log("data is undefined");
		} else if (data != undefined) {
			//construct string to display inside of vehicleData
			const string =
				"Name: " +
				data[0] +
				"\tType: " +
				data[1] +
				"<br/>Crew: " +
				data[2] +
				"\tPassengers: " +
				data[3] +
				"<br/>cargo:" +
				vehicles[j].cargo;
			if (data[4].length > 0) {
				string.concat("<br/>", data[4]);
			}
			// create vehicle div, add to page
			let vehicleDiv = document.createElement("div");
			vehicleDiv.setAttribute("id", "vehicleContainer");
			contentDiv.insertAdjacentElement("beforeend", vehicleDiv);

			// create vehicleData p, add string created earlier
			let vehicleData = document.createElement("p");
			vehicleData.innerHTML = string;

			// create image img, add src and alt attributes

			let image = document.createElement("img");
			image.setAttribute("src", "https://cataas.com/cat?width=128&height=128"); // this url needs to be that of the image
			image.setAttribute("alt", " placeholder text");

			// add image and vehicleDiv to vehicleData
			vehicleDiv.insertAdjacentElement("afterbegin", image);
			vehicleDiv.insertAdjacentElement("beforeend", vehicleData);
			generateInputs(vehicles[j].id, vehicleDiv);
		}
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

// create factions based on which side was called
function initFactions(side) {
	// removes all of the DOM elements inside the div with id="factions"
	removeChildren("factions");

	// remove all of the DOM elements inside the div with id="variants"
	removeChildren("variants");

	// create variable to avoid weird and complex syntax
	// for a direct call to factionsTree
	let sideData = factionsTree[side];

	// create a button for every faction of the side, with the label
	// being the faction name
	for (let i = 0; i < factionsTree[side].length; i++) {
		let faction = sideData[i];
		let id = faction.name;
		createButton(id, "factions", "beforeend", variants, faction);
	}
}

// create variants based on the called faction
function variants(faction) {
	// remove all of the DOM elements inside the div with id="variants"
	removeChildren("variants");

	// remove all of the DOM elements inside the div with id="content"
	removeChildren("content");

	// create variant buttons
	let variantList = faction.variants;
	for (let i = 0; i < variantList.length; i++) {
		let variant = variantList[i];
		let str = variant.name + " " + variant.era;
		createButton(str, "variants", "beforeend", generateContent, variant);
	}
}

/*
this function has the task of generating the content of the variant.
This includes the vehicle stats, an image and the input.
*/
async function generateContent(variant) {
	// get all vehicle groups, get motorpool

	// iterate through motorpool groups, create a div for every vehicle, add a cat photo
	for (let i = 0; i < variant.motorpool.length; i++) {
		// create new variable for every group in the motorpool.
		// Create p for group, fetch content div
		const vehicleGroup = variant.motorpool[i];
		const contentDiv = document.getElementById("content");

		// create p element, add attributes, content and add to groupDiv
		let groupTitle = document.createElement("h3");
		groupTitle.innerText = vehicleGroup.group;
		groupTitle.id = vehicleGroup.group;
		contentDiv.insertAdjacentElement("beforeend", groupTitle);

		// start iterating through the vehicles
		const vehicles = vehicleGroup.vehicles;
		fillData(vehicles);
	}
}

//----------TESTING-FUNCTIONS----------//

function generateInputs(id, parent) {
	let newInput = document.createElement("input");
	newInput.setAttribute("type", "number");
	newInput.setAttribute("max", "10");
	newInput.setAttribute("min", "0");
	newInput.setAttribute("id", id);
	newInput.setAttribute("default", "0");
	const parentNode = parent;
	parentNode.insertAdjacentElement("beforeend", newInput);
}

// get all input DOMs and chec
function parseInputs() {
	const inputs = document.querySelectorAll("input");
	const resultDOM = document.getElementById("resultData");

	// this loop iterates through the inputs in the html page.
	for (let i = 0; i < inputs.length; i++) {
		let input = inputs[i];

		// check if a vehicle has been added to the checklist
		if (input.value != "" && input.value > 0) {
			let inputData = motorpoolMap.get(input.id);
			console.log(inputData[1]);
			inputCounter.passengers += Number(inputData[3]);
			inputCounter.crew += Number(inputData[2]);
			if (inputData.cargo != -1) {
				inputCounter.cargo += Number(inputData[4]);
			}d
		}
	}

	let string =
		"Current Preset requires " +
		inputCounter.crew +
		" crew. <br/> It provides space for " +
		inputCounter.passengers +
		" passengers, as well as " +
		inputCounter.cargo +
		" cargo slots.";
	resultDOM.innerHTML = string;
}
//------------------------------------//

//----------VARIABLES----------//
const factionsPath = "../json/factions.json";
const motorpoolPath = "../json/motorpool.json";
//-----------------------------//

//------------TESTING BELOW HERE FOR READABILITY--------------//

parse(factionsPath, motorpoolPath);
console.log(motorpoolMap.get("Car"));
console.log(typeof 1);

const input = document.querySelector("input");
