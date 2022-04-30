//obtenir le Local storage créé en page product
// pour pouvoir afficher le panier
function get_local_storage() {
    let local_storage = JSON.parse(localStorage.getItem("panier"));
   // let id = GetId();
    return (local_storage);
}
//préparer le html qui va construire le panier
function display_html(data,local_storage) {

    let price = data.price * local_storage.quantity;
    const cart_item = document.getElementById('cart__items');
    const article = document.createElement('article');
    const item_img = document.createElement('div');
    const item_content = document.createElement('div');
    const content_description = document.createElement('div');
    const content_settings = document.createElement('div');
    const settings_quantity = document.createElement('div');
    const settings_delete = document.createElement('div');
    
    article.classList.add('cart__item');
    article.setAttribute('data-id', '{product-ID}');
    article.setAttribute('data-color', '{product-color}');
    item_img.classList.add('cart__item__img');
    item_content.classList.add('cart__item__content');
    content_description.classList.add('item__content__description');
    content_settings.classList.add('cart__item__content__settings');
    settings_quantity.classList.add('cart__item__content__settings__quantity');
    settings_delete.classList.add('cart__item__content__settings__delete');
    
    console.log(data.name);
    item_img.innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
    content_description.innerHTML = `<h2>${data.name}</h2><p>${local_storage.color}</p><p>${price}</p>`;

    settings_quantity.innerHTML = `<p>Qté : </p> <input type="number" class="itemQuantity" 
    name="${data.name}" min="1" max="100" value="${local_storage.quantity}">`;

    settings_delete.innerHTML = `<p class="deleteItem">Supprimer</p>`;
  
    cart_item.appendChild(article);
        article.appendChild(item_img);
        article.appendChild(item_content);
            item_content.appendChild(content_description);
            item_content.appendChild(content_settings);
            content_settings.appendChild(settings_quantity);
            content_settings.appendChild(settings_delete);
}

function total(len,price){
  let total_Quantity = document.getElementById('totalQuantity'); 
  if (len == 1){
    let html = `<p>Total (<span id="totalQuantity">${len}</span> article) : 
    <span id="totalPrice"><!-- 84,00 --></span> €</p>`
    let insert = document.getElementsByClassName('cart__price');
    insert[0].innerHTML = html;
  }
  total_Quantity.innerText = len;
  let total_Price = document.getElementById('totalPrice');
  total_Price.innerText = price;
}


function get_Price() {
    let local_storage = get_local_storage();
    let id = local_storage.id;
    let price = 0;
    let len = local_storage.length;
    for (let i = 0; i < local_storage.length; i++){
        fetch(`http://localhost:3000/api/products/${local_storage[i].id}`)
            .then((response) => {
                if (response.status == 404) {
                    console.log('404');
                } else if (response.ok) {
                    response.json().then((data) => {
                      price += data.price;
                      console.log(price);
                      console.log(local_storage.length);
                        total(len,price);
                        display_html(data,local_storage[i],len,price);
                    })
                }

            })
            .catch(function (err) {
                // some error here
            })
    }
}

function get_contact(){
    const first_Name = document.getElementById("firstName").value;
    const last_Name = document.getElementById("lastName").value;
    const form_address = document.getElementById("address").value;
    const form_city = document.getElementById("city").value;
    const form_email = document.getElementById("email").value;
    let contact = {firstName: first_Name, lastname:last_Name, address: form_address, email: form_email};
    console.log(contact);
    return(contact);
}

function post(){
    fetch("http://localhost:3000/api/products/order", {
    // Adding method type
    method: "POST",
    // Adding body or contents to send
    body: JSON.stringify({
               
    }),
     
    // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
})
// Converting to JSON
.then(response => response.json())
// Displaying results to console
.then(json => console.log(json));
}

get_contact();
get_Price();
