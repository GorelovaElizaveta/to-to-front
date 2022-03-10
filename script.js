let allTasks = [];
let inputValue = "";

let input = null;
let editTask = -1;
let val = "";
let intermediaresult = "";

window.onload = init = async () => {
  input = document.getElementById("add-task");
  input.addEventListener("change", updateValue);
  const resp = await fetch("http://localhost:8000/allTasks", {
    method: "GET",
  });
  const result = await resp.json();
  allTasks = result.data;
  render();
};

const onCklickButton = async () => {
  if (inputValue.trim()) {
    const resp = await fetch("http://localhost:8000/createTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        text: inputValue,
        isCheck: false,
      }),
    });
    const result = await resp.json();
    allTasks = result.data;
    inputValue = " ";
    input.value = " ";
    render();
  } else {
    alert("Поле не заполнено!");
  }
};

const updateValue = (event) => {
  inputValue = event.target.value;
};

const render = () => {
  const content = document.getElementById("content-page");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  allTasks.sort((a, b) => (a.isCheck ? 1 : a.isCheck < b.isCheck ? -1 : 0));
  allTasks.map((item, index) => {
    const container = document.createElement("div");
    container.id = `task-${index}`;
    container.className = "task-container";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.isCheck;
    checkbox.onchange = () => {
      onChangChekbox(index);
    };
    container.appendChild(checkbox);

    if (index === editTask) {
      const inputTask = document.createElement("input");
      inputTask.type = "text";
      inputTask.value = item.text;
      inputTask.innerText = item.text;
      intermediaresult = item.text;
      inputTask.className = "inputChange";
      inputTask.addEventListener("change", taskTxt);
      container.appendChild(inputTask);
      const imgDone = document.createElement("img");
      const imgBack = document.createElement("img");
      imgDone.src = "done.png";
      imgBack.src = "back.jpg";
      imgDone.onclick = () => {
        doneTask(index);
      };

      imgBack.onclick = () => backTask();
      container.appendChild(imgDone);
      container.appendChild(imgBack);
    } else {
      const text = document.createElement("p");
      text.innerText = item.text;
      text.className = item.isCheck
        ? item.isChoose
          ? "text-task done-text choose"
          : "text-task done-text"
        : item.isChoose
        ? "text-task choose"
        : "text-task";
      container.appendChild(text);

      const imgDelete = document.createElement("img");
      imgDelete.src = "close.jpg";
      imgDelete.onclick = function () {
        delTask(index);
      };

      container.appendChild(imgDelete);
      if (!item.isCheck) {
        const imgEdit = document.createElement("img");
        imgEdit.src = "edit.png";
        imgEdit.onclick = function () {
          editTask = index;
          render();
        };
        container.appendChild(imgEdit);

      }
    }

    content.appendChild(container);
  });
};

const backTask = () => {
  editTask = "";
  console.log("editTask is empty");
  render();
};

const taskTxt = (event) => {
  intermediaresult = event.target.value;
  intermediaresult.trim(" ")
};

const onChangChekbox = async (index) => {
  const id = allTasks[index]._id;
  allTasks[index].isCheck = !allTasks[index].isCheck;
  const check = allTasks[index].isCheck;
  const resp = await fetch(
    `http://localhost:8000/updateTask?isCheck=${check}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        _id: id,
        isCheck: check,
      }),
    }
  );
  let result = await resp.json();
  console.log(result);
  allTasks = result.data;
  render();
};

const delTask = async (index) => {
  const _id = allTasks[index]._id;
  const resp = await fetch(`http://localhost:8000/deleteTask?id=${_id}`, {
    method: "DELETE",
  });
  let result = await resp.json();
  console.log(result);
  allTasks = result.data;
  render();
};

const doneTask = async (index) => {
  if(!(intermediaresult === "")){
  const id = allTasks[index]._id;
  const resp = await fetch(
    `http://localhost:8000/updateTask?text=${intermediaresult}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        _id: id,
        text: intermediaresult,
      }),
    }
  );
  let result = await resp.json();
  console.log(result);
  allTasks = result.data;

  editTask = -1;
  render();
  } else{
    alert("Введите значение!!!")
  }
};

const delButton = async () => {
  allTasks = [];
  editTask = -1;
  const resp = await fetch(
    `http://localhost:8000/deleteAll`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
  render();
};
