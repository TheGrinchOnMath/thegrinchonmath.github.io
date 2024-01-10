- cleanup the functions, add more functions to make the code clearer to read
- research json, how to access complicated arrays

factions.json structure:
side:`[{name:FACTION_NAME, variants:[{name:NAME, motorpool:[{vehicles:{id:ID, cargo : 0}}]}]}]`

factions object structure:



Idea:
when a user clicks on a variant, load vehicles from motorpool db using ID

Create: object containing: SIDE:[{FACTIONNAME:DATA; VARIANTS:[VAR1, VAR2, VAR3]}]
create a map with VARIANT:MOTORPOOL [vehicle1[id, cargo], vehicle2[id, cargo]]

### TODO:
- change parseInputs storage of quantity of inputs
