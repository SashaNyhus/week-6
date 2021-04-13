const MAIN_MENU = `Welcome to Marion's Donut Shop!
What would you like to do?
(1) Print current donut inventory and prices
(2) Print current donut sales and total revenue
(3) Create new donut type
(4) Add donuts to inventory
(5) Order donuts
(6) Generate random orders 
(7) Quit program`;

class donutData {
	donutName;
	donutPrice;
	donutQuantityInStore;
	donutQuantitySold;
	donutIndividualRevenue;
	
	constructor(name, price, quantity){
		this.donutName = name;
		this.donutPrice = price;
		this.donutQuantityInStore = quantity;
		this.donutQuantitySold = 0;
		this.donutIndividualRevenue = 0;
	}
}
var shopRevenue = 0;
var shopTotalSold = 0;
var shopInventory = {
	glazed: new donutData("Glazed Donut", .88, 36),
	jelly: new donutData("Jelly-Filled Donut", 1.1, 24),
	cream: new donutData("Butter-cream Bismark", 1, 24),
	maple: new donutData("Maple Bar", 1, 24),
	apple: new donutData("Apple Fritter", 1, 24),
	hole: new donutData("Donut Hole", .5, 48),
}


console.log(shopInventory)


mainMenu();

function mainMenu() {
	menuLoop: 
	while(true){
	let input = prompt(MAIN_MENU, "")
	switch(input){
		case "1":
			printInventory(shopInventory);
			break;
		case "2":
			printRevenue(shopRevenue, shopInventory);
			break;
		case "3":
			createNewDonut(shopInventory);
			break;
		case "4":
			addDonuts(shopInventory);
			break;
		case "5":
			orderDonuts(shopInventory);
			break;
		case "6":
			recordRandomOrders(shopRevenue, shopInventory);
			break;
		case "7":
		case null:
			break menuLoop;
		default:
			alert("Please enter a number from 1-6")
			break;
	}
	}
}

function printInventory(inventoryObject){
	let messageToPrint = [];
	let keyArray = Object.keys(inventoryObject);
	keyArray.forEach( function(donutEntry) { 
		messageToPrint.push(inventoryObject[donutEntry]["donutName"] + ": " + inventoryObject[donutEntry]["donutQuantityInStore"] + " in inventory, priced at " + convertToDollars(inventoryObject[donutEntry]["donutPrice"]) + " each.")
	})
	alert(messageToPrint.join("\n")); 
	return;	
}

function printRevenue(revenueTotal, inventoryObject){
	let messageToPrint = [`Total shop revenue is ${convertToDollars(revenueTotal)}, from ${ shopTotalSold} donut(s) sold`];
	let keyArray = Object.keys(inventoryObject);
	keyArray.forEach( function(donutEntry){
		messageToPrint.push(`${convertToDollars(inventoryObject[donutEntry]["donutIndividualRevenue"])} from ${inventoryObject[donutEntry]["donutQuantitySold"]} ${inventoryObject[donutEntry]["donutName"]}(s) sold`)
	});
	alert(messageToPrint.join("\n"))
	return;
}

function createNewDonut(inventoryObject){
	let cancelAlert = "Donut creation cancelled";
	let progressDisplay = "";
	let name = "";
	let price = "";
	let initialQuantity = "";
	let key = "";
	name = getNewDonutName(inventoryObject);
	if(name === null){
		alert(cancelAlert);
		return;
	}
	progressDisplay = `New Donut Name: ${name} \n`;
	price = getNewDonutPrice(progressDisplay);
	if(price === null){
		alert(cancelAlert);
		return;
	}
	progressDisplay += `New Donut Price: ${convertToDollars(price)} \n`;
	initialQuantity = getNewDonutQuantity(progressDisplay);
	if(initialQuantity === null){
		alert(cancelAlert);
		return;
	}
	progressDisplay += `New Donut Quantity: ${initialQuantity} \n`;
	key = getNewDonutKey(inventoryObject, progressDisplay);
	if(key === null){
		alert(cancelAlert);
		return;
	}
	progressDisplay += `New Donut Key: ${key} \n`;
	if( confirm(progressDisplay + "Confirm creation of new donut type?") ){
		inventoryObject[key] = new donutData(name, price, initialQuantity);
		alert(`${name} successfully added to shop!`);
		return;
	}
	alert(cancelAlert);
	return;
}

