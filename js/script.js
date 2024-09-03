// catalog.js

document.addEventListener('DOMContentLoaded', () => {
    const url = './data/data_long.xlsx';
    const catalog = document.getElementById('catalog');

    let groupMembersSet = new Set();
    let speciesGroups = {}; // Para agrupar registros por espécie

    // Usando a função reutilizável para carregar dados do Excel
    fetchAndParseExcel(url, (json) => {
        json.forEach(row => {
            const columns = row.map(cell => (typeof cell === 'string' ? cell.trim() : cell));
            const aluno = columns[1];
            const groupMembers = columns[2] || '';
            groupMembers.split(',').forEach(member => groupMembersSet.add(member.trim()));

            for (let i = 4; i < columns.length; i += 9) {
                const nomeComum = columns[i];
                const especie = columns[i + 1];
                const familia = columns[i + 2];
                const ordem = columns[i + 3].replace('.', '');
                const alimentacao = columns[i + 4];
                const habitat = columns[i + 5];
                const curiosidades = columns[i + 6];
                let imagem = columns[i + 7];
                const localFoto = columns[i + 8];

                if (imagem && imagem.includes('drive.google.com/open?id=')) {
                    const fileId = imagem.split('id=')[1];
                    imagem = `https://drive.google.com/file/d/${fileId}/preview`;
                }

                // Atualizar dados de métricas para cada registro
                if (especie) {
                    speciesSet.add(especie);
                    generaSet.add(especie.split(' ')[0]);
                }
                if (familia) familiesSet.add(familia);
                if (ordem) ordersSet.add(ordem);

                // Agrupando registros por espécie
                if (!speciesGroups[especie]) speciesGroups[especie] = [];
                speciesGroups[especie].push({
                    nomeComum, especie, familia, ordem, alimentacao, habitat, curiosidades, imagem, localFoto, groupMembers
                });

                // Atualizar métricas
                updateInventoryData(ordem, familia, especie, nomeComum);
            }
        });

        const groupMembersArray = Array.from(groupMembersSet).sort();
        document.getElementById('groupMembers').textContent = groupMembersArray.join(', ');

        // Renderiza os grupos de espécies no grid de catálogo
        renderSpeciesCarousels(speciesGroups, catalog);

        // Atualizar métricas após o processamento
        updateCountsAndTopElements();
        generateInventoryTable();

        // Adiciona eventos de ordenação
        document.getElementById('sortNomeComum').addEventListener('click', () => sortByNomeComum(speciesGroups, catalog));
        document.getElementById('sortEspecie').addEventListener('click', () => sortByEspecie(speciesGroups, catalog));
        document.getElementById('sortFamilia').addEventListener('click', () => sortByFamilia(speciesGroups, catalog));
        document.getElementById('sortOrdem').addEventListener('click', () => sortByOrdem(speciesGroups, catalog));

        console.log('Todos os dados foram processados com sucesso.');
    });

    function renderSpeciesCarousels(speciesGroups, catalog) {
        catalog.innerHTML = ''; // Limpa o catálogo atual
        Object.keys(speciesGroups).forEach(especie => {
            const speciesContainer = createElement('div', '', 'species-card');
            const header = createElement('h2', especie, 'species-header');
            speciesContainer.appendChild(header);
    
            // Cria o carrossel para registros da espécie
            const carouselContainer = createElement('div', '', 'carousel-container');
            const carouselInner = createElement('div', '', 'carousel-inner');
    
            speciesGroups[especie].forEach((record, index) => {
                const card = createCarouselItem(record, index === 0); // Usando a função importada de utils.js
                carouselInner.appendChild(card);
            });
    
            // Condicional para exibir botões de navegação apenas se houver mais de uma imagem
            if (speciesGroups[especie].length > 1) {
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
    
        // Iniciar a observação das divs para lazy loading dos iframes após renderização
        initLazyLoading();
    }
    

    function navigateCarousel(carouselInner, direction) {
        const items = carouselInner.querySelectorAll('.carousel-item');
        const activeItem = carouselInner.querySelector('.carousel-item.active');
        let newIndex = Array.from(items).indexOf(activeItem);

        activeItem.classList.remove('active');

        if (direction === 'next') {
            newIndex = (newIndex + 1) % items.length;
        } else if (direction === 'prev') {
            newIndex = (newIndex - 1 + items.length) % items.length;
        }

        items[newIndex].classList.add('active');
    }

    function initLazyLoading() {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target.querySelector('iframe');
                    if (iframe && iframe.dataset.src) {
                        iframe.src = iframe.dataset.src;
                        delete iframe.dataset.src;
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.carousel-item').forEach(item => observer.observe(item));
    }
});
