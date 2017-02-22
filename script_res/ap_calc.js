// input field validation
var bounds = {
    "level":[0,100],
    "base":[1,255],
    "evs":[0,252],
    "ivs":[0,31],
    "dvs":[0,15],
    "move-bp":[0,999]
};
for (var bounded in bounds) {
    if (bounds.hasOwnProperty(bounded)) {
        attachValidation(bounded, bounds[bounded][0], bounds[bounded][1]);
    }
}
function attachValidation(clazz, min, max) {
    $("." + clazz).keyup(function() {
        validate($(this), min, max);
    });
}
function validate(obj, min, max) {
    obj.val(Math.max(min, Math.min(max, ~~obj.val())));
}

// auto-calc stats and current HP on change
$(".level").keyup(function() {
    var poke = $(this).closest(".poke-info");
    calcHP(poke);
    calcStats(poke);
});
$(".nature").bind("keyup change", function() {
    calcStats($(this).closest(".poke-info"));
	calcNatureStats($(this).closest(".poke-info"));
});
$(".hp .base, .hp .evs, .hp .ivs").bind("keyup change", function() {
    calcHP($(this).closest(".poke-info"));
});
$(".at .base, .at .evs, .at .ivs").bind("keyup change", function() {
    calcStat($(this).closest(".poke-info"), 'at');
});
$(".df .base, .df .evs, .df .ivs").bind("keyup change", function() {
    calcStat($(this).closest(".poke-info"), 'df');
});
$(".sa .base, .sa .evs, .sa .ivs").bind("keyup change", function() {
    calcStat($(this).closest(".poke-info"), 'sa');
});
$(".sd .base, .sd .evs, .sd .ivs").bind("keyup change", function() {
    calcStat($(this).closest(".poke-info"), 'sd');
});
$(".sp .base, .sp .evs, .sp .ivs").bind("keyup change", function() {
    calcStat($(this).closest(".poke-info"), 'sp');
});
$(".evs").bind("keyup change", function() {
    calcEvTotal($(this).closest(".poke-info"));
});
$(".base").bind("keyup change", function() {
    calcBST($(this).closest(".poke-info"));
});
$(".sl .base").keyup(function() {
    calcStat($(this).closest(".poke-info"), 'sl');
});
$(".at .dvs").keyup(function() {
    var poke = $(this).closest(".poke-info");
    calcStat(poke, 'at');
    poke.find(".hp .dvs").val(getHPDVs(poke));
    calcHP(poke);
});
$(".df .dvs").keyup(function() {
    var poke = $(this).closest(".poke-info");
    calcStat(poke, 'df');
    poke.find(".hp .dvs").val(getHPDVs(poke));
    calcHP(poke);
});
$(".sa .dvs").keyup(function() {
    var poke = $(this).closest(".poke-info");
    calcStat(poke, 'sa');
    poke.find(".sd .dvs").val($(this).val());
    calcStat(poke, 'sd');
    poke.find(".hp .dvs").val(getHPDVs(poke));
    calcHP(poke);
});
$(".sp .dvs").keyup(function() {
    var poke = $(this).closest(".poke-info");
    calcStat(poke, 'sp');
    poke.find(".hp .dvs").val(getHPDVs(poke));
    calcHP(poke);
});
$(".sl .dvs").keyup(function() {
    var poke = $(this).closest(".poke-info");
    calcStat(poke, 'sl');
    poke.find(".hp .dvs").val(getHPDVs(poke));
    calcHP(poke);
});

function getHPDVs(poke) {
    return (~~poke.find(".at .dvs").val() % 2) * 8 +
            (~~poke.find(".df .dvs").val() % 2) * 4 +
            (~~poke.find(gen === 1 ? ".sl .dvs" : ".sa .dvs").val() % 2) * 2 +
            (~~poke.find(".sp .dvs").val() % 2);
}

function calcStats(poke) {
    for (var i = 0; i < STATS.length; i++) {
        calcStat(poke, STATS[i]);
    }
}

function calcBST(poke) {
    var total = 0;
    poke.find('.base').each(function (idx, elt) { total += 1*$(elt).val(); });

    var baseTotal = poke.find('.base-total');
    baseTotal.text(total);
}

function calcEvTotal(poke) {
    var total = 0;
    poke.find('.evs').each(function (idx, elt) { total += 1*$(elt).val(); });

    var newClass = total > 510 ? 'overLimit' : 'underLimit';

    var evTotal = poke.find('.ev-total');
    evTotal.removeClass('underLimit overLimit').text(total).addClass(newClass);
}

function calcNatureStats(poke){
	
	var pos, neg;
	var nature = poke.find('.nature').val();
	pos = NATURES[nature][0];
	neg = NATURES[nature][1];
	poke.find('.at-text').removeClass('posNat negNat');
	poke.find('.df-text').removeClass('posNat negNat');
	poke.find('.sa-text').removeClass('posNat negNat');
	poke.find('.sd-text').removeClass('posNat negNat');
	poke.find('.sp-text').removeClass('posNat negNat');
	switch (pos) {
        case "at":
			poke.find('.at-text').addClass('posNat');
			break;
        case "df":
			poke.find('.df-text').addClass('posNat');
			break;
        case "sa":
			poke.find('.sa-text').addClass('posNat');
			break;
        case "sd":
			poke.find('.sd-text').addClass('posNat');
			break;
        case "sp":
			poke.find('.sp-text').addClass('posNat');
			break;
	}
	switch (neg) {
        case "at":
			poke.find('.at-text').addClass('negNat');
			break;
        case "df":
			poke.find('.df-text').addClass('negNat');
			break;
        case "sa":
			poke.find('.sa-text').addClass('negNat');
			break;
        case "sd":
			poke.find('.sd-text').addClass('negNat');
			break;
        case "sp":
			poke.find('.sp-text').addClass('negNat');
			break;
	}
}

