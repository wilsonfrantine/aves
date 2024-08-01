document.addEventListener('DOMContentLoaded', () => {
    const catalog = document.getElementById('catalog');
    const zoomModal = document.getElementById('zoomModal');
    const zoomImage = document.getElementById('zoomImage');
    const zoomInfo = document.getElementById('zoomInfo');
    const closeBtn = document.getElementById('closeBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const sortNomeComumBtn = document.getElementById('sortNomeComum');
    const sortEspecieBtn = document.getElementById('sortEspecie');
    const sortFamiliaBtn = document.getElementById('sortFamilia');
    const sortOrdemBtn = document.getElementById('sortOrdem');
    const url = './data/data.xlsx';

    let cards = [];
    let currentIndex = 0;

    fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            json.slice(1).forEach(row => {
                row = row.map(cell => (typeof cell === 'string' ? cell.trim() : cell));

                const columns = row;

                const studentName = columns[1];
                const groupMembers = columns[2];
                for (let i = 4; i < columns.length; i += 9) {
                    const nomeComum = columns[i];
                    const especie = columns[i + 1];
                    const familia = columns[i + 2];
                    const ordem = columns[i + 3];
                    const alimentacao = columns[i + 4];
                    const habitat = columns[i + 5];
                    const curiosidades = columns[i + 6];
                    let imagem = columns[i + 7];
                    const localFoto = columns[i + 8];

                    if (imagem && imagem.includes('drive.google.com/open?id=')) {
                        const fileId = imagem.split('id=')[1];
                        imagem = `https://drive.usercontent.google.com/download?id=${fileId}&export=view`;
                    }

                    if (nomeComum) {
                        const card = document.createElement('div');
                        card.className = 'card';
                        card.dataset.index = cards.length;

                        const img = document.createElement('img');
                        img.src = imagem;
                        img.alt = nomeComum;
                        img.onerror = () => console.error(`Erro ao carregar imagem: ${imagem}`);
                        card.appendChild(img);

                        const title = document.createElement('h2');
                        title.textContent = nomeComum;
                        card.appendChild(title);

                        const especieElement = document.createElement('p');
                        especieElement.innerHTML = `<strong>Espécie:</strong> <i>${especie}</i>`;
                        card.appendChild(especieElement);

                        const familiaElement = document.createElement('p');
                        familiaElement.innerHTML = `<strong>Família:</strong> ${familia}`;
                        card.appendChild(familiaElement);

                        const ordemElement = document.createElement('p');
                        ordemElement.innerHTML = `<strong>Ordem:</strong> ${ordem}`;
                        card.appendChild(ordemElement);

                        const alimentacaoElement = document.createElement('p');
                        alimentacaoElement.innerHTML = `<strong>Alimentação:</strong> ${alimentacao}`;
                        card.appendChild(alimentacaoElement);

                        const habitatElement = document.createElement('p');
                        habitatElement.innerHTML = `<strong>Habitat:</strong> ${habitat}`;
                        card.appendChild(habitatElement);

                        const curiosidadesElement = document.createElement('p');
                        curiosidadesElement.innerHTML = `<strong>Curiosidades:</strong> ${curiosidades}`;
                        card.appendChild(curiosidadesElement);

                        const localFotoElement = document.createElement('p');
                        localFotoElement.innerHTML = `<strong>Local da foto:</strong> ${localFoto}`;
                        card.appendChild(localFotoElement);

                        const fonteElement = document.createElement('p');
                        fonteElement.innerHTML = `<strong>Alunos:</strong> ${groupMembers}`;
                        card.appendChild(fonteElement);

                        card.addEventListener('click', () => openZoom(card));
                        catalog.appendChild(card);
                        cards.push(card);
                    }
                }
            });
            console.log('Todos os dados foram processados com sucesso.');
        })
        .catch(error => console.error('Error fetching data: ', error));

    function openZoom(card) {
        currentIndex = parseInt(card.dataset.index);
        updateZoom();
        zoomModal.style.display = 'block';
    }

    function updateZoom() {
        const card = cards[currentIndex];
        const imgSrc = card.querySelector('img').src;
        const info = card.querySelectorAll('p, h2');

        zoomImage.src = imgSrc;
        zoomInfo.innerHTML = '';
        info.forEach(element => {
            zoomInfo.innerHTML += element.outerHTML + '<br>';
        });
    }

    function closeZoom() {
        zoomModal.style.display = 'none';
    }

    function showPrev() {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : cards.length - 1;
        updateZoom();
    }

    function showNext() {
        currentIndex = (currentIndex < cards.length - 1) ? currentIndex + 1 : 0;
        updateZoom();
    }

    function sortCatalog(compareFunction) {
        cards.sort(compareFunction);
        catalog.innerHTML = '';
        cards.forEach(card => {
            catalog.appendChild(card);
        });
    }

    sortNomeComumBtn.addEventListener('click', () => {
        sortCatalog((a, b) => {
            const nomeA = a.querySelector('h2').textContent.toLowerCase();
            const nomeB = b.querySelector('h2').textContent.toLowerCase();
            return nomeA.localeCompare(nomeB);
        });
    });

    sortEspecieBtn.addEventListener('click', () => {
        sortCatalog((a, b) => {
            const especieA = a.querySelector('p:nth-of-type(1) i').textContent.toLowerCase();
            const especieB = b.querySelector('p:nth-of-type(1) i').textContent.toLowerCase();
            return especieA.localeCompare(especieB);
        });
    });

    sortFamiliaBtn.addEventListener('click', () => {
        sortCatalog((a, b) => {
            const familiaA = a.querySelector('p:nth-of-type(2)').textContent.toLowerCase();
            const familiaB = b.querySelector('p:nth-of-type(2)').textContent.toLowerCase();
            return familiaA.localeCompare(familiaB);
        });
    });

    sortOrdemBtn.addEventListener('click', () => {
        sortCatalog((a, b) => {
            const ordemA = a.querySelector('p:nth-of-type(3)').textContent.toLowerCase();
            const ordemB = b.querySelector('p:nth-of-type(3)').textContent.toLowerCase();
            return ordemA.localeCompare(ordemB);
        });
    });

    closeBtn.addEventListener('click', closeZoom);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    window.addEventListener('click', (event) => {
        if (event.target === zoomModal) {
            closeZoom();
        }
    });
});
