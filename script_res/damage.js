function CALCULATE_ALL_MOVES_BW(p1, p2, field) {
	checkAirLock(p1, field);
	checkAirLock(p2, field);
	checkForecast(p1, field.getWeather());
	checkForecast(p2, field.getWeather());
	checkKlutz(p1);
	checkKlutz(p2);
	checkRoom(field, p1, p2);
	checkSimple(p1.boosts);
	checkSimple(p2.boosts);
	p1.stats[DF] = getModifiedStat(p1.rawStats[DF], p1.boosts[DF]);
	p1.stats[SD] = getModifiedStat(p1.rawStats[SD], p1.boosts[SD]);
	p1.stats[SP] = getFinalSpeed(p1, field.getWeather());
	p2.stats[DF] = getModifiedStat(p2.rawStats[DF], p2.boosts[DF]);
	p2.stats[SD] = getModifiedStat(p2.rawStats[SD], p2.boosts[SD]);
	p2.stats[SP] = getFinalSpeed(p2, field.getWeather());
	checkIntimidate(p1, p2);
	checkIntimidate(p2, p1);
	checkDownload(p1, p2);
	checkDownload(p2, p1);
	p1.stats[AT] = getModifiedStat(p1.rawStats[AT], p1.boosts[AT]);
	p1.stats[SA] = getModifiedStat(p1.rawStats[SA], p1.boosts[SA]);
	p2.stats[AT] = getModifiedStat(p2.rawStats[AT], p2.boosts[AT]);
	p2.stats[SA] = getModifiedStat(p2.rawStats[SA], p2.boosts[SA]);
	var side1 = field.getSide(1);
	var side2 = field.getSide(0);
	checkInfiltrator(p1, side1);
	checkInfiltrator(p2, side2);
	var results = [[], []];
	for (let i = 0; i < 4; i++) {
		results[0][i] = getDamageResult(p1, p2, p1.moves[i], side1);
		results[1][i] = getDamageResult(p2, p1, p2.moves[i], side2);
	}
	return results;
}

function CalculateTurnOrder(attacker, defender, move, field) {
	let order = "speed tie";
	let speedDiff = attacker.stats[SP] - defender.stats[SP];
	let tr = field.isTR;
	let attackerMoving = "";
	if (tr) speedDiff *= -1;
	if (speedDiff > 0) {
		order = "move first";
		attackerMoving = "FIRST";
	}
	else if (speedDiff < 0) {
		order = "move second"
		attackerMoving = "SECOND";
	}
	let inTR = tr ? " in Trick Room" : "";
	return {
		attackerTurn: attackerMoving,
		description: (attacker.name + " will " + order + inTR + ".")
	};
}

