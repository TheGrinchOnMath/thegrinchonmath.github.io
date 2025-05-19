/*
Script for the motorpool visualization website
*/

// Declare Global Variables
let motorpoolMap = new Map(),
	motorpoolTree = null;

// global max and min vehicles for the selections
let maxVehicles = 10,
	minVehicles = 0;

// keep track of how many of each data type is at total
let inputCounter = { passengers: 0, crew: 0, cargo: 0, turrets: [] };

// arrays for use with checking if images are in the img directory
let idArray = new Array(),
	urlArray = new Array(),
	notThereArray = new Array();

// array to keep track of what air elements are in the selected variant
let airElementsArray = new Array();

// 2 Seat helis array
const twoSeaterHelis = ["RHS_AH1Z_wd", "LOP_IRAN_AH1Z_WD", "BWA3_Tiger_RMK", "RHS_AH64D", "rhs_mi28n_vvsc"]

// fetch json file, return js object. dont modify as promises are weird
async function parseJson(path) {
	const request = await fetch(path);
	const response = await request.json();

	return response;
}

// main function
// and only function that gets directly called at script execution
async function parse(factionsPath, motorpoolPath) {
	// get json data for factions and motorpool (all ingame items)
	factionsTree = await parseJson(factionsPath);
	motorpoolTree = await parseJson(motorpoolPath);

	// create an array containing all side names as string, for later use
	let sides = new Array();
	for (let side in factionsTree) {
		sides.push(side);
	}

	// fill motorpoolMap with id:[name, type, crew, passengers, cargo, turrets]
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

	// call initSides, creates sides buttons from the array created earlier
	initSides(sides);
}

// set attributes for a node. credit: https://bobbyhadz.com/blog/javascript-set-multiple-attributes-to-element
function setAttributes(element, attributes) {
	Object.keys(attributes).forEach((attr) => {
		element.setAttribute(attr, attributes[attr]);
	});
}

// set event listeners for a node. inspired by above function
function setEventListeners(element, functions) {
	Object.keys(functions).forEach((func) => {
		element.addEventListener("click", function () {
			window[func](functions[func]);
			// credit for pointing the right way is https://stackoverflow.com/a/359910
		});
	});
}

/*
id: button ID. parent: parent node in the html. position: beforeend, afterbegin, etc
attributes: object containing all of the data used by setAttributes such as innerText, disabled, etc
*/
function createButton(attributes = "undefined", functions = "undefined") {
	// create button node
	const button = document.createElement("button");

	// set attributes. IMPORTANT: IF ATTRIBUTES ARE WRONG LOOK AT CREATEBUTTON PARAMS ON CALL
	if (attributes != "undefined") {
		setAttributes(button, attributes);
	}

	// set event listeners. Same as above
	if (functions != "undefined") {
		setEventListeners(button, functions);
	}

	return button;
}

function removeChildren(id) {
	const node = document.getElementById(id);
	while (node.firstChild) {
		node.removeChild(node.lastChild);
	}
}

function loadImage(id) {
	let img = document.getElementById("image");
	let imgId = id.toLowerCase();

	// create url for localhost
	const url = `/img/${imgId}.jpg`;
	let imgUrl = "/img/missing.jpg";

	if (asyncCheckFileExists(url)) {
		// use the image from the image dir
		imgUrl = url;
	}

	// check if DOM already exists
	if (img === null) {
		// get parent
		const parentElement = document.getElementById("imageDiv");

		// create element
		img = document.createElement("img");
		// set id, class
		img.setAttribute("id", "image");
		img.setAttribute("class", "image");
		parentElement.insertAdjacentElement("beforeend", img);
	}

	// change what image the element fetches
	img.setAttribute("src", imgUrl);
	// change the alt to be the image id
	img.setAttribute("alt", imgId);
}

// empties the resultContainer child divs
function resetResults() {
	// get the parent div of the image and the parent div of the results
	let imageDiv = document.getElementById("imageDiv");
	let results = document.getElementById("results");

	// empty both divs
	results.replaceChildren([]);
	imageDiv.replaceChildren([]);
}

