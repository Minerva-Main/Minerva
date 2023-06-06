
var leveltoanswers = {
	1: "H2O",
    2: "BIOLOGY",
    3: "ATOM",
    4: "GRAVITY",
    5: "CO2",
	6: "ELEMENTS",
	7: "ELECTRICITY",
	8: "HEAT",
	9: "MAGNETISM",
	10:"GEOLOGY",
	11: "COLLISION",
	12: "ASTRONOMY",
	13: "WIND",
	14: "MIND",
	15: "PHYSICS",
	16: "CHEMISTRY",
	17: "ENERGY",
	18: "BOTANY",
	19: "CLIMATE",
	20:"ANATOMY",
}

var nooflevels = 20; 
var currentlevel = 1;

var tempanswer = leveltoanswers[currentlevel];

var noofhints = 3; 

var options = {
	0 : true, 1 : true, 2 : true, 3 : true, 4 : true, 5 : true, 6 : true, 7 : true, 8 : true, 9 : true, 10 : true, 11 : true, 12 : true, 13 : true, 14 : true, 15 : true, 16 : true, 17 : true
}


var blanks = {} 

var letters = {} 

var freq = {} 

var tempfreq = {} 


function main() {
	var alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
	var answer = leveltoanswers[currentlevel];
	for (var i = 0; i < 35; ++i) {
		freq[alphabets[i]] = 0;
		tempfreq[alphabets[i]] = 0;
	}
	for (var i = 0; i < answer.length; ++i)
		freq[answer[i]] += 1; 

	addimages(currentlevel); 
	$(".hintimage").attr("onclick", "viewfullimage(this)");
	addblanks(currentlevel); 
	addoptions(currentlevel); 
}


function getsubmission() {
	var x = "";
	$(".blank").each(function(item, element) {
		x += element.innerHTML; 
	});

	return x;
}

function checkifcorrect(level) {
	var submission = getsubmission();
	if (submission === leveltoanswers[level])
		return true;
	return false;
}



function addimages(level) {
	$("#smallimages").empty(); 
	var dir = "./img/level" + level + "/"; 

	
	for (var i = 1; i <= 2; ++i) {
		var imagelocation = dir + i + ".jpg" ;
		$("#smallimages").append("<img src=" + imagelocation + " class='hintimage'>");
	}
	$("#smallimages").append("<br>");
	for (var i = 3; i <= 4; ++i) {
		var imagelocation = dir + i + ".jpg" ;
		$("#smallimages").append("<img src=" + imagelocation + " class='hintimage'>");
	}
}



function addblanks(level) {
	$("#blanks").empty(); 
	var answer = leveltoanswers[level];
	for (var i = 0; i < answer.length; ++i) {
		$("#blanks").append("<span class='blank' onclick='deselect(\"" + i + "\")'>_</span>");
		blanks[i] = null;
	}

	
	$("#blanks").append("<div id='hintbutton' align='left' onclick='hint(" + level + ")'><i class='fas fa-lightbulb' style='font-size: 60px;'></i><br><span id='noofhints'></span></div><br><br>")
	$("#noofhints")[0].innerHTML = noofhints + " hint(s) remaining";
}


function addoptions(level) {
	 
	var s = createstring(level);
	for (var i = 0; i < 18; ++i) {
		letters[i] = s[i];
	}
	$("#letters").empty(); 
	for (var i = 0; i < 9; ++i)
		$("#letters").append("<span class='letter' onclick='addletter(\"" + s[i] + "\", " + i + ")'>" + s[i] + "</span>");
	$("#letters").append("<br>");
	for (var i = 9; i < 18; ++i)
		$("#letters").append("<span class='letter' onclick='addletter(\"" + s[i] + "\", " + i + ")'>" + s[i] + "</span>");
}


String.prototype.shuffle = function() {

	var that = this.split("");
	var len = that.length, t, i;
	while(len) {
		i = Math.random() * len-- | 0;
		t = that[len], that[len] = that[i], that[i] = t;
	}
	return that.join("");
}


function createstring(level) {
	var answer = leveltoanswers[level];
	var numberremaining = 18 - answer.length;
	var s = answer;
	var alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
	var possible = "";
	for (var i = 0; i < alphabets.length; ++i) {
		if (answer.indexOf(alphabets[i]) == -1)
			possible += alphabets[i];
	}
	possible = possible.shuffle();
	for (var i = 0; i < numberremaining; ++i)
		s += possible[i];
	s = s.shuffle();
	return s;
}

function updatetempanswer() {
	var answer = leveltoanswers[currentlevel];
	var s = "";
	$(".blank").each(function(item, element){
		var xxx = element.innerHTML;
		if (xxx === "_" || xxx != answer[item]) {
			s += answer[item];
		}
	});
	tempanswer = s;
}

