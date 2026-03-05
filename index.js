
const categoriesContainer = document.getElementById('categoriesContainer');
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
    console.log(data);
    console.log(categoriesContainer);
    data.categories.forEach(category => {
        // console.log(category);
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline w-full';
        btn.textContent = category.category_name
        categoriesContainer.appendChild(btn);

    });
}
loadCategories()