// Dados dos produtos
const produtos = [
  {
    id: 1,
    nome: 'Morango',
    categoria: 'Frutas e Verduras',
    preco: 8.00,
    img: 'https://imagens-cdn.canalrural.com.br/2025/07/morangos-colheita-piracaia.jpeg',
    alt: 'Morangos vermelhos frescos e suculentos'
  },
  {
    id: 2,
    nome: 'Arroz 5kg',
    categoria: 'Não Perecíveis',
    preco: 23.90,
    img: 'https://tse1.mm.bing.net/th/id/OIP.T3UjTGs9G--PBAEx_WWpxQHaHa?rs=1&pid=ImgDetMain',
    alt: 'Pacote de arroz branco tipo 1 de 5 quilogramas'
  },
  {
    id: 3,
    nome: 'Detergente 500ml',
    categoria: 'Higiene e Limpeza',
    preco: 3.99,
    img: 'https://th.bing.com/th/id/R.07f12e9e2a116833eca803b01017dbec?rik=RkkYSCNWmPhWSQ&pid=ImgRaw&r=0',
    alt: 'Frasco de detergente concentrado 500ml'
  },
  {
    id: 4,
    nome: 'Banana Nanica',
    categoria: 'Frutas e Verduras',
    preco: 4.29,
    img: 'https://i0.wp.com/files.agro20.com.br/uploads/2019/09/banana-nanica-1.jpg?w=1024&ssl=1',
    alt: 'Cacho de bananas nanica maduras'
  },
  {
    id: 5,
    nome: 'Feijão 1kg',
    categoria: 'Não Perecíveis',
    preco: 8.59,
    img: 'https://carrefourbrfood.vtexassets.com/arquivos/ids/62334244/feijao-preto-premium-fritz-frida-500g-1.jpg?v=637915857166170000',
    alt: 'Pacote de feijão preto premium 1 quilograma'
  },
  {
    id: 6,
    nome: 'Sabão em Pó 1kg',
    categoria: 'Higiene e Limpeza',
    preco: 17.49,
    img: 'https://tse3.mm.bing.net/th/id/OIP.btiD_J0MEvlBxiV7TpHnMgHaHa?rs=1&pid=ImgDetMain',
    alt: 'Embalagem de sabão em pó concentrado 1 quilograma'
  }
];

// Variáveis globais
let carrinho = parseInt(localStorage.getItem('carrinho') || '0');

// Elementos do DOM
const gridProdutos = document.getElementById('gridProdutos');
const inputBusca = document.getElementById('inputBusca');
const cartCount = document.getElementById('cartCount');

// Função para renderizar produtos
function renderizarProdutos(listaProdutos) {
  if (!gridProdutos) return;

  gridProdutos.innerHTML = '';

  if (listaProdutos.length === 0) {
    gridProdutos.innerHTML = `
      <div class="col-12 text-center py-4">
        <h4 class="text-muted">Nenhum produto encontrado</h4>
        <p class="text-muted">Tente buscar por outros termos</p>
      </div>
    `;
    return;
  }

  listaProdutos.forEach(produto => {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-lg-4';
    
    col.innerHTML = `
      <div class="card card-produto h-100" 
           tabindex="0" 
           aria-label="Produto: ${produto.nome}, categoria ${produto.categoria}, preço R$ ${produto.preco.toFixed(2)}">
        <img src="${produto.img}" 
             class="card-img-top" 
             alt="${produto.alt}"
             loading="lazy">
        <div class="card-body d-flex flex-column">
          <h3 class="h6 fw-bold">${produto.nome}</h3>
          <p class="text-muted small mb-1">${produto.categoria}</p>
          <p class="fw-bold text-success fs-5 mt-auto mb-3">
            R$ ${produto.preco.toFixed(2)}
          </p>
          <button class="btn btn-primary mt-auto" 
                  data-id="${produto.id}"
                  aria-label="Adicionar ${produto.nome} ao carrinho">
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    `;
    
    gridProdutos.appendChild(col);
  });
}

// Função de busca de produtos
function buscarProdutos() {
  if (!inputBusca) return;
  
  const termo = inputBusca.value.toLowerCase().trim();
  
  const produtosFiltrados = produtos.filter(produto => 
    produto.nome.toLowerCase().includes(termo) || 
    produto.categoria.toLowerCase().includes(termo)
  );
  
  renderizarProdutos(produtosFiltrados);
}

// Função para adicionar ao carrinho
function adicionarAoCarrinho(produtoId) {
  const produto = produtos.find(p => p.id === produtoId);
  if (!produto) return;
  
  carrinho++;
  atualizarContadorCarrinho();
  localStorage.setItem('carrinho', carrinho.toString());
  
  mostrarToast(`${produto.nome} adicionado ao carrinho!`, 'success');
}

// Função para atualizar contador do carrinho
function atualizarContadorCarrinho() {
  if (cartCount) {
    cartCount.textContent = carrinho;
  }
}

// Inicializar sistema de produtos
function iniciarProdutos() {
  
  setTimeout(() => {
    renderizarProdutos(produtos);
  }, 500);
  
  
  if (inputBusca) {
    inputBusca.addEventListener('input', buscarProdutos);
  }
  
  // Configurar cliques no carrinho
  if (gridProdutos) {
    gridProdutos.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-id]');
      if (btn) {
        const produtoId = parseInt(btn.dataset.id);
        adicionarAoCarrinho(produtoId);
      }
    });
  }
  

  atualizarContadorCarrinho();
}