// metrics.js

// Variáveis para métricas
window.speciesSet = new Set();
window.generaSet = new Set();
window.familiesSet = new Set();
window.ordersSet = new Set();

window.speciesCountByOrder = {};
window.speciesCountByFamily = {};
window.speciesCountByGenus = {};

window.inventoryData = {};

// Função para atualizar dados de métricas
window.updateInventoryData = function (ordem, familia, especie, nomeComum) {
    if (ordem) {
        window.speciesCountByOrder[ordem] = (window.speciesCountByOrder[ordem] || 0) + 1;
        if (!window.inventoryData[ordem]) window.inventoryData[ordem] = {};
    }
    if (familia) {
        window.speciesCountByFamily[familia] = (window.speciesCountByFamily[familia] || 0) + 1;
        if (!window.inventoryData[ordem][familia]) window.inventoryData[ordem][familia] = [];
    }
    if (especie) {
        const genero = especie.split(' ')[0];
        if (!window.speciesCountByGenus[genero]) window.speciesCountByGenus[genero] = 0;
        window.speciesCountByGenus[genero] += 1;

        if (!window.inventoryData[ordem]) window.inventoryData[ordem] = {};  // Inicialização de ordem no inventoryData
        if (!window.inventoryData[ordem][familia]) window.inventoryData[ordem][familia] = []; // Inicialização de família

        window.inventoryData[ordem][familia].push({ especie, nomeComum });
    }
};

// Função para atualizar contagens e elementos de topo no DOM
window.updateCountsAndTopElements = function () {
    updateCountsInDOM({
        speciesCount: window.speciesSet.size,
        generaCount: window.generaSet.size,
        familiesCount: window.familiesSet.size,
        ordersCount: window.ordersSet.size
    });

    const topOrder = getTopKeyByValue(window.speciesCountByOrder) || "N/A";
    const topFamily = getTopKeyByValue(window.speciesCountByFamily) || "N/A";
    const topGenus = getTopKeyByValue(window.speciesCountByGenus) || "N/A";

    updateCountsInDOM({
        topOrder,
        topOrderCount: window.speciesCountByOrder[topOrder] || "0",
        topFamily,
        topFamilyCount: window.speciesCountByFamily[topFamily] || "0",
        topGenus,
        topGenusCount: window.speciesCountByGenus[topGenus] || "0"
    });
};

// Função para gerar tabela de inventário
window.generateInventoryTable = function () {
    const inventoryTable = document.getElementById('inventoryTable');
    if (!inventoryTable) return;

    inventoryTable.innerHTML = ''; // Limpa o conteúdo atual antes de gerar a nova tabela

    for (let ordem in window.inventoryData) {
        const orderDiv = createElement('div');
        orderDiv.appendChild(createElement('h3', ordem));

        for (let familia in window.inventoryData[ordem]) {
            const familyDiv = createElement('div');
            familyDiv.appendChild(createElement('h4', familia));

            addSortedListToDOM(familyDiv, window.inventoryData[ordem][familia], item => `<em>${item.especie}</em> (${item.nomeComum})`);
            orderDiv.appendChild(familyDiv);
        }

        inventoryTable.appendChild(orderDiv);
    }
};
