var timer = 256
var tickRate = 16
var visualRate = 256
var msg = false
var count = 0

var resources = {"cash":150,"beers":0,"BTquality":1,"manager":0,"barLevel":1,"bartender": 0,"beerSold":0}
var costs = {"BTquality":15,
	     "bartender":200,
	     "bartender_tip":15,"beer_cost": 100,"manager_cost":1000,"bar_level":15000}
var growthRate = {"BTquality":1.20,
		  "bartender":1.20,
	     "bartender_tip":1.15,"manager":1.20} 

var increments = [{"input":["bartender","bartender_tip"],
		   "output":"cash"}]

var unlocks = {"BTquality":{"cash":10},
	       "bartender":{"cash":200},
	       "bartender_tip":{"bartender":1},"manager":{"cash":800},"barUpgrade":{"bartender": 4}}

function serveDrinks(num){
    if (resources["beers"] > 0) {
    resources["cash"] += num*resources["BTquality"]
    resources["beers"] = resources["beers"] - 1
    resources["beerSold"] += 1
    document.getElementById("message").innerHTML = "Watch for some achievements when you sell a certain amount of beers ;)"
    updateText()
    }
};
function buyBeer(num) {
    if (resources["cash"]>=100) {
    msg = true
    resources["beers"]+=num
    resources["cash"] = resources["cash"] - costs["beer_cost"]
    document.getElementById("inventPopup").style.display="none"
    }
};

function upgradeBartender(num){
    if (resources["cash"] >= costs["bartender_tip"]*num){
	resources["bartender_tip"] += num
	resources["cash"] -= num*costs["bartender_tip"]
	costs["bartender_tip"] *= growthRate["bartender_tip"]
	document.getElementById("message").innerHTML = "Your bartenders love you as a boss for giving them an extra bonus. They are working extra hard for you now!"
    
	updateText()
    }
};


function upgradeBTquality(num){
    if (resources["cash"] >= costs["BTquality"]*num){     
	resources["BTquality"] += num
	resources["cash"] -= num*costs["BTquality"]
	
	costs["BTquality"] *= growthRate["BTquality"]
    
    document.getElementById("message").innerHTML = "The customers are loving your service, they will leave some extra tips!"
	
	updateText()
    }
};
function hireManager(num) {
    if (resources["cash"]>= costs["manager_cost"]*num) {
        if(!resources["manager"]) {
            resources["manager"] = 0
        }
        resources["manager"] += num 
        resources["cash"] -= num*costs["manager_cost"]
        
        costs["manager_cost"] *= growthRate["manager"]
        
        document.getElementById("message").innerHTML = "You just hired a new manager. They will keep your bar stocked up on beer inventory"
        
        updateText()
    }
};
function hireBartender(num){
    if (resources["cash"] >= costs["bartender"]*num){
        if (resources["bartender"] < resources["barLevel"]*5) {
            if (!resources["bartender"]){
	           resources["bartender"] = 0
            }
            if (!resources["bartender_tip"]){
	           resources["bartender_tip"] = 1 
            }
            count++
            resources["bartender"] += num
            resources["cash"] -= num*costs["bartender"]
            costs["bartender"] *= growthRate["bartender"]
            document.getElementById("message").innerHTML = "You have just hired a new bartender. He will get right to work!"    
        
            updateText()
        }
        else {
            document.getElementById("message").innerHTML = "Need to upgrade bar level before hiring more bartenders!"
        }
    }
};

function upgradeBar(num) {
    if (resources["cash"] >= costs["bar_level"]) {
        if (resources["manager"] >= resources["barLevel"]) {
            resources["cash"] = resources["cash"] - costs["bar_level"]
            resources["barLevel"] = resources["barLevel"] + num
            costs["bar_level"] = costs["bar_level"] * 1.4
            document.getElementById("message").innerHTML = "You have just upgraded your bar! You can now hire more bartenders!"
            updateText();
            
        }
        else {
            document.getElementById("message").innerHTML = "Cannot upgrade bar until you hire another manager!"
        }
    }
};


function updateText(){
    for (var key in unlocks){
	var unlocked = true
	for (var criterion in unlocks[key]){
	    unlocked = unlocked && resources[criterion] >= unlocks[key][criterion]
	}
	if (unlocked){
	    for (var element of document.getElementsByClassName("show_"+key)){		 
		element.style.display = "block"
	    }
	}
    }
    
    for (var key in resources){
	 for (var element of document.getElementsByClassName(key)){
	    element.innerHTML = resources[key].toFixed(2)
	}
    }
    for (var key in costs){
	for (var element of document.getElementsByClassName(key+"_cost")){
	    element.innerHTML = costs[key].toFixed(2)
	}
    }
};


window.setInterval(function(){
    timer += tickRate    
    for (var increment of increments){
        total = 10
        for (var input of increment["input"]){
	       total *= resources[input]  
        }
        document.getElementById("beersold").innerHTML = "Beers sold: " + resources["beerSold"]
        document.getElementById("barLvl").innerHTML = "Bar level: " + resources["barLevel"]
        if (resources["manager"] == 0) {
            document.getElementById("inventPopup").style.display="block"
        }
        if (resources["manager"]==0 && msg==true && resources["beers"]==0) {
            document.getElementById("message").innerHTML = "Generate enough cash to hire a manager to have your bar always stocked up, and allow you to upgrade your bar level to make more ca$h!"
            }
        if (resources["manager"] >= 1 && resources["beers"] == 0) {
            //add beer count here or...
            resources["cash"] = resources["cash"] - 100
            resources["beers"] = resources["beers"] + 200
        }
        if (total && resources["beers"] > 0){
            //add beer count here
	       console.log(total)
           resources["beers"] = resources["beers"] - 1
           
           resources["beerSold"] += count
	       resources[increment["output"]] += total/tickRate
        }
        if (resources["beers"] > 0) {
            document.getElementById("inventPopup").style.display="none"
        }
        if (resources["beerSold"]==100) {
            document.getElementById("message").innerHTML = "100 beers sold... better keep going you want to stay in business!"
        }
        if (resources["beerSold"]==1000) {
            document.getElementById("message").innerHTML = "1000 beers sold... Not bad, but you are far from the talk of the town!"
        }
        if (resources["beerSold"]==5000) {
            document.getElementById("message").innerHTML = "5000 beers sold... Now you are starting to make some noise!"
        }
        if (resources["beerSold"]==10000) {
            document.getElementById("message").innerHTML = "10000 beers sold... You got people from out of state coming to drink at your bar! :O"
        }
        if (resources["beerSold"]==50000) {
            document.getElementById("message").innerHTML = "50000 beers sold... You got people from out of state coming to drink at your bar! :O"
        }
        if (resources["beerSold"]==75000) {
            document.getElementById("message").innerHTML = "75000 beers sold... Budlight are approaching you for brand deals!"
        }
        if (resources["beerSold"]==100000) {
            document.getElementById("message").innerHTML = "100000 beers sold... You are beginning to draw celebrity attention!"
        }
        if (resources["beerSold"]==1000000) {
            document.getElementById("message").innerHTML = "1000000 beers sold... You have the hottest bar in the state!"
        }
        if (resources["beerSold"]==10000000) {
            document.getElementById("message").innerHTML = "10000000 beers sold, You are now keeping up with the Kardashians and Kanye!"
        }
    }
    
    if (timer > visualRate){
	   timer -= visualRate
	   updateText()
    }
  

}, tickRate);
