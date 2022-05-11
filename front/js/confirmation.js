
//récupération du numéro de commande dans l'url
function orderId() {
        const url = window.location.search;
        const urlParams = new URLSearchParams(url);
    
        const orderId = urlParams.get('orderId')
        return (orderId);
    }

function set_html(){
    const order = orderId();
    console.log(orderId);
    const html = document.getElementById('orderId');
    html.innerText = order;
}
set_html();