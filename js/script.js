document.addEventListener('DOMContentLoaded', () => {
    const catalog = document.getElementById('catalog');
    const apiKey = 'YOUR_GOOGLE_SHEETS_API_KEY';
    const spreadsheetId = 'YOUR_SPREADSHEET_ID';
    const range = 'Sheet1!A:Z';

    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;
            rows.slice(1).forEach(row => {
                const studentName = row[1];
                const groupMembers = row[2];
                // Loop through the bird data starting from the 5th column (index 4)
                for (let i = 4; i < row.length; i += 10) {
                    const nomeComum = row[i];
                    const especie = row[i + 1];
                    const familia = row[i + 2];
                    const ordem = row[i + 3];
                    const alimentacao = row[i + 4];
                    const habitat = row[i + 5];
                    const curiosidades = row[i + 6];
                    const imagem = row[i + 7];
                    const localFoto = row[i + 8];

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
