import { useState, useContext } from "react";
import factionJson from "../../json/factions.json";

function Variants(props) {
	const store = useContext(StoreContext);

    console.log(store.side, store.faction);

	const side = props.side;
	const faction = props.faction;
	let factionData = [];
	let variantNames = [];

	// get array of factions for given side
	const factionArr = factionJson[side];

	// iterate through array and get correct faction variants as array
	for (let i = 0; i < factionArr.length; i++) {
		if (factionArr[i].name === faction) {
			factionData = factionArr[i].variants;
		}
	}
	
    // get variant names (loop)
	for (let i = 0; i < factionData.length; i++) {
		variantNames.push(factionData[i].name + " " + factionData[i].era);
	}

	return (
		<>
			<div id="variants">
				{variantNames.map((x) => (
					<button onClick={() => setVariant(x)}>{x}</button>
				))}
			</div>
		</>
	);
}

export default Variants;
