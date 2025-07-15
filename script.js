
const carrossel = document.getElementById('carrossel');
const dotsContainer = document.getElementById('dots');
const legendaSlide = document.getElementById('legenda-slide');
const total = carrossel.children.length;

const legendas = [
  "Chave De Impacto Elétrica - Encaixe 3/4 220v R$ 2.199,00 Em estoque Marca: DEWALT",
  "Legenda do slide 2",
  "Legenda do slide 3",
  "Legenda do slide 4"
];//Altera as legendas conforme necessário aqui

let index = 0;

// Cria as bolinhas dinamicamente - EXECUTA APENAS UMA VEZ
for (let i = 0; i < total; i++) {
  const dot = document.createElement('div');
  dot.classList.add('dot');
  if (i === 0) dot.classList.add('active');

  dot.addEventListener('click', () => {
    index = i;
    atualizarCarrossel();
  });

  dotsContainer.appendChild(dot);
}

function moverCarrossel(direcao) {
  index += direcao;
  if (index < 0) index = 0;
  if (index > total - 1) index = total - 1;
  atualizarCarrossel();
}

function atualizarCarrossel() {
  const deslocamento = index * -(1010); // Pablo: ajuste conforme largura + margem dos seus slides
  carrossel.style.transform = `translateX(${deslocamento}px)`;

  // Atualiza legenda
  legendaSlide.textContent = legendas[index];

  // Atualiza bolinhas
  const dots = dotsContainer.children;
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.toggle('active', i === index);
  }
}
//Barra de pesquisa funcional
const searchInput = document.querySelector('#pesquisa');
const produtos = document.querySelectorAll('.produto');

searchInput.addEventListener('input', function() {
  const termo = this.value.toLowerCase();
  
  produtos.forEach(produto => {
    const textoProduto = produto.innerText.toLowerCase();
    if (textoProduto.includes(termo)) {
      produto.style.display = '';
    } else {
      produto.style.display = 'none';
    }
  });
});

// Função para adicionar produto ao carrinho na página inicial
function adicionarProdutoAoCarrinho(id, nome, preco, imagem) {
    const produto = {
        id: id,
        nome: nome,
        preco: preco,
        imagem: imagem
    };
    
    // Usar a função do carrinho.js
    if (typeof adicionarAoCarrinho === 'function') {
        adicionarAoCarrinho(produto);
    } else {
        // Fallback caso o carrinho.js não esteja carregado
        console.error('Função adicionarAoCarrinho não encontrada');
    }
}

// Atualizar contador do carrinho quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    if (typeof atualizarContadorCarrinho === 'function') {
        atualizarContadorCarrinho();
    }
});