function clearBoostsL(){
	$('#at-boost-L').val('0');
	$('#df-boost-L').val('0');
	$('#sa-boost-L').val('0');
	$('#sd-boost-L').val('0');
	$('#sp-boost-L').val('0');
	calculate();
}
function boostAllL(){
	var boost;
	boost = $('#at-boost-L option:selected');
	boost.attr('selected', false);
	boost.prev().attr('selected', 'selected');
	boost = $('#df-boost-L option:selected');
	boost.attr('selected', false);
	boost.prev().attr('selected', 'selected');
	boost = $('#sa-boost-L option:selected');
	boost.attr('selected', false);
	boost.prev().attr('selected', 'selected');
	boost = $('#sd-boost-L option:selected');
	boost.attr('selected', false);
	boost.prev().attr('selected', 'selected');
	boost = $('#sp-boost-L option:selected');
	boost.attr('selected', false);
	boost.prev().attr('selected', 'selected');
	calculate();
}
function clearBoostsR(){
	$('#at-boost-R').val('0');
	$('#df-boost-R').val('0');
	$('#sa-boost-R').val('0');
	$('#sd-boost-R').val('0');
	$('#sp-boost-R').val('0');
	calculate();
}
function boostAllR(){
	var boost;
	boost = $('#at-boost-R option:selected');
	boost.attr('selected', false);
	boost.prev().attr('selected', 'selected');
	boost = $('#df-boost-R option:selected');
	boost.attr('selected', false);
	boost.prev().attr('selected', 'selected');
	boost = $('#sa-boost-R option:selected');
	boost.attr('selected', false);
	boost.prev().attr('selected', 'selected');
	boost = $('#sd-boost-R option:selected');
	boost.attr('selected', false);
	boost.prev().attr('selected', 'selected');
	boost = $('#sp-boost-R option:selected');
	boost.attr('selected', false);
	boost.prev().attr('selected', 'selected');
	calculate();
}


function calcCurrentHP(poke, max, percent) {
    var current = Math.ceil(percent * max / 100);
    poke.find(".current-hp").val(current);
}
function calcPercentHP(poke, max, current) {
    var percent = Math.floor(100 * current / max);
    poke.find(".percent-hp").val(percent);
}
$(".current-hp").keyup(function() {
    var max = $(this).parent().children(".max-hp").text();
    validate($(this), 0, max);
    var current = $(this).val();
    calcPercentHP($(this).parent(), max, current);
});
$(".percent-hp").keyup(function() {
    var max = $(this).parent().children(".max-hp").text();
    validate($(this), 0, 100);
    var percent = $(this).val();
    calcCurrentHP($(this).parent(), max, percent);
});

var lastAura = [false, false, false]
$(".ability").bind("keyup change", function() {
    $(this).closest(".poke-info").find(".move-hits").val($(this).val() === 'Skill Link' ? 5 : 3);
    autoSetAura()
    autoSetTerrain()
});

$("#p1 .ability").bind("keyup change", function() {
    autosetWeather($(this).val(), 0);
});
$("#p2 .ability").bind("keyup change", function() {
    autosetWeather($(this).val(), 1);
});

var lastTerrain = "noterrain";
var lastManualWeather = "";
var lastAutoWeather = ["", ""];
function autoSetAura()
{
    var ability1 = $("#p1 .ability").val()
    var ability2 = $("#p2 .ability").val()
    if(ability1 == "Fairy Aura" || ability2 == "Fairy Aura" )
        $("input:checkbox[id='fairy-aura']").prop("checked", true)
    else        
        $("input:checkbox[id='fairy-aura']").prop("checked", lastAura[0])
    if(ability1 == "Dark Aura" || ability2 == "Dark Aura")
        $("input:checkbox[id='dark-aura']").prop("checked", true)
    else        
        $("input:checkbox[id='dark-aura']").prop("checked", lastAura[1])
    if(ability1 == "Aura Break" || ability2 == "Aura Break" )
        $("input:checkbox[id='aura-break']").prop("checked", true)
    else        
        $("input:checkbox[id='aura-break']").prop("checked", lastAura[2])
}
function autoSetTerrain()
{
    var ability1 = $("#p1 .ability").val()
    var ability2 = $("#p2 .ability").val()
    if((ability1 == "Electric Surge" || ability2 == "Electric Surge")){
        $("input:radio[id='electric']").prop("checked", true)
        lastTerrain = 'electric';
    }
    else if((ability1 == "Grassy Surge" || ability2 == "Grassy Surge")){
        $("input:radio[id='grassy']").prop("checked", true)
        lastTerrain = 'grassy';
    }
    else if((ability1 == "Misty Surge" || ability2 == "Misty Surge")){
        $("input:radio[id='misty']").prop("checked", true)
        lastTerrain = 'misty';
    }
    else if((ability1 == "Psychic Surge" || ability2 == "Psychic Surge")){
        $("input:radio[id='psychic']").prop("checked", true)
        lastTerrain = 'psychic';
    }
    else
        $("input:radio[id='noterrain']").prop("checked", true)
}

function autosetWeather(ability, i) {
    var currentWeather = $("input:radio[name='weather']:checked").val();
    if (lastAutoWeather.indexOf(currentWeather) === -1 || currentWeather === "") {
        lastManualWeather = currentWeather;
        lastAutoWeather[1-i] = "";
    }

    var primalWeather = ["Harsh Sun", "Heavy Rain"];
    var autoWeatherAbilities = {
            "Drought": "Sun",
            "Drizzle": "Rain",
            "Sand Stream": "Sand",
            "Snow Warning": "Hail",
            "Desolate Land": "Harsh Sun",
            "Primordial Sea": "Heavy Rain",
            "Delta Stream": "Strong Winds"
        };
    var newWeather;

    if (ability in autoWeatherAbilities) {
        lastAutoWeather[i] = autoWeatherAbilities[ability];
        if (currentWeather === "Strong Winds") {
            if (lastAutoWeather.indexOf("Strong Winds") === -1) {
                newWeather = lastAutoWeather[i];
            }
        } else if (primalWeather.indexOf(currentWeather) > -1) {
            if (lastAutoWeather[i] === "Strong Winds" || primalWeather.indexOf(lastAutoWeather[i]) > -1) {
                newWeather = lastAutoWeather[i];
            } else if (primalWeather.indexOf(lastAutoWeather[1-i]) > -1) {
                newWeather = lastAutoWeather[1-i];
            } else {
                newWeather = lastAutoWeather[i];
            }
        } else {
            newWeather = lastAutoWeather[i];
        }
    } else {
        lastAutoWeather[i] = "";
        newWeather = lastAutoWeather[1-i] !== "" ? lastAutoWeather[1-i] : lastManualWeather;
    }

    if (newWeather === "Strong Winds" || primalWeather.indexOf(newWeather) > -1) {
        //$("input:radio[name='weather']").prop("disabled", true);
        //edited out by squirrelboy1225 for doubles!
        $("input:radio[name='weather'][value='" + newWeather + "']").prop("disabled", false);
    } else if (typeof newWeather != "undefined") {
        for (var k = 0; k < $("input:radio[name='weather']").length; k++) {
            var val = $("input:radio[name='weather']")[k].value;
            if (primalWeather.indexOf(val) === -1 && val !== "Strong Winds") {
                $("input:radio[name='weather']")[k].disabled = false;
            } else {
                //$("input:radio[name='weather']")[k].disabled = true;
                //edited out by squirrelboy1225 for doubles!
            }
        }
    }
    $("input:radio[name='weather'][value='" + newWeather + "']").prop("checked", true);
}

