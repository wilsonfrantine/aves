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
        speciesCountByOrder[ordem] = (speciesCountByOrder[ordem] || 0) + 1;
        if (!inventoryData[ordem]) inventoryData[ordem] = {};
    }
    if (familia) {
        speciesCountByFamily[familia] = (speciesCountByFamily[familia] || 0) + 1;
        if (!inventoryData[ordem][familia]) inventoryData[ordem][familia] = [];
    }
    if (especie) {
        if (!speciesCountByGenus[especie.split(' ')[0]]) speciesCountByGenus[especie.split(' ')[0]] = 0;
        speciesCountByGenus[especie.split(' ')[0]] += 1;

        inventoryData[ordem][familia].push({ especie, nomeComum });
    }
};

// Função para atualizar contagens e elementos de topo no DOM
window.updateCountsAndTopElements = function () {
    updateCountsInDOM({
        speciesCount: speciesSet.size,
        generaCount: generaSet.size,
        familiesCount: familiesSet.size,
        ordersCount: ordersSet.size
    });

    const topOrder = getTopKeyByValue(speciesCountByOrder);
    const topFamily = getTopKeyByValue(speciesCountByFamily);
    const topGenus = getTopKeyByValue(speciesCountByGenus);

    updateCountsInDOM({
        topOrder,
        topOrderCount: speciesCountByOrder[topOrder],
        topFamily,
        topFamilyCount: speciesCountByFamily[topFamily],
        topGenus,
        topGenusCount: speciesCountByGenus[topGenus]
    });
};

// Função para gerar tabela de inventário
// metrics.js

window.generateInventoryTable = function () {
    const inventoryTable = document.getElementById('inventoryTable');
    if (!inventoryTable) return;

    for (let ordem in inventoryData) {
        const orderDiv = createElement('div');
        orderDiv.appendChild(createElement('h3', ordem));

        for (let familia in inventoryData[ordem]) {
            const familyDiv = createElement('div');
            familyDiv.appendChild(createElement('h4', familia));

            addSortedListToDOM(familyDiv, inventoryData[ordem][familia], item => `<em>${item.especie}</em> (${item.nomeComum})`);
            orderDiv.appendChild(familyDiv);
        }

        inventoryTable.appendChild(orderDiv);
    }
};
