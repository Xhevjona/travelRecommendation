const container = document.querySelector(".search-container");
const toggle = document.getElementById("toggleSearch");

toggle.addEventListener("click", () => {
    container.classList.toggle("expanded");

    if (container.classList.contains("expanded")) {
        document.getElementById("searchInput").focus();
    }
});