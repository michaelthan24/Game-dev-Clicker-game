var timer = 256
var tickRate = 16
var visualRate = 256
var msg = false
var resources = {"cash":150,"beers":0,"BTquality":1,"manager":0,"barLevel":1,"bartender": 0}
var costs = {"BTquality":15,
	     "bartender":200,
	     "bartender_tip":15,"beer_cost": 100,"manager_cost":1000}
var growthRate = {"BTquality":1.01,
		  "bartender":1.05,
	     "bartender_tip":1.15,"manager":1.10} 

var increments = [{"input":["bartender","bartender_tip"],
		   "output":"cash"}]

var unlocks = {"BTquality":{"cash":10},
	       "bartender":{"cash":200},
	       "bartender_tip":{"bartender":1},"manager":{"cash":800}}

function serveDrinks(num){
    if (resources["beers"] > 0) {
    resources["cash"] += num*resources["BTquality"]
    resources["beers"] = resources["beers"] - 1
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
        document.getElementById("barLvl").innerHTML = "Bar level: " + resources["barLevel"]
        if (resources["manager"] == 0) {
            document.getElementById("inventPopup").style.display="block"
        }
        if (resources["manager"]==0 && msg==true && resources["beers"]==0) {
            document.getElementById("message").innerHTML = "Buy a manager to have your bar always stocked up!"
            }

        if (resources["manager"] >= 1 && resources["beers"] == 0) {
            resources["cash"] = resources["cash"] - 100
            resources["beers"] = resources["beers"] + 200
        }
        if (total && resources["beers"] > 0){
	       console.log(total)
           resources["beers"] = resources["beers"] - 1
	       resources[increment["output"]] += total/tickRate
        }
        if (resources["beers"] > 0) {
            document.getElementById("inventPopup").style.display="none"
        }
    }
    
    if (timer > visualRate){
	   timer -= visualRate
	   updateText()
    }
  

}, tickRate);
