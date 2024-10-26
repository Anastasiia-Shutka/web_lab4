import {
    addItemToPage,
    renderItemsList,
    clearInputs,
    getInputValues,
} from "./dom_util.js";

const inputName = document.getElementById('input-name');
const inputDuration = document.getElementById('input-duration');
const inputReviews = document.getElementById('input-reviews');
const itemsContainer = document.getElementById('items-container');
const modal = document.getElementById("modal");
const create = document.getElementById('create');
const countReviewsButton = document.getElementById('count-reviews');
const reviewCountDisplay = document.getElementById('review-count');
const sortButton = document.getElementById('sort-button');
const sortOptions = document.getElementById('sort-options');
const closeModalBtn = document.getElementById("close-modal");

let movies = [];
let currentEditId = null;

function validateInputs() {
    const name = inputName.value.trim();
    const duration = inputDuration.value.trim();
    const reviews = inputReviews.value.trim();

    const namePattern = /^[A-Za-z\s]+$/;
    if (!namePattern.test(name)) {
        alert("Name should only contain letters and spaces.");
        return false;
    }

    if (isNaN(duration) || Number(duration) <= 0) {
        alert("Duration should be a positive number.");
        return false;
    }
    if (isNaN(reviews) || Number(reviews) < 0) {
        alert("Reviews should be a non-negative number.");
        return false;
    }

    return true;
}
const handleEdit = (id) => {
    const itemToEdit = movies.find(movie => movie.id === id);
    
    if (itemToEdit) {
        currentEditId = id;

        inputName.value = itemToEdit.name;
        inputDuration.value = itemToEdit.duration;
        inputReviews.value = itemToEdit.reviews;

        modal.style.display = "block";
    }
};
create.addEventListener('click', (event) => {
    event.preventDefault();

    modal.style.display = "block"
});

document.getElementById('save-movie').addEventListener('click', (event) => {
    event.preventDefault()
    if (!validateInputs()) {
        return;
    }

    const value = getInputValues();

    if (!value) {
        alert("Please fill in all fields to create a movie.");
        return;
    }

    if (currentEditId) {
        const index = movies.findIndex(movie => movie.id === currentEditId);
        if (index !== -1) {
            movies[index] = { ...movies[index], ...value };
            currentEditId = null
        }
    } else {
        movies.push(value);
    }

    renderItemsList(movies);
    clearInputs();
    modal.style.display = "none"
});

closeModalBtn.onclick = function() {
    modal.style.display = "none";
    clearInputs();
};

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        clearInputs();
    }
};

document.getElementById('search').addEventListener("click", () => {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const foundMovies = movies.filter(movie => movie.name.toLowerCase().includes(searchInput));
    renderItemsList(foundMovies);
});

document.getElementById('cancel').addEventListener("click", () => {
    renderItemsList(movies);
    document.getElementById('search-input').value = "";
});

countReviewsButton.addEventListener('click', () => {
    const totalReviews = movies.reduce((sum, movie) => sum + Number(movie.reviews), 0);
    reviewCountDisplay.textContent = `Total IMDB Reviews: ${totalReviews}`;
});


sortButton.addEventListener('click', () => {
    const sortBy = sortOptions.value;

    if (sortBy === 'name') {
        movies.sort((a, b) => b.name.localeCompare(a.name, 'en', { sensitivity: 'base' }));
    } else if (sortBy === 'duration') {
        movies.sort((a, b) => b.duration - a.duration);
    } else if (sortBy === 'reviews') {
        movies.sort((a, b) => b.reviews - a.reviews);
    }

    renderItemsList(movies);
});

document.getElementById('create').addEventListener('click', () => {
    currentEditId = null;
    clearInputs();
    modal.style.display = "block"; 
});

document.addEventListener("click", (event) => {
    if (event.target && event.target.classList.contains("btn-info")) {
        const id = event.target.id.split("-")[0];
        handleEdit(id);
    }
});
