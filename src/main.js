import getDate from './getDate.js';
import startSpeech from './speechRecognition.js';

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
const speechBtn = document.getElementById('speech-btn');
const taskTotalCountEl = document.getElementById('total-count');
const backlogCountEl = document.getElementById('backlog-count');
const completeCountEl = document.getElementById('complete-count');
const progressCountEl = document.getElementById('progress-count');
const progressStatusEl = document.getElementById('progress-status');
const progressbarEl = document.getElementById('progress-bar');
const modal = document.getElementById('modal');
const modalForm = document.getElementById('modal-form');
const removeBtn = document.getElementById('btn--remove');

let backlogTasks = [];
let progressTasks = [];
let completeTasks = [];
let tasks = [];
let prevTask = null;
let updatedOnLoad = false;
let isUpdated = false;
let isEditMode = false;

// 모달 여닫기
function closeModal() {
  if (isUpdated) {
    removeBtn.classList.add('hidden');
    isUpdated = false;
  }

  modal.classList.remove('visible');
  modalForm.reset();
  isEditMode = false;
}

function openModal() {
  modal.classList.add('visible');

  if (isEditMode) {
    removeBtn.classList.remove('hidden');
  } else {
    removeBtn.classList.add('hidden');
  }
}

// 로컬 스토리지에서 데이터 가져오기
function getSavedTask() {
  backlogTasks = localStorage.getItem('backlogItems')
    ? JSON.parse(localStorage.getItem('backlogItems'))
    : [];

  progressTasks = localStorage.getItem('progressItems')
    ? JSON.parse(localStorage.getItem('progressItems'))
    : [];

  completeTasks = localStorage.getItem('completeItems')
    ? JSON.parse(localStorage.getItem('completeItems'))
    : [];
}

// 로컬 스토리지에 데이터 저장하기
function saveTasks() {
  tasks = [backlogTasks, progressTasks, completeTasks];

  const taskNames = ['backlog', 'progress', 'complete'];
  taskNames.forEach((taskName, index) => {
    localStorage.setItem(`${taskName}Items`, JSON.stringify(tasks[index]));
  });
}

// 할일 삭제
function removeTask(category, id) {
  if (category === 'backlog') {
    backlogTasks = backlogTasks.filter((task) => task.id !== id);
  } else if (category === 'progress') {
    progressTasks = progressTasks.filter((task) => task.id !== id);
  } else if (category === 'complete') {
    completeTasks = completeTasks.filter((task) => task.id !== id);
  }

  renderTasks();
  closeModal();
}

// 할일 목록 정렬
const sortTasks = (index) => {
  const selectedEl = taskSelectEls[index];
  const selectedOption = selectedEl.options[selectedEl.selectedIndex].value;

  if (selectedOption === 'created') {
    tasks[index] = tasks[index].sort((a, b) =>
      a.createdAt > b.createdAt ? 1 : -1
    );
  } else if (selectedOption === 'priority') {
    tasks[index] = tasks[index].sort((a, b) =>
      +a.priority < +b.priority ? 1 : -1
    );
  } else if (selectedOption === 'alphabetical') {
    tasks[index] = tasks[index].sort((a, b) =>
      a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
    );
  } else {
    return;
  }

  renderTasks();
};

window.sortTasks = sortTasks;

// 돔 요소 생성
const generateTaskEl = (categoryDOM, task) => {
  const { title, priority, desc } = task;

  const item = document.createElement('li');
  item.classList.add('task-item');
  item.onclick = () => getPrevTask(task);

  const itemContent = document.createElement('div');
  itemContent.classList.add('task-content');

  const itemTitle = document.createElement('h3');
  itemTitle.classList.add('item-title');
  itemTitle.textContent =
    title.length > 12 ? `${title.substring(0, 12)}..` : title;

  const itemDesc = document.createElement('p');
  itemDesc.classList.add('item-desc');
  itemDesc.textContent = desc.length > 15 ? `${desc.substring(0, 15)}..` : desc;

  const itemPriority = document.createElement('i');

  if (priority === '1') {
    itemPriority.classList.add('fa-solid', 'fa-star-half');
  } else if (priority === '2') {
    itemPriority.classList.add('fa-solid', 'fa-star-half-stroke');
  } else {
    itemPriority.classList.add('fa-solid', 'fa-star');
  }

  itemContent.append(itemTitle, itemDesc);
  item.append(itemContent, itemPriority);
  categoryDOM.appendChild(item);
};

