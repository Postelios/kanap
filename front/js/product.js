function GetId() {
//    console.log(window.location.search);
 //   console.log(location.search);
 //   console.log(location);
    const url = window.location.search;
    const urlParams = new URLSearchParams(url);

    const id = urlParams.get('id')
  //  console.log(id);
    return (id);
}

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
        //console.log(data.colors[i]);
        html += `<option value = ${data.colors[i]} > ${data.colors[i]} </option>`;
    };
    colors.innerHTML += html;

}

function getProduct() {
    let id = GetId();
    console.log(id);
    fetch(`http://localhost:3000/api/products/${id}`)
        .then((response) => {
            if (response.status == 404) {
                console.log('404');
                let name = document.getElementById("title");
                name.innerText = `Ce produit n'éxiste pas`;

            } else if (response.ok) {
                response.json().then((data) => {
          //          console.log(data);
            //        console.log(response);
                    display_html(data);
                })
            }

        })
        .catch(function (err) {
            // some error here
        });
}


function get_local_storage(){
    let local_storage = (localStorage.getItem("panier"));
    let id = GetId();
    local_storage = JSON.parse(local_storage);

   // console.log("la taille du local storage est:"+local_storage.length);
    //console.log("le contenu du local storage est:"+local_storage[1].color);
    //console.log("le contenu du local storage est:"+local_storage[0].id[0]);
    console.log(local_storage);

    //console.log(local_storage.color);
return (local_storage);
}

function check_basket(local_storage, basket) {
    let y = 0;//debugger;
    while (y < local_storage.length){
            if (local_storage[y].id == basket[0].id){
                return (y);
            }
        y++;
    }
    return (-1);
}

function basket() {

    const add = document.getElementById("addToCart");
    const quantity = document.getElementById("quantity");
    const color = document.getElementById("colors");
    const id = GetId();
    const local_storage = get_local_storage();
   // JSON.parse(local_storage);
   // let basket = [{ id: GetId(), quantity: quantity.value, color: color.value}];

    add.addEventListener('click', function () {
       // console.log('ca clique!!!');
        //console.log(quantity.value);
        //console.log(color.value);
        //console.log(basket);
        //alert("vous devez choisir une couleur et une quantité pour le produit choisi.");
 
        //1-get local storage dans une variable
        //2-verifier que lid du produit n'existe pas
        //2bis-Si il existe aug la quantité
        //3-save la variable dans le local
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
            let basket = [];
        basket.push ({ id: GetId(), quantity: quantity.value, color: color.value});
        //console.log(basket);
        let check_ls = (element) => element.id == id;
        let z = local_storage.findIndex(check_ls);
        console.log(z);
        let y = check_basket(local_storage, basket);
        console.log(y);
        localStorage.setItem("panier", JSON.stringify(basket));
        };
    })
}
getProduct();
get_local_storage();
basket();
