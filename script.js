const API_URL = 'https://api.jikan.moe/v4/top/anime'; // Example API (Jikan API for anime data)
let currentPage = 1;
let currentCategory = 'top';

document.addEventListener('DOMContentLoaded', () => {
    fetchAnimeNews();

    document.getElementById('search-button').addEventListener('click', searchAnimeNews);
    document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => changePage(1));

    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            currentCategory = e.target.getAttribute('data-category');
            currentPage = 1;
            fetchAnimeNews();
        });
    });
});

async function fetchAnimeNews() {
    showLoadingSpinner(true);
    try {
        const response = await fetch(`${API_URL}?page=${currentPage}&category=${currentCategory}`);
        const data = await response.json();
        displayNews(data.data);
    } catch (error) {
        console.error('Error fetching anime news:', error);
    } finally {
        showLoadingSpinner(false);
    }
}

function displayNews(news) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';

    news.forEach(article => {
        const card = document.createElement('div');
        card.className = 'card bg-gray-800 p-5 rounded-lg shadow-lg';

        card.innerHTML = `
            <img src="${article.images.jpg.image_url}" alt="${article.title}" class="w-full h-64 object-cover rounded-lg mb-4">
            <h2 class="text-2xl font-bold mb-2">${article.title}</h2>
            <p class="mb-4">${article.synopsis}</p>
            <a href="${article.url}" target="_blank" class="text-blue-500 hover:underline"><i class="fas fa-external-link-alt"></i> Read more</a>
        `;

        newsContainer.appendChild(card);
    });
}

function searchAnimeNews() {
    const query = document.getElementById('search-input').value.trim();
    if (query) {
        currentCategory = 'search';
        currentPage = 1;
        API_URL = `https://api.jikan.moe/v4/search/anime?q=${query}`;
        fetchAnimeNews();
    }
}

function changePage(direction) {
    currentPage += direction;
    fetchAnimeNews();
}

function showLoadingSpinner(show) {
    const loadingSpinner = document.getElementById('loading');
    if (show) {
        loadingSpinner.classList.remove('hidden');
    } else {
        loadingSpinner.classList.add('hidden');
    }
}
