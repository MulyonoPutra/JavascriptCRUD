const postList = document.querySelector('.post-list');
const apiUrl = 'http://localhost:3000/data';
const addForm = document.querySelector('.add-new-form');
const titleValue = document.getElementById('title-value');
const bodyValue = document.getElementById('body-value');
const btnSubmit = document.querySelector('.btn-submit');
let output = '';

// GET: Read the posts
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        renderPosts(data)
    });


postList.addEventListener('click', (e) => {
    e.preventDefault();
    let deleteBtnClick = e.target.id == 'delete-post';
    let editBtnClick = e.target.id == 'edit-post';
    let id = e.target.parentElement.dataset.id;

    // DELETE: Delete the posts
    if (deleteBtnClick) {
        fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(() => location.reload());
    }

    if (editBtnClick) {

        const parent = e.target.parentElement;
        let titleContent = parent.querySelector('.card-title').textContent;
        let bodyContent = parent.querySelector('.card-text').textContent;

        titleValue.value = titleContent;
        bodyValue.value = bodyContent;

        // PUT: Update the posts
        btnSubmit.addEventListener('click', (e) => {
            e.preventDefault();
            fetch(`${apiUrl}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: titleValue.value,
                    body: bodyValue.value
                })
            }).then(response => response.json())
                .then(() => location.reload());
        })

    }

}
);

const renderPosts = (posts) => {
    posts.forEach(post => {
        output += `
            <div class="card col-md-6" style="width: 18rem;">
                <div class="card-body" data-id="${post.id}">
                    <h5 class="card-title">${post.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${post.date}</h6>
                    <p class="card-text">${post.body}</p>
                    <a class="btn btn-warning" id="edit-post">Edit</a>
                    <a class="btn btn-primary" id="delete-post">Delete</a>
                </div>
            </div>
    `
    });
    postList.innerHTML = output;
}


// POST: Create a new post

addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Form submitted');
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: titleValue.value,
            body: bodyValue.value
        })
    }).then(response => response.json())
        .then(data => {
            const postArray = [];
            postArray.push(data);
            renderPosts(postArray);
        });

    titleValue.value = '';
    bodyValue.value = '';
});


