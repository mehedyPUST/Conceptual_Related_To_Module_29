
const categoriesContainer = document.getElementById('categoriesContainer');
const treesContainer = document.getElementById('treesContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const allTreesBtn = document.getElementById('allTreesBtn');
const treeDetailsModal = document.getElementById('tree-details-modal');
const modalImage = document.getElementById('modalImage');
const modalCategory = document.getElementById('modalCategory');
const modalDescription = document.getElementById('modalDescription');
const modalPrice = document.getElementById('modalPrice');
const modalTitle = document.getElementById('modalTitle');
const cartContainer = document.getElementById('cartContainer');
const totalPrice = document.getElementById('totalPrice');
const emptyCartMsg = document.getElementById('emptyCartMsg');
let cart = [];
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
            <figure onclick ="openTreeModal(${tree.id})">
                <img src="${tree.image}"
                    alt="${tree.name}"
                    title="${tree.name}" 
                    class="h-48 w-full object-cover cursor-pointer"/>
            </figure>
            <div class="card-body" >
                <h2 class="card-title cursor-pointer" onclick ="openTreeModal(${tree.id})" >${tree.name}</h2>
                <p class=" line-clamp-3 cursor-pointer" onclick ="openTreeModal(${tree.id})">${tree.description}</p>
                <div class="badge badge-outline badge-success">${tree.category}</div>
                <div class=" flex justify-between items-center gap-2">
                    <h2 class="font-bold text-xl text-green-500 ">$${tree.price}</h2>
                    <button class="btn btn-primary bg-green-500 border-none" onclick="addToCart(${tree.id}, '${tree.name}', ${tree.price})">Cart</button>
                </div>
            </div>
`;
        treesContainer.appendChild(card);

    });
}
async function openTreeModal(treeId) {
    console.log(treeId, "treeId");
    const res = await fetch(`https://openapi.programming-hero.com/api/plant/${treeId}`);
    const data = await res.json();
    const plantDetails = data.plants;
    console.log(plantDetails, 'data')
    console.log(data, 'data');

    modalTitle.textContent = plantDetails.name;
    modalImage.src = plantDetails.image;
    modalCategory.textContent = plantDetails.category;
    modalPrice.textContent = plantDetails.price;
    modalDescription.textContent = plantDetails.description;
    treeDetailsModal.showModal();
}

function addToCart(id, name, price) {
    console.log(id, name, price, 'add to cart ');
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id,
            name,
            price,
            quantity: 1
        });
    }

    updateCart();
}

function updateCart() {
    cartContainer.innerHTML = "";
    if (cart.length === 0) {
        emptyCartMsg.classList.remove("hidden")
        return;
    }
    emptyCartMsg.classList.add("hidden")

    let total = 0;
    console.log(cart);
    cart.forEach(item => {
        total = total + item.price * item.quantity;
        const cartItem = document.createElement("div");
        cartItem.className = "card card-body shadow-2xl bg-green-100"
        cartItem.innerHTML = `
          <div class="flex justify-between items-center">
                <div>
                    <h2>${item.name}</h2>
                    <p>$${item.price} x ${item.quantity}</p>
                </div>
                <button class="btn btn-ghost" onclick= "removeFromCart(${item.id})">X</button>
            </div>
            <p class=" text-right font-semibold text-xl">$${item.price * item.quantity}</p>
         
         `;
        cartContainer.appendChild(cartItem);
    })
    totalPrice.innerText = `$${total}`;
}

function removeFromCart(treeId) {
    // console.log(treeId, "treeId");
    const updatedCartElements = cart.filter(item => item.id != treeId);
    cart = updatedCartElements;
    updateCart();
}


loadCategories();
loadTrees();
updateCart()
