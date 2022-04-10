let cart = [];
let modalQt = 1;
let modalKey = 0;

const f = (el) => document.querySelector(el);
const fs = (el) => document.querySelectorAll(el);

// LISTAGEM DAS PIZZAS
pizzaJson.map( (item, index) => {
    // pegando a parte de html modelo da pizza
    let pizzaItem = f('.models .pizza-item').cloneNode(true);

    // preenchendo as informacoes em pizza-item
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `${item.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;    
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        // target (o elemento clicado) | closest (Pega o item mais proximo)
        let key = e.target.closest('.pizza-item').getAttribute('data-key');

        modalQt = 1;
        modalKey = key;

        f('.pizzaBig img').src = pizzaJson[key].img;
        f('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        f('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        f('.pizzaInfo--actualPrice').innerHTML = `${pizzaJson[key].price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;

        f('.pizzaInfo--size.selected').classList.remove('selected');
        
        fs('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        f('.pizzaInfo--qt').innerHTML = modalQt;

        f('.pizzaWindowArea').style.opacity = 0;
        f('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            f('.pizzaWindowArea').style.opacity = 1;            
        }, 200);
    });

    f('.pizza-area').append(pizzaItem);
})

// EVENTOS DO MODAL
function closeModal() {
    f('.pizzaWindowArea').style.opacity = 0;

    setTimeout(() => {
        f('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

fs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach( (item) => {
    item.addEventListener('click', closeModal);
});

f('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        f('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

f('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    f('.pizzaInfo--qt').innerHTML = modalQt;
});

fs('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        f('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

f('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(f('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id + '@' + size;

    let key = cart.findIndex( (item) => item.identifier == identifier);

    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }

    updateCart();
    closeModal();
});

f('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        f('aside').style.left = '0';
    }
});

f('.menu-closer').addEventListener('click', () => {
    f('aside').style.left = '100vw';
});

function updateCart() {
    f('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        f('aside').classList.add('show');
        f('.cart').innerHTML = '';
        
        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart) {
            let pizzaItem = pizzaJson.find( (item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = f('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;                    
                } else {
                    cart.splice(i, 1);
                }

                updateCart();
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });

            f('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        f('.subtotal span:last-child').innerHTML = `${subtotal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;;;
        f('.desconto span:last-child').innerHTML = `${desconto.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;;;
        f('.total span:last-child').innerHTML = `${total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;;;
    } else {
        f('aside').classList.remove('show');
        f('aside').style.left = '100vw';
    }
}