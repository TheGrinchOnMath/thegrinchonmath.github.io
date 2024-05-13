import json, sys

PATH1 = "/home/gronk/Desktop/Projects/thegrinchonmath.github.io/legacy/json/factions.json"
PATH2 = "/home/gronk/Desktop/Projects/thegrinchonmath.github.io/legacy/json/motorpool.json"

LIST = []
TURRET_LIST = []
TURRET_ID = []

with open(PATH1, "r") as read_file:
    json_object = json.load(read_file)

    # get every side
    for key in json_object:
        side = json_object[key]

        for faction in side:
            for key in faction:
                variants = faction[key]
                for variant in variants:
                    # some weird error with it trying to access the name of the variant
                    try:
                        motorpool = variant["motorpool"]
                    except TypeError:
                        continue

                    for group in motorpool:
                        vehicles = group["vehicles"]
                        for vehicle in vehicles:
                            LIST.append(vehicle['id'])

LIST = list(set(LIST))

with open(PATH2, "r") as read_file:
    motorpool_json = json.load(read_file)

    for element in motorpool_json:
        turrets = element["turrets"]
        if turrets != []:
            for turret_data in turrets:
                turret_id = turret_data["id"] if isinstance(turret_data, type({})) else turret_data

                TURRET_LIST.append(turret_data)
                TURRET_ID.append(turret_id)

turret_list_temp = []
[turret_list_temp.append(x) for x in TURRET_LIST if x not in turret_list_temp]
TURRET_LIST = turret_list_temp
turret_id_temp = []
[turret_id_temp.append(x) for x in TURRET_ID if x not in turret_id_temp]
TURRET_LIST = turret_id_temp

print(len(LIST), len(TURRET_LIST), TURRET_ID)