let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskinput = document.getElementById("taskinput");
const addbutton = document.getElementById("addbutton");
const tasklist = document.getElementById("tasklist");

function renderTasks() {
  tasklist.innerHTML = "";

  tasks.forEach((taskObj, index) => {
    const li = document.createElement("li");
    if (taskObj.completed) {
      li.classList.add("completed");
    }

    // Task text container
    const taskText = document.createElement("span");
    taskText.textContent = taskObj.text;
    taskText.className = "task-text";

    // Make the entire li respond to double-click (except delete button)
    li.addEventListener("dblclick", function(e) {
      // Don't initiate edit if clicking on delete button
      if (e.target.classList.contains("delete-btn") || e.target.tagName === "BUTTON") {
        return;
      }
      startEditing(li, taskText, index);
    });

    // Toggle completion on single click (except when clicking buttons)
    li.addEventListener("click", function(e) {
      if (e.target.classList.contains("delete-btn") || e.target.tagName === "BUTTON") {
        return;
      }
      tasks[index].completed = !tasks[index].completed;
      saveAndRender();
    });

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "delete-btn";
    delBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      tasks.splice(index, 1);
      saveAndRender();
    });

    li.appendChild(taskText);
    li.appendChild(delBtn);
    tasklist.appendChild(li);
  });
}

function startEditing(li, taskTextElement, index) {
  const currentText = tasks[index].text;
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentText;
  input.className = "edit-input";
  
  // Replace the text with an input field
  li.replaceChild(input, taskTextElement);
  input.focus();

  function saveEdit() {
    const newText = input.value.trim();
    if (newText && newText !== currentText) {
      tasks[index].text = newText;
      saveAndRender();
    } else {
      renderTasks(); // Revert if empty or unchanged
    }
  }

  input.addEventListener("blur", saveEdit);
  input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") renderTasks(); // Cancel on Escape
  });
}

function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Add new task
addbutton.addEventListener("click", function(event) {
  event.preventDefault();
  const input = taskinput.value.trim();
  if (input === "") return;

  tasks.push({ text: input, completed: false });
  taskinput.value = "";
  saveAndRender();
});

// Optional: Add task on Enter key
taskinput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    addbutton.click();
  }
});

renderTasks();