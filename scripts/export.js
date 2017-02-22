
var STAT_NAMES = ["Atk","Def","SpA","SpD","Spe"];
function exportSpreadL(){
	var poke = new Pokemon($("#p1"), $("#p1moves"));
	
	
	var pokestring = buildExportString(poke);
	
	
	
	document.getElementById('sxportL').value = pokestring;

	document.getElementById('sxportL').select();
}
function exportSpreadR(){
	var poke = new Pokemon($("#p2"), $("#p2moves"));
	
	
	var pokestring = buildExportString(poke);
	
	
	
	document.getElementById('sxportR').value = pokestring;

	document.getElementById('sxportR').select();
}

function buildExportString(poke){
	/*	Pokemon Showdown Export Format
		0	Nickname (Species) @ Item
		1	Ability: Name
		2	Level: #
		3	EVs: # Stat / # Stat / # Stat
		4	Serious Nature
		5	IVs: # Stat
		6	- Move Name
		7	- Move Name
		8	- Move Name
		9	- Move Name
			*/
	var pokestring = "";
	
	var species  = poke.name;
	for(var i = 0; i < showdownFormes.length; ++i)
	{
		if(species == showdownFormes[i][1])
			species = showdownFormes[i][0]
	}
	if(species.indexOf('Mega ') != -1){
		species = species.substring(species.indexOf('Mega ') + 5);
	//	species += "-Mega";
	}
	
	pokestring += species;
	
	
	if(poke.item){
		pokestring += " @ ";
		pokestring += poke.item;
	}
	pokestring += "\n";
	
	pokestring += "Ability: ";
	pokestring += poke.ability;
	pokestring += "\n";
	
	pokestring += "EVs: ";
	
	var hp = poke.HPEVs;
	var at = poke.evs["at"];
	var df = poke.evs["df"];
	var sa = poke.evs["sa"];
	var sd = poke.evs["sd"];
	var sp = poke.evs["sp"];
	
	if(hp > 0){
		pokestring += hp;
		pokestring += " HP";
		
		if( at > 0 || df > 0 || sa > 0 || sd > 0 || sp > 0)
			pokestring += " / ";	
	}
	if(at > 0){
		pokestring += at;
		pokestring += " Atk";
		
		if( df > 0 || sa > 0 || sd > 0 || sp > 0)
			pokestring += " / ";	
	}
	if(df > 0){
		pokestring += df;
		pokestring += " Def";
		
		if(sa > 0 || sd > 0 || sp > 0)
			pokestring += " / ";	
	}
	if(sa > 0){
		pokestring += sa;
		pokestring += " SpA";
		
		if(sd > 0 || sp > 0)
			pokestring += " / ";	
	}
	if(sd > 0){
		pokestring += sd;
		pokestring += " SpD";
		
		if(sp > 0)
			pokestring += " / ";	
	}
	if(sp > 0){
		pokestring += sp;
		pokestring += " Spe";
	}
	
	
	
	
	var ivtot = poke.HPIVs;
	for(var i = 0; i < STATS.length; i++){	
		ivtot += poke.ivs[STATS[i]];
		/*pokestring += ivtot;
		pokestring += " ";*/
	}
	
	if(ivtot < 31 * (1 + STATS.length)){
		pokestring += "\n";
		pokestring += "IVs: ";
		
		if(poke.HPIVs < 31){
			pokestring += poke.HPIVs;
			pokestring += " HP";
		}
		ivtot -= poke.HPIVs;
		if(ivtot < 31*(STATS.length)){
			if(poke.HPIVs < 31){
				pokestring += " / ";
			}
			
			for(var i = 0; i < STATS.length; i++){	
				if(poke.ivs[STATS[i]] < 31){
					pokestring += poke.ivs[STATS[i]];
					pokestring += " ";
					pokestring += STAT_NAMES[i];
					
					if((ivtot - poke.ivs[STATS[i]]) < 31*(STATS.length - (i+1))){
						pokestring += " / ";
					}
					else{
						break;
					}
					
				}
				ivtot -= poke.ivs[STATS[i]];
				
			}
		}
		
	}
	
	
	pokestring += "\n";
	pokestring += poke.nature;
	pokestring += " Nature";
	pokestring += "\n";
	
	for (var i = 0; i < poke.moves.length; i++) {
		if(poke.moves[i].name == "(No Move)")
			continue;
		pokestring += "- ";
		pokestring += poke.moves[i].name;
		pokestring += "\n";
	}
	
	return pokestring;
}
