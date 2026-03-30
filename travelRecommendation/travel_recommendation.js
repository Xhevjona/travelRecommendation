const container = document.querySelector(".search-container");
const toggle = document.getElementById("toggleSearch");

toggle.addEventListener("click", () => {
    container.classList.toggle("expanded");

    if (container.classList.contains("expanded")) {
        document.getElementById("searchInput").focus();
    }
});

const input = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");
const resultsDiv = document.getElementById("results");
const dropdown = document.getElementById("dropdownResults");
const homeSection = document.querySelector(".home");

resultsDiv.style.display = "none";

let data = {};

fetch("travel_recommendation_api.json")
    .then(res => res.json())
    .then(json => {
        data = json;
        console.log("Data loaded:", data);
    })
    .catch(err => console.log("Error loading JSON:", err));

function normalizeKeyword(word) {
    word = word.toLowerCase().trim();

    if (word.includes("beach")) return "beaches";
    if (word.includes("temple")) return "temples";
    if (word.includes("country")) return "countries";

    return null;
}

function displayResults(items) {
    resultsDiv.innerHTML = "";

    items.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("result-card");

        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
        `;

        resultsDiv.appendChild(card);
    });
}

input.addEventListener("input", () => {
    const keyword = normalizeKeyword(input.value);

    dropdown.innerHTML = "";

    resultsDiv.style.display = "none";

    if (!keyword || !data[keyword]) {
        dropdown.style.display = "none";
        return;
    }

    data[keyword].slice(0, 2).forEach(item => {
        const div = document.createElement("div");
        div.classList.add("dropdown-item");
        div.textContent = item.name;

        div.addEventListener("click", () => {
            input.value = item.name;
            dropdown.style.display = "none";
        });

        dropdown.appendChild(div);
    });

    dropdown.style.display = "flex";
});

document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-container")) {
        dropdown.style.display = "none";
    }
});

searchBtn.addEventListener("click", () => {
    const keyword = normalizeKeyword(input.value);

    dropdown.style.display = "none";

    if (!keyword || !data[keyword]) {
        resultsDiv.innerHTML = "<p style='color:white;'>No results found</p>";
        resultsDiv.style.display = "block";
        return;
    }

    displayResults(data[keyword]);

    resultsDiv.style.display = "flex";

    homeSection.classList.add("hide-overlay");
});

resetBtn.addEventListener("click", () => {
    input.value = "";
    resultsDiv.innerHTML = "";
    dropdown.style.display = "none";

    resultsDiv.style.display = "none";

    homeSection.classList.remove("hide-overlay");
});

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});