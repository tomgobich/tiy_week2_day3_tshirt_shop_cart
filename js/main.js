// Glboal Constants / Variables
const TAX_RATE = 0.065;
var myStorage = localStorage;
var minimizeCartStatus = false;



// DOM Selectors
var cartIconItem1	= document.getElementById('cartIconItem1');
var cartIconItem2	= document.getElementById('cartIconItem2');
var cartIconItem3	= document.getElementById('cartIconItem3');
var itemCart 		= document.getElementById('itemCart');
var itemList 		= document.getElementById('itemList');
var itemTotals		= document.getElementById('itemTotals');
var cartCount		= document.getElementById('cartCount');
var minimizeCart	= document.getElementById('minimizeCart');
var cartTotal 		= document.getElementById('cartTotal');
var taxTotal 		= document.getElementById('taxTotal');
var grandTotal		= document.getElementById('grandTotal');



// Global Arrays
var cart = [];
var items = [
	{
		name: "Save My Trees",
		color: "Blue",
		price: 29
	},
	{
		name: "Nature Lover",
		color: "Pink",
		price: 19
	},
	{
		name: "Forrest Walk",
		color: "Orange",
		price: 39
	}
];



// Hide car by default
itemCart.classList.add('hide-element');



// If local storage for cart exists, load local storage
if(JSON.parse(localStorage.getItem('cart')))
{
	loadLocalStorage();
}



// Interval based call to reload cart item listing, thus updating cart times
setInterval(prepareCartItems, 10000);



// Event listeners
cartIconItem1.addEventListener('click', function()
{
	updateCart( cartIconItem1, items[0]);
});

cartIconItem2.addEventListener('click', function()
{
	updateCart( cartIconItem2, items[1]);
});

cartIconItem3.addEventListener('click', function()
{
	updateCart( cartIconItem3, items[2]);
});

// Specific event listener for minimizing the cart
minimizeCart.addEventListener('click', function()
{
	// Is the cart minimized?
	if(!minimizeCartStatus)
	{
		// No, minimize it
		itemList.classList.add('hide-element');
		itemTotals.classList.add('hide-element');
		minimizeCart.innerHTML = "+";
		minimizeCartStatus = true;
	}
	else 
	{
		// Yes, expand it
		itemList.classList.remove('hide-element');
		itemTotals.classList.remove('hide-element');
		minimizeCart.innerHTML = "-";
		minimizeCartStatus = false;
	}
});



// --------------------------------------------------
// Load data from local storage
// --------------------------------------------------
function loadLocalStorage()
{
	// Load locally saved cart into variable
	var localCart = JSON.parse(localStorage.getItem('cart'));

	// Loop through local cart
	localCart.forEach(function(orderItem, index)
	{
		var itemDetails = getCurrentItem(orderItem);
		var itemElement = itemDetails[0];
		var itemInfo 	= itemDetails[1];

		// Update current state cart to reflect local cart
		updateCart(itemElement, itemInfo, orderItem.date);
	});
}



// --------------------------------------------------
// Clears all local storage and updates cart
// --------------------------------------------------
function clearLocalStorage()
{
	// Clear the local storage
	localStorage.clear();

	// Repeat until the cart is empty
	while(cart.length > 0)
	{
		// Remove first item in cart array
		updateCart(cart[0].element, cart[0].item);
	}
}



// --------------------------------------------------
// Update Cart - All Cart Functionality Starts Here
// --------------------------------------------------	
function updateCart(itemId, itemObject, timestamp)
{
	// Toggles item's status in cart
	setCartStatus(itemId, itemObject, timestamp);

	// Displays items and total in cart box
	editCart();

	// Toggles carts visibility if all items removed or item added
	displayCart();
}



// --------------------------------------------------
// Toggle Item's Status in Cart
// --------------------------------------------------	
function setCartStatus(itemId, itemObject, timestamp)
{
	var itemArrayIndex = -1;
	
	// Is there an existing timestamp?
	if(timestamp === undefined) 
	{
		// No, set timestamp to now
		timestamp = new Date();
	}

	// Loop through cart
	cart.forEach(function(orderItem, index) 
	{
		// Is the current itemObject in the cart?
		if(orderItem.item === itemObject) 
		{
			// Yes, mark this index as current
			itemArrayIndex = index;
		}
	});

	// Was the item found in the cart?
	if(itemArrayIndex === -1 ) 
	{
		// No, add item to cart
		itemId.classList.add('active');
		cart.push({item: itemObject, element: itemId, date: timestamp});
		console.log('+ | Item: ' + itemObject.name + ' was added to the cart on ' + timestamp);
	}
	else
	{
		// No, remove item from cart
		console.log('- | Item: ' + cart[itemArrayIndex].item.name + ' was removed from the cart on ' + timestamp);
		itemId.classList.remove('active');
		cart.splice(itemArrayIndex, 1);
	}

	// Save new cart in local storage
	localStorage.setItem('cart', JSON.stringify(cart));
}



