document.addEventListener('DOMContentLoaded', () => {
    const url = './data/data.xlsx';

    let speciesSet = new Set();
    let generaSet = new Set();
    let familiesSet = new Set();
    let ordersSet = new Set();

    let speciesCountByOrder = {};
    let speciesCountByFamily = {};
    let speciesCountByGenus = {};

    let inventoryData = {};

    fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            json.slice(1).forEach(row => {
                const columns = row.map(cell => (typeof cell === 'string' ? cell.trim() : cell));

                for (let i = 4; i < columns.length; i += 9) {
                    const nomeComum = columns[i];
                    const especie = columns[i + 1];
                    const genero = columns[i + 1].split(' ')[0];
                    const familia = columns[i + 2];
                    const ordem = columns[i + 3];

                    if (especie && !speciesSet.has(especie)) {
                        speciesSet.add(especie);
                        if (genero) generaSet.add(genero);
                        if (familia) familiesSet.add(familia);
                        if (ordem) ordersSet.add(ordem);

                        if (ordem) {
                            speciesCountByOrder[ordem] = (speciesCountByOrder[ordem] || 0) + 1;
                            if (!inventoryData[ordem]) inventoryData[ordem] = {};
                        }
                        if (familia) {
                            speciesCountByFamily[familia] = (speciesCountByFamily[familia] || 0) + 1;
                            if (!inventoryData[ordem][familia]) inventoryData[ordem][familia] = new Set();
                        }
                        if (genero) {
                            speciesCountByGenus[genero] = (speciesCountByGenus[genero] || 0) + 1;
                        }
                        if (especie) {
                            inventoryData[ordem][familia].add({ especie, nomeComum });
                        }
                    }
                }
            });

            document.getElementById('speciesCount').textContent = speciesSet.size;
            document.getElementById('generaCount').textContent = generaSet.size;
            document.getElementById('familiesCount').textContent = familiesSet.size;
            document.getElementById('ordersCount').textContent = ordersSet.size;

            const topOrder = Object.keys(speciesCountByOrder).reduce((a, b) => speciesCountByOrder[a] > speciesCountByOrder[b] ? a : b);
            const topFamily = Object.keys(speciesCountByFamily).reduce((a, b) => speciesCountByFamily[a] > speciesCountByFamily[b] ? a : b);
            const topGenus = Object.keys(speciesCountByGenus).reduce((a, b) => speciesCountByGenus[a] > speciesCountByGenus[b] ? a : b);

            document.getElementById('topOrder').textContent = `${topOrder}`;
            document.getElementById('topOrderCount').textContent = `${speciesCountByOrder[topOrder]}`;
            document.getElementById('topFamily').textContent = `${topFamily}`;
            document.getElementById('topFamilyCount').textContent = `${speciesCountByFamily[topFamily]}`;
            document.getElementById('topGenus').textContent = `${topGenus}`;
            document.getElementById('topGenusCount').textContent = `${speciesCountByGenus[topGenus]}`;

            // Generating inventory table
            const inventoryTable = document.getElementById('inventoryTable');
            for (let ordem in inventoryData) {
                const orderDiv = document.createElement('div');
                orderDiv.innerHTML = `<h3>${ordem}</h3>`;
                for (let familia in inventoryData[ordem]) {
                    const familyDiv = document.createElement('div');
                    familyDiv.innerHTML = `<h4>${familia}</h4><ul>`;
                    Array.from(inventoryData[ordem][familia]).sort((a, b) => a.especie.localeCompare(b.especie)).forEach(item => {
                        familyDiv.innerHTML += `<li><em>${item.especie}</em> (${item.nomeComum})</li>`;
                    });
                    familyDiv.innerHTML += `</ul>`;
                    orderDiv.appendChild(familyDiv);
                }
                inventoryTable.appendChild(orderDiv);
            }
        })
        .catch(error => console.error('Error fetching data: ', error));
});
