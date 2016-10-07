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



// Array of shop items
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

// Array for cart
var cart = [];



// Hide car by default
itemCart.classList.add('hide-element');



if(JSON.parse(localStorage.getItem('cart')))
{
	loadLocalData();
}



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



function loadLocalData()
{
	var localCart = JSON.parse(localStorage.getItem('cart'));

	localCart.forEach(function(orderItem, index)
	{
		console.log('Line 100');
		console.log(orderItem);
		var itemDetails = getCurrentItem(orderItem);
		var itemElement = itemDetails[0];
		var itemInfo 	= itemDetails[1];

		updateCart(itemElement, itemInfo, orderItem.date);
	});
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

	// // Toggles carts visibility if all items removed or item added
	displayCart();
}



// --------------------------------------------------
// Toggle Item's Status in Cart
// --------------------------------------------------	
function setCartStatus(itemId, itemObject, timestamp)
{
	var itemArrayIndex = -1;
	var cartItem = {
		item: itemObject,
		element: itemId,
		date: timestamp
	};

	if(timestamp == "") {
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
	if(itemArrayIndex === -1) 
	{
		// No, add item to cart
		itemId.classList.add('active');
		cart.push(cartItem);

		console.log('+ | Item: ' + itemObject.name + ' was added to the cart on ' + timestamp);
	}
	else 
	{
		// Yes, remove item from cart
		console.log('- | Item: ' + cart[itemArrayIndex].item.name + ' was removed from the cart on ' + timestamp);
		itemId.classList.remove('active');
		cart.splice(itemArrayIndex, 1);
	}

	//localStorage.setItem( 'car', JSON.stringify(car) );
	//console.log( JSON.parse( localStorage.getItem( 'car' ) ) );

	localStorage.setItem('cart', JSON.stringify(cart));
	console.log(JSON.parse(localStorage.getItem('cart')));
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
				<p>${orderItem.item.name}</p>
				<p>${orderItem.item.color}</p>
				<p>${moment(orderItem.date).fromNow()}</p>
				<a href='#' class='remove' onClick="updateCart(${itemElement}, ${itemInfo})">Remove</a>
				<p>$ ${orderItem.item.price.toFixed(2)}</p>
			</div>
		`;

		// Display item details in cart listing
		itemList.innerHTML += itemHTML;

		// Add item total to running total
		total += orderItem.item.price;
	});

	return total;
}



// --------------------------------------------------
// Validates Price Outputs - Ensures all are above 0
// --------------------------------------------------	
function validatePriceOutput(price)
{
	if(price < 0)
	{
		return 0;
	}

	return price;
}



function getCurrentItem(orderItem)
{
	var itemDetails = [];

	if(orderItem.item == items[0] || orderItem.item.name == items[0].name) 
	{
		itemDetails = [cartIconItem1, items[0], "cartIconItem1", "items[0]"];
		return itemDetails;
	}
	else if(orderItem.item == items[1] || orderItem.item.name == items[1].name)
	{
		itemDetails = [cartIconItem2, items[1], "cartIconItem2", "items[1]"];
		return itemDetails;
	}
	else if(orderItem.item == items[2] || orderItem.item.name == items[2].name)
	{
		itemDetails = [cartIconItem3, items[2], "cartIconItem3", "items[2]"];
		return itemDetails;
	}
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