function getNewDonutName(inventoryObject){
	let newDonutName = ""
	let keyArray = Object.keys(inventoryObject);
	let inUse = false;
	while(true){
		newDonutName = prompt("What is the display name for the new donut?", "");
		keyArray.forEach(function(donutEntry){
			if(inventoryObject[donutEntry]["donutName"] === newDonutName){
				inUse = true;
			}
			return;
		})
		if(inUse){
			alert("That name is already in use. Please choose another");
			continue;
		}
		break;
	}
	return newDonutName;
}

function getNewDonutPrice(donutProgress){
	let price = "";
	while(true){
		price = prompt(donutProgress + "What is the price of the new donut?", "");
		if(price === null){
			break;
		}
		price = Number(price);
		if( isNaN(price) || price < 0 ){
			alert("Price must be a positive number");
			continue;
		}
		break;
	}
	return price;
}

function getNewDonutQuantity(donutProgress){
	let quantity = ""
	while(true){
		quantity = prompt(donutProgress + "How many of the new type of donut would you like to add to store inventory?", "");
		if(quantity === null){
			break;
		}
		quantity = Number(quantity);
		if( isNaN(quantity) || quantity < 0 || (Math.floor(quantity) != quantity) ){
			alert("Quantity must be a positive, whole number (Type '0' if you do not want to add donuts)");
			continue;
		}
		break;
	}
	return quantity;
}

function getNewDonutKey(inventoryObject, donutProgress){
	let newKey = ""
	while(true){
		newKey = prompt(donutProgress + "Enter a short, one-word key to easily access the new donut type. \n Key is not case sensitive and cannot already be associated with another donut type", "");
		if(newKey === null){
			break;
		}
		newKey = newKey.toLowerCase();
		if (newKey in inventoryObject){
			let keysInUseMessage = `Sorry, that key is already in use. Please choose a different key. \n All current keys in use are: ${Object.keys(inventoryObject).join(", ")}`
			alert(keysInUseMessage);
			continue;
		}
		break;
	}
	return newKey;
}

function addDonuts(inventoryObject){
	let donutToAdd = getDonutChoice(inventoryObject, false);
	if(donutToAdd === null){
		alert("Action cancelled");
		return;
	}
	let quantityToAdd = getDonutQuantity(donutToAdd, false);
	if(quantityToAdd === 0){
		alert("Action cancelled")
		return;
	}
	let additionConfirmed = confirm(`${quantityToAdd} ${donutToAdd["donutName"]}(s) will be added to shop inventory`);
	if(additionConfirmed){
		recordDonutAddition(donutToAdd, quantityToAdd);
	}
	return;
}

function orderDonuts(inventoryObject){
	let donutToBuy = getDonutChoice(inventoryObject, true);
	if (donutToBuy === null){
		alert("Order cancelled");
		return;
	}
	let orderQuantity = getDonutQuantity(donutToBuy, true);
	if (orderQuantity === 0){
		alert("Order cancelled");
		return;
	}
	let orderPrice = getOrderPrice(donutToBuy, orderQuantity);
	let orderConfirmed = confirmOrder(donutToBuy, orderQuantity, orderPrice);
	if(orderConfirmed) {
		recordOrder(donutToBuy, orderQuantity, orderPrice);
		alert("Thank you for your purchase!");
	}
	else{
		alert("Order cancelled")
	}
	return;
}

