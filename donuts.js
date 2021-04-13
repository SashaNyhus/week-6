const MAIN_MENU = `Welcome to Marion's Donut Shop!
What would you like to do?
(1) Print current donut inventory and prices
(2) Print current donut sales and total revenue
(3) Create new donut type
(4) Add donuts to inventory
(5) Order donuts
(6) Quit program`;

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
			//createNewDonut();
			break;
		case "4":
			let donutToAdd = getDonutChoice(shopInventory, false);
			if(donutToAdd === null){
				alert("Action cancelled");
				break;
			}
			let quantityToAdd = getDonutQuantity(donutToAdd, false);
			if(quantityToAdd === 0){
				alert("Action cancelled")
				break;
			}
			let additionConfirmed = confirm(`${quantityToAdd} ${donutToAdd["donutName"]}(s) will be added to shop inventory`);
			if(additionConfirmed){
				addDonuts(donutToAdd, quantityToAdd);
			}
			break;
		case "5":
			let donutToBuy = getDonutChoice(shopInventory, true);
			if (donutToBuy === null){
				alert("Order cancelled");
				break;
			}
			let orderQuantity = getDonutQuantity(donutToBuy, true);
			if (orderQuantity === 0){
				alert("Order cancelled");
				break;
			}
			let orderPrice = getOrderPrice(donutToBuy, orderQuantity);
			let orderConfirmed = confirmOrder(donutToBuy, orderQuantity, orderPrice);
			if(orderConfirmed) {
				recordOrder(donutToBuy, orderQuantity, orderPrice);
				alert("Thank you for your purchase!");
			}
			break;
		case "6":
		case null:
			break menuLoop;
		case "7":
			//recordRandomOrders();
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

function addDonuts(donutObject, quantity){
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
