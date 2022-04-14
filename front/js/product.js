
function GetId() {
    console.log(window.location.search);
    console.log(location.search);
    console.log(location);
    const url = window.location.search;
    const urlParams = new URLSearchParams(url);

    const id = urlParams.get('id')
    console.log(id);
    return (id);
}

function display_html(data){
    
    const img = document.getElementsByClassName("item__img");
    img[0].innerHTML = "<img src='" + data.imageUrl + "' alt=" + data.altTxt + ">";

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
        console.log(data.colors[i]);
        html += "<option value='" + data.colors[i] + "'>" + data.colors[i] + "</option>";
    };
    colors.innerHTML=html;

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
                    console.log(data);
                    console.log(response);
                    display_html(data);
                })
            }

        })
        .catch(function (err) {
            // some error here
        });
}

getProduct();

function basket() {

    const add = document.getElementById("addToCart");
    const quantity = document.getElementById("quantity");
    const color = document.getElementById("colors");
    const id = GetId();
    var basket = [{ id: GetId(), quantity: quantity.value}];

    add.addEventListener('click', function () {
        console.log('ca clique!!!');
        console.log(quantity.value);
        console.log(color.value);

        //1-get local storage dans une variable
        //2-verifier que lid du produit n'existe pas
        //2bis-Si il existe aug la quantité
        //3-save la variable dans le local
        console.log(basket);
        basket.push({ id: GetId(), quantity: quantity.value });
        console.log(basket);
        let price = document.getElementById("price");
        price.innerText = Math.floor(Math.random() * 9000);
        localStorage.setItem('panier', JSON.stringify(basket));


    })
}
basket();