// this function gets called by parse, and creates the sides buttons. also empties factions and variants
function initSides(sideArray) {
	// get nodes for sides, factions, variants
	const sides = document.getElementById("sides"),
		factions = document.getElementById("factions"),
		variants = document.getElementById("variants");

	// init new array for holding the buttons for later use with replaceChildren
	let newSideArray = new Array();

	for (let i = 0; i < sideArray.length; i++) {
		let side = sideArray[i];
		const button = createButton(
			{ id: side, type: "button" },
			{ factions: side }
		);
		button.innerText = side;
		newSideArray.push(button);
	}

	// replace children of sides, empty factions and variants
	for (let i = 0; i < newSideArray.length; i++) {
		sides.insertAdjacentElement("beforeend", newSideArray[i]);
	}

	// empty factions and variants divs
	factions.replaceChildren([]);
	variants.replaceChildren([]);

	// empty the results
	resetResults();
}

//
function factions(side) {
	// get nodes for factions, variants and content
	const factions = document.getElementById("factions"),
		variants = document.getElementById("variants"),
		content = document.getElementById("content");

	// init new array for holding the buttons for later use with replaceChildren
	let newFactionsArray = new Array();

	// create variable to avoid weird and complex syntax
	// for a direct call to factionsTree
	let sideData = factionsTree[side];

	// create a button for every faction of the side, with the label
	// being the faction name
	for (let i = 0; i < factionsTree[side].length; i++) {
		let faction = sideData[i];
		let id = faction.name;
		const button = createButton(
			{ id: id, type: "button" },
			{ variants: faction }
		);
		button.innerText = id;
		newFactionsArray.push(button);
	}

	factions.replaceChildren([]);
	// replace old factions with new factions, empty variants
	for (let i = 0; i < newFactionsArray.length; i++) {
		factions.insertAdjacentElement("beforeend", newFactionsArray[i]);
	}

	// empty variants, content divs
	variants.replaceChildren([]);
	content.replaceChildren([]);

	// empty results
	resetResults();
}

// create variants based on the called faction
function variants(faction) {
	// get nodes for variant buttons and content
	const variants = document.getElementById("variants"),
		content = document.getElementById("content");

	// init new array for holding the buttons for later use with replaceChildren
	let newVariantsArray = new Array();

	// create variant buttons
	const variantList = faction.variants;
	for (let i = 0; i < variantList.length; i++) {
		const variant = variantList[i];
		const str = variant.name + " " + variant.era;
		const button = createButton(
			{ id: str, type: "button" },
			{ generateContent: variant }
		);
		button.innerText = str;
		newVariantsArray.push(button);
	}
	// empty variants div
	variants.replaceChildren([]);

	// replace buttons in variants, empty content
	for (let i = 0; i < newVariantsArray.length; i++) {
		variants.insertAdjacentElement("beforeend", newVariantsArray[i]);
	}
	content.replaceChildren([]);

	// empty results
	resetResults();
}

// variant parameter is an object, extracted from factions.json
async function generateContent(variant) {
	// get content node
	const contentNode = document.getElementById("content");
		contentNode.replaceChildren([]);
	// reset airElements array
	airElementsArray = new Array();

	// iterate through variant.motorpool array
	for (let i = 0; i < variant.motorpool.length; i++) {
		// create variable to store the data of the variant motorpool group, get the content node
		const group = variant.motorpool[i],
			groupTitle = document.createElement("h4");

		// set group header attributes
		setAttributes(groupTitle, {
			id: group.group,
			class: "group",
		});
		groupTitle.innerText = group.group;

		// insert group into content
		contentNode.insertAdjacentElement("beforeend", groupTitle);

		// get vehicles from group, process vehicles
		const vehicles = group.vehicles;
		processVehicles(vehicles, group);
	}
}

// function for making life easier on myself.
// creates and sets up a p node with given data and returns the object
function createTextNode(attributes) {
	// create node
	const node = document.createElement("p");

	// set attributes
	setAttributes(node, attributes);

	// return node
	return node;
}