function getDamageResult(attacker, defender, move, field) {
	var moveDescName = move.name;

	var atkAbility = attacker.ability;
	var defAbility = defender.ability;

	if (move.isZ && gen === 7) {
		var tempMove = move;
		//turning it into a generic single-target Z-move
		move = moves[ZMOVES_LOOKUP[tempMove.type]];
		move.bp = tempMove.zp;
		move.name = "Z-" + tempMove.name;
		move.isZ = true;
		move.category = tempMove.category;
		if (move.name.includes("Hidden Power")) {
			move.type = "Normal";
		}
		else move.type = tempMove.type;
		move.isCrit = tempMove.isCrit;
		move.hits = 1;

		attacker.item = "";
		moveDescName = ZMOVES_LOOKUP[move.type] + " (" + move.bp + " BP)";
	}

	/*****************/
	/*** Max Moves ***/
	/*****************/

	var exceptions_100_fight = ["Low Kick", "Reversal", "Final Gambit"];
	var exceptions_80_fight = ["Double Kick", "Triple Kick"];
	var exceptions_75_fight = ["Counter", "Seismic Toss"];
	var exceptions_140 = ["Crush Grip", "Wring Out", "Magnitude", "Double Iron Bash"];
	var exceptions_130 = ["Pin Missile", "Power Trip", "Punishment", "Dragon Darts", "Dual Chop", "Electro Ball", "Heat Crash", 
			"Bullet Seed", "Grass Knot", "Bonemerang", "Bone Rush", "Fissure", "Icicle Spear", "Sheer Cold", "Weather Ball", "Tail Slap", "Guillotine", "Horn Drill",
			"Flail", "Return", "Frustration", "Endeavor", "Natural Gift", "Trump Card", "Stored Power", "Rock Blast", "Gear Grind", "Gyro Ball", "Heavy Slam"];
	var exceptions_120 = ["Double Hit", "Spike Cannon"];
	var exceptions_100 = ["Twineedle", "Beat Up", "Fling", "Dragon Rage", "Nature's Madness", "Night Shade", "Comet Punch", "Fury Swipes", "Sonic Boom", "Bide",
			"Super Fang", "Present", "Spit Up", "Psywave", "Mirror Coat", "Metal Burst"];
	if(move.isMax && gen >= 8) {
		var tempMove = move;
		move = moves[MAXMOVES_LOOKUP[tempMove.type]];
		if(move.type == "Fighting" || move.type == "Poison") {
			if(tempMove.bp >= 150 || exceptions_100_fight.includes(move.name)) 
				move.bp = 100;
			else if(tempMove.bp >= 110) 
				move.bp = 95;
			else if(tempMove.bp >= 75) 
				move.bp = 90;
			else if(tempMove.bp >= 65) 
				move.bp = 85;
			else if(tempMove.bp >= 55 || exceptions_80_fight.includes(move.name)) 
				move.bp = 80;
			else if(tempMove.bp >= 45 || exceptions_75_fight.includes(move.name)) 
				move.bp = 75;
			else 
				move.bp = 70;
		}
		else {
			if(tempMove.bp >= 150) 
				move.bp = 150;
			else if(tempMove.bp >= 110 || exceptions_140.includes(move.name)) 
				move.bp = 140;
			else if(tempMove.bp >= 75 || exceptions_130.includes(move.name)) 
				move.bp = 130;
			else if(tempMove.bp >= 65 || exceptions_120.includes(move.name)) 
				move.bp = 120;
			else if(tempMove.bp >= 55 || exceptions_100.includes(move.name)) 
				move.bp = 110;
			else if(tempMove.bp >= 45) 
				move.bp = 100;
			else 
				move.bp = 90;
		}
		let maxName = MAXMOVES_LOOKUP[move.type];
		if(attacker.isGmax){
			console.log(attacker.GType);
			if(attacker.GType === move.type){
				maxName = attacker.GName;
			}
		}
		moveDescName =  maxName + " (" + move.bp + " BP)";

		move.category = tempMove.category;
		move.isMax = true;

		if(attacker.item == "Choice Band" || attacker.item == "Choice Specs" || attacker.item == "Choice Scarf") {
			attacker.item = "";
		}
	}

	var description = {
		"attackerName": attacker.name,
		"moveName": moveDescName,
		"defenderName": defender.name
	};

	description.atkShiny = attacker.isShiny;
	description.defShiny = defender.isShiny;

	description.attackerMark = attacker.markDesc;
	description.defenderMark = defender.markDesc;

	var turnOrder = CalculateTurnOrder(attacker, defender, move, field);

	description.isMR = field.isMR;		// magical room
	description.isWR = field.isWR;		// wonder room

	description.defMaxed = defender.isMax;
	description.defGMaxed = defender.isGmax;
	

	// if a move has 0 bp there is obviously no damage calculation to be done
	if (move.bp === 0) {
		return { "damage": [0], "description": buildDescription(description), "order": turnOrder.description };
	}


	// Chip Away ignores defense modifiers
	if (move.name === "Chip Away") {
		//defender.boosts[DF] = 0;
		defender.stats[DF] = getModifiedStat(defender.rawStats[DF], 0);
	}

	// Photon Geyser and LtBtS adapt to the user's higher attacking stat 
	if (move.name === "Photon Geyser" || move.name === "Light That Burns the Sky") {
		move.category = (attacker.stats[AT] > attacker.stats[SA]) ? "Physical" : "Special";
	}

	// Mold Breaker ignores the defender's ability
	if (["Mold Breaker", "Teravolt", "Turboblaze"].indexOf(atkAbility) !== -1) {
		defAbility = "";
		description.attackerAbility = atkAbility;
		defender.isFriendGuard = false;
	}
	// these moves function identically to Mold Breaker
	else if (move.name === "Moongeist Beam"
		|| move.name === "Sunsteel Strike"
		|| move.name === "Searing Sunraze Smash"
		|| move.name === "Menacing Moonraze Maelstrom"
		|| move.name === "Light That Burns the Sky") {

		defAbility = ""; //works as a mold breaker
		defender.isFriendGuard = false;
	}

	// Battle Armor & Shell Armor grant immunity to critical hits
	var isCritical = (move.isCrit && ["Battle Armor", "Shell Armor"].indexOf(defAbility) === -1);






	/***************************/
	/*** Type-Changing Moves ***/
	/***************************/

	// Weather Ball changes type depending on weather
	if (move.name === "Weather Ball") {
		move.type = field.weather.indexOf("Sun") > -1 ? "Fire"
			: field.weather.indexOf("Rain") > -1 ? "Water"
				: field.weather === "Sand" ? "Rock"
					: field.weather === "Hail" ? "Ice"
						: "Normal";

		description.weather = field.weather;
		description.moveType = move.type;
	}
	// Nature Power changes type depending on terrain
	else if (move.name === "Nature Power") {
		move.type = field.terrain === "Electric" ? "Electric"
			: field.terrain === "Grassy" ? "Grass"
				: field.terrain === "Psychic" ? "Psychic"
					: field.terrain === "Misty" ? "Fairy"
						: "Normal";
		description.terrain = field.terrain;
		description.moveType = move.type;
	}
	// Judgement changes type depending on held item
	else if (move.name === "Judgment" && attacker.item.indexOf("Plate") !== -1) {
		move.type = getItemBoostType(attacker.item);
	}
	// Natural Gift changes everything 
	else if (move.name === "Natural Gift" && attacker.item.indexOf("Berry") !== -1) {
		var gift = getNaturalGift(attacker.item);
		move.type = gift.t;
		move.bp = gift.p;
		description.attackerItem = attacker.item;
		description.moveBP = move.bp;
		description.moveType = move.type;
	}
	// Revelation Dance uses the attacker's primary type
	else if (move.name === "Revelation Dance") {
		move.type = attacker.type1;
		//TODO: check if soak affects revelation dance type	
	}

	// Z-Moves and Max Moves don't receive -ate type changes
	if (!move.isZ && !move.isMax) {
		var isAerilate = atkAbility === "Aerilate" && move.type === "Normal";
		var isPixilate = atkAbility === "Pixilate" && move.type === "Normal";
		var isRefrigerate = atkAbility === "Refrigerate" && move.type === "Normal";
		var isGalvanize = atkAbility === "Galvanize" && move.type === "Normal";

		if (isAerilate) {
			move.type = "Flying";
		} else if (isPixilate) {
			move.type = "Fairy";
		} else if (isRefrigerate) {
			move.type = "Ice";
		} else if (isGalvanize) {
			move.type = "Electric";
		} else if (atkAbility === "Normalize") {
			move.type = "Normal";
			description.attackerAbility = atkAbility;
		} else if (atkAbility === "Liquid Voice" && move.isSound) {
			move.type = "Water"
			description.attackerAbility = atkAbility;
		}
	}

	if (field.isIonized && move.type === "Normal") {
		move.type = "Electric";
		description.isIonized = true;
	}




	/*************************/
	/*** Type Effectivenes ***/
	/*************************/

	// Check if Gravity is affecting the calculation
	if (field.isGravity && move.type === "Ground"
		&& (defender.type1 === "Flying" || defender.type2 === "Flying" || defAbility === "Levitate" || defender.item === "Air Balloon")) {
		description.isGravity = true;
	}

	let typeEffect1 = getMoveEffectiveness(move, defender.type1, atkAbility === "Scrappy" || field.isForesight, field.isGravity);
	let typeEffect2 = defender.type2 ? getMoveEffectiveness(move, defender.type2, atkAbility === "Scrappy" || field.isForesight, field.isGravity) : 1;
	var typeEffectiveness = typeEffect1 * typeEffect2;

	/* handle type effectiveness for type-altered targets */
	if (defender.isSoaked == true) {
		description.defSoak = true;
		typeEffectiveness = getMoveEffectiveness(move, "Water", atkAbility === "Scrappy" || field.isForesight, field.isGravity);
	}
	if (defender.isForestCurse && (defender.type1 != "Grass" && defender.type2 != "Grass")) {
		description.defFC = true;
		typeEffectiveness *= getMoveEffectiveness(move, "Grass", atkAbility === "Scrappy" || field.isForesight, field.isGravity);
	}
	if (defender.isTrickOrTreat && (defender.type1 != "Ghost" && defender.type2 != "Ghost")) {
		description.defToT = true;
		typeEffectiveness *= getMoveEffectiveness(move, "Ghost", atkAbility === "Scrappy" || field.isForesight, field.isGravity);
	}

	// if the type effectiveness is 0, we're done
	if (typeEffectiveness === 0) {
		return { "damage": [0], "description": buildDescription(description), "order": turnOrder.description };
	}

	// handle immunity granted by abilities
	if ((defAbility === "Wonder Guard" && typeEffectiveness <= 1)
		|| (move.type === "Grass" && defAbility === "Sap Sipper")
		|| (move.type === "Fire" && defAbility.indexOf("Flash Fire") !== -1)
		|| (move.type === "Water" && ["Dry Skin", "Storm Drain", "Water Absorb"].indexOf(defAbility) !== -1)
		|| (move.type === "Electric" && ["Lightning Rod", "Lightningrod", "Motor Drive", "Volt Absorb"].indexOf(defAbility) !== -1)
		|| (move.type === "Ground" && !field.isGravity && defAbility === "Levitate")
		|| (move.isBullet && defAbility === "Bulletproof")
		|| (move.isSound && defAbility === "Soundproof")) {
		description.defenderAbility = defAbility;
		return { "damage": [0], "description": buildDescription(description), "order": turnOrder.description };
	}

	// handle immunity granted by items
	if (move.type === "Ground" && !field.isGravity && defender.item === "Air Balloon") {
		description.defenderItem = defender.item;
		return { "damage": [0], "description": buildDescription(description), "order": turnOrder.description };
	}

	// handle immunity granted by strong weather 
	if ((field.weather === "Harsh Sun" && move.type === "Water")
		|| (field.weather === "Heavy Rain" && move.type === "Fire")) {
		return { "damage": [0], "description": buildDescription(description), "order": turnOrder.description };
	}


	if (move.name === "Sky Drop" && ([defender.type1, defender.type2].indexOf("Flying") !== -1 || defender.weight >= 200.0 || field.isGravity)) {
		return { "damage": [0], "description": buildDescription(description), "order": turnOrder.description };
	}

	if (move.name === "Synchronoise") {
		if (attacker.isSoaked && !defender.isSoaked) {
			if ([defender.type1, defender.type2, defender.type3].indexOf("Water") === -1) {
				return { "damage": [0], "description": buildDescription(description), "order": turnOrder.description };
			}
		}
		else if (!attacker.isSoaked && defender.isSoaked) {
			if ([attacker.type1, attacker.type2, attacker.type3].indexOf("Water") === -1) {
				return { "damage": [0], "description": buildDescription(description), "order": turnOrder.description };
			}
		}
		else if ([defender.type1, defender.type2, defender.type3].indexOf(attacker.type1) === -1
			&& [defender.type1, defender.type2, defender.type3].indexOf(attacker.type2) === -1
			&& [defender.type1, defender.type2, defender.type3].indexOf(attacker.type3) === -1) {
			return { "damage": [0], "description": buildDescription(description), "order": turnOrder.description };
		}
	}

	// moves that deal fixed damage based on level
	if (move.name === "Seismic Toss" || move.name === "Night Shade") {
		let lv = attacker.level;
		if (atkAbility === "Parental Bond") {
			lv *= 2;
		}
		return { "damage": [lv], "description": buildDescription(description), "order": turnOrder.description };
	}


	description.HPEVs = defender.HPEVs + " HP";

	if (move.hits > 1) {
		description.hits = move.hits;
	}




	/******************/
	/*** Base Power ***/
	/******************/

	var basePower;
	var bpMods = [];

	switch (move.name) {
		case "Fishious Rend":
		case "Bolt Beak":
			basePower = turnOrder.attackerTurn === "FIRST" ? 170 : 85;
			description.moveBP = basePower;
			break;
		case "Payback":
			basePower = turnOrder.attackerTurn === "LAST" ? 100 : 50;
			description.moveBP = basePower;
			break;
		case "Electro Ball":
			var r = Math.floor(attacker.stats[SP] / defender.stats[SP]);
			basePower = r >= 4 ? 150 : r >= 3 ? 120 : r >= 2 ? 80 : 60;
			description.moveBP = basePower;
			break;
		case "Gyro Ball":
			basePower = Math.min(150, Math.floor(25 * defender.stats[SP] / attacker.stats[SP]));
			description.moveBP = basePower;
			break;
		case "Punishment":
			basePower = Math.min(200, 60 + 20 * countBoosts(defender.boosts));
			description.moveBP = basePower;
			break;
		case "Low Kick":
		case "Grass Knot":
			var w = defender.weight;
			basePower = w >= 200 ? 120 : w >= 100 ? 100 : w >= 50 ? 80 : w >= 25 ? 60 : w >= 10 ? 40 : 20;
			description.moveBP = basePower;
			break;
		case "Heavy Slam":
		case "Heat Crash":
			var wr = attacker.weight / defender.weight;
			basePower = wr >= 5 ? 120 : wr >= 4 ? 100 : wr >= 3 ? 80 : wr >= 2 ? 60 : 40;
			description.moveBP = basePower;
			break;
		case "Stored Power":
		case "Power Trip":
			basePower = 20 + 20 * countBoosts(attacker.boosts);
			description.moveBP = basePower;
			break;
		case "Acrobatics":
			basePower = attacker.item === "Flying Gem" || attacker.item === "" ? 110 : 55;
			description.moveBP = basePower;
			break;
		case "Wake-Up Slap":
			basePower = move.bp * (defender.status === "Asleep" ? 2 : 1);
			description.moveBP = basePower;
			break;
		case "Weather Ball":
			basePower = field.weather !== "" ? 100 : 50;
			description.moveBP = basePower;
			break;
		case "Fling":
			basePower = getFlingPower(attacker.item);
			description.moveBP = basePower;
			description.attackerItem = attacker.item;
			break;
		case "Eruption":
		case "Water Spout":
			basePower = Math.max(1, Math.floor(150 * attacker.curHP / attacker.maxHP));
			description.moveBP = basePower;
			break;
		case "Flail":
		case "Reversal":
			var p = Math.floor(48 * attacker.curHP / attacker.maxHP);
			basePower = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
			description.moveBP = basePower;
			break;
		case "Bulldoze":
		case "Earthquake":
			basePower = (field.terrain === "Grassy") ? move.bp / 2 : move.bp;
			description.terrain = field.terrain;
			break;
		case "Nature Power":
			basePower = (field.terrain === "Electric" || field.terrain === "Grassy") ? 90 : (field.terrain === "Misty") ? 95 : 80;
			break;
		case "Venoshock":
			basePower = move.bp * ((defender.status === "Poisoned" || defender.status === "Badly Poisoned") ? 2 : 1);
			description.moveBP = basePower;
			break;
		default:
			basePower = move.bp;
	}


	// ability BP modifiers
	if ((atkAbility === "Technician" && basePower <= 60)
		|| (atkAbility === "Flare Boost" && attacker.status === "Burned" && move.category === "Special")
		|| (atkAbility === "Toxic Boost" && (attacker.status === "Poisoned" || attacker.status === "Badly Poisoned") && move.category === "Physical")) {
		bpMods.push(0x1800);
		description.attackerAbility = atkAbility;
	} else if (atkAbility === "Analytic" && turnOrder.description === "LAST") {
		bpMods.push(0x14CD);
		description.attackerAbility = atkAbility;
	} else if (atkAbility === "Sand Force" && field.weather === "Sand" && ["Rock", "Ground", "Steel"].indexOf(move.type) !== -1) {
		bpMods.push();
		description.attackerAbility = atkAbility;
		description.weather = field.weather;
	} else if ((atkAbility === "Reckless" && move.hasRecoil)
		|| (atkAbility === "Iron Fist" && move.isPunch)) {
		bpMods.push(0x1333);
		description.attackerAbility = atkAbility;
	}

	if (defAbility === "Heatproof" && move.type === "Fire") {
		bpMods.push(0x800);
		description.defenderAbility = defAbility;
	} else if (defAbility === "Dry Skin" && move.type === "Fire") {
		bpMods.push(0x1400);
		description.defenderAbility = defAbility;
	}

	if (atkAbility === "Sheer Force" && move.hasSecondaryEffect) {
		bpMods.push(0x14CD);
		description.attackerAbility = atkAbility;
	}

	// hold item BP modifiers
	if (getItemBoostType(attacker.item) === move.type) {
		bpMods.push(0x1333);
		description.attackerItem = attacker.item;
	} else if ((attacker.item === "Muscle Band" && move.category === "Physical")
		|| (attacker.item === "Wise Glasses" && move.category === "Special")) {
		bpMods.push(0x1199);
		description.attackerItem = attacker.item;
	} else if (((attacker.item === "Adamant Orb" && attacker.name === "Dialga")
		|| (attacker.item === "Lustrous Orb" && attacker.name === "Palkia")
		|| (attacker.item === "Griseous Orb" && attacker.name === "Giratina-O"))
		&& (move.type === attacker.type1 || move.type === attacker.type2)) {
		bpMods.push(0x1333);
		description.attackerItem = attacker.item;
	} else if (attacker.item === move.type + " Gem") {
		bpMods.push(gen >= 6 ? 0x14CD : 0x1800);
		description.attackerItem = attacker.item;
	}

	// status-based BP modifiers
	if ((move.name === "Facade" && ["Burned", "Paralyzed", "Poisoned", "Badly Poisoned"].indexOf(attacker.status) !== -1)
		|| (move.name === "Brine" && defender.curHP <= defender.maxHP / 2)
		|| (move.name === "Venoshock" && (defender.status === "Poisoned" || defender.status === "Badly Poisoned"))
		|| (move.name === "Hex" && (defender.status !== "Healthy"))) {
		bpMods.push(0x2000);
		description.moveBP = move.bp * 2;
	}

	if ((move.name === "Solar Beam" || move.name == "SolarBeam" || move.name === "Solar Blade")
		&& ["Rain", "Sand", "Hail", "Heavy Rain"].indexOf(field.weather) !== -1) {
		bpMods.push(0x800);
		description.moveBP = move.bp / 2;
		description.weather = field.weather;
	}

	if (gen >= 6 && move.name === "Knock Off"
		&& !(defender.item === ""
			|| (defender.item === "Colbur Berry" && typeEffectiveness > 1)
			|| (defender.name === "Giratina-O" && defender.item === "Griseous Orb")
			|| (defender.name.indexOf("Arceus") !== -1 && defender.item.indexOf("Plate") !== -1))) {
		bpMods.push(0x1800);
		description.moveBP = move.bp * 1.5;
	}

	if (field.isHelpingHand) {
		bpMods.push(0x1800);
		description.isHelpingHand = true;
	}

	if (field.isBattery && move.category === "Special") {
		bpMods.push(0x14CD);
		description.isBattery = true;
	}

	if (!move.isZ && (isAerilate || isPixilate || isRefrigerate || isGalvanize)) {
		if (gen <= 6) {
			bpMods.push(0x14CD);
		}
		else {
			bpMods.push(0x1333);	// ...is this 1.2x?
		}
		description.attackerAbility = atkAbility;
	}
	if ((atkAbility === "Mega Launcher" && move.isPulse)
		|| (atkAbility === "Strong Jaw" && move.isBite)) {
		bpMods.push(0x1800);
		description.attackerAbility = atkAbility;
	}
	if (atkAbility === "Tough Claws" && move.makesContact) { //boosts by 1.3x for contact moves, apparently
		bpMods.push(0x14CD);
		description.attackerAbility = atkAbility;
	}
	if (move.type === "Steel" && atkAbility === "Steelworker") {
		bpMods.push(0x1800);
	}
	if (atkAbility === "Long Reach") {
		move.makesContact = false;
	}
	// NB/TT calc ignores Fluffy if you have one of the above abilities, which is probably wrong
	if (defAbility === "Fluffy" && move.makesContact) {
		description.defenderAbility = defAbility;
		bpMods.push(0x800);
	}
	if (defAbility === "Punk Rock" && move.isSound) {
			finalMods.push(0x800);
			description.defenderAbility = defAbility;
	}


	/*** Auras ***/

	let isAttackerAura = (atkAbility === (move.type + " Aura"))
	let isDefenderAura = defAbility === (move.type + " Aura");
	let auraActive = ($("input:checkbox[id='" + move.type.toLowerCase() + "-aura']:checked").val() != undefined)
	let auraBreak = ($("input:checkbox[id='aura-break']:checked").val() != undefined)
	if (auraActive) {
		if (auraBreak) {
			bpMods.push(0x0C00);
			description.attackerAbility = atkAbility;
			description.defenderAbility = defAbility;
		} else {
			bpMods.push(0x1547);
			if (isAttackerAura) {
				description.attackerAbility = atkAbility;
			}
			if (isDefenderAura) {
				description.defenderAbility = defAbility;
			}
		}
	}


	// this is where the magic happens   
	basePower = Math.max(1, pokeRound(basePower * chainMods(bpMods) / 0x1000));

	// for Baby Kangaskhan :3
	basePower = attacker.isChild ? basePower / 4 : basePower;


	////////////////////////////////
	////////// (SP)ATTACK //////////
	////////////////////////////////
	var attack;
	var attackSource = move.name === "Foul Play" ? defender : attacker;
	var attackStat = move.category === "Physical" ? AT : SA;
	var atkMods = [];


	description.attackEVs = attacker.evs[attackStat]
		+ (NATURES[attacker.nature][0] === attackStat ? "+" : NATURES[attacker.nature][1] === attackStat ? "-" : "")
		+ " " + toSmogonStat(attackStat);

	if (attackSource.boosts[attackStat] === 0 || (isCritical && attackSource.boosts[attackStat] < 0)) {
		attack = attackSource.rawStats[attackStat];
	} else if (defAbility === "Unaware") {
		attack = attackSource.rawStats[attackStat];
		description.defenderAbility = defAbility;
	} else {
		attack = attackSource.stats[attackStat];
		description.attackBoost = attackSource.boosts[attackStat];
	}

	// unlike all other attack modifiers, Hustle gets applied directly
	if (atkAbility === "Hustle" && move.category === "Physical") {
		attack = pokeRound(attack * 3 / 2);
		description.attackerAbility = atkAbility;
	}

	// type resistance abilities
	if ((defAbility === "Thick Fat" && (move.type === "Fire" || move.type === "Ice"))
		|| (defAbility === "Water Bubble" && move.type === "Fire")) {
		atkMods.push(0x800);
		description.defenderAbility = defAbility;
	}
	// type weakness abilities
	if (defAbility === "Fluffy" && move.type === "Fire") {
		atkMods.push(0x2000);
		description.defenderAbility = defAbility;
	}


	if ((atkAbility === "Guts" && attacker.status !== "Healthy" && move.category === "Physical")
		|| (atkAbility === "Overgrow" && attacker.curHP <= attacker.maxHP / 3 && move.type === "Grass")
		|| (atkAbility === "Blaze" && attacker.curHP <= attacker.maxHP / 3 && move.type === "Fire")
		|| (atkAbility === "Torrent" && attacker.curHP <= attacker.maxHP / 3 && move.type === "Water")
		|| (atkAbility === "Swarm" && attacker.curHP <= attacker.maxHP / 3 && move.type === "Bug")) {
		atkMods.push(0x1800);
		description.attackerAbility = atkAbility;
	}
	else if (atkAbility === "Flash Fire (activated)" && move.type === "Fire") {
		atkMods.push(0x1800);
		description.attackerAbility = "Flash Fire";
	}
	else if ((atkAbility === "Solar Power" && field.weather.indexOf("Sun") > -1 && move.category === "Special")
		|| (atkAbility === "Flower Gift" && field.weather.indexOf("Sun") > -1 && move.category === "Physical")) {
		atkMods.push(0x1800);
		description.attackerAbility = atkAbility;
		description.weather = field.weather;
	}
	else if ((atkAbility === "Defeatist" && attacker.curHP <= attacker.maxHP / 2)
		|| (atkAbility === "Slow Start" && move.category === "Physical")) {
		atkMods.push(0x800);
		description.attackerAbility = atkAbility;
	}
	else if ((atkAbility === "Water Bubble" && move.type === "Water")
		|| ((atkAbility === "Huge Power" || atkAbility === "Pure Power") && move.category === "Physical")) {
		atkMods.push(0x2000);
		description.attackerAbility = atkAbility;
	}
	if (atkAbility === "Gorilla Tactics" && move.category === "Physical") {
		atkMods.push(0x1800);
		description.attackerAbility = atkAbility;
	}

	// item-based atk modifiers
	if ((attacker.item === "Thick Club" && (attacker.name === "Cubone" || attacker.name === "Marowak" || attacker.name === "Marowak-Alola") && move.category === "Physical")
		|| (attacker.item === "Deep Sea Tooth" && attacker.name === "Clamperl" && move.category === "Special")
		|| (attacker.item === "Light Ball" && attacker.name === "Pikachu")) {
		atkMods.push(0x2000);
		description.attackerItem = attacker.item;
	}
	if ((gen <= 6 && attacker.item === "Soul Dew" && (attacker.name === "Latios" || attacker.name === "Latias") && move.category === "Special")
		|| (attacker.item === "Choice Band" && move.category === "Physical")
		|| (attacker.item === "Choice Specs" && move.category === "Special")) {
		atkMods.push(0x1800);
		description.attackerItem = attacker.item;
	}

	attack = Math.max(1, pokeRound(attack * chainMods(atkMods) / 0x1000));

	////////////////////////////////
	///////// (SP)DEFENSE //////////
	////////////////////////////////
	var defense;
	var hitsPhysical = move.category === "Physical" || move.dealsPhysicalDamage;
	var defenseStat = hitsPhysical ? DF : SD;
	var wonderDef = defenseStat;
	var dfMods = [];

	if (field.isWR) {
		wonderDef = hitsPhysical ? SD : DF;
	}

	description.defenseEVs = (field.isWR ? "[" : "") + defender.evs[wonderDef]
		+ (NATURES[defender.nature][0] === wonderDef ? "+" : NATURES[defender.nature][1] === wonderDef ? "-" : "") + " "
		+ toSmogonStat(wonderDef) + (field.isWR ? "]" : "");
	if (defender.boosts[defenseStat] === 0 || (isCritical && defender.boosts[defenseStat] > 0) || move.ignoresDefenseBoosts) {
		defense = defender.rawStats[defenseStat];
	} else if (atkAbility === "Unaware") {
		defense = defender.rawStats[defenseStat];
		description.attackerAbility = atkAbility;
	} else if (move.name === "Chip Away") {
		defense = defender.rawStats[defenseStat];
	} else {
		defense = defender.stats[defenseStat];
		description.defenseBoost = defender.boosts[defenseStat];
	}

	// unlike all other defense modifiers, Sandstorm SpD boost gets applied directly
	if (field.weather === "Sand" && (defender.type1 === "Rock" || defender.type2 === "Rock") && !hitsPhysical) {
		defense = pokeRound(defense * 3 / 2);
		description.weather = field.weather;
	}

	if (defAbility === "Marvel Scale" && defender.status !== "Healthy" && hitsPhysical) {
		dfMods.push(0x1800);
		description.defenderAbility = defAbility;
	} else if (defAbility === "Flower Gift" && field.weather.indexOf("Sun") > -1 && !hitsPhysical) {
		dfMods.push(0x1800);
		description.defenderAbility = defAbility;
		description.weather = field.weather;
	}

	if ((defender.item === "Deep Sea Scale" && defender.name === "Clamperl" && !hitsPhysical)
		|| (defender.item === "Metal Powder" && defender.name === "Ditto")
		|| (gen <= 6 && defender.item === "Soul Dew" && (defender.name === "Latios" || defender.name === "Latias") && !hitsPhysical)
		|| (defender.item === "Assault Vest" && !hitsPhysical) || defender.item === "Eviolite") {
		dfMods.push(0x1800);
		description.defenderItem = defender.item;
	}


	defense = Math.max(1, pokeRound(defense * chainMods(dfMods) / 0x1000));





	////////////////////////////////
	//////////// DAMAGE ////////////
	////////////////////////////////
	var baseDamage = Math.floor(Math.floor((Math.floor((2 * attacker.level) / 5 + 2) * basePower * attack) / defense) / 50 + 2);
	if (field.format !== "Singles" && move.isSpread) {
		baseDamage = pokeRound(baseDamage * 0xC00 / 0x1000);
	}
	if ((field.weather.indexOf("Sun") > -1 && move.type === "Fire") || (field.weather.indexOf("Rain") > -1 && move.type === "Water")) {
		baseDamage = pokeRound(baseDamage * 0x1800 / 0x1000);
		description.weather = field.weather;
	}
	else if ((field.weather === "Sun" && move.type === "Water") || (field.weather === "Rain" && move.type === "Fire")
		|| (field.weather === "Strong Winds" && (defender.type1 === "Flying" || defender.type2 === "Flying") && typeChart[move.type]["Flying"] > 1)) {
		baseDamage = pokeRound(baseDamage * 0x800 / 0x1000);
		description.weather = field.weather;
	}

	if ((field.isWet && move.type === "Fire") || (field.isMuddy && move.type === "Electric")) {
		baseDamage = pokeRound(baseDamage * 0x800 / 0x1800);
		description.isWeakened = true;
	}

	if (field.isGravity || (attacker.type1 !== "Flying" && attacker.type2 !== "Flying" && attacker.item !== "Air Balloon" && atkAbility !== "Levitate")) {
		if ((field.terrain === "Electric" && move.type === "Electric")
			|| (field.terrain === "Grassy" && move.type == "Grass")
			|| (field.terrain === "Psychic" && move.type == "Psychic")) {
			if (gen >= 8) {
				baseDamage = pokeRound(baseDamage * 0x14CD / 0x1000);
			}
			else {
				baseDamage = pokeRound(baseDamage * 0x1800 / 0x1000);
			}
			description.terrain = field.terrain;
		}
	}
	if (field.isGravity || (defender.type1 !== "Flying" && defender.type2 !== "Flying" && defender.item !== "Air Balloon" && defAbility !== "Levitate")) {
		if (field.terrain === "Misty" && move.type === "Dragon") {
			baseDamage = pokeRound(baseDamage * 0x800 / 0x1000);
			description.terrain = field.terrain;
		}
		if (field.terrain === "Psychic" && move.isPriority === true) {
			description.terrain = field.terrain;
			return { "damage": [0], "description": buildDescription(description), "order": turnOrder.description };
		}
	}


	if (isCritical) {
		baseDamage = Math.floor(baseDamage * (gen >= 6 ? 1.5 : 2));
		description.isCritical = isCritical;
	}

	// the random factor is applied between the crit mod and the stab mod, so don't apply anything below this until we're inside the loop
	var stabMod = 0x1000;
	if (attacker.isSoaked) {
		description.atkSoak = true;
		if (move.type === "Water") {
			if (atkAbility === "Adaptability") {
				stabMod = 0x2000;
				description.attackerAbility = atkAbility;
			}
			else {
				stabMod = 0x1800;
			}
		}
	}
	else if (move.type === attacker.type1 || move.type === attacker.type2 || move.type === attacker.type3) {
		if (atkAbility === "Adaptability") {
			stabMod = 0x2000;
			description.attackerAbility = atkAbility;
		}
		else {
			stabMod = 0x1800;
		}
	}

	if (move.type == "Grass" && attacker.isForestCurse) {		/* STAB mods for type changes */
		description.atkFC = true;
	}
	else if (move.type == "Ghost" && attacker.isTrickOrTreat) {
		description.atkToT = true;
	}
	if (atkAbility === "Protean") {
		stabMod = 0x1800;
		description.attackerAbility = atkAbility;
		description.atkSoak = false;
	}


	var applyBurn = (attacker.status === "Burned" && move.category === "Physical" && atkAbility !== "Guts" && !move.ignoresBurn);
	description.isBurned = applyBurn;
	var finalMods = [];
	if (field.isReflect && move.category === "Physical" && !isCritical) {
		finalMods.push(field.format !== "Singles" ? 0xA8F : 0x800);
		description.isReflect = true;
	}
	else if (field.isLightScreen && move.category === "Special" && !isCritical) {
		finalMods.push(field.format !== "Singles" ? 0xA8F : 0x800);
		description.isLightScreen = true;
	}
	if (field.isAuroraVeil && !isCritical) {
		finalMods.push(field.format !== "Singles" ? 0xA8F : 0x800);
		description.isAuroraVeil = true;
	}
	if ((defAbility === "Multiscale" || defAbility == "Shadow Shield") && defender.curHP === defender.maxHP) {
		finalMods.push(0x800);
		description.defenderAbility = defAbility;
	}
	if (atkAbility === "Tinted Lens" && typeEffectiveness < 1) {
		finalMods.push(0x2000);
		description.attackerAbility = atkAbility;
	}
	if ((move.name === "Dynamax Cannon" || move.name === "Behemoth Blade" || move.name === "Behemoth Bash") 
			&& (defender.isDmax || defender.isGmax)) {
		finalMods.push(0x2000);
	}
	if (field.isFriendGuard) {
		finalMods.push(0xC00);
		description.isFriendGuard = true;
	}
	if (atkAbility === "Sniper" && isCritical) {
		finalMods.push(0x1800);
		description.attackerAbility = atkAbility;
	}
	if ((defAbility === "Solid Rock" || defAbility === "Filter" || defAbility === "Prism Armor") && typeEffectiveness > 1) {
		finalMods.push(0xC00);
		description.defenderAbility = defAbility;
	}
	if (atkAbility === "Neuroforce" && typeEffectiveness > 1) {
		finalMods.push(0x1400);
		description.attackerAbility = atkAbility;
	}
	if (attacker.item === "Expert Belt" && typeEffectiveness > 1) {
		finalMods.push(0x1333);
		description.attackerItem = attacker.item;
	} else if (attacker.item === "Life Orb") {
		finalMods.push(0x14CD);
		description.attackerItem = attacker.item;
	} else if (gen >= 7 && attacker.item === "Soul Dew" && (attacker.name === "Latios" || attacker.name === "Latias") && (move.type === "Dragon" || move.type === "Psychic")) {
		finalMods.push(0x1333);
		description.attackerItem = attacker.item;
	}
	if (getBerryResistType(defender.item) === move.type && (typeEffectiveness > 1 || move.type === "Normal") && atkAbility !== "Unnerve") {
		finalMods.push(0x800);
		description.defenderItem = defender.item;
	}
	if (defAbility === "Fur Coat" && hitsPhysical) {
		finalMods.push(0x800);
		description.defenderAbility = defAbility;
	}
	if (defender.isProtect) {
		description.isProtect = true;
		if (move.isZ) {
			finalMods.push(0x400);
		}
		else {
			finalMods.push(0x000);
		}
	}


	var finalMod = chainMods(finalMods);
	var damage = [], pbDamage = [];
	var child, childDamage, j;

	if (atkAbility === "Parental Bond" && move.hits === 1 && (field.format === "Singles" || !move.isSpread)) {
		child = JSON.parse(JSON.stringify(attacker));
		child.ability = '';
		child.isChild = true;
		if (move.name === 'Power-Up Punch') {
			child.boosts[AT]++;
			child.stats[AT] = getModifiedStat(child.rawStats[AT], child.boosts[AT]);
		}
		childDamage = getDamageResult(child, defender, move, field).damage;
		description.attackerAbility = atkAbility;
	}
	for (var i = 0; i < 16; i++) {
		damage[i] = Math.floor(baseDamage * (85 + i) / 100);
		damage[i] = pokeRound(damage[i] * stabMod / 0x1000);
		damage[i] = Math.floor(damage[i] * typeEffectiveness);
		if (applyBurn) {
			damage[i] = Math.floor(damage[i] / 2);
		}
		damage[i] = Math.max(1, damage[i]);
		damage[i] = pokeRound(damage[i] * finalMod / 0x1000);
		if (atkAbility === "Parental Bond" && move.hits === 1 && (field.format === "Singles" || !move.isSpread)) {
			for (j = 0; j < 16; j++) {
				pbDamage[(16 * i) + j] = damage[i] + childDamage[j];
			}
		}
	}
	// REturn a bit more info if this is a Parental Bond usage.
	if (pbDamage.length) {
		return {
			"damage": pbDamage.sort(numericSort),
			"parentDamage": damage,
			"childDamage": childDamage,
			"description": buildDescription(description),
			"order": turnOrder.description
		};
	}
	return {
		"damage": pbDamage.length ? pbDamage.sort(numericSort) : damage,
		"description": buildDescription(description),
		"order": turnOrder.description
	};
}

