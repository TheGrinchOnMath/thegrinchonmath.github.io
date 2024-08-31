import { useState } from "react";
import factionJson from "../../json/factions.json";
import Variants from "./variants.js";

function Factions(props) {
	const side = props.side;
	const [faction, changeFaction] = useState("");

	const factions = factionJson[side];

	const factionNames = factions.map((x) => x.name);

	return (
		<>
			<div id="factions">
				{factionNames.map((x) => (
					<button onClick={() => changeFaction(x)}>{x}</button>
				))}
			</div>
			{side !== "" ? <Variants faction={faction} side={side} /> : null}
		</>
	);
}

export default Factions;
