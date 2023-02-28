const API = "http://localhost:3000/post";

//? pagination start
let paginationList = document.querySelector(".pagination");
let back = document.querySelector("#back");
let next = document.querySelector("#next");
let currentPage = 1;
let pageTotalCount = 1;
// ? pagination end

// ? search start
let searchInp = document.querySelector("#search");
let searchVal = "";
// ? search end

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
let btn = document.querySelector(".btnAdd");
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
    editStatus = false;
  } else {
    if (Object.values(addPostForm).some((value) => !value.trim())) {
      alert("Не все поля заполнены!");
    } else {
      createPost(addPostForm);
      resetForm();
    }
  }
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-delete")) {
    const id = event.target.getAttribute("id");
    if (confirm("Do you really wanna delete this contact?")) deletePost(id);
  }

  if (event.target.classList.contains("btn-edit")) {
    const id = event.target.getAttribute("id");
    editStatus = true;
    window.scrollTo(0, 0);
    btn.innerText = "Edit";
    let editedPost = post.find((post) => post.id == id);
    editPostForm = {
      ...editedPost,
    };
    inputs.forEach((input) => {
      const field = input.getAttribute("name");
      input.value = editPostForm[field];
    });
  }
});

async function getPost() {
  let postResponse = await fetch(API).then((res) => res.json());
  post = postResponse;
  console.log(postResponse);
  render();
}

async function render() {
  let res = await fetch(`${API}?q=${searchVal}&_page=${currentPage}&_limit=5`);
  let post = await res.json();

  drawPaginationButtons();
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
      <div class="card_wrapper">
      <h5 class="card-title ms-3 mt-2">${element.name}</h5>
      <p class="card-text ms-3 " >${element.text}</p>
      <p class="card-text text-info ms-3">${element.email}</p>
     <img src=${element.photo} class="card-img-top img_card" alt="...">
     <div class="card-body">
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
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  post = post.filter((post) => post.id != id);
  render();
}

async function editPost(editedPost, id) {
  const editedPostResponse = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editedPost),
  }).then((res) => res.json());
  post = post.map((post) => (post.id == id ? editedPostResponse : post));
  render();
}

async function createPost(postInfo) {
  const createdPostResponse = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postInfo),
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

// ? pagination start

function drawPaginationButtons() {
  fetch(`${API}?q=${searchVal}`)
    .then((res) => res.json())
    .then((data) => {
      pageTotalCount = Math.ceil(data.length / 5);
      paginationList.innerHTML = "";
      for (let i = 1; i <= pageTotalCount; i++) {
        if (currentPage == i) {
          let page1 = document.createElement("li");
          page1.innerHTML = `
          <li class="page-item active"><a class="page-link page_number" href="#">${i}</a></li>`;
          paginationList.append(page1);
        } else {
          let page1 = document.createElement("li");
          page1.innerHTML = `
          <li class="page-item"><a class="page-link page_number" href="#">${i}</a></li>`;
          paginationList.append(page1);
        }
      }
      // ? красим в серый цвет prev/next кнопки
      if (currentPage == 1) {
        back.classList.add("disabled");
      } else {
        back.classList.remove("disabled");
      }

      if (currentPage == pageTotalCount) {
        next.classList.add("disabled");
      } else {
        next.classList.remove("disabled");
      }
    });
}
back.addEventListener("click", () => {
  if (currentPage <= 1) {
    return;
  }
  currentPage--;
  render();
});

next.addEventListener("click", () => {
  if (currentPage >= pageTotalCount) {
    return;
  }
  currentPage++;
  render();
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("page_number")) {
    currentPage = e.target.innerText;
    render();
  }
});

searchInp.addEventListener("input", () => {
  searchVal = searchInp.value;
  render();
});

getPost();

// ? pagination end