function numericSort(a, b) {
	return a - b;
}

function buildDescription(description) {
	if (description.isMR) {
		description.attackerItem = "";
		description.defenderItem = "";
	}

	var output = "";

	if (description.attackBoost) {
		if (description.attackBoost > 0) {
			output += "+";
		}
		output += description.attackBoost + " ";
	}

	output = appendIfSet(output, description.attackEVs);
	output = appendIfSet(output, description.attackerItem);
	output = appendIfSet(output, description.attackerAbility);

	if (description.isBurned) {
		output += "burned ";
	}
	if (description.atkSoak) {
		output += "soaked ";
	}
	if (description.atkFC) {
		output += "Forest's Curse ";
	}
	if (description.atkToT) {
		output += "Trick-or-Treat ";
	}
	if (description.atkShiny) {
		output += "shiny ";
	}

	output += description.attackerName;
	
	output += description.attackerMark;
	
	output += " ";								/*attacker name*/

	if (description.isHelpingHand) {
		output += "Helping Hand ";
	}

	if (description.isIonized) {
		output += "Ionized ";
	}

	if (description.isBattery) {
		output += "Battery-boosted ";
	}

	output += description.moveName + " ";

	if (description.moveBP && description.moveType) {
		output += "(" + description.moveBP + " BP " + description.moveType + ") ";
	} else if (description.moveBP) {
		output += "(" + description.moveBP + " BP) ";
	} else if (description.moveType) {
		output += "(" + description.moveType + ") ";
	}
	if (description.hits) {
		output += "(" + description.hits + " hits) ";
	}

	if (description.isWeakened) {
		output += "(weakened) ";
	}

	output += "vs. ";

	if (description.defenseBoost) {
		if (description.defenseBoost > 0) {
			output += "+";
		}
		output += description.defenseBoost + " ";
	}
	output = appendIfSet(output, description.HPEVs);
	if (description.defenseEVs) {
		output += " / " + description.defenseEVs + " ";
	}
	output = appendIfSet(output, description.defenderItem);
	output = appendIfSet(output, description.defenderAbility);

	if (description.defSoak) {
		output += "soaked ";
	}
	if (description.defFC) {
		output += "Forest's Curse ";
	}
	if (description.defToT) {
		output += "Trick-or-Treat ";
	}
	if (description.defShiny){
		output += "shiny ";
	}

	if(description.defGMaxed ){
		output += "Gigantamax "
	}
	else if(description.defMaxed){
		output += "Dynamax ";
	}


	output += description.defenderName;										/*defender name*/

	output += description.defenderMark;

	if (description.isProtect) {
		output += " (Protecting)";
	}

	if (description.weather) {
		output += " in " + description.weather;
	}
	if (description.terrain) {
		output += " on " + description.terrain + " Terrain";
	}
	if (description.isReflect) {
		output += " through Reflect";
		if (description.isAuroraVeil)
			output += " and Aurora Veil";
	} else if (description.isLightScreen) {
		output += " through Light Screen";
		if (description.isAuroraVeil)
			output += " and Aurora Veil";
	}
	else if (description.isAuroraVeil) {
		output += " through Aurora Veil";
	}

	if (description.isGravity) {
		output += " under the effect of Gravity";
		if (description.isWR)
			output += " and Wonder Room";
	}
	else if (description.isWR) {
		output += " under the effect of Wonder Room";
	}

	if (description.isCritical) {
		output += " on a critical hit";
	}
	return output;
}

