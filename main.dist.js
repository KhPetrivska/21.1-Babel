"use strict";

var taskForm = $("form").first();
var listContainer = $(".js--todos-wrapper");
var taskItem = $(".todo-item");
var taskStorage = JSON.parse(localStorage.getItem("TaskList")) || [];
for (var i = 0; i < taskStorage.length; i++) {
  var _taskStorage$i = taskStorage[i],
    task = _taskStorage$i.task,
    completed = _taskStorage$i.completed,
    id = _taskStorage$i.id;
  generateTaskBlock(task, completed, id);
}
function generateTaskBlock(text, check, id) {
  //const newTaskDiv = $('<li></li>');
  var newTaskItem = $(taskItem).clone(true);
  newTaskItem.attr("id", id);
  newTaskItem.addClass("todo-item");
  newTaskItem.find(".todo-item__description").text(text);
  newTaskItem.css("display", "");
  var checker = newTaskItem.find("input");
  checker.prop("checked", check);
  if (check) {
    $(checker).parent().addClass("todo-item--checked");
  }
  $(listContainer).append(newTaskItem);
}

// On form submit
$(taskForm).submit(function (event) {
  event.preventDefault();
  var formInput = $(taskForm).find('input[name="value"]').val();
  if (formInput.trim() === "") {
    alert("Empty input cannot be submitted");
    return;
  }
  var id = "TaskId" + Date.now() + Math.random();
  var newTask = {
    id: id,
    task: formInput,
    completed: false
  };
  taskStorage.push(newTask);
  localStorage.setItem("TaskList", JSON.stringify(taskStorage));
  generateTaskBlock(formInput, false, id);
  $(taskForm).find('input[name="value"]').val("");
});

// On delete click
$(document).click(function (event) {
  if ($(event.target).hasClass("todo-item__delete")) {
    var description = $(event.target).prev().text();
    $(event.target).parent().remove();
    taskStorage = taskStorage.filter(function (task) {
      return task.task !== description;
    });
    localStorage.setItem("TaskList", JSON.stringify(taskStorage));
  }
});

// On checkbox click
$(document).click(function (event) {
  if (event.target.type === "checkbox") {
    var itemTextContent = $(event.target).next().text();
    taskStorage = taskStorage.map(function (taskObj) {
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

$(listContainer).click(function (event) {
  if ($(event.target).parent().hasClass("todo-item") && !$(event.target).hasClass("todo-item__delete") && !$(event.target).is(":checkbox")) {
    var modalW = $("#exampleModal");
    var modal = new bootstrap.Modal(modalW[0]);
    var localStorageTaskList = JSON.parse(localStorage.getItem("TaskList"));
    var eventId = $(event.target).parent().attr("id");
    var itemInTheList = localStorageTaskList.find(function (item) {
      return item.id === eventId;
    });
    if (itemInTheList) {
      modalW.find(".modal-body").text(itemInTheList.task);
      modal.show();
      modal;
    } else {
      console.log("Item not found in the list.");
    }
  }
});
