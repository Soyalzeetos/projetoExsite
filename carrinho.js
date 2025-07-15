// Gerenciamento do carrinho de compras

// Recupera o carrinho do localStorage ou inicializa vazio
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Função para salvar carrinho no localStorage
function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
}

// Função para adicionar produto ao carrinho
function adicionarAoCarrinho(produto) {
    const itemExistente = carrinho.find(item => item.id === produto.id);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            ...produto,
            quantidade: 1
        });
    }
    
    salvarCarrinho();
    mostrarNotificacao('Produto adicionado ao carrinho!');
}

// Função para remover produto do carrinho
function removerDoCarrinho(produtoId) {
    const itemElement = document.querySelector(`[data-id="${produtoId}"]`);
    if (itemElement) {
        itemElement.classList.add('item-removendo');
        setTimeout(() => {
            carrinho = carrinho.filter(item => item.id !== produtoId);
            salvarCarrinho();
            renderizarCarrinho();
        }, 300);
    }
}

// Função para atualizar quantidade
function atualizarQuantidade(produtoId, novaQuantidade) {
    if (novaQuantidade <= 0) {
        removerDoCarrinho(produtoId);
        return;
    }
    
    const item = carrinho.find(item => item.id === produtoId);
    if (item) {
        item.quantidade = novaQuantidade;
        salvarCarrinho();
        renderizarCarrinho();
    }
}

// Função para calcular total do carrinho
function calcularTotal() {
    return carrinho.reduce((total, item) => {
        const preco = parseFloat(item.preco.replace('R$ ', '').replace('.', '').replace(',', '.'));
        return total + (preco * item.quantidade);
    }, 0);
}

// Função para formatar preço
function formatarPreco(valor) {
    return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Função para renderizar itens do carrinho
function renderizarCarrinho() {
    const itensContainer = document.getElementById('itens-carrinho');
    const carrinhoVazio = document.getElementById('carrinho-vazio');
    const resumoPedido = document.getElementById('resumo-pedido');
    
    if (carrinho.length === 0) {
        carrinhoVazio.style.display = 'block';
        resumoPedido.style.display = 'none';
        itensContainer.innerHTML = '';
        itensContainer.appendChild(carrinhoVazio);
        return;
    }
    
    carrinhoVazio.style.display = 'none';
    resumoPedido.style.display = 'block';
    
    const itensHTML = carrinho.map(item => `
        <div class="item-carrinho" data-id="${item.id}">
            <img src="${item.imagem}" alt="${item.nome}">
            <div class="info-produto">
                <h4>${item.nome}</h4>
                <div class="preco">${item.preco}</div>
                <div class="controles-quantidade">
                    <button class="btn-quantidade" onclick="atualizarQuantidade('${item.id}', ${item.quantidade - 1})">-</button>
                    <input type="number" class="quantidade" value="${item.quantidade}" min="1" 
                           onchange="atualizarQuantidade('${item.id}', parseInt(this.value))">
                    <button class="btn-quantidade" onclick="atualizarQuantidade('${item.id}', ${item.quantidade + 1})">+</button>
                </div>
            </div>
            <button class="btn-remover" onclick="removerDoCarrinho('${item.id}')">Remover</button>
        </div>
    `).join('');
    
    itensContainer.innerHTML = itensHTML;
    
    // Atualizar resumo do pedido
    const total = calcularTotal();
    document.getElementById('subtotal').textContent = formatarPreco(total);
    document.getElementById('total').textContent = formatarPreco(total);
}

// Função para atualizar contador do carrinho
function atualizarContadorCarrinho() {
    const contador = document.getElementById('contador-carrinho');
    if (contador) {
        const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
        contador.textContent = totalItens;
        contador.style.display = totalItens > 0 ? 'flex' : 'none';
    }
}

// Função para mostrar notificação
function mostrarNotificacao(mensagem) {
    // Criar elemento de notificação
    const notificacao = document.createElement('div');
    notificacao.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideInRight 0.3s ease-out;
    `;
    notificacao.textContent = mensagem;
    
    // Adicionar CSS da animação
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notificacao);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notificacao.remove();
    }, 3000);
}

// Função para finalizar compra
function finalizarCompra() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    const total = calcularTotal();
    const mensagem = `Obrigado pela sua compra!\n\nTotal: ${formatarPreco(total)}\n\nSeus produtos serão entregues em breve.`;
    
    alert(mensagem);
    
    // Limpar carrinho após compra
    carrinho = [];
    salvarCarrinho();
    renderizarCarrinho();
}

// Inicializar página do carrinho
document.addEventListener('DOMContentLoaded', function() {
    renderizarCarrinho();
    atualizarContadorCarrinho();
});

// Função global para ser usada em outras páginas
window.adicionarAoCarrinho = adicionarAoCarrinho;
window.atualizarContadorCarrinho = atualizarContadorCarrinho;