// process vehicles of each group and insert into the content div at the right spot
function processVehicles(vehicles, group) {
	// get content div
	const contentNode = document.getElementById("content");
	const groupName = group.group;
	let crewSeats;
	let airAsset = false;
	// check for all group names
	if (
		groupName == "Rotary Transport" ||
		groupName == "Rotary Attack" ||
		groupName == "Fixed Wing Transport" ||
		groupName == "Fixed Wing Attack"
	) {

		airAsset = true;
		crewSeats = 1;
		// do something with TACP later here
	} else if (groupName == "APC" || groupName == "SPAA" || groupName == "SPG") {
		crewSeats = 2;
	} else if (groupName == "IFV" || groupName == "MBT") {
		crewSeats = 3;
	}
	// the not speshal vehicles do not need a dedicated crew so no need to calculate
	else {
		console.log("unknown group: " + group.group)
		crewSeats = 0;
	}

	// iterate through vehicles
	for (let i = 0; i < vehicles.length; i++) {
		// set new variable from motorpoolMap for ease of syntax
		const data = motorpoolMap.get(vehicles[i].id);

		// add vehicle ID to the list
		idArray.push(vehicles[i].id.toLowerCase());

		if (data == undefined) {
			// detect if missing data. currently there is no data for turrets.
			// uncomment to get data
			// console.log(`there is no data in motorpoolMap for id:${vehicles[i].id}`);
		} else {

			if (airAsset && twoSeaterHelis.includes(vehicles[i].id)) {
				crewSeats = 2;
			}

			if (airAsset) {
				airElementsArray.push(vehicles[i].id);
			}
			// calculate the correct passenger and crew counts
			const totalSeats = Number(data[2]) + Number(data[3]);
			const passengerSeats = totalSeats - crewSeats;

			// create all the elements for the row of the grid for the vehicle

			// create type node, set attributes
			const typeId = vehicles[i].id + "Type";
			const type = createTextNode({
				id: typeId,
				class: "type",
				value: data[1],
			});
			type.innerText = "type: " + data[1];
			type.addEventListener("click", function () {
				loadImage(vehicles[i].id);
			});
			contentNode.insertAdjacentElement("beforeend", type);

			// create name node, set attributes
			const nameId = vehicles[i].id + "Name";
			const name = createTextNode({
				id: nameId,
				class: "name",
				value: data[0],
			});
			name.innerText = data[0];
			name.addEventListener("click", function () {
				loadImage(vehicles[i].id);
			});
			contentNode.insertAdjacentElement("beforeend", name);

			// create crew node, set attributes
			const crewId = vehicles[i].id + "Crew";
			const crew = createTextNode({
				id: crewId,
				class: "crew",
				value: data[2],
			});
			crew.innerText = "crew: " + crewSeats;
			crew.addEventListener("click", function () {
				loadImage(vehicles[i].id);
			});
			contentNode.insertAdjacentElement("beforeend", crew);

			// create passenger node, set attributes
			const passengersId = vehicles[i].id + "Passengers";
			const passengers = createTextNode({
				id: passengersId,
				class: "passengers",
				value: passengerSeats,
			});
			passengers.addEventListener("click", function () {
				loadImage(vehicles[i].id);
			});
			passengers.innerText = "passengers: " + data[3];
			contentNode.insertAdjacentElement("beforeend", passengers);

			// create cargo node, set attributes
			const cargoId = vehicles[i].id + "Cargo";
			const cargo = createTextNode({
				id: cargoId,
				class: "cargo",
			});

			// check if cargo is enabled or disabled
			if (vehicles[i].cargo != -1) {
				cargo.innerText = "cargo: " + vehicles[i].cargo;
				cargo.setAttribute("value", vehicles[i].cargo);
			} else {
				cargo.innerText = "cargo: " + 0;
				cargo.setAttribute("value", 0);
			}

			cargo.addEventListener("click", function () {
				loadImage(vehicles[i].id);
			});
			contentNode.insertAdjacentElement("beforeend", cargo);

			// create turrets p, set attributes

			// create plus button, set attributes
			const plusId = vehicles[i].id + "Plus";
			const plus = createButton(
				{ id: plusId, type: "button", class: "plus" },
				{ addToVehicleCount: vehicles[i].id }
			);
			plus.innerText = "+";
			plus.addEventListener("click", function () {
				loadImage(vehicles[i].id);
			});
			contentNode.insertAdjacentElement("beforeend", plus);

			// create minus button, set attributes
			const minusId = vehicles[i].id + "Minus";
			const minus = createButton(
				{ id: minusId, type: "button", class: "minus" },
				{ deductFromVehicleCount: vehicles[i].id }
			);
			minus.innerText = "-";
			contentNode.insertAdjacentElement("beforeend", minus);

			// create vehicleCount node, set attributes
			const vehicleCountId = vehicles[i].id + "VehicleCount";
			const vehicleCount = createTextNode({
				id: vehicleCountId,
				class: "vehicleCount",
			});
			vehicleCount.setAttribute("value", vehicles[i].id);
			vehicleCount.innerText = "0";
			vehicleCount.addEventListener("click", function () {
				loadImage(vehicles[i].id);
			});
			contentNode.insertAdjacentElement("beforeend", vehicleCount);

			// create thin black line between vehicles
			const gridRowSeparator = document.createElement("div");
			gridRowSeparator.setAttribute("class", "gridRowSeparator");
			contentNode.insertAdjacentElement("beforeend", gridRowSeparator);
		}
	}
}

