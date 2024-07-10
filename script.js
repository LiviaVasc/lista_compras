document.getElementById('item-form').addEventListener('submit', addItem);

const productList = [
    "Arroz", "Feijão", "Açúcar", "Café", "Leite", "Óleo de soja", "Farinha de trigo",
    "Macarrão", "Molho de tomate", "Sal", "Papel higiênico", "Sabonete", "Detergente",
    "Desinfetante", "Shampoo", "Condicionador", "Creme dental", "Frango", "Carne bovina",
    "Carne suína", "Peixe", "Ovos", "Queijo", "Presunto", "Manteiga", "Margarina",
    "Iogurte", "Suco", "Refrigerante", "Água mineral", "Biscoitos", "Chocolate", "Cerveja",
    "Vinho", "Pão", "Cereal", "Frutas", "Legumes", "Verduras"
];

function autocomplete(inp, arr) {
    let currentFocus;

    inp.addEventListener("input", function(e) {
        let a, b, i, val = this.value;
        closeAllLists();
        if (!val) return false;
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function(e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });

    inp.addEventListener("keydown", function(e) {
        let x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        const x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            if (elmnt !== x[i] && elmnt !== inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

autocomplete(document.getElementById('item-name'), productList);

function addItem(e) {
    e.preventDefault();
    
    const itemName = document.getElementById('item-name').value;
    let itemPrice = document.getElementById('item-price').value;
    const itemQuantity = parseInt(document.getElementById('item-quantity').value);
    
    // Substituir vírgula por ponto e converter para número
    itemPrice = parseFloat(itemPrice.replace(',', '.'));
    
    // Verificar se o valor é um número válido
    if (isNaN(itemPrice)) {
        alert('Por favor, insira um valor válido.');
        return;
    }

    // Formatar o preço para ter duas casas decimais
    itemPrice = formatPrice(itemPrice);

    const itemSubtotal = itemPrice * itemQuantity;
    
    const li = document.createElement('li');
    li.innerHTML = `${itemName} - R$${itemPrice.toFixed(2)} x ${itemQuantity} = R$${itemSubtotal.toFixed(2)}`;
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', function() {
        removeItem(li, itemSubtotal);
    });
    
    li.appendChild(deleteButton);
    document.getElementById('shopping-list').appendChild(li);
    
    updateTotal(itemSubtotal);
    
    document.getElementById('item-form').reset();
}

function formatPrice(price) {
    return Math.round(price * 100) / 100;
}

function updateTotal(itemSubtotal) {
    const totalElement = document.getElementById('total');
    const currentTotal = parseFloat(totalElement.textContent);
    const newTotal = currentTotal + itemSubtotal;
    
    totalElement.textContent = newTotal.toFixed(2);
}

function removeItem(itemElement, itemSubtotal) {
    document.getElementById('shopping-list').removeChild(itemElement);
    updateTotal(-itemSubtotal);
}