function recordRandomOrders(revenueTotal, inventoryObject){
	let keyArray = Object.keys(inventoryObject);
	let ordersToGenerate = Number( prompt("How many random orders would you like to generate?", "") );
	if(isNaN(ordersToGenerate)){
		alert("Not a number; action canclled");
		return;
	}
	for(let i = 0; i < ordersToGenerate; i++){
		let donutChoice = inventoryObject[keyArray[getRandomNumber(0, (keyArray.length - 1))]];
		let donutQuantity = getRandomNumber(1, (donutChoice["donutQuantityInStore"]));
		let orderPrice = getOrderPrice(donutChoice, donutQuantity);
		recordOrder(donutChoice, donutQuantity, orderPrice);
	}
	alert(`${ordersToGenerate} order(s) recorded`)
	return;
}

function getDonutChoice(inventoryObject, purcahse){
	let donutChoice;
	let keyArray = Object.keys(inventoryObject);
	let optionsDisplay = [`Enter the item key for the donut you wish to ${purcahse ? "purchase": "add"} (listed in parentheses)`];
	keyArray.forEach( function(donutEntry){
		optionsDisplay.push(`(${donutEntry}) ${inventoryObject[donutEntry]["donutName"]}, ${convertToDollars(inventoryObject[donutEntry]["donutPrice"])} each`)
	});
	optionsDisplay = optionsDisplay.join("\n");
	while(true){
		donutChoice = (prompt(optionsDisplay, "").toLowerCase());
		if (donutChoice in inventoryObject){
			break;
		}
		else if (donutChoice === null){
			break;
		}
		else {
			alert("Key not recognized. Try again or cancel order.");
			continue;
		}
	}
	donutChoice = inventoryObject[donutChoice];
	return donutChoice;
}

function getDonutQuantity(donutObject, purchase){
	let quantity = 0;
	while(true){
		quantity = Number( prompt(`Enter the quantity of ${donutObject["donutName"]}s you would like to ${purchase ? "purchase": "add to inventory"}`, "") );
		if (isNaN(quantity) || (quantity < 0) || (Math.floor(quantity) != quantity)){
			alert("Please enter a positive, whole number");
			continue;
		}
		else if (purchase && donutObject["donutQuantityInStore"] < quantity){
			quantity = donutObject["donutQuantityInStore"];
			alert(`Sorry, we only have ${quantity} ${donutObject["donutName"]}(s) in the store. Your order has been changed to ${quantity} donuts.`)
		}
		break;
	}
	return quantity;
}

function recordDonutAddition(donutObject, quantity){
	donutObject["donutQuantityInStore"] += quantity;
}

function getOrderPrice(donutObject, quantity){
	return (donutObject["donutPrice"] * quantity);
}

function confirmOrder(donutObject, quantity, price){
	let confirmationMessage = `Confirm order of ${quantity} ${donutObject["donutName"]}(s) for ${convertToDollars(price)}?`
	return confirm(confirmationMessage);
}

function recordOrder(donutObject, quantity, price){
	donutObject["donutQuantityInStore"] -= quantity;
	donutObject["donutQuantitySold"] += quantity;
	donutObject["donutIndividualRevenue"] += price;
	shopTotalSold += quantity;
	shopRevenue += price;
	return;
}

function convertToDollars(x){
	return "$" + Number.parseFloat(x).toFixed(2);
}

function getRandomNumber(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
}



// early version of random orders, decided I didn't have time to include adding more donuts
// function recordRandomOrders(revenueTotal, inventoryObject){
// 	let keyArray = Object.keys(inventoryObject);
// 	let totalDonuts = "";
// 	let quantityMessage = "";
// 	let addMoreDonuts = "";
// 	keyArray.forEach( function(donutEntry){
// 		totalDonuts += inventoryObject[donutEntry]["donutQuantityInStore"];
// 	})
// 	quantityMessage = `There are currently ${totalDonuts} in the store. \n (1) Generate random orders now \n (2) Add more donuts first \n (3) Cancel`;
// 	while(true){
// 		let input = prompt(quantityMessage, "")
// 		switch (input){
// 			case "1":
// 				break;
// 			case "2":
// 				while( isNaN(addMoreDonuts) || (Math.floor(addMoreDonuts) != addMoreDonuts) ){
// 					addMoreDonuts = Number(prompt("Type a quantity of donuts to add to all types", ""))
// 				}
// 		}
// 	}
// }