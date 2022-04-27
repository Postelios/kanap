//obtenir le Local storage créé en page product
// pour pouvoir afficher le panier
function get_local_storage() {
    let local_storage = JSON.parse(localStorage.getItem("panier"));
   // let id = GetId();
    return (local_storage);
}

//préparer le html qui va construire le panier
function display_html(data) {
    let local_storage = get_local_storage();
    let price = data.price * local_storage[0].quantity;
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
    content_description.innerHTML = `<h2>${data.name}</h2><p>${local_storage[0].color}</p><p>${price}</p>`;

console.log(local_storage[0].quantity);
    settings_quantity.innerHTML = `<p>Qté : ${local_storage[0].quantity}</p> 
    <input type="number" class="itemQuantity" 
    name="${data.name}" min="1" max="100" value="${local_storage[0].quantity}">`;

    settings_delete.innerHTML = `<p class="deleteItem">Supprimer</p>`;
  
    cart_item.appendChild(article);
        article.appendChild(item_img);
        article.appendChild(item_content);
            item_content.appendChild(content_description);
            item_content.appendChild(content_settings);
            content_settings.appendChild(settings_quantity);
            content_settings.appendChild(settings_delete);

            /* <article>
    <div class="cart__item__img">
      <img src="../images/product01.jpg" alt="Photographie d'un canapé">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>Nom du produit</h2>
        <p>Vert</p>
        <p>42,00 €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>*/
}



function get_Price() {
    let local_storage = get_local_storage();
    let id = local_storage.id;
    console.log(local_storage);
    console.log(local_storage[0].id);
    console.log(local_storage.length);
    for (let i = 0; i < local_storage.length; i++) {
        console.log(i);
        fetch(`http://localhost:3000/api/products/${local_storage[0].id}`)
            .then((response) => {
                console.log('then');
                if (response.status == 404) {
                    console.log('404');
                } else if (response.ok) {
                    response.json().then((data) => {
                        display_html(data);
                        console.log('in');
                        console.log(data);
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
get_contact();
get_Price();