// --------------------------------------------------
// Edit Cart Items & Totals
// --------------------------------------------------	
function editCart()
{
	// Prepares HTML for cart items
	var total = prepareCartItems();

	// Cart total calculations
	var tax 		= total * TAX_RATE;
	var amountDue 	= total + tax;
	total 			= total.toFixed(2);
	tax 			= tax.toFixed(2);
	amountDue		= amountDue.toFixed(2);

	// Price output validation
	total 		= validatePriceOutput(total);
	tax 		= validatePriceOutput(tax);
	amountDue 	= validatePriceOutput(amountDue);

	// Display cart totals
	cartTotal.innerHTML 	= '$ ' 	+ total;
	taxTotal.innerHTML 		= '$ ' 	+ tax;
	grandTotal.innerHTML	= '$ ' 	+ amountDue;
	cartCount.innerHTML		= '(' 	+ cart.length + ')'; 
}



// --------------------------------------------------
// Prepares Cart Item Listing HTML for Display
// --------------------------------------------------	
function prepareCartItems()
{
	var total = 0;

	// Clear item list
	itemList.innerHTML = "";

	// Loop through items in cart - Set appropriate HTML
	cart.forEach(function(orderItem)
	{
		var itemDetails = getCurrentItem(orderItem);
		var itemElement = itemDetails[2];
		var itemInfo = itemDetails[3];
		var itemHTML = 
		`
			<div>
				<p class="item-remove"><a href='#' class='remove' onClick="updateCart(${itemElement}, ${itemInfo})">X</a></p>
				<p class="item-name">${orderItem.item.name}</p>
				<p class="item-color">${orderItem.item.color}</p>
				<p class="item-date">${moment(orderItem.date).fromNow()}</p>
				<p class="item-price">$ ${orderItem.item.price.toFixed(2)}</p>
			</div>
		`;

		// Display item details in cart listing
		itemList.innerHTML += itemHTML;

		// Add item total to running total
		total += orderItem.item.price;
	});

	// Add 'Remove All' feature at end of cart list
	itemList.innerHTML += 
	`
		<div>
			<p class='remove-all'><a href='#' onClick="clearLocalStorage()">X (All)</a></p>
		</div>
	`;

	return total;
}



// --------------------------------------------------
// Gets the current item's details
// --------------------------------------------------
function getCurrentItem(orderItem)
{
	var itemDetails = [];

	// Is it the first item in the item array?
	if(orderItem.item == items[0] || orderItem.item.name == items[0].name) 
	{
		// Yes, mark this one as active
		itemDetails = [cartIconItem1, items[0], "cartIconItem1", "items[0]"];
		return itemDetails;
	}
	// Is it the second item in the item array?
	else if(orderItem.item == items[1] || orderItem.item.name == items[1].name)
	{
		// Yes, mark this one as active
		itemDetails = [cartIconItem2, items[1], "cartIconItem2", "items[1]"];
		return itemDetails;
	}
	// Is it the third item in the item array?
	else if(orderItem.item == items[2] || orderItem.item.name == items[2].name)
	{
		// Yes, mark this one as active
		itemDetails = [cartIconItem3, items[2], "cartIconItem3", "items[2]"];
		return itemDetails;
	}
}



// --------------------------------------------------
// Validates Price Outputs - Ensures all are above 0
// --------------------------------------------------
function validatePriceOutput(price)
{
	// Price somehow less than zero?
	if(price < 0)
	{
		// Set as zero
		return 0;
	}

	return price;
}



// --------------------------------------------------
// Toggle Cart Visibility | 0 = hidden, 1+ = show
// --------------------------------------------------
function displayCart()
{
	// Are there any items in the cart?
	if(cart.length < 1)
	{
		// No, don't show the cart
		itemCart.classList.add('hide-element');
	}
	else
	{
		// Yes, show the cart
		itemCart.classList.remove('hide-element');
	}
}