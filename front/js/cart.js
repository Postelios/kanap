//obtenir le Local storage créé en page product
// pour pouvoir afficher le panier
function get_local_storage() {
  let local_storage = JSON.parse(localStorage.getItem("panier"));
  // let id = GetId();
  return (local_storage);
}

function supprimer() {
  let local_storage = get_local_storage();
  const del = document.getElementsByClassName('deleteItem');
  const cart_items = document.getElementById('cart__items');
  for (let i = 0; i < del.length; i++) {
    del[i].addEventListener('click', function (element) {
      const items = document.getElementsByTagName('article');
      let this_item = element.srcElement;
      let article = this_item.parentNode.parentNode.parentNode.parentNode;
      console.log(article);
      let product = { id: article.dataset.id, color: article.dataset.color };
      console.log(product);
      let check_ls = (element) => element.id == product.id && element.color == product.color;
      let y = local_storage.findIndex(check_ls)
      console.log(y);
      local_storage.splice(y, 1);
      if (local_storage.length == 0) {
        localStorage.removeItem("panier");
      }
      else
        localStorage.setItem("panier", JSON.stringify(local_storage));
      console.log(items);
      //location.reload()  
      cart_items.removeChild(article);
    });
  }
}

function input_change(price) {
  const quantity = document.getElementsByClassName("itemQuantity");
  let local_storage = get_local_storage();
  const cart_items = document.getElementById('cart__items');
  for (let i = 0; i < quantity.length; i++) {
    quantity[i].addEventListener('change', function (element) {
      let this_item = element.target;
      console.log(this_item);
      let article = this_item.parentNode.parentNode.parentNode.parentNode;
      console.log(article);
      let product = { id: article.dataset.id, color: article.dataset.color };
      let check_ls = (element) => element.id == product.id && element.color == product.color;
      let y = local_storage.findIndex(check_ls)
      if (this_item.value == 0) {
        local_storage.splice(y, 1);
        cart_items.removeChild(article);
        if (local_storage.length == 0) {
          localStorage.removeItem("panier");
          return;
        }
      }
      else {
        local_storage[y].quantity = this_item.value;
      }
      localStorage.setItem("panier", JSON.stringify(local_storage));
    });
  }
  return;
}
//préparer le html qui va construire le panier
function display_html(data, local_storage) {

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
}

function total(len, price) {
  let total_Quantity = document.getElementById('totalQuantity');
  if (len == 1) {
    let html = `<p>Total (<span id = "totalQuantity">${len}</span> article) : 
    <span id="totalPrice"><!-- 84,00 --></span> €</p>`
    let insert = document.getElementsByClassName('cart__price');
    insert[0].innerHTML = html;
  }
  total_Quantity.innerText = len;
  let total_Price = document.getElementById('totalPrice');
  total_Price.innerText = price;
}

async function get_Price() {
  let local_storage = get_local_storage();
  //let id = local_storage.id;
  // console.log('test'+id);
  let prices = [];
  let len = local_storage.length;
  for (let i = 0; i < local_storage.length; i++) { console.log(local_storage[i].id) };
  for (let i = 0; i < local_storage.length; i++) {
    try {
      var response = await fetch(`http://localhost:3000/api/products/${local_storage[i].id}`);

      //    .then((response) => {
      if (response.status == 404) {
        console.log('404');
      } else if (response.ok) {
        var data = await response.json()//.then((data) => {
        //console.log(local_storage[i].id);
        //console.log(local_storage.length);
        prices.push({id:local_storage[i].id, price:data.price});
        //total(len, price);
        display_html(data, local_storage[i], len, data.price);
        //})
      }

    }
    catch (err) {
      console.error(err)
      // some error here
    }
  }
  return prices;
}


function set_errorHTML() {
  const first_name = document.getElementById('firstName');
  const first_name_err = document.getElementById('firstNameErrorMsg');
  const last_name = document.getElementById('lastName');
  const last_name_err = document.getElementById('lastNameErrorMsg');
  const address = document.getElementById('address');
  const address_err = document.getElementById('addressErrorMsg');
  const city = document.getElementById('city');
  const city_err = document.getElementById('cityErrorMsg');
  const email = document.getElementById('email');
  const email_err = document.getElementById('emailErrorMsg');
  const regex_name = /^[a-zA-Z]+(?:[\s'-][a-zA-Z]+)*$/;
  const regex_address = /^[-' 0-9a-zA-Z]+$/
  const regex_email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  first_name.addEventListener('change', function (){
      if (first_name.value.match(regex_name)) {
        console.log('okregex4');
        first_name_err.innerText = "";
      }
      else{
        first_name_err.innerText = "merci d'entrer un prénom valide.";
      };
  })
  last_name.addEventListener('change', function (){
    if (last_name.value.match(regex_name)) {
      console.log('okregex3');
      last_name_err.innerText = "";

    }
    else{
      last_name_err.innerText = "merci d'entrer un nom valide.";
    };
})
address.addEventListener('change', function (){
  if (address.value.match(regex_address)) {
    console.log('okregex2');
    address_err.innerText = "";
  }
  else{
    address_err.innerText = "merci d'entrer une addresse valide.";
  };
})
city.addEventListener('change', function (){
  if (city.value.match(regex_name)){
    console.log('okregex1');
    city_err.innerText = "";
  }
  else{
    city_err.innerText = "merci d'entrer une ville valide.";
    city_ok = 'pas ok1'
  };
})
  email.addEventListener('change', function () {
    if (email.value.match(regex_email)) {
      console.log('okregex');
      email_err.innerText = "";
    }
    else{
      email_err.innerText = "merci d'entrer un email valide.";
    };
  })
}

function get_contact() {
  let first_Name = document.getElementById("firstName");
  let last_Name = document.getElementById("lastName");
  let form_address = document.getElementById("address");
  let form_city = document.getElementById("city");
  let form_email = document.getElementById("email");
  console.log('get_contact');
  console.log(form_email.value);
  let contact = { firstName: first_Name.value, lastName: last_Name.value, address: form_address.value, city: form_city.value, email: form_email.value };
    return (contact);
 
}

function get_all_id(){
  let local_storage = get_local_storage();
  let products = [];
  local_storage.forEach(element => {
    products.push(element.id);    
  });
  console.log(products);
  return products;
}
function param_order() {
  let contact_var = get_contact();
  let products_var = get_all_id();
  let order = { contact: contact_var, products: products_var };
  return order;
}

function post() {
  const btn_order = document.getElementById('order');
  btn_order.addEventListener('click', function(){
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
    .then(response => {
      if (response.status != 201) {
        console.log('err');
        alert("il y a une erreur dans votre comande, merci de réessayer plus tard");

      } else if (response.ok) {
        response.json().then((data) => {
          console.log(data.orderId);
          const orderId = data.orderId;
          window.location.href = `./confirmation.html?orderId=${orderId}`
        })
      }

    });});
}

async function main() {
  let price = await get_Price();
  console.log(price);
  supprimer();
  input_change();
  set_errorHTML();
  param_order();
  post();
}
main();
//Promise.all()