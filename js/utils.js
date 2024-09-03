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
    const keys = Object.keys(obj);
    if (keys.length === 0) return null; // Verifica se o array de chaves está vazio

    // Encontra a chave com o valor máximo
    return keys.reduce((a, b) => (obj[a] > obj[b] ? a : b));
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
// Função para criar um item de carrossel
// Função para criar um item de carrossel (agora movida para utils.js)
function createCarouselItem(record, isActive) {
    const item = createElement('div', '', 'carousel-item');
    if (isActive) item.classList.add('active');

    const iframe = createElement('iframe');
    iframe.dataset.src = record.imagem; // Usar lazy loading com dataset
    iframe.width = '60%';
    iframe.height = '400px';
    iframe.style.border = 'none';
    iframe.style.objectFit = 'cover';
    iframe.allow = 'autoplay';
    item.appendChild(iframe);

    // Título com o nome comum da ave (destaque centralizado)
    item.appendChild(createElement('h2', record.nomeComum, 'bird-name')); 

    // Contêiner para o restante das informações, alinhado à esquerda
    const infoContainer = createElement('div', '', 'bird-info-container');
    infoContainer.style.textAlign = 'left'; // Alinhamento à esquerda

    // Função auxiliar para criar parágrafos com parte em negrito
    function createInfoParagraph(label, text) {
        const p = createElement('p', '', 'bird-info');
        const strong = createElement('strong', label);
        p.appendChild(strong);
        p.appendChild(document.createTextNode(text));
        return p;
    }

    // Parágrafo para "Espécie:" com o nome da espécie em itálico
    const speciesElement = createElement('p', '', 'bird-species');
    const speciesLabel = createElement('strong', 'Espécie: ');
    const speciesName = createElement('span', record.especie); // Cria um span para o nome da espécie
    speciesName.style.fontStyle = 'italic'; // Aplica o estilo itálico ao span
    speciesElement.appendChild(speciesLabel);
    speciesElement.appendChild(speciesName);
    infoContainer.appendChild(speciesElement);

    // Outros elementos do card
    infoContainer.appendChild(createInfoParagraph('Família: ', record.familia));
    infoContainer.appendChild(createInfoParagraph('Ordem: ', record.ordem));
    infoContainer.appendChild(createInfoParagraph('Alimentação: ', record.alimentacao));
    infoContainer.appendChild(createInfoParagraph('Habitat: ', record.habitat));
    infoContainer.appendChild(createInfoParagraph('Curiosidades: ', record.curiosidades));
    infoContainer.appendChild(createInfoParagraph('Local da Foto: ', record.localFoto));

    // Adiciona o parágrafo para exibir os alunos que contribuíram para o registro
    infoContainer.appendChild(createInfoParagraph('Alunos: ', record.groupMembers));

    // Adiciona o contêiner de informações ao item do carrossel
    item.appendChild(infoContainer);

    return item;
}



// Funções de Ordenação do Catálogo
function sortCatalog(speciesGroups, catalog, compareFunction) {
    const speciesArray = Object.keys(speciesGroups).map(especie => ({
        especie,
        records: speciesGroups[especie]
    }));

    speciesArray.sort(compareFunction);

    catalog.innerHTML = '';
    speciesArray.forEach(species => {
        const speciesContainer = createElement('div', '', 'species-card');
        const header = createElement('h2', species.especie, 'species-header');
        speciesContainer.appendChild(header);

        const carouselContainer = createElement('div', '', 'carousel-container');
        const carouselInner = createElement('div', '', 'carousel-inner');

        species.records.forEach((record, index) => {
            const card = createCarouselItem(record, index === 0); // Cria um item do carrossel
            carouselInner.appendChild(card);
        });

        // Condicional para exibir botões de navegação apenas se houver mais de uma imagem
        if (species.records.length > 1) {
            // Botão Anterior com ícone de seta
            const prevButton = createElement('button', '', 'carousel-btn prev-btn');
            const prevIcon = createElement('span', 'chevron_left', 'material-icons'); // Adiciona ícone gráfico
            prevButton.appendChild(prevIcon);
            prevButton.addEventListener('click', () => navigateCarousel(carouselInner, 'prev'));

            // Botão Próximo com ícone de seta
            const nextButton = createElement('button', '', 'carousel-btn next-btn');
            const nextIcon = createElement('span', 'chevron_right', 'material-icons'); // Adiciona ícone gráfico
            nextButton.appendChild(nextIcon);
            nextButton.addEventListener('click', () => navigateCarousel(carouselInner, 'next'));

            carouselContainer.appendChild(prevButton);
            carouselContainer.appendChild(nextButton);
        }

        carouselContainer.appendChild(carouselInner);
        speciesContainer.appendChild(carouselContainer);
        catalog.appendChild(speciesContainer);
    });

    initLazyLoading();
}


// As funções de ordenação continuam iguais
function sortByNomeComum(speciesGroups, catalog) {
    sortCatalog(speciesGroups, catalog, (a, b) => {
        const nomeA = a.records[0].nomeComum.toLowerCase();
        const nomeB = b.records[0].nomeComum.toLowerCase();
        return nomeA.localeCompare(nomeB);
    });
}

function sortByEspecie(speciesGroups, catalog) {
    sortCatalog(speciesGroups, catalog, (a, b) => {
        const especieA = a.especie.toLowerCase();
        const especieB = b.especie.toLowerCase();
        return especieA.localeCompare(especieB);
    });
}

function sortByFamilia(speciesGroups, catalog) {
    sortCatalog(speciesGroups, catalog, (a, b) => {
        const familiaA = a.records[0].familia.toLowerCase();
        const familiaB = b.records[0].familia.toLowerCase();
        return familiaA.localeCompare(familiaB);
    });
}

function sortByOrdem(speciesGroups, catalog) {
    sortCatalog(speciesGroups, catalog, (a, b) => {
        const ordemA = a.records[0].ordem.toLowerCase();
        const ordemB = b.records[0].ordem.toLowerCase();
        return ordemA.localeCompare(ordemB);
    });
}
// Função para atualizar contagens e elementos principais no DOM
window.updateCountsAndTopElements = function () {
    const speciesCount = speciesSet.size;
    const generaCount = generaSet.size;
    const familiesCount = familiesSet.size;
    const ordersCount = ordersSet.size;

    updateCountsInDOM({
        speciesCount,
        generaCount,
        familiesCount,
        ordersCount
    });

    // Atualiza os elementos principais usando a função getTopKeyByValue com verificação
    const topOrder = getTopKeyByValue(speciesCountByOrder) || "N/A";
    const topFamily = getTopKeyByValue(speciesCountByFamily) || "N/A";
    const topGenus = getTopKeyByValue(speciesCountByGenus) || "N/A";

    document.getElementById('topOrder').textContent = topOrder;
    document.getElementById('topOrderCount').textContent = speciesCountByOrder[topOrder] || "0";
    document.getElementById('topFamily').textContent = topFamily;
    document.getElementById('topFamilyCount').textContent = speciesCountByFamily[topFamily] || "0";
    document.getElementById('topGenus').textContent = topGenus;
    document.getElementById('topGenusCount').textContent = speciesCountByGenus[topGenus] || "0";
};