$("#p1 .item").bind("keyup change", function() {
    autosetStatus("#p1", $(this).val());
});
$("#p2 .item").bind("keyup change", function() {
    autosetStatus("#p2", $(this).val());
});

var lastManualStatus = {"#p1":"Healthy", "#p2":"Healthy"};
var lastAutoStatus = {"#p1":"Healthy", "#p2":"Healthy"};
function autosetStatus(p, item) {
    var currentStatus = $(p + " .status").val();
    if (currentStatus !== lastAutoStatus[p]) {
        lastManualStatus[p] = currentStatus;
    }
    if (item === "Flame Orb") {
        lastAutoStatus[p] = "Burned";
        $(p + " .status").val("Burned");
        $(p + " .status").change();
    } else if (item === "Toxic Orb") {
        lastAutoStatus[p] = "Badly Poisoned";
        $(p + " .status").val("Badly Poisoned");
        $(p + " .status").change();
    } else {
        lastAutoStatus[p] = "Healthy";
        if (currentStatus !== lastManualStatus[p]) {
            $(p + " .status").val(lastManualStatus[p]);
            $(p + " .status").change();
        }
    }
}

$(".status").bind("keyup change", function() {
    if ($(this).val() === 'Badly Poisoned') {
        $(this).parent().children(".toxic-counter").show();
    } else {
        $(this).parent().children(".toxic-counter").hide();
    }
});

// auto-update move details on select
$(".move-selector").change(function() {
    var moveName = $(this).val();
    var move = moves[moveName] || moves['(No Move)'];
    var moveGroupObj = $(this).parent();
    moveGroupObj.children(".move-bp").val(move.bp);
    moveGroupObj.children(".move-type").val(move.type);
    moveGroupObj.children(".move-cat").val(move.category);
    moveGroupObj.children(".move-crit").prop("checked", move.alwaysCrit === true);
	
	var movehits_str = '#' + moveGroupObj.attr('id') + '-hits'; 
	if(movehits_str != 'undefined-hits'){
//		window.alert(movehits_str);
	}
	var movehits = $(movehits_str);
    if (move.isMultiHit) {
		
        movehits.show();
        movehits.val($(this).closest(".poke-info").find(".ability").val() === 'Skill Link' ? 5 : 3);
    } else {
        movehits.hide();
    }
});

// auto-update set details on select
$(".set-selector").change(function() {
    var fullSetName = $(this).val();
    var pokemonName, setName;
    var DOU = !$('#lvlock').is(":checked");
	var lockLevels = $('#lvlock').is(":checked");
	var levelLock = $('#level-set').val();
    pokemonName = fullSetName.substring(0, fullSetName.indexOf(" ("));
    setName = fullSetName.substring(fullSetName.indexOf("(") + 1, fullSetName.lastIndexOf(")"));
    var pokemon = pokedex[pokemonName];
    if (pokemon) {
        var pokeObj = $(this).closest(".poke-info");

        // If the sticky move was on this side, reset it
        if (stickyMoves.getSelectedSide() === pokeObj.prop("id")) {
            stickyMoves.clearStickyMove();
        }

        pokeObj.find(".type1").val(pokemon.t1);
        pokeObj.find(".type2").val(pokemon.t2);
        pokeObj.find(".hp .base").val(pokemon.bs.hp);
        var i;
        for (i = 0; i < STATS.length; i++) {
            pokeObj.find("." + STATS[i] + " .base").val(pokemon.bs[STATS[i]]);
        }
        pokeObj.find(".weight").val(pokemon.w);
        pokeObj.find(".boost").val(0);
        pokeObj.find(".percent-hp").val(100);
        pokeObj.find(".status").val("Healthy");
        $(".status").change();
        var moveObj;
        var abilityObj = pokeObj.find(".ability");
        var itemObj = pokeObj.find(".item");
        if (pokemonName in setdex && setName in setdex[pokemonName]) {
            var set = setdex[pokemonName][setName];
           /* if(DOU) pokeObj.find(".level").val(100);
            else pokeObj.find(".level").val(set.level);*/
			if(lockLevels) pokeObj.find(".level").val(levelLock);
			else pokeObj.find(".level").val(set.level);
            pokeObj.find(".hp .evs").val((set.evs && typeof set.evs.hp !== "undefined") ? set.evs.hp : 0);
            pokeObj.find(".hp .ivs").val((set.ivs && typeof set.ivs.hp !== "undefined") ? set.ivs.hp : 31);
            pokeObj.find(".hp .dvs").val((set.dvs && typeof set.dvs.hp !== "undefined") ? set.dvs.hp : 15);
            for (i = 0; i < STATS.length; i++) {
                pokeObj.find("." + STATS[i] + " .evs").val((set.evs && typeof set.evs[STATS[i]] !== "undefined") ? set.evs[STATS[i]] : 0);
                pokeObj.find("." + STATS[i] + " .ivs").val((set.ivs && typeof set.ivs[STATS[i]] !== "undefined") ? set.ivs[STATS[i]] : 31);
                pokeObj.find("." + STATS[i] + " .dvs").val((set.dvs && typeof set.dvs[STATS[i]] !== "undefined") ? set.dvs[STATS[i]] : 15);
            }
            setSelectValueIfValid(pokeObj.find(".nature"), set.nature, "Hardy");
            setSelectValueIfValid(abilityObj, pokemon.ab ? pokemon.ab : set.ability, "");
            setSelectValueIfValid(itemObj, set.item, "");
            for (i = 0; i < 4; i++) {
                moveObj = pokeObj.find(".move" + (i+1) + " select.move-selector");
                setSelectValueIfValid(moveObj, set.moves[i], "(No Move)");
                moveObj.change();
            }
        } else {
            if(lockLevels) pokeObj.find(".level").val(levelLock);
			else pokeObj.find(".level").val(50);
            pokeObj.find(".hp .evs").val(0);
            pokeObj.find(".hp .ivs").val(31);
            pokeObj.find(".hp .dvs").val(15);
            for (i = 0; i < STATS.length; i++) {
                pokeObj.find("." + STATS[i] + " .evs").val(0);
                pokeObj.find("." + STATS[i] + " .ivs").val(31);
                pokeObj.find("." + STATS[i] + " .dvs").val(15);
            }
            pokeObj.find(".nature").val("Hardy");
            setSelectValueIfValid(abilityObj, pokemon.ab, "");
            itemObj.val("");
            for (i = 0; i < 4; i++) {
                moveObj = pokeObj.find(".move" + (i+1) + " select.move-selector");
                moveObj.val("(No Move)");
                moveObj.change();
            }
        }
		calcNatureStats(pokeObj);
        var formeObj = $(this).siblings().find(".forme").parent();
        itemObj.prop("disabled", false);
        if (pokemon.formes) {
			formeObj.show();
            showFormes(formeObj, setName, pokemonName, pokemon);
        } else {
            formeObj.hide();
        }
        calcHP(pokeObj);
        calcStats(pokeObj);
		calcBST(pokeObj);
        calcEvTotal(pokeObj);
		calcNatureStats(pokeObj);
        abilityObj.change();
        itemObj.change();
    }
});

