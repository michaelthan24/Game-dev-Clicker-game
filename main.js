var timer = 256
var tickRate = 16
var visualRate = 256
var resources = {"cash":200,"beers":0,"BTquality":1,"manager":0}
var costs = {"BTquality":15,
	     "miner":150,
	     "miner_pickaxe":15,"beer_cost": 100,"manager_cost":1000}
var growthRate = {"BTquality":1.01,
		  "miner":1.05,
	     "miner_pickaxe":1.15,"manager":1.10} 

var increments = [{"input":["miner","miner_pickaxe"],
		   "output":"cash"}]

var unlocks = {"BTquality":{"cash":10},
	       "miner":{"cash":100},
	       "miner_pickaxe":{"miner":1},"manager":{"cash":800}}

function serveDrinks(num){
    if (resources["beers"] > 0) {
    resources["cash"] += num*resources["BTquality"]
    resources["beers"] = resources["beers"] - 1
    updateText()
    }
};
function buyBeer(num) {
    if (resources["cash"]>=100) {
    resources["beers"]+=num
    resources["cash"] = resources["cash"] - costs["beer_cost"]
    document.getElementById("inventPopup").style.display="none"
    }
};

function upgradeMinerPickaxe(num){
    if (resources["cash"] >= costs["miner_pickaxe"]*num){
	resources["miner_pickaxe"] += num
	resources["cash"] -= num*costs["miner_pickaxe"]
	
	costs["miner_pickaxe"] *= growthRate["miner_pickaxe"]
	
	updateText()
    }
};

function upgradeBTquality(num){
    if (resources["cash"] >= costs["BTquality"]*num){
	resources["BTquality"] += num
	resources["cash"] -= num*costs["BTquality"]
	
	costs["BTquality"] *= growthRate["BTquality"]
	
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
        
        updateText()
    }
};
function hireMiner(num){
    if (resources["cash"] >= costs["miner"]*num){
	   if (!resources["miner"]){
	       resources["miner"] = 0
	   }
	   if (!resources["miner_pickaxe"]){
	       resources["miner_pickaxe"] = 1
	   }
	   resources["miner"] += num
	   resources["cash"] -= num*costs["miner"]
	
	   costs["miner"] *= growthRate["miner"]
	
	   updateText()

	
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
        if (resources["manager"] == 0) {
            document.getElementById("inventPopup").style.display="block"
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
