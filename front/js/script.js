//appel api

function getall() {
    fetch("http://localhost:3000/api/products")
        .then((response) => response.json().then((data) => {
            console.log(data);
            let items = document.getElementById("items");
            let html_code = "";
            data.forEach(element => {
                console.log(element);
                console.log(element.name + ' ' + element._id);
                //items.innerHTML += setHtml(element);
                html_code += setHtml(element);
                element.colors.forEach(color => console.log(color));
            }
            );
            items.innerHTML = html_code;
        }))
}

function setHtml(element) {
    let html = `<a href='./product.html?id=${element._id}'>
    <article> <img src='${element.imageUrl}' alt='${element.altTxt}'><h3 class='productName'>${element.name}</h3><p class='productDescription'>${element.description}</p></article></a>`
     // let div = document.createElement('div'+element._id);
    // div.innerHTML = html;
    // a.appendChild(div) 
    return html;
}

getall();