function showFormes(formeObj, setName, pokemonName, pokemon) {
    var defaultForme = 0;

    if (setName !== 'Blank Set') {
        var set = setdex[pokemonName][setName];

        // Repurpose the previous filtering code to provide the "different default" logic
        if ((set.item.indexOf('ite') !== -1 && set.item.indexOf('ite Y') === -1) ||
            (pokemonName === "Groudon" && set.item.indexOf("Red Orb") !== -1) ||
            (pokemonName === "Kyogre" && set.item.indexOf("Blue Orb") !== -1) ||
            (pokemonName === "Meloetta" && set.moves.indexOf("Relic Song") !== -1) ||
            (pokemonName === "Rayquaza" && set.moves.indexOf("Dragon Ascent") !== -1)) {
            defaultForme = 1;
        } else if (set.item.indexOf('ite Y') !== -1) {
            defaultForme = 2;
        }
    }

    var formeOptions = getSelectOptions(pokemon.formes, false, defaultForme);
    formeObj.children("select").find("option").remove().end().append(formeOptions).change();
    formeObj.show();
}

function setSelectValueIfValid(select, value, fallback) {
    select.val(select.children("option[value='" + value + "']").length !== 0 ? value : fallback);
}

$(".forme").change(function() {
    var altForme = pokedex[$(this).val()],
        //container = $(this).closest(".info-group").siblings(),
		container = $(this).closest(".info-group"),
        fullSetName = container.find(".select2-chosen").first().text(),
        pokemonName = fullSetName.substring(0, fullSetName.indexOf(" (")),
        setName = fullSetName.substring(fullSetName.indexOf("(") + 1, fullSetName.lastIndexOf(")"));

    $(this).parent().siblings().find(".type1").val(altForme.t1);
    $(this).parent().siblings().find(".type2").val(typeof altForme.t2 != "undefined" ? altForme.t2 : "");
    $(this).parent().siblings().find(".weight").val(altForme.w);

    for (var i = 0; i < STATS.length; i++) {
        var baseStat = container.find("." + STATS[i]).find(".base");
        baseStat.val(altForme.bs[STATS[i]]);
        baseStat.keyup();
    }

    if (abilities.indexOf(altForme.ab) > -1) {
        container.find(".ability").val(altForme.ab);
    } else if (setName !== "Blank Set" && abilities.indexOf(setdex[pokemonName][setName].ability) > -1) {
        container.find(".ability").val(setdex[pokemonName][setName].ability);
    } else {
        container.find(".ability").val("");
    }
    container.find(".ability").keyup();
	container.find(".nature").keyup();

    if ($(this).val().indexOf("Mega") === 0 && $(this).val() !== "Mega Rayquaza") {
        container.find(".item").val("").keyup();
        //container.find(".item").prop("disabled", true);
        //edited out by squirrelboy1225 for doubles!
    } else {
        container.find(".item").prop("disabled", false);
    }

    if (pokemonName === "Darmanitan") {
        container.find(".percent-hp").val($(this).val() === "Darmanitan-Z" ? "50" : "100").keyup();
    }
});

function getTerrainEffects() {
    var className = $(this).prop("className");
    className = className.substring(0, className.indexOf(" "));
    switch (className) {
        case "type1":
        case "type2":
        case "ability":
        case "item":
            var id = $(this).closest(".poke-info").prop("id");
            var terrainValue = $("input:checkbox[name='terrain']:checked").val();
            if (terrainValue === "Electric") {
                $("#" + id).find("[value='Asleep']").prop("disabled", isGrounded($("#" + id)));
            } else if (terrainValue === "Misty") {
                $("#" + id).find(".status").prop("disabled", isGrounded($("#" + id)));
            }
            break;
        default:
            $("input:checkbox[name='terrain']").not(this).prop("checked", false);
            if ($(this).prop("checked") && $(this).val() === "Electric") {
                $("#p1").find("[value='Asleep']").prop("disabled", isGrounded($("#p1")));
                $("#p2").find("[value='Asleep']").prop("disabled", isGrounded($("#p2")));
            } else if ($(this).prop("checked") && $(this).val() === "Misty") {
                $("#p1").find(".status").prop("disabled", isGrounded($("#p1")));
                $("#p2").find(".status").prop("disabled", isGrounded($("#p2")));
            } else {
                $("#p1").find("[value='Asleep']").prop("disabled", false);
                $("#p1").find(".status").prop("disabled", false);
                $("#p2").find("[value='Asleep']").prop("disabled", false);
                $("#p2").find(".status").prop("disabled", false);
            }
            break;
    }
}

