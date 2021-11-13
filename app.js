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
                console.log(cartItem);
                
               
            
            });
        });
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
}

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const products = new Products();

    products.getProducts().then(data => {
        ui.displayProducts(data);
        Storage.saveProducts(data);
    }).then( () => {
        ui.getAtcButtons();
    })
})