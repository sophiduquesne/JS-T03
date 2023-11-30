const products = [
  { id: 1, name: 'Bis Lacta Preto', price: 5.99 },
  { id: 2, name: 'Bis Lacta Branco', price: 6.00 },
  { id: 3, name: 'Caixa de Bombom Lacta', price: 18.90 },
  { id: 4, name: 'Caixa de Bombom Nestlé', price: 16.50 },
  { id: 5, name: 'Caixa Ferrero Rocher - 15un', price: 45.00 },
  { id: 6, name: 'Caixa Ferrero Rondnoir - 14un', price: 48.00 },
  { id: 7, name: 'Caixa Raffaello - 15un', price: 49.99 },
  { id: 8, name: 'Kit kat Nestlé Preto', price: 4.00 },
  { id: 9, name: 'Kit Kat Nestlé Branco', price: 4.50 },
];

let cart = [];

function renderProducts() {
  const productsList = document.querySelector('#products ul');
  productsList.innerHTML = '';
  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `${product.name} - R$ ${product.price.toFixed(2)} <button onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>`;
    productsList.appendChild(li);
  });
}

function renderCart() {
  const cartList = document.querySelector('#cart-items');
  const totalElement = document.querySelector('#total');
  const totalFormElement = document.querySelector('#totalForm');
  const cartQuantityElement = document.querySelector('#cart-quantity');

  cartList.innerHTML = '';
  let total = 0;
  let quantity = 0;

  cart.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `${item.name} - R$ ${item.price.toFixed(2)} x${item.quantity} <button onclick="removeFromCart(${item.id})">Remover</button>`;
    cartList.appendChild(li);
    total += item.price * item.quantity;
    quantity += item.quantity;
  });

  totalElement.textContent = `Total: R$ ${total.toFixed(2)}`;
  totalFormElement.textContent = `Total: R$ ${total.toFixed(2)}`;
  cartQuantityElement.textContent = `Produtos escolhidos: ${quantity}`;

  return total;
}

function saveTotalToLocalStorage(total) {
  const salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];
  salesHistory.push(total);
  localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
}

function calculateTotalSales() {
  const salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];
  const totalSales = salesHistory.reduce((sum, value) => sum + value, 0);
  alert(`O total das vendas é: R$ ${totalSales.toFixed(2)}`);
}

document.querySelector('#calcularTotalVendas').addEventListener('click', () => {
  calcularTotalSales();

function getTotal() {
  return renderCart();
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
      cartItem.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    renderCart();
  }
}

function removeFromCart(productId) {
  const index = cart.findIndex(item => item.id === productId);
  if (index !== -1) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1);
    }
    renderCart();
  }
}

function checkout() {
  if (cart.length > 0) {
    const totalPrice = calculateTotal().toFixed(2);

    const cliente = {
      nome: document.getElementById('nome').value,
      cpf: document.getElementById('cpf').value,
      email: document.getElementById('email').value,
      telefone: document.getElementById('telefone').value,
      cep: document.getElementById('cep').value,
    };

    const isNomeValid = /^[A-Za-zÀ-ú\s]+$/.test(cliente.nome);
    const isCpfValid = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cliente.cpf);
    const isEmailValid = /\S+@\S+\.\S+/.test(cliente.email);
    const isTelefoneValid = /^\d{10,11}$/.test(cliente.telefone);
    const isCepValid = /^\d{5}-\d{3}$/.test(cliente.cep);

    if (!cliente.nome.trim() || !isNomeValid || !isCpfValid || !isEmailValid || !isTelefoneValid || !isCepValid) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    enviarDadosParaProfessor(cliente, cart);

    saveTotalToLocalStorage(parseFloat(totalPrice));

    window.location.href = `index.html?total=${totalPrice}&nome=${cliente.nome}&cpf=${cliente.cpf}&email=${cliente.email}&telefone=${cliente.telefone}&cep=${cliente.cep}`;
  } else {
    alert('Adicione produtos ao carrinho antes de finalizar a compra.');
  }
}