function appendIfSet(str, toAppend) {
	if (toAppend) {
		return str + toAppend + " ";
	}
	return str;
}

function toSmogonStat(stat) {
	return stat === AT ? "Atk"
		: stat === DF ? "Def"
		: stat === SA ? "SpA"
		: stat === SD ? "SpD"
		: stat === SP ? "Spe"
		: "wtf";
}

function chainMods(mods) {
	var M = 0x1000;
	for (var i = 0; i < mods.length; i++) {
		if (mods[i] !== 0x1000) {
			M = ((M * mods[i]) + 0x800) >> 12;
		}
	}
	return M;
}

function getMoveEffectiveness(move, type, isGhostRevealed, isGravity) {
	if (isGhostRevealed && type === "Ghost" && (move.type === "Normal" || move.type === "Fighting")) {
		return 1;
	} else if (isGravity && type === "Flying" && move.type === "Ground") {
		return 1;
	} else if (move.name === "Freeze-Dry" && type === "Water") {
		return 2;
	} else if (move.name === "Flying Press") {
		return typeChart[move.type][type] * typeChart["Flying"][type];
	} else {
		return typeChart[move.type][type];
	}
}

function getModifiedStat(stat, mod) {
	return mod > 0 ? Math.floor(stat * (2 + mod) / 2)
		: mod < 0 ? Math.floor(stat * 2 / (2 - mod))
			: stat;
}

