// =========================
// NewsHub - script.js
// =========================

const API_KEY = "pub_5d7ca1e0a89547eab3bf99c76a9631b8";
const API_URL = "https://newsdata.io/api/1/news";

let currentCategory = "general";
let currentPage = 1;
let currentQuery = "";

// DOM elements
const featuredArticles = document.getElementById("featured-articles");
const newsContainer = document.getElementById("news-container");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const loadMoreButton = document.getElementById("load-more");
const categoryLinks = document.querySelectorAll(".categories a");

// =========================
// Fetch news from API
// =========================
async function fetchNews(page = 1, category = "general", query = "") {
    try {
        const url = `${API_URL}?apikey=${API_KEY}&language=en&category=${category}&q=${encodeURIComponent(query)}&page=${page}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            if (page === 1) {
                displayFeaturedNews(data.results.slice(0, 3));
                newsContainer.innerHTML = "";
            }
            displayNews(data.results);
        } else {
            if (page === 1) {
                newsContainer.innerHTML = "<p>No news found.</p>";
                featuredArticles.innerHTML = "";
            }
        }
    } catch (error) {
        console.error("Error fetching news:", error);
        if (page === 1) {
            newsContainer.innerHTML = "<p>Failed to fetch news.</p>";
            featuredArticles.innerHTML = "";
        }
    }
}

// =========================
// Display featured news
// =========================
function displayFeaturedNews(articles) {
    featuredArticles.innerHTML = "";
    articles.forEach(article => {
        const item = document.createElement("div");
        item.classList.add("featured-item");
        item.innerHTML = `
            <a href="${article.link}" target="_blank">
                <img src="${article.image_url || 'https://via.placeholder.com/400x200'}" alt="${article.title}">
                <h3>${article.title}</h3>
            </a>
        `;
        featuredArticles.appendChild(item);
    });
}

// =========================
// Display regular news
// =========================
function displayNews(articles) {
    articles.forEach(article => {
        const item = document.createElement("div");
        item.classList.add("article-item");
        item.innerHTML = `
            <a href="${article.link}" target="_blank">
                <img src="${article.image_url || 'https://via.placeholder.com/300x150'}" alt="${article.title}">
                <h4>${article.title}</h4>
                <p>${article.description || ""}</p>
                <small>Source: ${article.source_id || "Unknown"} | ${new Date(article.pubDate).toLocaleString()}</small>
            </a>
        `;
        newsContainer.appendChild(item);
    });
}

// =========================
// Event Listeners
// =========================

// Search
searchButton.addEventListener("click", () => {
    currentQuery = searchInput.value.trim();
    currentPage = 1;
    fetchNews(currentPage, currentCategory, currentQuery);
});

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        currentQuery = searchInput.value.trim();
        currentPage = 1;
        fetchNews(currentPage, currentCategory, currentQuery);
    }
});

// Categories
categoryLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        categoryLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        currentCategory = link.dataset.category;
        currentPage = 1;
        currentQuery = "";
        searchInput.value = "";
        fetchNews(currentPage, currentCategory);
    });
});

// Load more
loadMoreButton.addEventListener("click", () => {
    currentPage++;
    fetchNews(currentPage, currentCategory, currentQuery);
});

// =========================
// Initial fetch
// =========================
fetchNews();
