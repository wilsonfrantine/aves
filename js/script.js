// catalog.js

document.addEventListener('DOMContentLoaded', () => {
    const url = './data/data_long.xlsx';
    const catalog = document.getElementById('catalog');

    let cards = [];
    let groupMembersSet = new Set();

    // Usando a função reutilizável para carregar dados do Excel
    fetchAndParseExcel(url, (json) => {
        json.forEach(row => {
            const columns = row.map(cell => (typeof cell === 'string' ? cell.trim() : cell));
            const aluno = columns[1];
            const groupMembers = columns[2] || ''; // Verificando se o campo existe e não é nulo
            groupMembers.split(',').forEach(member => groupMembersSet.add(member.trim()));

            for (let i = 4; i < columns.length; i += 9) {
                const nomeComum = columns[i];
                const especie = columns[i + 1];
                const familia = columns[i + 2];
                const ordem = columns[i + 3].replace('.', ''); // Remove o ponto final, se existir
                const alimentacao = columns[i + 4];
                const habitat = columns[i + 5];
                const curiosidades = columns[i + 6];
                let imagem = columns[i + 7];
                const localFoto = columns[i + 8];

                if (imagem && imagem.includes('drive.google.com/open?id=')) {
                    const fileId = imagem.split('id=')[1];
                    imagem = `https://drive.google.com/file/d/${fileId}/preview`;
                }

                if (especie && !speciesSet.has(especie)) {
                    speciesSet.add(especie);
                    const genero = especie.split(' ')[0];
                    if (genero) generaSet.add(genero);
                    if (familia) familiesSet.add(familia);
                    if (ordem) ordersSet.add(ordem);

                    // Atualizar dados de métricas
                    updateInventoryData(ordem, familia, especie, nomeComum);
                }

                if (nomeComum) {
                    const card = createCard(nomeComum, especie, familia, ordem, alimentacao, habitat, curiosidades, imagem, localFoto, groupMembers);
                    catalog.appendChild(card);
                    cards.push(card);
                }
            }
        });

        initLazyLoading(cards);

        const groupMembersArray = Array.from(groupMembersSet).sort();
        document.getElementById('groupMembers').textContent = groupMembersArray.join(', ');

        // Atualizar métricas após o processamento
        updateCountsAndTopElements();
        generateInventoryTable();

        // Adiciona eventos de ordenação
        document.getElementById('sortNomeComum').addEventListener('click', () => sortByNomeComum(cards, catalog));
        document.getElementById('sortEspecie').addEventListener('click', () => sortByEspecie(cards, catalog));
        document.getElementById('sortFamilia').addEventListener('click', () => sortByFamilia(cards, catalog));
        document.getElementById('sortOrdem').addEventListener('click', () => sortByOrdem(cards, catalog));

        console.log('Todos os dados foram processados com sucesso.');
    });

    function createCard(nomeComum, especie, familia, ordem, alimentacao, habitat, curiosidades, imagem, localFoto, groupMembers) {
        const card = createElement('div', '', 'card');
        card.dataset.index = cards.length;

        const iframe = createElement('iframe');
        iframe.dataset.src = imagem;
        iframe.width = '100%';
        iframe.height = '200px';
        iframe.style.border = 'none';
        iframe.allow = 'autoplay';
        card.appendChild(iframe);

        card.appendChild(createElement('h2', nomeComum));
        card.appendChild(createElement('p', `Espécie: ${especie}`, 'especie'));
        card.appendChild(createElement('p', `Família: ${familia}`, 'familia'));
        card.appendChild(createElement('p', `Ordem: ${ordem}`, 'ordem'));
        card.appendChild(createElement('p', `Alimentação: ${alimentacao}`, 'alimentacao'));
        card.appendChild(createElement('p', `Habitat: ${habitat}`, 'habitat'));
        card.appendChild(createElement('p', `Curiosidades: ${curiosidades}`, 'curiosidades'));
        card.appendChild(createElement('p', `Local da foto: ${localFoto}`, 'localFoto'));
        card.appendChild(createElement('p', `Alunos: ${groupMembers}`, 'fonte'));

        return card;
    }

    function initLazyLoading(cards) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target.querySelector('iframe');
                    if (iframe.dataset.src) {
                        iframe.src = iframe.dataset.src;
                        delete iframe.dataset.src;
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => observer.observe(card));
    }
});
