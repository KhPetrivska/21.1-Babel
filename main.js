"use strict";

const taskForm = $("form").first();
const listContainer = $(".js--todos-wrapper");
const taskItem = $(".todo-item");

let taskStorage = JSON.parse(localStorage.getItem("TaskList")) || [];

for (let i = 0; i < taskStorage.length; i++) {
  const { task, completed, id } = taskStorage[i];
  generateTaskBlock(task, completed, id);
}

function generateTaskBlock(text, check, id) {
  //const newTaskDiv = $('<li></li>');
  const newTaskItem = $(taskItem).clone(true);
  newTaskItem.attr("id", id);
  newTaskItem.addClass("todo-item");
  newTaskItem.find(".todo-item__description").text(text);
  newTaskItem.css("display", "");
  const checker = newTaskItem.find("input");
  checker.prop("checked", check);
  if (check) {
    $(checker).parent().addClass("todo-item--checked");
  }
  $(listContainer).append(newTaskItem);
}

// On form submit
$(taskForm).submit((event) => {
  event.preventDefault();
  const formInput = $(taskForm).find('input[name="value"]').val();
  if (formInput.trim() === "") {
    alert("Empty input cannot be submitted");
    return;
  }
  const id = "TaskId" + Date.now() + Math.random();
  const newTask = { id: id, task: formInput, completed: false };
  taskStorage.push(newTask);
  localStorage.setItem("TaskList", JSON.stringify(taskStorage));

  generateTaskBlock(formInput, false, id);
  $(taskForm).find('input[name="value"]').val("");
});

// On delete click
$(document).click((event) => {
  if ($(event.target).hasClass("todo-item__delete")) {
    const description = $(event.target).prev().text();
    $(event.target).parent().remove();

    taskStorage = taskStorage.filter((task) => task.task !== description);
    localStorage.setItem("TaskList", JSON.stringify(taskStorage));
  }
});

// On checkbox click
$(document).click((event) => {
  if (event.target.type === "checkbox") {
    const itemTextContent = $(event.target).next().text();
    taskStorage = taskStorage.map((taskObj) => {
      if (taskObj.task === itemTextContent) {
        taskObj.completed = !taskObj.completed;
      }
      return taskObj;
    });

    if (event.target.checked) {
      $(event.target).parent().addClass("todo-item--checked");
    } else {
      $(event.target).parent().removeClass("todo-item--checked");
    }

    localStorage.setItem("TaskList", JSON.stringify(taskStorage));
  }
});

//Modal window feature

$(listContainer).click((event) => {
  if (
    $(event.target).parent().hasClass("todo-item") &&
    !$(event.target).hasClass("todo-item__delete") &&
    !$(event.target).is(":checkbox")
  ) {
    const modalW = $("#exampleModal");
    const modal = new bootstrap.Modal(modalW[0]);

    const localStorageTaskList = JSON.parse(localStorage.getItem("TaskList"));
    const eventId = $(event.target).parent().attr("id");
    const itemInTheList = localStorageTaskList.find(
      (item) => item.id === eventId
    );

    if (itemInTheList) {
      modalW.find(".modal-body").text(itemInTheList.task);
      modal.show();
      modal;
    } else {
      console.log("Item not found in the list.");
    }
  }
});
