//obtenir le Local storage créé en page product
// pour pouvoir afficher le panier
function get_local_storage() {
    let local_storage = JSON.parse(localStorage.getItem("panier"));
    let id = GetId();
    return (local_storage);
}

//préparer le html qui va construire le panier
function set_html() {
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
    
    item_img.innerHTML = 'a';//`<img src="${data.imageUrl}" alt="${data.altTxt}">`;
    content_description.innerHTML = 'b'; //  `<h2>${data.name}</h2><p>${data.color}</p><p>${data.color}</p>`;


    settings_quantity.innerHTML = 'a'; // `<p>Qté : ${local_storage.quantity}</p>
    //<input type="number" class="itemQuantity" 
    //name="${data.name}" min="1" max="100" value="${local_storage.quantity}"`>;

    settings_delete.innerHTML = 'a'; //`<p class="deleteItem">Supprimer</p>`;
  
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

set_html();


function get_Price() {
    let local_storage = get_local_storage();
    let id = local_storage.id;
    for (let i = 0; i < local_storage.lenght; i++) {
        fetch(`http://localhost:3000/api/products/${local_storage[i].id}`)
            .then((response) => {
                if (response.status == 404) {
                    console.log('404');
                } else if (response.ok) {
                    response.json().then((data) => {
                        display_html(data);
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
    let contact = {firstName: first_Name, last_Name}
}