function isGrounded(pokeInfo) {
    return $("#gravity").prop("checked") || (pokeInfo.find(".type1").val() !== "Flying" && pokeInfo.find(".type2").val() !== "Flying" &&
            pokeInfo.find(".ability").val() !== "Levitate" && pokeInfo.find(".item").val() !== "Air Balloon");
}

var resultLocations = [[],[]];
for (var i = 0; i < 4; i++) {
    resultLocations[0].push({
        "move":"#resultMoveL" + (i+1),
        "damage":"#resultDamageL" + (i+1)
    });
    resultLocations[1].push({
        "move":"#resultMoveR" + (i+1),
        "damage":"#resultDamageR" + (i+1)
    });
}

var damageResults;
function calculate() {
    var p1 = new Pokemon($("#p1"), $("#p1moves"));
    var p2 = new Pokemon($("#p2"), $("#p2moves"));
    var field = new Field();
    damageResults = calculateAllMoves(p1, p2, field);
    var result, minDamage, maxDamage, minPercent, maxPercent, percentText;
    var highestMaxPercent = -1;
    var bestResult;
    for (var i = 0; i < 4; i++) {
        result = damageResults[0][i];
        minDamage = result.damage[0] * p1.moves[i].hits;
        maxDamage = result.damage[result.damage.length-1] * p1.moves[i].hits;
        minPercent = Math.floor(minDamage * 1000 / p2.maxHP) / 10;
        maxPercent = Math.floor(maxDamage * 1000 / p2.maxHP) / 10;
        result.damageText = minDamage + "-" + maxDamage + " (" + minPercent + " - " + maxPercent + "%)";
        result.koChanceText = p1.moves[i].bp === 0 ? 'nice move'
                : getKOChanceText(result.damage, p1.moves[i], p2, field.getSide(1), p1.ability === 'Bad Dreams');
        
        $(resultLocations[0][i].move + " + label").text(p1.moves[i].name.replace("Hidden Power", "HP"));
        $(resultLocations[0][i].damage).text(minPercent + " - " + maxPercent + "%");
        if (maxPercent > highestMaxPercent) {
            highestMaxPercent = maxPercent;
            bestResult = $(resultLocations[0][i].move);
        }
        
        result = damageResults[1][i];
        minDamage = result.damage[0] * p2.moves[i].hits;
        maxDamage = result.damage[result.damage.length-1] * p2.moves[i].hits;
        minPercent = Math.floor(minDamage * 1000 / p1.maxHP) / 10;
        maxPercent = Math.floor(maxDamage * 1000 / p1.maxHP) / 10;
        result.damageText = minDamage + "-" + maxDamage + " (" + minPercent + " - " + maxPercent + "%)";
        result.koChanceText = p2.moves[i].bp === 0 ? 'nice move'
                : getKOChanceText(result.damage, p2.moves[i], p1, field.getSide(0), p2.ability === 'Bad Dreams');
        
        $(resultLocations[1][i].move + " + label").text(p2.moves[i].name.replace("Hidden Power", "HP"));
        $(resultLocations[1][i].damage).text(minPercent + " - " + maxPercent + "%");
        if (maxPercent > highestMaxPercent) {
            highestMaxPercent = maxPercent;
            bestResult = $(resultLocations[1][i].move);
        }
    }
    if ($('.locked-move').length) {
        bestResult = $('.locked-move');
    } else {
        stickyMoves.setSelectedMove(bestResult.prop("id"));
    }
    bestResult.prop("checked", true);
    bestResult.change();
    $("#resultHeaderL").text(p1.name + "'s Moves (select one to show detailed results)");
    $("#resultHeaderR").text(p2.name + "'s Moves (select one to show detailed results)");
	
	
	
}

$(".result-move").change(function() {
    if (damageResults) {
        var result = findDamageResult($(this));
        if (result) {
            $("#mainResult").html(result.description + ": " + result.damageText + " -- " + result.koChanceText);
            if (result.parentDamage) {
                $("#damageValues").text("(First hit: " + result.parentDamage.join(", ") + 
                    "; Second hit: " + result.childDamage.join(", ") + ")");
            } else {
                $("#damageValues").text("(" + result.damage.join(", ") + ")");
            }
			$("#turnOrderDisplay").text(result.order);
        }
    }
});

// Need to close over "lastClicked", so we'll do it the old-fashioned way to avoid
// needlessly polluting the global namespace.
var stickyMoves = (function () {
    var lastClicked = 'resultMoveL1';
    $(".result-move").click(function () {
        if (this.id === lastClicked) {
            $(this).toggleClass("locked-move");
        } else {
            $('.locked-move').removeClass('locked-move');
        }
        lastClicked = this.id;
    });

    return {
        clearStickyMove: function () {
            lastClicked = null;
            $('.locked-move').removeClass('locked-move');
        },
        setSelectedMove: function (slot) {
            lastClicked = slot;
        },
        getSelectedSide: function () {
            if (lastClicked) {
                if (lastClicked.indexOf('resultMoveL') !== -1) {
                    return 'p1';
                } else if (lastClicked.indexOf('resultMoveR') !== -1) {
                    return 'p2';
                }
            }
            return null;
        }
    };
})();

function findDamageResult(resultMoveObj) {
    var selector = "#" + resultMoveObj.attr("id");
    for (var i = 0; i < resultLocations.length; i++) {
        for (var j = 0; j < resultLocations[i].length; j++) {
            if (resultLocations[i][j].move === selector) {
                return damageResults[i][j];
            }
        }
    }
}