function allfilled() {
	
	var isempty = false;
	$(".blank").each(function(item, element) {
		if (element.innerHTML == "_")
			isempty = true;
	});

	return !isempty;
}

function findfirstvacant() {
	var elementtoreturn;
	var index;
	var blanks = document.getElementsByClassName("blank");
	for (var i = 0; i < blanks.length; ++i) {
		if (blanks[i].innerHTML == "_") {
			index = i;
			elementtoreturn = blanks[i];
			break;
		}
	}
	return [elementtoreturn, index];
}

function addletter(lettertoadd, index) {	
	if (options[index] == false) {
		return;
	}
	else {
		var ffv = findfirstvacant();
		var element = ffv[0];
		var elindex = ffv[1];
		
		element.innerHTML = lettertoadd;
		options[index] = false; 

		$(".letter")[index].onclick = null;
		$(".letter")[index].style.cursor = "not-allowed";
		$(".letter")[index].style.background = "hex:222";
		$(".letter")[index].addEventListener("click", function() {
            addletter(lettertoadd, index);
        });
		
		blanks[elindex] = index;
		updatetempanswer(); 
		tempfreq[lettertoadd] += 1;

		if (allfilled())
			nextmove();
	}
}


function deselect(elindex) {
	if ($(".blank")[elindex].innerHTML == "_") {
		return;
	}

	var lettertoremove = $(".blank")[elindex].innerHTML;
	tempfreq[lettertoremove] -= 1; 
	$(".blank")[elindex].innerHTML = "_"; 
	var index = blanks[elindex]; 
	options[index] = true; 
	$(".letter")[index].onclick = function() { 
	
		addletter(letters[index], index);
	};
	$(".letter")[index].onclick = function playMusic() {
		var audio = document.getElementById("background-music");
		audio.play();
	};
	$(".letter")[index].style.cursor = "pointer";
	$(".letter")[index].style.background = "hex:222";
	$(".blank").css("color", "white");
	updatetempanswer(); 
}



function nextmove() {
	if (checkifcorrect(currentlevel)) {

		if (currentlevel === nooflevels) {
			window.location = "congrats.html";
		}

		currentlevel++;
		tempanswer = leveltoanswers[currentlevel];

		options = {
			0 : true, 1 : true, 2 : true, 3 : true, 4 : true, 5 : true, 6 : true, 7 : true, 8 : true, 9 : true, 10 : true, 11 : true, 12 : true, 13 : true, 14 : true, 15 : true, 16 : true, 17 : true
		}

		blanks = {
		}

		letters = {
		}

		noofhints = 3;
		main(); 
	}

	else {
		
		markincorrect();
	}
}


function markincorrect() {
	$(".blank").css("color", "red");
}



function findLetter(letter) {
	var index;
	$(".letter").each(function(item, element) {
		if (element.innerHTML == letter) {
			index = item;
		}
	});
	return index;
}

function getRandomLetter() {
	var position = Math.floor(Math.random() * tempanswer.length); 
	var letter = tempanswer.charAt(position); 

	tempanswer = tempanswer.substr(0, position) + tempanswer.substr(position + 1, tempanswer.length);
	var pos; 
	var answer = leveltoanswers[currentlevel]; 
	for (var i = 0; i < answer.length; ++i) {
		if (answer[i] == letter && $(".blank")[i].innerHTML != letter) {
			pos = i;
			break;
		}
	}

	return [letter, pos];
}

function addhint(lettertoadd, index, position) {
	var answer = leveltoanswers[currentlevel];
	if (tempfreq[lettertoadd] == freq[lettertoadd]) {
		var firstfoundat;
		for (var i = 0; i < answer.length; ++i) {
			if ($(".blank")[i].innerHTML == lettertoadd) {
				firstfoundat = i;
				break;
			}
		}

		deselect(firstfoundat);
		tempfreq[lettertoadd] -= 1;
	}


	var element = $(".blank")[position];
	var elindex = position;

	if (element.innerHTML != "_")
		deselect(position);

	
	element.innerHTML = lettertoadd;
	options[index] = false; 
	$(".letter")[index].onclick = null; 

	
	$(".letter")[index].style.cursor = "not-allowed";
	$(".letter")[index].style.background = "hex:222";
	blanks[elindex] = index;
	$(".blank")[elindex].onclick = null;
	$(".blank")[elindex].style.cursor = "not-allowed";
	tempfreq[lettertoadd] += 1;
	if (allfilled())
		nextmove();
}

function hint() {
	if (noofhints <= 0) {
		return;
	}
	var grl = getRandomLetter(); 
	var letter = grl[0];
	var position = grl[1];
	var index = findLetter(letter); 
	noofhints--; 
	addhint(letter, index, position); 
	$("#noofhints")[0].innerHTML = noofhints + " hint(s) remaining"; 
}