// task 구성
function buildTask(category, taskTitle, priority, taskDesc) {
  return {
    id: Math.floor(Math.random() * 1000000000),
    category,
    title: taskTitle,
    priority,
    desc: taskDesc,
    createdAt: new Date(),
  };
}

// 배열에 추가
function pushTasks(task) {
  if (task.category === 'backlog') {
    backlogTasks.push(task);
  } else if (task.category === 'progress') {
    progressTasks.push(task);
  } else {
    completeTasks.push(task);
  }

  renderTasks();
}

// 이전 정보 가져오기
function getPrevTask(task) {
  isEditMode = true;
  prevTask = task;
  const { id, category, title, priority, desc } = task;

  const categoryEl = getElement(categoryEls, category);
  categoryEl.checked = true;

  const priorityEl = getElement(priorityEls, priority);
  priorityEl.checked = true;

  taskTitleEl.value = title;
  taskDescEl.value = desc;

  removeBtn.classList.remove('hidden');
  removeBtn.onclick = () => removeTask(category, id);

  openModal();
}

function getElement(elements, value) {
  return Array.from(elements).find((element) => element.value === value);
}

function updateTasks(category, id) {
  if (category === 'backlog') {
    backlogTasks = backlogTasks.filter((task) => task.id !== id);
  } else if (category === 'progress') {
    progressTasks = progressTasks.filter((task) => task.id !== id);
  } else {
    completeTasks = completeTasks.filter((task) => task.id !== id);
  }
}

// form 제출
function submitForm(event) {
  event.preventDefault();

  const category = getValueFromElements(categoryEls);
  const priority = getValueFromElements(priorityEls);
  const taskTitle = taskTitleEl.value;
  const taskDesc = taskDescEl.value;

  if (!category || !priority || !taskTitle.trim() || !taskDesc.trim()) {
    alert('모든 입력창에 값을 입력해주세요.');
  } else {
    const task = buildTask(category, taskTitle, priority, taskDesc);

    if (isEditMode) {
      updateTasks(prevTask.category, prevTask.id);
      isEditMode = false;
    }

    pushTasks(task);
    isUpdated = true;
    closeModal();
    modalForm.reset();
  }
}

function getValueFromElements(elements) {
  const element = Array.from(elements).find((element) => element.checked);
  return element ? element.value : null;
}

// 이미지 렌더링 보조
function generateImgEl(index, categoryDOM) {
  const entryImg = document.createElement('img');
  entryImg.setAttribute('src', `../assets/image/people0${index}.png`);
  entryImg.classList.add('entry-img');
  categoryDOM.appendChild(entryImg);
}

// 통계
function getCount() {
  progressbarEl.style.width = '';

  let backlogCount = backlogTasks.length;
  let progressCount = progressTasks.length;
  let completeCount = completeTasks.length;

  backlogCountEl.textContent = backlogCount;
  progressCountEl.textContent = progressCount;
  completeCountEl.textContent = completeCount;

  let totalCount = +backlogCount + +progressCount + +completeCount;
  taskTotalCountEl.textContent = `${+totalCount} Tasks`;

  progressStatusEl.textContent = `${completeCount} / ${totalCount}`;

  let percentage = (completeCount / totalCount) * 100;
  progressbarEl.style.width = `${percentage}%`;
}

// 할일 렌더링
function renderTasks() {
  if (!updatedOnLoad) {
    getSavedTask();
  }

  renderCategoryTasks(backlogTasks, backlogListEl, 1);
  renderCategoryTasks(progressTasks, progressListEl, 2);
  renderCategoryTasks(completeTasks, completeListEl, 3);

  updatedOnLoad = true;
  saveTasks();
  getCount();
}

function renderCategoryTasks(categoryTasks, categoryDOM, index) {
  if (categoryTasks.length === 0) {
    categoryDOM.textContent = '';
    generateImgEl(index, categoryDOM);
  } else {
    categoryDOM.textContent = '';
  }

  categoryTasks.forEach((task) => {
    generateTaskEl(categoryDOM, task);
  });
}

function init() {
  getDate();
  renderTasks();
}

addBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
modalForm.addEventListener('submit', submitForm);
speechBtn.addEventListener('click', startSpeech);

init();