function enviarDadosParaServidor(cliente, cart) {
  const produtos = cart.map(item => item.name);
  const quantidades = cart.map(item => item.quantity);
  const precos = cart.map(item => item.price * item.quantity);

  const texto = `Pedido de Compra:\n\nProdutos:\n${produtos.join('\n')}\nQuantidades: ${quantidades.join(', ')}\nPreços: ${precos.map(p => `R$ ${p.toFixed(2)}`).join(', ')}\n\nDados do Comprador:\nNome: ${cliente.nome}\nCPF: ${cliente.cpf}\nE-mail: ${cliente.email}\nTelefone: ${cliente.telefone}\nCEP: ${cliente.cep}\n\nTotal da compra: R$ ${calculateTotal().toFixed(2)}`;

  fetch('http://jkorpela.fi/cgi-bin/echo.cgi', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ data: texto }),
  })
  .then(response => response.text())
  .then(data => {
    console.log('Resposta do servidor:', data);
    alert('E-mail enviado para o servidor com os detalhes da compra.');
  })
  .catch(error => {
    console.error('Erro ao enviar e-mail para o servidor:', error);
    alert('Erro ao enviar e-mail para o servidor. Por favor, tente novamente.');
  });
}


function calculateTotal() {
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
  });
  return total;
}

function resetCart() {
  cart = [];
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
});

function enviarDadosParaProfessor(cliente, cart) {
  const produtos = cart.map(item => item.name);
  const quantidades = cart.map(item => item.quantity);
  const precos = cart.map(item => item.price * item.quantity);

  const texto = `Fulano comprou:\n${cart.map(item => `${item.quantity} de ${item.name} gastando R$ ${item.price * item.quantity}`).join('\n')}\n\nDados do comprador:\nNome: ${cliente.nome}\nCPF: ${cliente.cpf}\nE-mail: ${cliente.email}\nTelefone: ${cliente.telefone}\nCEP: ${cliente.cep}\n\nTotal da compra: R$ ${calculateTotal().toFixed(2)}`;

  fetch('http://jkorpela.fi/cgi-bin/echo.cgi', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ data: texto }),
  })
  .then(response => response.text())
  .then(data => {
    console.log('Resposta do servidor:', data);
    alert('E-mail enviado para o professor com os detalhes da compra.');
  })
  .catch(error => {
    console.error('Erro ao enviar e-mail:', error);
    alert('Erro ao enviar e-mail. Por favor, tente novamente.');
  });
}

function saveTotalToLocalStorage(total) {
  const salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];
  const entry = `Venda total: R$ ${total.toFixed(2)}`;
  salesHistory.push(entry);
  
  
localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
}



function enviarDadosParaServidor(cliente, cart) {
  const produtos = cart.map(item => item.name);
  const quantidades = cart.map(item => item.quantity);
  const precos = cart.map(item => item.price * item.quantity);

  const texto = `Pedido de Compra:\n\nProdutos:\n${produtos.join('\n')}\nQuantidades: ${quantidades.join(', ')}\nPreços: ${precos.map(p => `R$ ${p.toFixed(2)}`).join(', ')}\n\nDados do Comprador:\nNome: ${cliente.nome}\nCPF: ${cliente.cpf}\nE-mail: ${cliente.email}\nTelefone: ${cliente.telefone}\nCEP: ${cliente.cep}\n\nTotal da compra: R$ ${calculateTotal().toFixed(2)}`;

  // Adiciona a chamada fetch para enviar os dados para o servidor
  fetch('http://jkorpela.fi/cgi-bin/echo.cgi', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ data: texto }),
  })
  .then(response => response.text())
  .then(data => {
    console.log('Resposta do servidor:', data);
    alert('Compra realizada com sucesso! Dados enviados para o servidor.');
    // Redireciona ou faz outras ações após o envio bem-sucedido
    // window.location.href = 'URL_DE_REDIRECIONAMENTO_AQUI';
  })
  .catch(error => {
    console.error('Erro ao enviar dados para o servidor:', error);
    alert('Erro ao enviar dados para o servidor. Por favor, tente novamente.');
  });
}

