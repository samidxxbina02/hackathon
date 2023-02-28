const API = "http://localhost:3000/post";

let post = [];
let editStatus = false;

let initialState = {
  name: "",
  photo: "",
  text: "",
  email: "",
};

let addPostForm = {
  ...initialState,
};

let editPostForm = {
  ...initialState,
};

let inputs = document.querySelectorAll("input");
let btn = document.querySelector("button");
let postList = document.querySelector(".post_list");

inputs.forEach((input) => {
  let field = input.getAttribute("name");
  input.addEventListener("input", (event) => {
    handleChange(field, event.target.value);
  });
});

btn.addEventListener("click", (event) => {
  event.preventDefault();
  if (editStatus) {
    editPost(editPostForm, editPostForm.id);
    resetForm();
    btn.innerText = "Add";
  } else {
    if (Object.values(addPostForm).some((value) => !value.trim())) {
      alert("Не все поля заполнены!");
    } else {
      createPost(addContactForm);
      resetForm();
    }
  }
});

async function getPost() {
  let postResponse = await fetch(API).then((res) => res.json());
  post = postResponse;
  render();
}

async function render() {
  let res = await fetch(`${API}?q=${searchVal}&_page=${currentPage}&_limit=3`);
  let post = await res.json();

  drawPaginayionButtons();
  // очищаем лист
  postList.innerHTML = "";
  // перебираем массив products

  post.forEach((element) => {
    // создаем новый див

    let newElem = document.createElement("div");
    // задаем айди новому диву

    newElem.id = element.id;
    // помещаем карточку в созданный див
    newElem.innerHTML = `
      <div class="card m-5" style="width: 18rem;">
     <img src=${element.image} class="card-img-top" alt="...">
     <div class="card-body">
      <h5 class="card-title">${element.title}</h5>
      <p class="card-text">${element.descr}</p>
      <p class="card-text">${element.price}</p>
  
      <a href="#"  id=${element.id} class="btn btn-danger btn-delete">DELETE</a>
      <a href="#" id=${element.id} class="btn btn-warning btn-edit" data-bs-toggle="modal" data-bs-target="#exampleModal">EDIT</a>
  
  
     </div>
     </div>
      `;
    // добавляем созданный див с карточкой внутри list
    postList.append(newElem);
  });
}

async function deletePost(id) {
  await fetch(`${API}${id}`, {
    method: "DELETE",
  });
  post = post.filter((post) => post.id != id);
  render();
}

async function editPost(editedPost, id) {
  const editedPostResponse = await fetch(`${API}${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editedPost),
  }).then((res) => res.json());
  post = post.map((post) => (post.id == id ? editedPostResponse : post));
  render();
}

async function createPost(post) {
  const createdPostResponse = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact),
  }).then((res) => res.json());
  post.push(createdPostResponse);
  render();
}

function resetForm() {
  inputs.forEach((input) => {
    input.value = "";
  });
  if (editStatus) {
    editPostForm = {
      ...initialState,
    };
  } else {
    addPostForm = {
      ...initialState,
    };
  }
}

function handleChange(field, value) {
  if (editStatus) {
    editPostForm = {
      ...editPostForm,
      [field]: value,
    };
  } else {
    addPostForm = {
      ...addPostForm,
      [field]: value,
    };
  }
}
