import getDate from './getDate.js';
import getCount from './getCount.js';
import startSpeech from './speechRecognition.js';
import { openModal, closeModal, modalForm, removeBtn } from './modal.js';
import globalContext from './globalContext.js';

// DOM element
const addBtn = document.getElementById('btn--add');
const closeBtn = document.getElementById('btn--close');
const taskTitleEl = document.getElementById('task-title');
const taskDescEl = document.getElementById('task-description');
const categoryEls = document.querySelectorAll('input[name="category"]');
const priorityEls = document.querySelectorAll('input[name="priority"]');
const backlogListEl = document.getElementById('backlog-list');
const progressListEl = document.getElementById('progress-list');
const completeListEl = document.getElementById('complete-list');
const taskSelectEls = document.querySelectorAll('.task-select');
const speechBtns = document.querySelectorAll('.speech-btn');

// Get LocalStorage Tasks
const getSavedTask = () => {
  globalContext.backlogTasks = localStorage.getItem('backlogItems')
    ? JSON.parse(localStorage.getItem('backlogItems'))
    : [];

  globalContext.progressTasks = localStorage.getItem('progressItems')
    ? JSON.parse(localStorage.getItem('progressItems'))
    : [];

  globalContext.completeTasks = localStorage.getItem('completeItems')
    ? JSON.parse(localStorage.getItem('completeItems'))
    : [];
};

// Save Tasks in Local Storage
const saveTasks = () => {
  globalContext.tasks = [
    globalContext.backlogTasks,
    globalContext.progressTasks,
    globalContext.completeTasks,
  ];
  const taskNames = ['backlog', 'progress', 'complete'];
  taskNames.forEach((taskNames, index) => {
    localStorage.setItem(
      `${taskNames}Items`,
      JSON.stringify(globalContext.tasks[index])
    );
  });
};

// Update Task
function updateTask(task) {
  const { id, category, title, priority, desc } = task;

  const categoryArr = Array.from(categoryEls);
  if (category === 'backlog') {
    categoryArr.find(
      (categoryEl) => categoryEl.value === 'backlog'
    ).checked = true;
    globalContext.backlogTasks = globalContext.backlogTasks.filter(
      (backlogTask) => backlogTask.id !== id
    );
  } else if (category === 'progress') {
    categoryArr.find(
      (categoryEl) => categoryEl.value === 'progress'
    ).checked = true;
    globalContext.progressTasks = globalContext.progressTasks.filter(
      (progressTask) => progressTask.id !== id
    );
  } else {
    categoryArr.find(
      (categoryEl) => categoryEl.value === 'complete'
    ).checked = true;
    globalContext.completeTasks = globalContext.completeTasks.filter(
      (completeTask) => completeTask.id !== id
    );
  }

  const priorityArr = Array.from(priorityEls);
  if (priority === '1') {
    priorityArr.find((priorityEl) => priorityEl.value === '1').checked = true;
  } else if (priority === '2') {
    priorityArr.find((priorityEl) => priorityEl.value === '2').checked = true;
  } else {
    priorityArr.find((priorityEl) => priorityEl.value === '3').checked = true;
  }

  removeBtn.classList.remove('hidden');
  removeBtn.onclick = () => removeTask(id);

  taskTitleEl.value = title;
  taskDescEl.value = desc;

  openModal();
}

// Remove Task
const removeTask = (id) => {
  globalContext.tasks.forEach((taskList) => {
    taskList = taskList.filter((task) => task.id !== id);
  });

  renderTasks();
  closeModal();
};

// Sort Tasks
const sortTasks = (index) => {
  const selectedEl = taskSelectEls[index];
  const selectedOption = selectedEl.options[selectedEl.selectedIndex].value;

  if (selectedOption === 'created') {
    globalContext.tasks[index] = globalContext.tasks[index].sort((a, b) =>
      a.createdAt > b.createdAt ? 1 : -1
    );
  } else if (selectedOption === 'priority') {
    globalContext.tasks[index] = globalContext.tasks[index].sort((a, b) =>
      +a.priority < +b.priority ? 1 : -1
    );
  } else if (selectedOption === 'alphabetical') {
    globalContext.tasks[index] = globalContext.tasks[index].sort((a, b) =>
      a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
    );
  } else {
    return;
  }

  renderTasks();
};

window.sortTasks = sortTasks;

