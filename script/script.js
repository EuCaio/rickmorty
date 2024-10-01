let currentPage = 1;
const totalPages = 100;
let allCharacters = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

window.onload = function() {
    fetchCharacters(currentPage);
    window.addEventListener('scroll', handleScroll);
    displayFavorites();
};

function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        if (currentPage < totalPages) {
            currentPage++;
            fetchCharacters(currentPage);
        }
    }
}

function fetchCharacters(page) {
    fetch(`https://rickandmortyapi.com/api/character?page=${page}`)
        .then(response => response.json())
        .then(data => {
            allCharacters = allCharacters.concat(data.results);
            displayCharacters(allCharacters);
        })
        .catch(error => console.error('Erro:', error));
}

function displayCharacters(characters) {
    const charactersDiv = document.getElementById('characters');
    charactersDiv.innerHTML = '';

    characters.forEach(character => {
        const characterDiv = document.createElement('div');
        characterDiv.className = 'character';

        const image = document.createElement('img');
        image.src = character.image;
        image.alt = character.name;

        const name = document.createElement('h3');
        name.textContent = character.name;

        const gender = document.createElement('p');
        gender.textContent = `Gênero: ${character.gender}`;

        const species = document.createElement('p');
        species.textContent = `Espécie: ${character.species}`;

        const status = document.createElement('p');
        status.textContent = `Status: ${character.status}`;

        // Botão para adicionar/remover dos favoritos
        const favoriteButton = document.createElement('button');
        favoriteButton.textContent = isFavorite(character) ? 'Item Favoritado' : 'Favoritar';
        favoriteButton.onclick = () => toggleFavorite(character, favoriteButton);

        characterDiv.appendChild(image);
        characterDiv.appendChild(name);
        characterDiv.appendChild(gender);
        characterDiv.appendChild(status);
        characterDiv.appendChild(species);
        characterDiv.appendChild(favoriteButton);

        charactersDiv.appendChild(characterDiv);
    });
}

function toggleFavorite(character, button) {
    if (isFavorite(character)) {
        favorites = favorites.filter(fav => fav.id !== character.id);
        button.textContent = 'Favoritar';
    } else {
        favorites.push(character);
        button.textContent = 'Item Favoritado';
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function isFavorite(character) {
    return favorites.some(fav => fav.id === character.id);
}

function filterCharacters() {
    const filterValue = document.getElementById('filterInput').value.toLowerCase();
    const filteredCharacters = allCharacters.filter(character => character.name.toLowerCase().includes(filterValue));
    displayCharacters(filteredCharacters);
}