//Selectros
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOptions = document.querySelector(".filter-todo");

//Event Listeners
//load the todos from the local storage
document.addEventListener("DOMContentLoaded", getTodosFromLocalStorage);

todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deletecheck);
filterOptions.addEventListener("click", filterTodo);

//Functions

function addTodo(event) {
  //prevent form from submitting
  event.preventDefault();
  console.log("o yo yoo");
  // Creating the toDo Div
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");

  const newTodo = document.createElement("li");
  newTodo.innerText = todoInput.value;
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);

  //   *Add Todo To Local Storage
  saveLocalTodos(todoInput.value);

  const completeButton = document.createElement("button");
  completeButton.innerHTML = '<i class="fas fa-check"> </i>';
  completeButton.classList.add("complete-btn");
  todoDiv.appendChild(completeButton);

  const trashButton = document.createElement("button");
  trashButton.innerHTML = '<i class="fas fa-trash"> </i>';
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);

  //Append to List
  todoList.appendChild(todoDiv);
  //clear to do input value
  todoInput.value = "";
}

//delete functionaliity
function deletecheck(e) {
  const item = e.target;
  if (item.tagName === "i") {
    item = item.parentElement;
  }
  if (item.classList.contains("trash-btn")) {
    console.log(item.classList);
    console.log(item.classList.contains("trash-btn"));
    const todo = item.parentElement;
    //Animation
    todo.classList.add("fall");
    //event listener to wait for the animation to be done before removing it from the document
    // ? in the animation we did in StyleSheet we did a TransitionEvent, we can have an animation Event as well
    deleteThingsFromLocalStorage(todo);
    todo.addEventListener("transitionend", () => {
      todo.remove();
    });
  }
  // check Mark funcitonality
  if (item.classList.contains("complete-btn")) {
    console.log(item.classList);
    console.log(item.classList.contains("complete-btn"));
    const todo = item.parentElement;
    todo.classList.toggle("completed");
  }
}

// filterOptionFunctionallity

function filterTodo(event) {
  const todos = todoList.childNodes;
  todos.forEach(function (todo) {
    switch (event.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
    }
  });
}
// Function to save the local todos
function saveLocalTodos(todo) {
  // chekc ---hey do i alereasy have things in there?
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodosFromLocalStorage() {
  // chekc ---hey do i alereasy have things in there?
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.forEach(function (todo) {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    const newTodo = document.createElement("li");
    newTodo.innerText = todo;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    const completeButton = document.createElement("button");
    completeButton.innerHTML = '<i class="fas fa-check"> </i>';
    completeButton.classList.add("complete-btn");
    todoDiv.appendChild(completeButton);

    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"> </i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    //Append to List
    todoList.appendChild(todoDiv);
  });
}

function deleteThingsFromLocalStorage(todo) {
  // chekc ---hey do i alereasy have things in there?
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  // we are gonna remove a spicific value from an array with the splice method
  const todoIndex = todo.children[0].innerText;
  // the second paramater of the splice method aka 1 means how many you want to remove starting from that elemenrt
  todos.splice(todos.indexOf(todoIndex), 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}
