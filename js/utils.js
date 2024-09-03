// utils.js

// Função para carregar e converter dados do Excel em JSON usando XLSX.js
function fetchAndParseExcel(url, callback) {
    fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0]; // Obtém o nome da primeira planilha
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Converte em JSON
            callback(json.slice(1)); // Ignora o cabeçalho e retorna as linhas
        })
        .catch(error => console.error('Erro ao buscar e converter dados do Excel: ', error));
}

// Função para atualizar contagens de elementos no DOM
function updateCountsInDOM(counts) {
    Object.keys(counts).forEach(id => {
        const element = document.getElementById(id);
        if (element) element.textContent = counts[id];
    });
}

// Função para criar um elemento DOM e adicionar texto
function createElement(tag, textContent = '', className = '') {
    const element = document.createElement(tag);
    if (textContent) element.textContent = textContent;
    if (className) element.className = className;
    return element;
}

// Função para ordenar um objeto e retornar a chave com o valor máximo
function getTopKeyByValue(obj) {
    return Object.keys(obj).reduce((a, b) => (obj[a] > obj[b] ? a : b));
}

// Função para adicionar listas ordenadas ao DOM

function addSortedListToDOM(parentElement, items, itemFormatter) {
    const ul = document.createElement('ul');
    items.sort((a, b) => {
        const itemA = String(a); // Garante que seja uma string
        const itemB = String(b); // Garante que seja uma string
        return itemA.localeCompare(itemB);
    }).forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = itemFormatter(item);
        ul.appendChild(li);
    });
    parentElement.appendChild(ul);
}


// Funções de Ordenação do Catálogo

function sortCatalog(cards, catalog, compareFunction) {
    cards.sort(compareFunction);
    catalog.innerHTML = '';
    cards.forEach(card => {
        catalog.appendChild(card);
    });
}

function sortByNomeComum(cards, catalog) {
    sortCatalog(cards, catalog, (a, b) => {
        const nomeA = a.querySelector('h2').textContent.toLowerCase();
        const nomeB = b.querySelector('h2').textContent.toLowerCase();
        return nomeA.localeCompare(nomeB);
    });
}

function sortByEspecie(cards, catalog) {
    sortCatalog(cards, catalog, (a, b) => {
        const especieA = a.querySelector('p.especie').textContent.split(': ')[1]?.toLowerCase() || '';
        const especieB = b.querySelector('p.especie').textContent.split(': ')[1]?.toLowerCase() || '';
        return especieA.localeCompare(especieB);
    });
}

function sortByFamilia(cards, catalog) {
    sortCatalog(cards, catalog, (a, b) => {
        const familiaA = a.querySelector('p.familia').textContent.split(': ')[1]?.toLowerCase() || '';
        const familiaB = b.querySelector('p.familia').textContent.split(': ')[1]?.toLowerCase() || '';
        return familiaA.localeCompare(familiaB);
    });
}

function sortByOrdem(cards, catalog) {
    sortCatalog(cards, catalog, (a, b) => {
        const ordemA = a.querySelector('p.ordem').textContent.split(': ')[1]?.toLowerCase() || '';
        const ordemB = b.querySelector('p.ordem').textContent.split(': ')[1]?.toLowerCase() || '';
        return ordemA.localeCompare(ordemB);
    });
}
