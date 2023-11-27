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
    cartList.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `${item.name} - R$ ${item.price.toFixed(2)} x${item.quantity} <button onclick="removeFromCart(${item.id})">Remover</button>`;
      cartList.appendChild(li);
      total += item.price * item.quantity;
    });
    totalElement.textContent = `Total: R$ ${total.toFixed(2)}`;
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
  
      // Preencher o objeto com os dados do cliente
      const cliente = {
        nome: prompt('Nome do cliente:'),
        cpf: prompt('CPF:'),
        email: prompt('E-mail:'),
        telefone: prompt('Telefone:'),
        cep: prompt('CEP:')
      };
  
      // Validar os campos
      const isNomeValid = validator.isLength(cliente.nome, { min: 1, max: 255 });
      const isCpfValid = validator.isLength(cliente.cpf, { min: 14, max: 14 }) && validator.matches(cliente.cpf, /^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
      const isEmailValid = validator.isEmail(cliente.email);
      const isTelefoneValid = validator.isNumeric(cliente.telefone) && validator.isMobilePhone(cliente.telefone, 'any', { strictMode: false });
      const isCepValid = validator.isNumeric(cliente.cep) && validator.isLength(cliente.cep, { min: 8, max: 8 });
  
      if (!cliente.nome.trim() || !isNomeValid || !isCpfValid || !isEmailValid || !isTelefoneValid || !isCepValid) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
      }
  
      // Redirecionar para a página de compra
      window.location.href = `compra.html?total=${totalPrice}&nome=${cliente.nome}&cpf=${cliente.cpf}&email=${cliente.email}&telefone=${cliente.telefone}&cep=${cliente.cep}`;
    } else {
      alert('Adicione produtos ao carrinho antes de finalizar a compra.');
    }
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
  