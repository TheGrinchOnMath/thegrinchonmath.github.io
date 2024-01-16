/*
Script for the motorpool visualization website
*/

// Declare Global Variables
let motorpoolMap = new Map(),
	motorpoolTree = null;

// global max and min vehicles for the selections
let maxVehicles = 10,
	minVehicles = 0;

// keep track of how many inputs have
let inputCounter = { passengers: 0, crew: 0, cargo: 0, turrets: [] };

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

// get image from path, load image to given location in html
function loadImage(id) {
	console.log(id);
}

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

	factions.replaceChildren([]);
	variants.replaceChildren([]);
}

//
function factions(side) {
	// get nodes for factions and variants
	const factions = document.getElementById("factions"),
		variants = document.getElementById("variants");

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
	variants.replaceChildren([]);
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
}

// variant parameter is an object, extracted from factions.json
async function generateContent(variant) {
	// get content node
	const contentNode = document.getElementById("content");

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
		processVehicles(vehicles, group.group);
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

	// iterate through vehicles
	for (let i = 0; i < vehicles.length; i++) {
		// set new variable from motorpoolMap for ease of syntax
		const data = motorpoolMap.get(vehicles[i].id);

		if (data == undefined) {
			console.log(`there is no data in motorpoolMap for id:${vehicles[i].id}`);
		} else {
			// create all the elements for the row of the grid for the vehicle

			// create type node, set attributes
			const typeId = vehicles[i].id + "Type";
			const type = createTextNode({
				id: typeId,
				class: "type",
			});
			type.innerText = data[1];
			type.addEventListener("click", function () {loadImage(vehicles[i].id)});
			contentNode.insertAdjacentElement("beforeend", type);

			// create name node, set attributes
			const nameId = vehicles[i].id + "Name";
			const name = createTextNode({
				id: nameId,
				class: "name",
			});
			name.innerText = data[0];
			name.addEventListener("click", function () {loadImage(vehicles[i].id)});
			contentNode.insertAdjacentElement("beforeend", name);

			// create crew node, set attributes
			const crewId = vehicles[i].id + "Crew";
			const crew = createTextNode({
				id: crewId,
				class: "crew",
			});
			crew.innerText = data[2];
			crew.addEventListener("click", function () {loadImage(vehicles[i].id)});
			contentNode.insertAdjacentElement("beforeend", crew);

			// create passenger node, set attributes
			const passengersId = vehicles[i].id + "Passengers";
			const passengers = createTextNode({
				id: passengersId,
				class: "passengers",
			});
			passengers.addEventListener("click", function () {loadImage(vehicles[i].id)});
			passengers.innerText = data[3];
			contentNode.insertAdjacentElement("beforeend", passengers);

			// create cargo node, set attributes
			const cargoId = vehicles[i].id + "Cargo";
			const cargo = createTextNode({
				id: cargoId,
				class: "cargo",
			});

			cargo.innerText = data[5];
			cargo.addEventListener("click", function () {loadImage(vehicles[i].id)});
			contentNode.insertAdjacentElement("beforeend", cargo);

			// create plus button, set attributes
			const plusId = vehicles[i].id + "Plus";
			const plus = createButton(
				{ id: plusId, type: "button", class: "plus" },
				{ calculate: "", addToVehicleCount: vehicles[i].id }
			);
			plus.innerText = "+";
			plus.addEventListener("click", function () {loadImage(vehicles[i].id)});
			contentNode.insertAdjacentElement("beforeend", plus);

			// create minus button, set attributes
			const minusId = vehicles[i].id + "Minus";
			const minus = createButton(
				{ id: minusId, type: "button", class: "minus" },
				{ calculate: "", deductFromVehicleCount: vehicles[i].id }
			);
			minus.innerText = "-";
			contentNode.insertAdjacentElement("beforeend", minus);

			// create vehicleCount node, set attributes
			const vehicleCountId = vehicles[i].id + "VehicleCount";
			const vehicleCount = createTextNode({
				id: vehicleCountId,
				class: "vehicleCount",
			});
			vehicleCount.innerText = "0";
			vehicleCount.addEventListener("click", function () {loadImage(vehicles[i].id)});
			contentNode.insertAdjacentElement("beforeend", vehicleCount);
		}
	}
}

