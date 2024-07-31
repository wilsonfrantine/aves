document.addEventListener('DOMContentLoaded', () => {
    const catalog = document.getElementById('catalog');
    const url = './data/data.xlsx'; // Atualize o caminho para o arquivo Excel local

    fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            json.slice(1).forEach(row => {
                const columns = row;

                const studentName = columns[1];
                const groupMembers = columns[2];
                // Loop through the bird data starting from the 5th column (index 4)
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

                    if (nomeComum) {
                        const card = document.createElement('div');
                        card.className = 'card';

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
                        fonteElement.innerHTML = `<strong>Fonte:</strong> ${studentName}`;
                        card.appendChild(fonteElement);

                        catalog.appendChild(card);
                    }
                }
            });
            console.log('Todos os dados foram processados com sucesso.');
        })
        .catch(error => console.error('Error fetching data: ', error));
});