// not working (below)

// add to the counter of the given vehicle
function addToVehicleCount(vehicleId) {
	// get vehicle counter, extract count
	const vehicleCounter = document.getElementById(`${vehicleId}VehicleCount`);
	let count = Number(vehicleCounter.innerText);

	// increment the counter by 1
	count++;

	if (count > maxVehicles) {
		count = maxVehicles;
	}

	// convert the count to string, reconvert it to a string and reinsert it into the node
	countString = count;
	vehicleCounter.innerText = countString; // you can add numbers to innertext, will treat as string
	showSelectedVehicles();
}

// remove from the count of the given vehicle
function deductFromVehicleCount(vehicleId) {
	// get vehicle counter, extract count
	const vehicleCounter = document.getElementById(`${vehicleId}VehicleCount`);
	let count = Number(vehicleCounter.innerText);

	// increment the counter by 1
	count--;

	// keep count from being negative (this breaks the code)
	if (count < 0) {
		count = 0;
	}

	// convert the count to string, reconvert it to a string and reinsert it into the node
	countString = count;
	vehicleCounter.innerText = countString;
	showSelectedVehicles();
}

function resetVehicleSelection() {
	// get selected vehicles
	const vehicleCounts = document.getElementsByClassName("vehicleCount");

	// iterate through selected vehicles and empty content
	for (let i = 0; i < vehicleCounts.length; i++) {
		count = vehicleCounts[i];
		count.innerText = 0;
	}
	// reset results
	resetResults();
}

