const allButton = document.querySelector("#allButton");
const openButton = document.querySelector("#openButton");
const doneButton = document.querySelector("#doneButton");
const removeButton = document.querySelector("#removeTodos");
const inputTodo = document.querySelector("#inputTodo");
const customPopup = document.querySelector("#customPopup");
const smallTriangle = document.querySelector("#smallTriangle");
const addTodoButton = document.querySelector("#addTodoButton");
const todoList = document.querySelector("#todoList");

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function renderState() {
  let statusOfRadioButtons = JSON.parse(
    localStorage.getItem("StatusOfRadioButtons")
  );
  if (statusOfRadioButtons === null) {
    statusOfRadioButtons = {
      allButton: true,
      openButton: false,
      doneButton: false,
    };
  }
  allButton.checked = statusOfRadioButtons.allButton;
  openButton.checked = statusOfRadioButtons.openButton;
  doneButton.checked = statusOfRadioButtons.doneButton;
  todoList.innerHTML = "";
  let addedTodos = JSON.parse(localStorage.getItem("addedTodos"));
  if (addedTodos === null) {
    addedTodos = {};
  }
  for (const toDo in addedTodos) {
    const newElement = document.createElement("li");
    const newInput = document.createElement("input");
    newInput.type = "checkbox";
    newElement.appendChild(newInput);
    newInput.checked = addedTodos[toDo].done;
    if (newInput.checked === true) {
      newElement.classList.add("toDoDone");
      newInput.classList.add("checkedInput");
    }
    const newTextNode = document.createTextNode(
      addedTodos[toDo].description + " "
    );
    newElement.appendChild(newTextNode);
    newElement.id = addedTodos[toDo].id;
    todoList.appendChild(newElement);
  }
  const chosenToDoID = JSON.parse(localStorage.getItem("geklicktes ToDo"));
  if (chosenToDoID !== null) {
    const chosenToDo = document.querySelector("#" + chosenToDoID);
    chosenToDo.classList.add("li_focused");
  }

  for (const toDo in addedTodos) {
    if (openButton.checked) {
      if (addedTodos[toDo].done === true) {
        const currentToDo = todoList.querySelector("#" + addedTodos[toDo].id);
        currentToDo.classList.add("hideToDo");
      }
    } else if (doneButton.checked) {
      if (addedTodos[toDo].done === false) {
        const currentToDo = todoList.querySelector("#" + addedTodos[toDo].id);
        currentToDo.classList.add("hideToDo");
      }
    }
  }
}

renderState();

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function changeRadioButtonStatus(xxx) {
  localStorage.removeItem("geklicktes ToDo");
  let statusOfRadioButtons = JSON.parse(
    localStorage.getItem("StatusOfRadioButtons")
  );
  if (statusOfRadioButtons === null) {
    statusOfRadioButtons = {
      allButton: true,
      openButton: false,
      doneButton: false,
    };
  }
  for (const radioButton in statusOfRadioButtons) {
    if (radioButton === xxx) {
      statusOfRadioButtons[radioButton] = true;
    } else {
      statusOfRadioButtons[radioButton] = false;
    }
  }
  localStorage.setItem(
    "StatusOfRadioButtons",
    JSON.stringify(statusOfRadioButtons)
  );
}

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

allButton.addEventListener("change", function (event) {
  changeRadioButtonStatus(event.target.id);
  renderState();
});

openButton.addEventListener("change", function (event) {
  changeRadioButtonStatus(event.target.id);
  renderState();
});

doneButton.addEventListener("change", function (event) {
  changeRadioButtonStatus(event.target.id);
  renderState();
});

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

inputTodo.addEventListener("click", function () {
  localStorage.removeItem("geklicktes ToDo");
  customPopup.style.display = "none";
  smallTriangle.style.display = "none";
  renderState();
});

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function addAToDo() {
  localStorage.removeItem("geklicktes ToDo");
  const trimedInput = inputTodo.value.trim();
  if (trimedInput.length >= 5) {
    let addedTodos = JSON.parse(localStorage.getItem("addedTodos"));
    if (addedTodos === null) {
      addedTodos = {};
    }
    const allDescriptions = [];
    for (const toDo in addedTodos) {
      allDescriptions.push(addedTodos[toDo].description.toLowerCase());
    }
    const isToDoIncluded = allDescriptions.includes(trimedInput.toLowerCase());
    if (isToDoIncluded) {
      customPopup.style.display = "inline";
      smallTriangle.style.display = "inline";
      return;
    } else {
      const newID = Date.now().toString(36);
      addedTodos[newID] = { description: trimedInput, id: newID, done: false };
      localStorage.setItem("addedTodos", JSON.stringify(addedTodos));
    }
  }
  inputTodo.value = "";
}

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

addTodoButton.addEventListener("click", function () {
  addAToDo();
  renderState();
});

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

inputTodo.addEventListener("keydown", function (event) {
  localStorage.removeItem("geklicktes ToDo");
  if (event.code === "Enter" || event.code === "NumpadEnter") {
    event.preventDefault();
    addAToDo();
    renderState();
  }
});

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

todoList.addEventListener("click", function (event) {
  localStorage.removeItem("geklicktes ToDo");
  const clickedCheckbox = event.target;
  if (event.target.tagName === "LI") {
    localStorage.setItem("geklicktes ToDo", JSON.stringify(event.target.id));
    const childCheckbox = event.target.querySelector("input");
    if (childCheckbox.checked === true) {
      childCheckbox.checked = false;
    } else {
      childCheckbox.checked = true;
    }
    const currentID = event.target.id;
    const addedTodos = JSON.parse(localStorage.getItem("addedTodos"));
    addedTodos[currentID].done = childCheckbox.checked;
    localStorage.setItem("addedTodos", JSON.stringify(addedTodos));
  } else if (
    clickedCheckbox.tagName === "INPUT" &&
    clickedCheckbox.type === "checkbox"
  ) {
    const currentID = event.target.parentElement.id;
    localStorage.setItem(
      "geklicktes ToDo",
      JSON.stringify(event.target.parentElement.id)
    );
    const checkboxDone = event.target.checked;
    const addedTodos = JSON.parse(localStorage.getItem("addedTodos"));
    addedTodos[currentID].done = checkboxDone;
    localStorage.setItem("addedTodos", JSON.stringify(addedTodos));
  }
  renderState();
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

removeButton.addEventListener("click", function () {
  localStorage.removeItem("geklicktes ToDo");
  let addedTodos = JSON.parse(localStorage.getItem("addedTodos"));
  if (addedTodos === null) {
    addedTodos = {};
  }
  for (toDo in addedTodos) {
    if (addedTodos[toDo].done === true) {
      delete addedTodos[toDo];
    }
  }
  localStorage.setItem("addedTodos", JSON.stringify(addedTodos));
  renderState();
});