function getFinalSpeed(pokemon, weather) {
	var speed = getModifiedStat(pokemon.rawStats[SP], pokemon.boosts[SP]);
	if (pokemon.item === "Choice Scarf") {
		speed = Math.floor(speed * 1.5);
	} else if (pokemon.item === "Macho Brace" || pokemon.item === "Iron Ball") {
		speed = Math.floor(speed / 2);
	}
	if ((pokemon.ability === "Chlorophyll" && weather.indexOf("Sun") > -1) ||
		(pokemon.ability === "Sand Rush" && weather === "Sand") ||
		(pokemon.ability === "Swift Swim" && weather.indexOf("Rain") > -1)) {
		speed *= 2;
	}
	if (pokemon.status === "Paralyzed")
		speed /= 2;
	return speed;
}



/*************************/
/*** Pre-Battle Checks ***/
/*************************/

function checkAirLock(pokemon, field) {
	if (pokemon.ability === "Air Lock" || pokemon.ability === "Cloud Nine") {
		field.clearWeather();
	}
}
function checkForecast(pokemon, weather) {
	if (pokemon.ability === "Forecast" && pokemon.name === "Castform") {
		if (weather.indexOf("Sun") > -1) {
			pokemon.type1 = "Fire";
		} else if (weather.indexOf("Rain") > -1) {
			pokemon.type1 = "Water";
		} else if (weather === "Hail") {
			pokemon.type1 = "Ice";
		} else {
			pokemon.type1 = "Normal";
		}
		pokemon.type2 = "";
	}
}
function checkKlutz(pokemon) {
	if (pokemon.ability === "Klutz") {
		pokemon.item = "";
	}
}