function Pokemon(pokeInfo, moveDisplay) {
    var setName = pokeInfo.find("input.set-selector").val();
    if (setName.indexOf("(") === -1) {
        this.name = setName;
    } else {
        var pokemonName = setName.substring(0, setName.indexOf(" ("));
        this.name = (pokedex[pokemonName].formes) ? pokeInfo.find(".forme").val() : pokemonName;
    }
    this.type1 = pokeInfo.find(".type1").val();
    this.type2 = pokeInfo.find(".type2").val();
    this.level = ~~pokeInfo.find(".level").val();
    this.maxHP = ~~pokeInfo.find(".hp .total").text();
    this.curHP = ~~pokeInfo.find(".current-hp").val();
    this.HPEVs = ~~pokeInfo.find(".hp .evs").val();
	this.HPIVs = ~~pokeInfo.find(".hp .ivs").val();
    this.rawStats = {};
    this.boosts = {};
    this.stats = {};
    this.evs = {};
    this.ivs = {};
    for (var i = 0; i < STATS.length; i++) {
        this.rawStats[STATS[i]] = ~~pokeInfo.find("." + STATS[i] + " .total").text();
        this.boosts[STATS[i]] = ~~pokeInfo.find("." + STATS[i] + " .boost").val();
        this.evs[STATS[i]] = ~~pokeInfo.find("." + STATS[i] + " .evs").val();
		this.ivs[STATS[i]] = ~~pokeInfo.find("." + STATS[i] + " .ivs").val();
    }
    this.nature = pokeInfo.find(".nature").val();
    this.ability = pokeInfo.find(".ability").val();
    this.item = pokeInfo.find(".item").val();
    this.status = pokeInfo.find(".status").val();
    this.toxicCounter = this.status === 'Badly Poisoned' ? ~~pokeInfo.find(".toxic-counter").val() : 0;
    var z1, crit1, z2, crit2, z3, crit3, z4, crit4;
	var hit1,hit2,hit3,hit4;
	z1 = moveDisplay.find(".z1").prop("checked");
	crit1 = moveDisplay.find(".crit1").prop("checked");
	z2 = moveDisplay.find(".z2").prop("checked");
	crit2 = moveDisplay.find(".crit2").prop("checked");
	z3 = moveDisplay.find(".z3").prop("checked");
	crit3 = moveDisplay.find(".crit3").prop("checked");
	z4 = moveDisplay.find(".z4").prop("checked");
	crit4 = moveDisplay.find(".crit4").prop("checked");
	hit1 = moveDisplay.find(".hit1").val();
	hit2 = moveDisplay.find(".hit2").val();
	hit3 = moveDisplay.find(".hit3").val();
	hit4 = moveDisplay.find(".hit4").val();
	
	this.moves = [
		getMoveDetails(pokeInfo.find(".move1"), z1, crit1, hit1),
        getMoveDetails(pokeInfo.find(".move2"), z2, crit2, hit2),
        getMoveDetails(pokeInfo.find(".move3"), z3, crit3, hit3),
        getMoveDetails(pokeInfo.find(".move4"), z4, crit4, hit4)
		
    ];
    this.weight = +pokeInfo.find(".weight").val();
	
	this.isShiny = pokeInfo.find(".shiny").prop("checked");
	this.isProtect = pokeInfo.find(".protect").prop("checked");
	
	this.isSoaked = pokeInfo.find(".soak").prop("checked");
	this.isForestCurse = pokeInfo.find(".forest-curse").prop("checked");
	this.isTrickOrTreat = pokeInfo.find(".trick-or-treat").prop("checked");
	this.type3 = "";
	if(this.isForestCurse){
		this.type3 = "Grass";
	}
	else if(this.isTrickOrTreat){
		this.type3 = "Ghost";
	}
	
}

function getMoveDetails(moveInfo, makeZ, makeCrit, hitNum) {
    var moveName = moveInfo.find("select.move-selector").val();
    var defaultDetails = moves[moveName];
    return $.extend({}, defaultDetails, {
        name: moveName,
        bp: ~~moveInfo.find(".move-bp").val(),
        type: moveInfo.find(".move-type").val(),
        category: moveInfo.find(".move-cat").val(),
		isCrit: makeCrit,
		isZ: makeZ,
		hits: (defaultDetails.isMultiHit && !makeZ) ? ~~hitNum : defaultDetails.isTwoHit ? 2 : 1
       // isCrit: moveInfo.find(".move-crit").prop("checked"),
       // isZ: moveInfo.find(".move-z").prop("checked"),
       // hits: (defaultDetails.isMultiHit && !moveInfo.find(".move-z").prop("checked")) ? ~~moveInfo.find(".move-hits").val() : defaultDetails.isTwoHit ? 2 : 1
    });
}

