// SELECT CSS WITH JS
const productsDOM = document.querySelector('.product-center');
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const overlay = document.querySelector('.overlay');
const clearCartBtn = document.querySelector('.clear-cart');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartDOM = document.querySelector('.cart');
const cartContent = document.querySelector('.cart-content');

let cart = [];

let buttonsDOM = [];

class Products {
	async getProducts() {
		try {
			let result = await fetch("products.json");
			let data = await result.json();
			let products = data.items;

			products = products.map((item) => {
				const id = item.id;
				const name = item.name;
				const price = item.price;
                const image = item.image;
				return {
					name,
					price,
					id,
					image,
				};
			});
			return products;
		} catch (error) {
			console.log(error);
		}
	}
}

// UI
class UI {
    displayProducts(products) {
        let result = "";
        products.forEach((product) => {
            result += `<div class="product">
            <div class="img-container">
                <img src=${product.image} alt="" class="product-img">
            </div>
            <h3>${product.name}</h3>
            <div class="caption">
                <h4 class="price">$${product.price}</h4>
                <button class="atc" data-id=${product.id}>add to cart</button>
            </div>
        </div>`;
        });
        productsDOM.innerHTML = result;
    }
    getAtcButtons() {
        const buttons = [...document.querySelectorAll('.atc')];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if(inCart) {
                button.innerText = "IN CART";
                button.disabled = true;
            }
            button.addEventListener('click', event => {
                event.target.innerText = "IN CART";
                event.target.disabled = true;
                
                let cartItem = {...Storage.getProduct(id), amount: 1};
                
                cart = [...cart, cartItem];
                console.log(cart);

                //SAVE CART TO LOCAL STORAGE
                Storage.saveCart(cart);
                // SET CART VALUES
                this.setCartValues(cart);
                // DISPLAY CART ITEM
                this.addCartItem(cartItem);

       
            
            });
        });
    }
    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map((item) => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        })
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }
    addCartItem(item) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `<img src=${item.image} alt="" />
        <div>
            <h4>${item.name}</h4>
            <h5>$${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>remove-item</span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>`;
        cartContent.appendChild(div);
    }
    showCart() {
        overlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    }
    hideCart() {
        overlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }
    removeItem(id) {
        cart = cart.filter((item) => { item.id !== id});
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `add to cart`;
    }
    clearCart() {
        let cartItems = cart.map((item) => item.id);
        cartItems.forEach((id) => this.removeItem(id));
        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();

    }
    getSingleButton(id) {
        return buttonsDOM.find((button) => button.dataset.id == id);
    }
    populateCart(cart) {
        cart.forEach(item =>  this.addCartItem(item));
    }
    // SETUP
    setupAPP() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart);
    }
    // CART LOGIC
    cartLogic() {
        clearCartBtn.addEventListener('click', () => {
            this.clearCart();
        })

        // CART FUNCTIONALITY
        cartContent.addEventListener('click', (e) => {
            if(e.target.classList.contains('remove-item')) {
                let removeItem = e.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
            } else if (e.target.classList.contains('fa-chevron-up')) {
                let addAmount = e.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item =>  item.id == id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
                tempItem.amountl
            } else if (e.target.classList.contains('fa-chevron-down')) {
                let lowerAmount = e.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id == id);
                tempItem.amount = tempItem.amount - 1;
                console.log(tempItem);
                if (tempItem.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                }
                else {
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                }
            }

        })
    }
}

class Storage {
    static saveProducts(cart) {
        localStorage.setItem("products", JSON.stringify(cart));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find((product) => product.id == id);
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart() {
        return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem('cart')) :[];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const products = new Products();

    //Intialize
    ui.setupAPP();

    products.getProducts().then(data => {
        ui.displayProducts(data);
        Storage.saveProducts(data);
    }).then( () => {
        ui.getAtcButtons();
        ui.cartLogic();
    })
})