function checkRoom(field, p1, p2) {
	if (field.getMR() == true) {
		p1.item = "";
		p2.item = "";
	}
	if (field.getWR() == true) {
		var temp = p1.rawStats[SD];
		p1.rawStats[SD] = p1.rawStats[DF];
		p1.rawStats[DF] = temp;
		temp = p2.rawStats[SD];
		p2.rawStats[SD] = p2.rawStats[DF];
		p2.rawStats[DF] = temp;
	}
}

function checkIntimidate(source, target) {
	if (source.ability === "Intimidate") {
		if (target.ability === "Contrary" || target.ability === "Defiant") {
			target.boosts[AT] = Math.min(6, target.boosts[AT] + 1);
		} else if (["Clear Body", "White Smoke", "Hyper Cutter", "Full Metal Body"].indexOf(target.ability) !== -1) {
			// no effect
		} else if (target.ability === "Simple") {
			target.boosts[AT] = Math.max(-6, target.boosts[AT] - 2);
		} else {
			target.boosts[AT] = Math.max(-6, target.boosts[AT] - 1);
		}
	}
}

function checkDownload(source, target) {
	if (source.ability === "Download") {
		if (target.stats[SD] <= target.stats[DF]) {
			source.boosts[SA] = Math.min(6, source.boosts[SA] + 1);
		} else {
			source.boosts[AT] = Math.min(6, source.boosts[AT] + 1);
		}
	}
}

function checkInfiltrator(attacker, affectedSide) {
	if (attacker.ability === "Infiltrator") {
		affectedSide.isReflect = false;
		affectedSide.isLightScreen = false;
		affectedSide.isAuroraVeil = false;
	}
}

function checkSimple(poke) {
	if (poke.ability === "Simple") {
		for (var i = 0; i < STATS.length; i++) {
			if (poke.boosts[STATS[i]] > 0) {
				poke.boosts[STATS[i]] = Math.min(6, poke.boosts[STATS[i]] * 2);
			}
			else {
				poke.boosts[STATS[i]] = Math.max(-6, poke.boosts[STATS[i]] * 2);
			}
		}
	}
}

function countBoosts(boosts) {
	var sum = 0;
	for (var i = 0; i < STATS.length; i++) {
		if (boosts[STATS[i]] > 0) {
			sum += boosts[STATS[i]];
		}
	}
	return sum;
}

// GameFreak rounds DOWN on .5
function pokeRound(num) {
	return (num % 1 > 0.5) ? Math.ceil(num) : Math.floor(num);
}
