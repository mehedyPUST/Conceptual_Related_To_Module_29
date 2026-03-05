
const categoriesContainer = document.getElementById('categoriesContainer');
const treesContainer = document.getElementById('treesContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const allTreesBtn = document.getElementById('allTreesBtn');

function showLoading() {
    loadingSpinner.classList.remove('hidden');
    loadingSpinner.classList.add('flex');
    treesContainer.innerHTML = "";
};

function hideLoading() {
    loadingSpinner.classList.remove('flex');
    loadingSpinner.classList.add('hidden');
};

// console.log(categoriesContainer);
// categoriesContainer.innerHTML = ' eikhane button gula asbe '

async function loadCategories() {
    // fetch('https://openapi.programming-hero.com/api/categories')
    //     .then((res) => res.json())

    //     .then((data) => {
    //         console.log(data);
    //     })
    //     .catch((e) => console.log(e));


    const res = await fetch("https://openapi.programming-hero.com/api/categories");
    const data = await res.json();
    // console.log(data);
    // console.log(categoriesContainer);
    data.categories.forEach(category => {
        // console.log(category);
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline w-full';
        btn.textContent = category.category_name;
        btn.onclick = () => selectCategory(category.id, btn);
        categoriesContainer.appendChild(btn);

    });
}

async function selectCategory(categoryId, btn) {
    console.log(categoryId, btn);
    showLoading();

    const allButtons = document.querySelectorAll("#categoriesContainer button, #allTreesBtn");
    // console.log(allButtons);
    allButtons.forEach(btn => {
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-outline");

    })
    btn.classList.add("btn-primary");
    btn.classList.remove("btn-outline");
    const res = await fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`);
    const data = await res.json();
    console.log(data);
    displayTrees(data.plants);
    hideLoading();
}

allTreesBtn.addEventListener('click', () => {
    const allButtons = document.querySelectorAll("#categoriesContainer button, #allTreesBtn");
    // console.log(allButtons);
    allButtons.forEach(btn => {
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-outline");

    })
    allTreesBtn.classList.add("btn-primary");
    allTreesBtn.classList.remove("btn-outline");
    loadTrees();
})

async function loadTrees() {
    showLoading();

    const res = await fetch("https://openapi.programming-hero.com/api/plants");
    const data = await res.json();
    hideLoading();
    // console.log(data);
    displayTrees(data.plants);
}

function displayTrees(trees) {
    // console.log(trees);
    trees.forEach((tree) => {
        // console.log(tree);
        const card = document.createElement('div');
        card.className = "card bg-white shadow-sm";
        card.innerHTML = `
            <figure>
                <img src="${tree.image}"
                    alt="${tree.name}"
                    title="${tree.name}" 
                    class="h-48 w-full object-cover"/>
            </figure>
            <div class="card-body">
                <h2 class="card-title">${tree.name}</h2>
                <p class=" line-clamp-3">${tree.description}</p>
                <div class="badge badge-outline badge-success">${tree.category}</div>
                <div class=" flex justify-between items-center gap-2">
                    <h2 class="font-bold text-xl text-green-500 ">$${tree.price}</h2>
                    <button class="btn btn-primary bg-green-500 border-none">Cart</button>
                </div>
            </div>
`;
        treesContainer.appendChild(card);

    });
}


loadCategories();
loadTrees();
