// SELECT CSS WITH JS
const productsDOM = document.querySelector(".product-center");
const cartBtn = document.querySelector(".cart-btn");
const cartItems = document.querySelector(".cart-items");
const overlay = document.querySelector(".overlay");
const cartDOM = document.querySelector(".cart");
const closeCartBtn = document.querySelector(".close-cart");
const cartContent = document.querySelector(".cart-content");
const clearCartBtn = document.querySelector(".clear-cart");
const cartTotal = document.querySelector(".cart-total");

let cart = [];

// Products
class Products {
	async getProducts() {
		try {
			let result = await fetch("products.json");
			let data = await result.json();
			let products = data.items;

			products = products.map((item) => {
				const name = item.name;
				const id = item.id;
				const price = item.price;
				const image = item.image;

				return { name, id, price, image };
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

		products.forEach((data) => {
			result += ` <div class="product">
          <div class="img-container">
              <img
                  src="${data.image}"
                  alt="yellow-chair"
                  class="product-img"
              />
          </div>
          <h3>${data.name}</h3>
          <div class="caption">
              <p class="price">$${data.price}</p>
              <button class="atc" data-id=${data.id}>ADD TO CART</button>
          </div>
      </div> `;
		});
		productsDOM.innerHTML = result;
	}
	showCart() {
		overlay.classList.add("transparentBcg");
		cartDOM.classList.add("showCart");
	}
	hideCart() {
        overlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }
    cartBtn() {
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart);
    }
}

document.addEventListener("DOMContentLoaded", () => {
	const ui = new UI();
	const products = new Products();
	// setup app
    
	// get all products
	products.getProducts().then((data) => {
		ui.displayProducts(data);
        ui.cartBtn();
	});
});
