const container = document.querySelector(".search-container");
const toggle = document.getElementById("toggleSearch");
const input = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");
const resultsDiv = document.getElementById("results");
const dropdown = document.getElementById("dropdownResults");
const homeSection = document.querySelector(".home");

resultsDiv.style.display = "none";

let data = {};
let dataLoaded = false;

fetch("travel_recommendation_api.json")
    .then(res => res.json())
    .then(json => {
        data = json;
        dataLoaded = true;
        console.log("Data loaded:", data);
    })
    .catch(err => console.log("Error loading JSON:", err));

toggle.addEventListener("click", () => {
    container.classList.toggle("expanded");
    if (container.classList.contains("expanded")) input.focus();
});

function normalizeKeyword(word) {
    word = word.toLowerCase().trim();
    if (word.includes("beach")) return "beaches";
    if (word.includes("temple")) return "temples";
    if (word.includes("country")) return "countries";
    return null;
}

function createDropdownCard(item) {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("dropdown-item");
    cardDiv.style.display = "flex";
    cardDiv.style.flexDirection = "column";
    cardDiv.style.padding = "10px";
    cardDiv.style.border = "1px solid #eee";
    cardDiv.style.marginTop = "5px";
    cardDiv.style.borderRadius = "10px";
    cardDiv.style.background = "#fff";
    cardDiv.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
    cardDiv.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}" style="width:100%; height:150px; object-fit:cover; border-radius:8px; margin-bottom:5px;">
        <h3 style="margin:0; font-size:1rem; color:navy;">${item.name}</h3>
        <p style="margin:5px 0 0 0; color:black; font-size:0.85rem;">${item.description}</p>
    `;
    cardDiv.addEventListener("click", () => {
        input.value = item.name;
        dropdown.style.display = "none";
    });
    return cardDiv;
}

input.addEventListener("input", () => {
    if (!dataLoaded) return;

    const searchValue = input.value.toLowerCase().trim();
    dropdown.innerHTML = "";

    if (!searchValue) {
        dropdown.style.display = "none";
        return;
    }

    let hasResults = false;

    if (searchValue === "country" && data.countries) {
        data.countries.forEach(c => {
            c.cities.forEach(city => {
                dropdown.appendChild(createDropdownCard(city));
                hasResults = true;
            });
        });
    } else {
        if (data.countries) {
            data.countries.forEach(c => {
                c.cities.forEach(city => {
                    if (city.name.toLowerCase().includes(searchValue)) {
                        dropdown.appendChild(createDropdownCard(city));
                        hasResults = true;
                    }
                });
            });
        }

        const keyword = normalizeKeyword(searchValue);
        if (keyword && data[keyword]) {
            data[keyword].forEach(item => {
                dropdown.appendChild(createDropdownCard(item));
                hasResults = true;
            });
        }
    }

    dropdown.style.display = hasResults ? "flex" : "none";
    dropdown.style.flexDirection = "column";
});

document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-container")) dropdown.style.display = "none";
});

searchBtn.addEventListener("click", () => {
    const searchValue = input.value.toLowerCase().trim();
    dropdown.style.display = "none";

    let results = [];

    if (searchValue === "country" && data.countries) {
        data.countries.forEach(c => results.push(...c.cities));
    } else {
        data.countries.forEach(c => {
            c.cities.forEach(city => {
                if (city.name.toLowerCase() === searchValue) results.push(city);
            });
        });

        const keyword = normalizeKeyword(searchValue);
        if (keyword && data[keyword]) results.push(...data[keyword]);
    }

    if (results.length === 0) {
        resultsDiv.innerHTML = "<p style='color:white;'>No results found</p>";
        resultsDiv.style.display = "flex";
    } else {
        resultsDiv.innerHTML = "";
        results.forEach(item => {
            const card = document.createElement("div");
            card.classList.add("result-card");
            card.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
            `;
            resultsDiv.appendChild(card);
        });
        resultsDiv.style.display = "flex";
        homeSection.classList.add("hide-overlay");
    }
});

resetBtn.addEventListener("click", () => {
    input.value = "";
    resultsDiv.innerHTML = "";
    dropdown.innerHTML = "";
    dropdown.style.display = "none";
    resultsDiv.style.display = "none";
    homeSection.classList.remove("hide-overlay");
});

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchBtn.click();
});