// not working (below)

// add to the counter of the given vehicle
function addToVehicleCount(vehicleId) {
	// check if the counter is ok
	checkVehicleCount(vehicleId);

	// get vehicle counter, extract count
	const vehicleCounter = document.getElementById(`${vehicleId}VehicleCount`);
	let count = Number(vehicleCounter.innerText);

	// increment the counter by 1
	count++;

	// convert the count to string, reconvert it to a string and reinsert it into the node
	countString = count;
	vehicleCounter.innerText = countString; // you can add numbers to innertext, will treat as string
}

// remove from the count of the given vehicle
function deductFromVehicleCount(vehicleId) {
	// check if the counter is ok
	checkVehicleCount(vehicleId);

	// get vehicle counter, extract count
	const vehicleCounter = document.getElementById(`${vehicleId}VehicleCount`);
	let count = Number(vehicleCounter.innerText);

	// increment the counter by 1
	count--;

	// convert the count to string, reconvert it to a string and reinsert it into the node
	countString = count;
	vehicleCounter.innerText = countString;
}

//
function checkVehicleCount(vehicleId) {
	// get vehicleCounter and button elements
	const vehicleCounter = document.getElementById(`${vehicleId}VehicleCount`),
		plusButton = document.getElementById(`${vehicleId}Plus`),
		minusButton = document.getElementById(`${vehicleId}Minus`);

	// get count from vehicleCounter
	let count = Number(vehicleCounter.innerText);

	if (count < 0) {
		// set count to 0, disable the minus button and enable the plus button
		count = 0;
		console.log("how did that happen");
		plusButton.setAttribute("disabled", "false");
		minusButton.setAttribute("disabled", "true");
	} else if (count > maxVehicles) {
		// disable the plus button, enable the minus button, set count to 10
		count = maxVehicles;
		plusButton.setAttribute("disabled", "true");
		minusButton.setAttribute("disabled", "false");
	} else if (0 > count > maxVehicles) {
		// enable plus and minus button
		plusButton.setAttribute("disabled", "false");
		minusButton.setAttribute("disabled", "false");
	}
}

function showSelectedVehicles() {
	// get all text nodes containing the numerical values for the vehicle quantity
	const counterNodes = document.getElementsByClassName("vehicleCounter");
	for (let i = 0; i < counterNodes.length; i++) {
		console.log(node, typeof node, counterNodes[i], typeof counterNodes[i]);
	}
}

function calculate(str) {
	this
}

function addEventListenersToPNodes() {
	const contentNode = document.getElementById("content");
	const pNodes = contentNode.getElementsByTagName("p"); // list of p elements inside of div id:content

	// iterate through that list
	for (let i = 0; 0 < pNodes.length; i++) {
		// avoid spaghetti
		let paragraph = pNodes[i];
		if (paragraph == undefined) {
			console.log(i, pNodes[i], pNodes[i-1].id, pNodes[i-1].innerText)
		}
		// add the event listener for click, that calls the function showSelectedVehicles
		paragraph.addEventListener("click", function () {
			// call showSelectedVehicles()
			showSelectedVehicles();
		});
	}
}

//----------call functions----------//
parse("/json/factions.json", "/json/motorpool.json");

// speshal button to test the addEventListenersToPNodes()function
const speshalButton = document.createElement("button");
speshalButton.innerText = "add event listeners to all p elements!";
const resultsDiv = document.getElementById("results");
speshalButton.addEventListener("click", function () {
	addEventListenersToPNodes();
});
resultsDiv.insertAdjacentElement("afterbegin", speshalButton);

IdIterator = motorpoolMap.keys()

for (let len = 0; len < motorpoolMap.length; len++) {
	let id = IdIterator.next().value();
	let url = `/img/${id}.jpg`
}

// credit: https://stackoverflow.com/a/3646923 this function sends a request. 
// if there is something there, a status other than 404 will be returned, which is what we want to know
function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}