// Glboal Constants / Variables
const TAX_RATE = 0.065;
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
		price: 29,
		inCart: false
	},
	{
		name: "Nature Lover",
		price: 19,
		inCart: false
	},
	{
		name: "Forrest Walk",
		price: 39,
		inCart: false
	}
];



// Hide car by default
itemCart.classList.add('hide-element');



// Event listeners
cartIconItem1.addEventListener('click', function() {
	updateCart( cartIconItem1, 0);
});

cartIconItem2.addEventListener('click', function() {
	updateCart( cartIconItem2, 1);
});

cartIconItem3.addEventListener('click', function() {
	updateCart( cartIconItem3, 2);
});

minimizeCart.addEventListener('click', function() {

	// Is the cart minimized?
	if( !minimizeCartStatus ) 
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
// Update Cart - All Cart Functionality Starts Here
// --------------------------------------------------	
function updateCart( itemId, itemIndex ) {

	// Toggles item's status in cart
	setCartStatus( itemId, itemIndex );

	// Displays items and total in cart box
	var itemInCart = editCart();

	// Toggles carts visibility if all items removed or item added
	displayCart( itemInCart );

}



// --------------------------------------------------
// Toggle Item's Status in Cart
// --------------------------------------------------	
function setCartStatus( itemId, itemIndex ) {

	// Was the item previously in the cart?
	if( !items[itemIndex].inCart ) 
	{
		// No, add item to cart
		itemId.classList.add('active');
		items[itemIndex].inCart = true;
	}
	else 
	{
		// Yes, remove item from cart
		itemId.classList.remove('active');
		items[itemIndex].inCart = false;
	}

}



// --------------------------------------------------
// Edit Cart Items & Totals
// --------------------------------------------------	
function editCart() {

	var itemInCart = false;
	var total = 0;
	var tax = 0;
	var amountDue = 0;
	var cartItemCount = 0;
	var itemsLength = items.length;
	itemList.innerHTML = "";			// Clear item list

	// Loop through items array
	for(var i = 0; i < itemsLength; i++) {

		// Is the item in the cart?
		if( items[i].inCart ) 
		{
			// Yes, display item in cart item list
			var item = "<p>" + items[i].name + "<span>$ " + items[i].price + "</span></p>";
			itemList.innerHTML += item;

			// Add item total to running total
			total += items[i].price;

			// Increment cart count by one
			cartItemCount++;

			// Mark the cart as having at least one item in it
			itemInCart = true;
		}

	}

	// Cart total calculations
	tax 		= total * TAX_RATE;
	amountDue 	= total + tax;
	total 		= total.toFixed(2);
	tax 		= tax.toFixed(2);
	amountDue	= amountDue.toFixed(2);


	// Display cart totals
	cartTotal.innerHTML 	= '$ ' 	+ total;
	taxTotal.innerHTML 		= '$ ' 	+ tax;
	grandTotal.innerHTML	= '$ ' 	+ amountDue;
	cartCount.innerHTML		= '(' 	+ cartItemCount	+ ')'; 

	// Return whether at least one item is in the cart
	return itemInCart;

}



// --------------------------------------------------
// Toggle Cart Visibility | 0 = hidden, 1+ = show
// --------------------------------------------------
function displayCart( itemInCart ) {

	// Are there any items in the cart?
	if( !itemInCart )
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