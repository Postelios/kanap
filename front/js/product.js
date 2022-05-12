//obtenir l'id du produit depuis l'url

function GetId() {

    const url = window.location.search;
    const urlParams = new URLSearchParams(url);

    const id = urlParams.get('id')

    return (id);
}

//créer le html qui envoyé dans la page

function display_html(data){
    
    const img = document.getElementsByClassName("item__img");
    img[0].innerHTML = `<img src='${data.imageUrl}' alt=${data.altTxt}">`;

    const name = document.getElementById("title");
    name.innerText = data.name;

    const price = document.getElementById("price");
    price.innerText = data.price;

    const description = document.getElementById("description");
    description.innerText = data.description;

    const colors = document.getElementById("colors");

    const len = data.colors.length;
    let html = "";

    for (let i = 0; i < len; i++) {
        html += `<option value = ${data.colors[i]} > ${data.colors[i]} </option>`;
    };

    colors.innerHTML += html;
}

//récuperer le produit par son id

function getProduct() {
    let id = GetId();
    fetch(`http://localhost:3000/api/products/${id}`)
        .then((response) => {
            if (response.status == 404) {

                //en cas d'id inexistants on avertit le client

                let name = document.getElementById("title");
                name.innerText = `Ce produit n'éxiste pas`;

            } else if (response.ok) {
                response.json().then((data) => {

                    //envoyer le html dans le dom

                    display_html(data);
                })
            }

        })
        .catch(function (err) {
            console.log(err);
        });
}

//fonction pour obtenir le local storage

function get_local_storage(){
    let local_storage = (localStorage.getItem("panier"));
    local_storage = JSON.parse(local_storage);

return (local_storage);
}

// vérifier que le produit ajouter est ou non deja dans le local storage
// et empecher sa quantité de dépasser 100

function check_color(local_storage, add_cart) {
    let y = 0;

    while (y < local_storage.length){
            if (local_storage[y].id == add_cart[0].id && local_storage[y].color == add_cart[0].color ){
                const ls = parseInt(local_storage[y].quantity);
                if(ls + parseInt(add_cart[0].quantity) > 100)
                local_storage[y].quantity = 100;
                else
                local_storage[y].quantity = ls + parseInt(add_cart[0].quantity)

                return 0;
            }
        y++;
    }
    return undefined;
}

function add_cart() {

    const add = document.getElementById("addToCart");
    const quantity = document.getElementById("quantity");
    const color = document.getElementById("colors");
    const id = GetId();
    let local_storage = get_local_storage();
 
    add.addEventListener('click', function () {

        //vérifier que le client choisi bien toutes les options obligatoires

        if (color.value == "" ){
            alert("vous devez choisir une couleur pour le produit choisi.");
        }
        else if ( quantity.value > 100){
            alert("vous devez choisir une quantité inférieure a 100.");
        }
        else if (quantity.value < 1){
            alert("vous devez choisir une quantité pour le produit chosi.");
        }
        else{

            // ajouter au panier via le local storage

            let add_cart = [];
        add_cart.push ({ id: GetId(), quantity: quantity.value, color: color.value});
        console.log(add_cart);
        let check_ls = (element) => element.id == id;

        //vérifier le contenu du local storage
        
       if(local_storage == null){
        local_storage = add_cart;
       }
       else{
        let y = (local_storage.findIndex(check_ls));
        let c = check_color(local_storage,add_cart);
            if (y == -1 || c == undefined)
            local_storage.push(add_cart[0]);
           }
        localStorage.setItem("panier", JSON.stringify(local_storage));
        return (add_cart);
        };
    })
}
getProduct();
get_local_storage();
add_cart();