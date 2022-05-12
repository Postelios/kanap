//obtenir le Local storage créé en page product
// pour pouvoir afficher le panier
function get_local_storage() {
  let local_storage = JSON.parse(localStorage.getItem("panier"));
  return (local_storage);
}

//supprimer un produit par le bouton supprimer

function supprimer(prices) {
  const del = document.getElementsByClassName('deleteItem');
  const cart_items = document.getElementById('cart__items');
  for (let i = 0; i < del.length; i++) {
    del[i].addEventListener('click', function (element) {

      //on se positionne a l'écoute du click

      let local_storage = get_local_storage();
      let this_item = element.target;
      let article = this_item.parentNode.parentNode.parentNode.parentNode;

      //j'utilise les information data color et data id afin
      // d'identifier le produit dans le localstorage

      let product = { id: article.dataset.id, color: article.dataset.color };
      let check_ls = (element) => element.id == product.id && element.color == product.color;
      let y = local_storage.findIndex(check_ls);

      //suppression de l'élément dans le local storage

      local_storage.splice(y, 1);

      //si le panier est vide je le réinitialise

      if (local_storage.length == 0) {
        localStorage.removeItem("panier");
      }
      else
        localStorage.setItem("panier", JSON.stringify(local_storage));

        //suppression de l'élément dans le dom

        cart_items.removeChild(article);

//recalcul des totaux quantité et prix avec la fonction total

      total(prices);
    });
  }
}

//réagir au changement de quantité depuis le panier

function input_change(prices) {
  const quantity = document.getElementsByClassName("itemQuantity");
  const cart_items = document.getElementById('cart__items');
 
  for (let i = 0; i < quantity.length; i++) {

    //on se met a l'écoute du changement de valeur

    quantity[i].addEventListener('change', function (element) {
      let local_storage = get_local_storage();
      let this_item = element.target;
      console.log(this_item);
      let article = this_item.parentNode.parentNode.parentNode.parentNode;
      console.log(article);
      let product = { id: article.dataset.id, color: article.dataset.color };
      
      //trouver l'index du localstorage correspondant au prix
      
      let check_ls = (element) => element.id == product.id && element.color == product.color;
      let y = local_storage.findIndex(check_ls)
      let check_price = (element) => element.id == local_storage[y].id;
      let c = prices.findIndex(check_price);
      let price = prices[c].price;
      const item_content = article.lastChild;
      const item_description = item_content.firstChild;
      const price_description = item_description.lastChild;

      //recalcul du nouveau prix

      price_description.innerText = this_item.value * price;

      //empecher la quantité de dépasser 100

      if (this_item.value > 100)
      this_item.value = 100;

      //suppression des produits sans quantité
      if (this_item.value == 0) {
        local_storage.splice(y, 1);
        cart_items.removeChild(article);

        //si le local storage est vide j'enleve la clé du local storage

        if (local_storage.length == 0) {
          localStorage.removeItem("panier");
          return;
        }
      }

     // je modifie la quantité du produit dans le local storage
     // pour que l'information soit conservée

      else {
        local_storage[y].quantity = this_item.value;
      }
      localStorage.setItem("panier", JSON.stringify(local_storage));
      
      //recalcul de la quantité et du prix total
      
      total(prices);
    });
  }
  return;
}

//génerer le html qui va construire le panier

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
//calculer les prix totaux et afficher la quantitée totale en fin de panier

function total(prices) {
  let local_storage = get_local_storage();
  let price = 0;
  let quantity = 0;
  let total_price = 0;

//boucle generant la quantité totale et le prix final

  local_storage.forEach(element => {
    let find_index = (price) => element.id == price.id;
    let elem_quantity = parseInt(element.quantity);
    quantity += elem_quantity;
    let y = prices.findIndex(find_index);
    total_price += prices[y].price * element.quantity;
  });

  //injection dans le html des resultats obtenus

  let total_Quantity = document.getElementById('totalQuantity');
  if (quantity <= 1) {
    let html = `<p>Total (<span id = "totalQuantity">${quantity}</span> article) : 
    <span id="totalPrice">${total_price}</span> €</p>`
    let insert = document.getElementsByClassName('cart__price');
    insert[0].innerHTML = html;
  }
  total_Quantity.innerText = quantity;
  let total_Price = document.getElementById('totalPrice');
  total_Price.innerText = total_price;
}

