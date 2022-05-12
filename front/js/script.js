//appel api permettant de récupérer tout les produits

function getall() {
    fetch("http://localhost:3000/api/products")
        .then((response) => response.json().then((data) => {
            console.log(data);
            let items = document.getElementById("items");
            let html_code = "";
            data.forEach(element => {

                //récupérer le html et l'injecter dans le dom

                html_code += setHtml(element);
            }
            );
            items.innerHTML = html_code;
        }))
}

//créer le html qui sera envoyé dans la page

function setHtml(element) {
    let html = `<a href='./product.html?id=${element._id}'>
    <article> <img src='${element.imageUrl}' alt='${element.altTxt}'><h3 class='productName'>${element.name}</h3>
    <p class='productDescription'>${element.description}</p></article></a>`
    
    return html;
}

getall();