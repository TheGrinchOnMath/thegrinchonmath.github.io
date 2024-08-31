import Form from "./components/motorpoolTool/form.js";
import Sides from "./components/motorpoolTool/sides.js";
import { useState, createContext } from "react";

function App() {
	const StoreContext = createContext();
	const [store, setStore] = useState({
		faction: "blufor",
		Faction: "British SAS",
		variant: "Urban Modern",
	});
	return (
		<>
			<p> hello react!</p>
			<StoreContext.Provider value={store}>
				<Form value={store}/>
				<Sides value={store}/>
			</StoreContext.Provider>
		</>
	);
}

export default App;