function Field() {
    var format = $("input:radio[name='format']:checked").val();
    var doubleHeal = $("#double-recovery").prop("checked");
    var isGravity = $("#gravity").prop("checked");
	var isTR = $("#trickRoom").prop("checked");
	var isMR = $("#magicRoom").prop("checked");
	var isWR = $("#wonderRoom").prop("checked");
	
    var isSR = [$("#srL").prop("checked"), $("#srR").prop("checked")];
	
	var isWet = $("#waterSport").prop("checked");
	var isMuddy = $("#mudSport").prop("checked");
	var isIonized = $("#ionDeluge").prop("checked");
	
    var weather;
    var spikes;
    if (gen === 2) {
        spikes = [$("#gscSpikesL").prop("checked") ? 1 : 0, $("#gscSpikesR").prop("checked") ? 1 : 0];
        weather = $("input:radio[name='gscWeather']:checked").val();
    } else {
        weather = $("input:radio[name='weather']:checked").val();
        spikes = [~~$("input:radio[name='spikesL']:checked").val(), ~~$("input:radio[name='spikesR']:checked").val()];
    }
	//var seeds = [~~$("input:radio[name='seedsL']:checked").val(), ~~$("input:radio[name='seedsR']:checked").val()];
	
    var terrain = ($("input:radio[name='terrain']:checked").val()) ? $("input:radio[name='terrain']:checked").val() : "";
    var isReflect = [$("#reflectL").prop("checked"), $("#reflectR").prop("checked")];
    var isLightScreen = [$("#lightScreenL").prop("checked"), $("#lightScreenR").prop("checked")];
	var isAuroraVeil =  [$("#auroraVeilL").prop("checked"), $("#auroraVeilR").prop("checked")];
    var isForesight = [$("#foresightL").prop("checked"), $("#foresightR").prop("checked")];
    var isHelpingHand = [$("#helpingHandR").prop("checked"), $("#helpingHandL").prop("checked")]; 	// affects attacks against opposite side
    var isFriendGuard = [$("#friendGuardL").prop("checked"), $("#friendGuardR").prop("checked")];
	var isBattery = [$("#batteryR").prop("checked"), $("#batteryL").prop("checked")];				// affects attacks against opposite side
    
    this.getWeather = function() {
        return weather;
    };
    this.clearWeather = function() {
        weather = "";
    };
    this.getSide = function(i) {
        return new Side(format, doubleHeal, terrain, weather, isGravity, isTR, isMR, isWR, isSR[i], isWet, isMuddy, isIonized, spikes[i], isReflect[i], isLightScreen[i], isAuroraVeil[i], isForesight[i], isHelpingHand[i], isFriendGuard[i], isBattery[i]);
    };
	this.getMR = function(){
		return isMR;
	};
	this.getWR = function(){
		return isWR;
	};
}

function Side(format, doubleHeal, terrain, weather, isGravity, isTR, isMR, isWR, isSR, isWet, isMuddy, isIonized, spikes, isReflect, isLightScreen, isAuroraVeil, isForesight, isHelpingHand, isFriendGuard, isBattery) {
    this.format = format;
	this.doubleHeal = doubleHeal;
    this.terrain = terrain;
    this.weather = weather;
    this.isGravity = isGravity;
    this.isTR = isTR;
	this.isMR = isMR;
	this.isWR = isWR;
    this.isSR = isSR;
	this.isWet = isWet;
	this.isMuddy = isMuddy;
	this.isIonized = isIonized;
    this.spikes = spikes;
	//this.seeds = seeds;
    this.isReflect = isReflect;
    this.isLightScreen = isLightScreen;
	this.isAuroraVeil = isAuroraVeil;
    this.isForesight = isForesight;
    this.isHelpingHand = isHelpingHand;
    this.isFriendGuard = isFriendGuard;
	this.isBattery = isBattery;
}

var gen, pokedex, setdex, typeChart, moves, abilities, items, STATS, calculateAllMoves, calcHP, calcStat;

$(".gen").change(function () {
    gen = ~~$(this).val();
    switch (gen) {
        case 1:
            pokedex = POKEDEX_RBY;
            setdex = SETDEX_RBY;
            typeChart = TYPE_CHART_RBY;
            moves = MOVES_RBY;
            items = [];
            abilities = [];
            STATS = STATS_RBY;
            calculateAllMoves = CALCULATE_ALL_MOVES_RBY;
            calcHP = CALC_HP_RBY;
            calcStat = CALC_STAT_RBY;
            break;
        case 2:
            pokedex = POKEDEX_GSC;
            setdex = SETDEX_GSC;
            typeChart = TYPE_CHART_GSC;
            moves = MOVES_GSC;
            items = ITEMS_GSC;
            abilities = [];
            STATS = STATS_GSC;
            calculateAllMoves = CALCULATE_ALL_MOVES_GSC;
            calcHP = CALC_HP_RBY;
            calcStat = CALC_STAT_RBY;
            break;
        case 3:
            pokedex = POKEDEX_ADV;
            setdex = SETDEX_ADV;
            typeChart = TYPE_CHART_GSC;
            moves = MOVES_ADV;
            items = ITEMS_ADV;
            abilities = ABILITIES_ADV;
            STATS = STATS_GSC;
            calculateAllMoves = CALCULATE_ALL_MOVES_ADV;
            calcHP = CALC_HP_ADV;
            calcStat = CALC_STAT_ADV;
            break;
        case 4:
            pokedex = POKEDEX_DPP;
            setdex = SETDEX_DPP;
            typeChart = TYPE_CHART_GSC;
            moves = MOVES_DPP;
            items = ITEMS_DPP;
            abilities = ABILITIES_DPP;
            STATS = STATS_GSC;
            calculateAllMoves = CALCULATE_ALL_MOVES_DPP;
            calcHP = CALC_HP_ADV;
            calcStat = CALC_STAT_ADV;
            break;
        case 5:
            pokedex = POKEDEX_BW;
            setdex = SETDEX_BW;
            typeChart = TYPE_CHART_GSC;
            moves = MOVES_BW;
            items = ITEMS_BW;
            abilities = ABILITIES_BW;
            STATS = STATS_GSC;
            calculateAllMoves = CALCULATE_ALL_MOVES_BW;
            calcHP = CALC_HP_ADV;
            calcStat = CALC_STAT_ADV;
            break;
        case 6:
            pokedex = POKEDEX_XY;
            setdex = SETDEX_XY;
            typeChart = TYPE_CHART_XY;
            moves = MOVES_XY;
            items = ITEMS_XY;
            abilities = ABILITIES_XY;
            STATS = STATS_GSC;
            calculateAllMoves = CALCULATE_ALL_MOVES_BW;
            calcHP = CALC_HP_ADV;
            calcStat = CALC_STAT_ADV;
            break;
        case 7:
            pokedex = POKEDEX_SM;
            setdex = SETDEX_SM;
            typeChart = TYPE_CHART_XY;
            moves = MOVES_SM;
            items = ITEMS_SM;
            abilities = ABILITIES_SM;
            STATS = STATS_GSC;
            calculateAllMoves = CALCULATE_ALL_MOVES_BW;
            calcHP = CALC_HP_ADV;
            calcStat = CALC_STAT_ADV;
    }
    clearField();
    $(".gen-specific.g" + gen).show();
    $(".gen-specific").not(".g" + gen).hide();
    var typeOptions = getSelectOptions(Object.keys(typeChart));
    $("select.type1, select.move-type").find("option").remove().end().append(typeOptions);
    $("select.type2").find("option").remove().end().append("<option value=\"\">(none)</option>" + typeOptions);
    var moveOptions = getSelectOptions(Object.keys(moves), true);
    $("select.move-selector").find("option").remove().end().append(moveOptions);
    var abilityOptions = getSelectOptions(abilities, true);
    $("select.ability").find("option").remove().end().append("<option value=\"\">(other)</option>" + abilityOptions);
    var itemOptions = getSelectOptions(items, true);
    $("select.item").find("option").remove().end().append("<option value=\"\">(none)</option>" + itemOptions);
    
    $(".set-selector").val(getSetOptions()[gen > 3 ? 1 : gen === 1 ? 5 : 3].id);
    $(".set-selector").change();
});