// Generate DOM element
const generateTaskEl = (categoryDOM, task) => {
  const { title, priority, desc } = task;

  // list item
  const item = document.createElement('li');
  item.classList.add('task-item');
  item.onclick = () => updateTask(task);

  // item content
  const itemContent = document.createElement('div');
  itemContent.classList.add('task-content');

  // item title
  const itemTitle = document.createElement('h3');
  itemTitle.classList.add('item-title');
  itemTitle.textContent =
    title.length > 12 ? `${title.substring(0, 12)}..` : title;

  // item desc
  const itemDesc = document.createElement('p');
  itemDesc.classList.add('item-desc');
  itemDesc.textContent = desc.length > 15 ? `${desc.substring(0, 15)}..` : desc;

  // item priority
  const itemPriority = document.createElement('i');

  if (priority === '1') {
    itemPriority.classList.add('fa-solid', 'fa-star-half');
  } else if (priority === '2') {
    itemPriority.classList.add('fa-solid', 'fa-star-half-stroke');
  } else {
    itemPriority.classList.add('fa-solid', 'fa-star');
  }

  // append
  itemContent.append(itemTitle, itemDesc);
  item.append(itemContent, itemPriority);
  categoryDOM.appendChild(item);
};

// Build task
const buildTask = (category, taskTitle, priority, taskDesc) => {
  globalContext.task = {
    id: Math.floor(Math.random() * 1000000),
    category,
    title: taskTitle,
    priority,
    desc: taskDesc,
    createdAt: new Date(),
  };

  return globalContext.task;
};

// push
const pushTasks = (task) => {
  if (task.category === 'backlog') {
    globalContext.backlogTasks.push(task);
  } else if (task.category === 'progress') {
    globalContext.progressTasks.push(task);
  } else {
    globalContext.completeTasks.push(task);
  }
  renderTasks();
};

// Add
const addTask = (event) => {
  event.preventDefault();

  let category;
  let priority;
  let taskTitle;
  let taskDesc;

  for (const categoryEl of categoryEls) {
    if (categoryEl.checked) {
      category = categoryEl.value;
      break;
    }
  }

  for (const priorityEl of priorityEls) {
    if (priorityEl.checked) {
      priority = priorityEl.value;
      break;
    }
  }

  taskTitle = taskTitleEl.value;
  taskDesc = taskDescEl.value;

  if (!category || !priority || !taskTitle.trim() || !taskDesc.trim()) {
    alert('모든 입력창에 값을 입력해주세요.');
  } else {
    globalContext.task = buildTask(category, taskTitle, priority, taskDesc);

    if (globalContext.task) {
      pushTasks(globalContext.task);
      closeModal();
      modalForm.reset();
    }
  }
};

// Helper Function for Rendering
const generateImgEl = (index, categoryDOM) => {
  const entryImg = document.createElement('img');
  entryImg.setAttribute('src', `../assets/image/people0${index}.png`);
  entryImg.classList.add('entry-img');
  categoryDOM.appendChild(entryImg);
};

// Render Tasks
const renderTasks = () => {
  if (!globalContext.updatedOnLoad) {
    getSavedTask();
  }

  if (globalContext.backlogTasks.length === 0) {
    backlogListEl.textContent = '';
    generateImgEl(1, backlogListEl);
  } else {
    backlogListEl.textContent = '';
  }
  globalContext.backlogTasks.forEach((backlogItem) => {
    generateTaskEl(backlogListEl, backlogItem);
  });

  if (globalContext.progressTasks.length === 0) {
    progressListEl.textContent = '';
    generateImgEl(2, progressListEl);
  } else {
    progressListEl.textContent = '';
  }
  globalContext.progressTasks.forEach((progressItem) => {
    generateTaskEl(progressListEl, progressItem);
  });

  if (globalContext.completeTasks.length === 0) {
    completeListEl.textContent = '';
    generateImgEl(3, completeListEl);
  } else {
    completeListEl.textContent = '';
  }
  globalContext.completeTasks.forEach((completeItem) => {
    generateTaskEl(completeListEl, completeItem);
  });

  globalContext.updatedOnLoad = true;
  saveTasks();
  getCount();
};

const init = () => {
  getDate();
  renderTasks();
};

// EventListners
addBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
modalForm.addEventListener('submit', addTask);
speechBtns.forEach((speechBtn) => {
  speechBtn.addEventListener('click', startSpeech);
});

init();
