import factionJson from "../../json/factions.json";
import Factions from "./factions.js";
import { useState, useContext} from "react";

function Sides(value) {
	// useState to render the factions buttons
	const [side, changeSide] = useState("");

    const store = useContext(StoreContext);
    store.side = "opfor";
	// get array of the sides (they are the keys in the first level of the json)
	let sideIDs = Object.keys(factionJson);

	return (
		<>
			<div id="sides">
				{/*render the buttons based on ids in sideIDs*/}
				{sideIDs.map((x) => (
					<button id={x} onClick={() => changeSide(x)}>
						{x}
					</button>
				))}
			</div>
			{/* if a side has been selected (side not empty), render factions, other wise dont */}
			{side !== "" ? <Factions side={side} /> : null}
		</>
	);
}

export default Sides;
