//obtenir le Local storage créé en page product
// pour pouvoir afficher le panier
function get_local_storage() {
    let local_storage = JSON.parse(localStorage.getItem("panier"));
   // let id = GetId();
    return (local_storage);
}

function supprimer(){
  let local_storage = get_local_storage();
  const del = document.getElementsByClassName('deleteItem');
  const item = document.getElementsByTagName('article');
  const items = document.getElementById('cart__items');
  for (let i = 0; i < del.length; i++){
  //console.log(del[i]);
  del[i].addEventListener('click', function () {
    let this_item = item[i]
    let product = {id:this_item.dataset.id , color:this_item.dataset.color};
    console.log(product);
    let check_ls = (element) => element.id == product.id && element.color == product.color;
    let y = local_storage.findIndex(check_ls)
    console.log(y);
    local_storage.splice(y,1);
    if (local_storage.length == 0){
      localStorage.removeItem("panier");
    }
    else
    localStorage.setItem("panier", JSON.stringify(local_storage));
    console.log(this_item);
    //location.reload()  
    this_item.remove();

  });}
}

function input_change(data){
  const quantity = document.getElementsByClassName("itemQuantity");
  let local_storage = get_local_storage();
  const item = document.getElementsByTagName('article');
  for (let i = 0; i < quantity.length; i++){
  quantity[i].addEventListener('change', function(){
    let price = data.price*quantity.value;
    let product = {id:item[i].dataset.id , color:item[i].dataset.color};
    let check_ls = (element) => element.id == product.id && element.color == product.color;
    let y = local_storage.findIndex(check_ls)
    local_storage[y].quantity = quantity[i].value;
    localStorage.setItem("panier", JSON.stringify(local_storage));
console.log("on est la");
  });
}}
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
    article.dataset.id = local_storage.id;
    article.dataset.color = local_storage.color;
    item_img.classList.add('cart__item__img');
    item_content.classList.add('cart__item__content');
    content_description.classList.add('item__content__description');
    content_settings.classList.add('cart__item__content__settings');
    settings_quantity.classList.add('cart__item__content__settings__quantity');
    settings_delete.classList.add('cart__item__content__settings__delete');
    
    console.log(data.name);
    item_img.innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
    content_description.innerHTML = `<h2>${data.name}</h2><p>${local_storage.color}</p><p>${price} €</p>`;

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
input_change(data);
}

function total(len,price){
  let total_Quantity = document.getElementById('totalQuantity'); 
  if (len == 1){
    let html = `<p>Total (<span id = "totalQuantity">${len}</span> article) : 
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
    for (let i = 0; i < local_storage.length; i++){console.log(local_storage[i].id)};
    for (let i = 0; i < local_storage.length; i++){
        fetch(`http://localhost:3000/api/products/${local_storage[i].id}`)
            .then((response) => {
                if (response.status == 404) {
                    console.log('404');
                } else if (response.ok) {
                    response.json().then((data) => {
                      price += data.price;
                      console.log(local_storage[i].id);
                      console.log(price);
                      console.log(local_storage.length);
                        total(len,price);
                        display_html(data,local_storage[i],len,price);
                        supprimer();
                    })
                }

            })
            .catch(function (err) {
                // some error here
            })
    }
}
function verif(s){
  for (let i = 0; i < s.length; i++){
    if (s[i] != [A-Za-z])
    return (nas);
  }
  for (let i = 0; i < s.length; i++){
    if (s[i] == @)
    return (email);
  }
  return 0;
}

function set_errorHTML(){
  const first_name = document.getElementById();
  const last_name = document.getElementById();
  const address = document.getElementById();
  const email = document.getElementById();
  
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

function param_order(){
  let contact = get_contact();
  let products = get_all_id();
  let order = {contact, products};
  return order;
}

function post(){
  let order = param_order();
    fetch("http://localhost:3000/api/products/order", {
    // Adding method type
    method: "POST",
    // Adding body or contents to send
    body: JSON.stringify(order),
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
console.log(get_local_storage());