function clearField() {
    $("#doubles").prop("checked", true);
    $("#double-recovery").prop("checked", false);
    $("#clear").prop("checked", true);
    $("#gscClear").prop("checked", true);
    $("#gravity").prop("checked", false);
    $("#trickRoom").prop("checked", false);
    $("#magicRoom").prop("checked", false);
    $("#wonderRoom").prop("checked", false);
    $("#waterSport").prop("checked", false);
    $("#mudSport").prop("checked", false);
    $("#ionDeluge").prop("checked", false);
    $("#srL").prop("checked", false);
    $("#srR").prop("checked", false);
    $("#spikesL0").prop("checked", true);
    $("#spikesR0").prop("checked", true);
 //   $("#seedsL0").prop("checked", true);
 //   $("#seedsR0").prop("checked", true);
    $("#gscSpikesL").prop("checked", false);
    $("#gscSpikesR").prop("checked", false);
    $("#reflectL").prop("checked", false);
    $("#reflectR").prop("checked", false);
    $("#lightScreenL").prop("checked", false);
    $("#lightScreenR").prop("checked", false);
    $("#foresightL").prop("checked", false);
    $("#foresightR").prop("checked", false);
    $("#helpingHandL").prop("checked", false);
    $("#helpingHandR").prop("checked", false);
    $("#friendGuardL").prop("checked", false);
    $("#friendGuardR").prop("checked", false);
    $("#batteryL").prop("checked", false);
    $("#batteryR").prop("checked", false);
}

function getSetOptions() {
    var pokeNames, index;
    pokeNames = Object.keys(pokedex);
    index = pokeNames.length;
    while (index--) {
        if (pokedex[pokeNames[index]].isAlternateForme) {
            pokeNames.splice(index, 1);
        }
    }
    pokeNames.sort();
    index = pokeNames.length;
    while(index--){ //forcing alolan forms to show first
        if(pokeNames[index].includes("-Alola")){
            var temp = pokeNames[index];
            pokeNames.splice(index, 1); //deleting alolan entry
            var regularForm = temp.substring(0, temp.indexOf("-Alola"));
            var regularIndex = pokeNames.indexOf(regularForm);
            pokeNames.splice(regularIndex, 0, temp); //re-inserting it right before non-alolan entry
        }
    }
    var setOptions = [];
    var idNum = 0;
    for (var i = 0; i < pokeNames.length; i++) {
        var pokeName = pokeNames[i];
        setOptions.push({
            pokemon: pokeName,
            text: pokeName
        });
        if (pokeName in setdex) {
            var setNames = Object.keys(setdex[pokeName]);
            for (var j = 0; j < setNames.length; j++) {
                var setName = setNames[j];
                setOptions.push({
                    pokemon: pokeName,
                    set: setName,
                    text: pokeName + " (" + setName + ")",
                    id: pokeName + " (" + setName + ")"
                });
            }
        }
        setOptions.push({
            pokemon: pokeName,
            set: "Blank Set",
            text: pokeName + " (Blank Set)",
            id: pokeName + " (Blank Set)"
        });
    }
    return setOptions;
}

function getSelectOptions(arr, sort, defaultIdx) {
    if (sort) {
        arr.sort();
    }
    var r = '';
    // Zero is of course falsy too, but this is mostly to coerce undefined.
    if (!defaultIdx) {
        defaultIdx = 0;
    }
    for (var i = 0; i < arr.length; i++) {
        if (i === defaultIdx) {
            r += '<option value="' + arr[i] + '" selected="selected">' + arr[i] + '</option>';
        } else {
            r += '<option value="' + arr[i] + '">' + arr[i] + '</option>';
        }
    }
    return r;
}



$(document).ready(function() {
    $("#gen7").prop("checked", true);
    $("#gen7").change();
    $(".terrain-trigger").bind("change keyup", getTerrainEffects);
    $(".calc-trigger").bind("change keyup", calculate);
    $(".set-selector").select2({
        formatResult: function(object) {
            return object.set ? ("&nbsp;&nbsp;&nbsp;" + object.set) : ("<b>" + object.text + "</b>");
        },
        query: function(query) {
            var setOptions = getSetOptions();
            var pageSize = 30;
            var results = [];
            for (var i = 0; i < setOptions.length; i++) {
                var pokeName = setOptions[i].pokemon.toUpperCase();
                if (!query.term || pokeName.indexOf(query.term.toUpperCase()) === 0) {
                    results.push(setOptions[i]);
                }
            }
            query.callback({
                results: results.slice((query.page - 1) * pageSize, query.page * pageSize),
                more: results.length >= query.page * pageSize
            });
        },
        initSelection: function(element, callback) {
            var data = getSetOptions()[gen > 3 ? 1 : gen === 1 ? 5 : 3];
            callback(data);
        }
    });
    $(".move-selector").select2({
        dropdownAutoWidth:true,
        matcher: function(term, text) {
            // 2nd condition is for Hidden Power
            return text.toUpperCase().indexOf(term.toUpperCase()) === 0 || text.toUpperCase().indexOf(" " + term.toUpperCase()) >= 0;
        }
    });
    $(".set-selector").val(getSetOptions()[gen > 3 ? 1 : gen === 1 ? 5 : 3].id);
    $(".set-selector").change();
});