// show the vehicles in a different div. requires: same stats as the content div. get the data from the content div
function showSelectedVehicles() {
	// reset input counter
	for (let key in inputCounter) {
		inputCounter[key] = 0;
	}

	// create object for use a couple of lines below
	let idObject = new Object();

	// get parent node
	const parent = document.getElementById("results");

	// create "reset" button
	const resetButton = createButton(
		{ id: "resetButton" },
		{ resetVehicleSelection: null }
	);
	resetButton.innerText = "Reset Vehicle selection";

	// create header for inside parent node
	const selectedVehicles = document.createElement("h3");
	selectedVehicles.setAttribute("id", "resultData");
	selectedVehicles.innerText = "Selected Vehicles:";

	// empty parent node
	parent.replaceChildren([]);
	// insert header, insert button
	parent.insertAdjacentElement("afterbegin", selectedVehicles);
	parent.insertAdjacentElement("afterbegin", resetButton);

	// get all text nodes containing the numerical values for the vehicle quantity
	const counterNodes = document.getElementsByClassName("vehicleCount");

	// iterate through counterNodes
	for (let i = 0; i < counterNodes.length; i++) {
		// get node
		node = counterNodes[i];

		// get node from the inner text
		let value = Number(node.innerText);

		// get id from value attribute
		let id = node.getAttribute("value");

		// if at least one vehicle has been selected, add the id and the value to the object
		if (value > 0) {
			idObject[id] = value;
		}
	}

	// get necessary data and create the text node
	// iterates through the keys of the object
	for (let key in idObject) {
		const container = document.createElement("p");

		// store value in variable to avoid variable salad
		const value = idObject[key];

		// load the innerText for every element in the content div that has vehicle data in it
		const type = document.getElementById(`${key}Type`).getAttribute("value"),
			name = document.getElementById(`${key}Name`).getAttribute("value"),
			crew = document.getElementById(`${key}Crew`).getAttribute("value"),
			passengers = document
				.getElementById(`${key}Passengers`)
				.getAttribute("value"),
			cargo = document.getElementById(`${key}Cargo`).getAttribute("value"),
			cargoValue = Number(cargo);

		motorpoolData = motorpoolMap.get(key);

		// add values to input counter
		inputCounter.passengers += value * Number(motorpoolData[3]);
		inputCounter.crew += value * Number(motorpoolData[2]);

		if (cargoValue > 0) {
			inputCounter.cargo += value * cargoValue;
		}

		// construct string to be put in the paragraph
		const str = `${value}x ${name}:   type: ${type}, crew: ${crew}, passengers: ${passengers}, cargo: ${cargo}`;

		container.innerText = str;
		parent.insertAdjacentElement("beforeend", container);
	}

	// check TACP reqs
	let str = calculateAirControlReqs();
	const TACPstring = document.createElement("h4");
	if (str != "") {
		TACPstring.innerHTML = "<br/>" + str;
	} else {
		TACPstring.innerHTML = "";
	}
	// create finalResult div, add innerText and insert into parent div
	const finalResult = document.createElement("h4");
	finalResult.innerText =
		"Current Preset requires " +
		inputCounter.crew +
		" dedicated crew. It provides space for " +
		inputCounter.passengers +
		" passengers. There are  " +
		inputCounter.cargo +
		" total cargo slots.";
	parent.insertAdjacentElement("beforeend", finalResult);

	parent.insertAdjacentElement("beforeend", TACPstring);
}

// calculate TACP element reqs based on air element count
function calculateAirControlReqs() {
	const vehicleCountArr = document.getElementsByClassName("vehicleCount");
	let airVehicles = 0;
	let fullRoles = false;
	let reducedRoles = false;
	// iterate through vehicleCounts
	for (let i = 0; i < vehicleCountArr.length; i++) {
		// get vehicle from array
		const vehicleCountNode = vehicleCountArr[i];
		const vehicleCount = Number(vehicleCountNode.innerText);
		// check if vehicle is inside the array created earlier
		if (
			airElementsArray.includes(vehicleCountNode.getAttribute("value")) &&
			vehicleCount != 0
		) {
			airVehicles += vehicleCount;
		}
	}
	// string to output
	let str = "TACP requirements: ";

	if (airVehicles === 1) {
		str = str + "1 FAC and PL who acts as JTAC";
	} else if (airVehicles > 1) {
		str = str + "Full TACP team: 1 FAC and 1 JTAC";
	} else {
		str = "";
	}
	return str;
}

// credit = https://stackoverflow.com/a/35341828
function checkImagesArr(array) {
	for (let index = 0; index < array.length; index++) {
		const id = array[index].toLowerCase();
		const url = `/img/${id}.jpg`;
		if (asyncCheckFileExists(url)) {
			urlArray.push(url);
		} else {
			notThereArray.push(url);
		}
	}
}

// check if the file exists by sending a xmlhttp request and reading the status. if 404, file not exist or service down
// credit and inspiration: https://kinsta.com/knowledgebase/javascript-http-request/
// !!! if the file does not exist the browser will throw an error. THIS IS NORMAL. the function will return false (normally?)
async function asyncCheckFileExists(url) {
	const xhr = new XMLHttpRequest();

	// specify request type and destination
	xhr.open("GET", url);

	// send request
	xhr.send();

	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status != 404) {
				return "sucess!";
			} else {
				return "Error, status was 404";
			}
		}
	};
}

//----------call functions----------//
parse("/json/factions.json", "/json/motorpool.json");
