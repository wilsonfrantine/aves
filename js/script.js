document.addEventListener('DOMContentLoaded', () => {
    const catalog = document.getElementById('catalog');
    const spreadsheetId = '1Uv7G-nbE_TJJH0OwR1NxkI9g_V0sjRLfahO5qons2DQ';
    const range = 'Sheet1!A:CP';
    //https://docs.google.com/spreadsheets/d/1Uv7G-nbE_TJJH0OwR1NxkI9g_V0sjRLfahO5qons2DQ/edit?usp=drive_link

    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${range}`;

    fetch(url)
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.split('\n').slice(1); // Ignorar a primeira linha (cabeçalhos)

            rows.forEach(row => {
                const columns = row.match(/("([^"]|"")*"|[^,]*)(?=,|$)/g);
                
                const studentName = columns[1];
                const groupMembers = columns[2];
                // Loop through the bird data starting from the 5th column (index 4)
                for (let i = 4; i < columns.length; i += 10) {
                    const nomeComum = columns[i];
                    const especie = columns[i + 1];
                    const familia = columns[i + 2];
                    const ordem = columns[i + 3];
                    const alimentacao = columns[i + 4];
                    const habitat = columns[i + 5];
                    const curiosidades = columns[i + 6];
                    const imagem = columns[i + 7];
                    const localFoto = columns[i + 8];

                    if (nomeComum) {
                        const card = document.createElement('div');
                        card.className = 'card';

                        const img = document.createElement('img');
                        img.src = imagem;
                        img.alt = nomeComum;
                        card.appendChild(img);

                        const title = document.createElement('h2');
                        title.textContent = nomeComum;
                        card.appendChild(title);

                        const especieElement = document.createElement('p');
                        especieElement.textContent = `Espécie: ${especie}`;
                        card.appendChild(especieElement);

                        const familiaElement = document.createElement('p');
                        familiaElement.textContent = `Família: ${familia}`;
                        card.appendChild(familiaElement);

                        const ordemElement = document.createElement('p');
                        ordemElement.textContent = `Ordem: ${ordem}`;
                        card.appendChild(ordemElement);

                        const alimentacaoElement = document.createElement('p');
                        alimentacaoElement.textContent = `Alimentação: ${alimentacao}`;
                        card.appendChild(alimentacaoElement);

                        const habitatElement = document.createElement('p');
                        habitatElement.textContent = `Habitat: ${habitat}`;
                        card.appendChild(habitatElement);

                        const curiosidadesElement = document.createElement('p');
                        curiosidadesElement.textContent = `Curiosidades: ${curiosidades}`;
                        card.appendChild(curiosidadesElement);

                        const localFotoElement = document.createElement('p');
                        localFotoElement.textContent = `Local da foto: ${localFoto}`;
                        card.appendChild(localFotoElement);

                        catalog.appendChild(card);
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching data: ', error));
});
