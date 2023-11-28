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

    const isNomeValid = validator.isLength(cliente.nome, { min: 1, max: 255 });
    const isCpfValid = validator.isCPF(cliente.cpf);
    const isEmailValid = validator.isEmail(cliente.email);
    const isTelefoneValid = validator.isNumeric(cliente.telefone) && validator.isMobilePhone(cliente.telefone, 'any', { strictMode: false });
    const isCepValid = validator.isNumeric(cliente.cep) && validator.isLength(cliente.cep, { min: 8, max: 8 });

    if (!cliente.nome.trim() || !isNomeValid || !isCpfValid || !isEmailValid || !isTelefoneValid || !isCepValid) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const dadosCompra = {
      cliente: cliente,
      carrinho: cart,
      total: totalPrice,
    };

    fetch('http://jkorpela.fi/cgi-bin/echo.cgi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosCompra),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Sucesso ao enviar dados:', data);
        alert('Compra finalizada com sucesso!');
        resetCart();
        renderCart();
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
        alert('Erro ao finalizar a compra. Por favor, tente novamente.');
      });
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
  // renderProducts(); // Se necessário, descomente esta linha
});