//fonction qui va récupérer les fiche produit depuis les ids du localstorage
//fonction assynchrone qui va renvoyer le prix qui me permettra de calculer les différents totaux

async function get_Price() {
  let local_storage = get_local_storage();
  let prices = [];
  let len = local_storage.length;
  for (let i = 0; i < local_storage.length; i++) {
    try {
      var response = await fetch(`http://localhost:3000/api/products/${local_storage[i].id}`);

      //interception d'une erreur 404 dans le cas d'un produit placé dans le panier devenu inéxistant

      if (response.status == 404) {

        //suppression de la ligne si i n'existe pas

        local_storage[i].splice(1,i);

        //réinitialisation de i pour compenser la suppression d'une  ligne.

        i -= i-1;

      } else if (response.ok) {
        var data = await response.json()

        //je remplis l'ojet contenant le prix attaché a son id qui me 
        //permettra de le passer dans la fonction total 

        prices.push({ id: local_storage[i].id, price: data.price });
      
        //on injecte le html créé plus tot

        display_html(data, local_storage[i], len, data.price);
      }

    }
    catch (err) {
      console.error(err)
      // some error here
    }
  }
  return prices;
}

// gestion des erreurs dans les champs du formulaire contact

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
  first_name.addEventListener('change', function () {
    if (first_name.value.match(regex_name)) {
      console.log('okregex4');
      first_name_err.innerText = "";
    }
    else {
      first_name_err.innerText = "merci d'entrer un prénom valide.";
    };
  })
  last_name.addEventListener('change', function () {
    if (last_name.value.match(regex_name)) {
      console.log('okregex3');
      last_name_err.innerText = "";

    }
    else {
      last_name_err.innerText = "merci d'entrer un nom valide.";
    };
  })
  address.addEventListener('change', function () {
    if (address.value.match(regex_address)) {
      console.log('okregex2');
      address_err.innerText = "";
    }
    else {
      address_err.innerText = "merci d'entrer une addresse valide.";
    };
  })
  city.addEventListener('change', function () {
    if (city.value.match(regex_name)) {
      console.log('okregex1');
      city_err.innerText = "";
    }
    else {
      city_err.innerText = "merci d'entrer une ville valide.";
      city_ok = 'pas ok1'
    };
  })
  email.addEventListener('change', function () {
    if (email.value.match(regex_email)) {
      console.log('okregex');
      email_err.innerText = "";
    }
    else {
      email_err.innerText = "merci d'entrer un email valide.";
    };
  })
}

//création de l'objet contact afin de préparer la requete post

function get_contact() {
  let first_Name = document.getElementById("firstName");
  let last_Name = document.getElementById("lastName");
  let form_address = document.getElementById("address");
  let form_city = document.getElementById("city");
  let form_email = document.getElementById("email");

  let contact = { firstName: first_Name.value, lastName: last_Name.value, address: form_address.value, city: form_city.value, email: form_email.value };
  
  return (contact);
}

//récupération de tout les ids dans le local storage

function get_all_id() {
  let local_storage = get_local_storage();
  let products = [];

  local_storage.forEach(element => {
    products.push(element.id);
  });
  return products;
}

//parametrer l'objet qui sera envoyé dans la requete push

function param_order() {
  let contact_var = get_contact();
  let products_var = get_all_id();

  let order = { contact: contact_var, products: products_var };

  return order;
}

//création de la requete post

function post() {
  const btn_order = document.getElementById('order');
  btn_order.addEventListener('click', function () {

//créer l'objet a retourner sur le clic

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

        //dans le cas ou il y a une erreur

        if (response.status != 201) {
          console.log('err');
          alert("il y a une erreur dans votre comande, merci de réessayer plus tard");

        } else if (response.ok) {

          //tout va bien on récupere le numero de commande et on le place dans l'url de redirection
          // afin de l'afficher en page confirmation
          response.json().then((data) => {
            const orderId = data.orderId;
            window.location.href = `./confirmation.html?orderId=${orderId}`
          })
        }

      });
  });
}

async function main() {

  //on attend le resultat de la fonction asynchrone afin de récupérer le prix

  let prices = await get_Price();
  console.log(prices);
  total(prices);
  supprimer(prices);
  input_change(prices);
  set_errorHTML();
  param_order();
  post();
}
main();