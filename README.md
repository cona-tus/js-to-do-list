# ✔️ 효율적인 투두리스트 앱, 'Taskist' 프로젝트

![taskist-thumb](https://github.com/cona-tus/js-to-do-list/assets/90844424/ca82c8de-bd70-4a46-9148-bf8f0b31957b)

<br/>

🔗 Taskist [[Live Demo](https://conatus-js-to-do-list.netlify.app/)]

<br/>
<br/>

## 1. Project

### 1-1. Project Description

Taskist는 Vanilla JavaScript로 제작한 투두리스트 웹 애플리케이션입니다. 사용자가 할 일을 3단계(시작 전, 진행 중, 완료)로 구분하여 관리할 수 있도록 기획하였습니다. 사용자의 편의에 따라 할 일 목록을 정렬할 수 있으며, 그래프가 제공되어 진행 상황과 달성률을 확인할 수 있습니다. 또한 Web Speech API를 활용한 음성인식 기능으로 더욱 편리하게 이용 가능합니다. CRUD 기능을 구현하였으며, 반응형 웹 디자인 및 퍼블리싱 작업을 진행했습니다.

<br/>

### 1-2. Project Duration & Participants

- 2023-2-16 ~ 2023-2-24
- 개인 프로젝트 (1인)

<br/>
<br/>

## 2. Skills

![HTML](https://img.shields.io/badge/html-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![SCSS](https://img.shields.io/badge/Sass-bf4080?style=for-the-badge&logo=Sass&logoColor=ffffff) ![JAVASCRIPT](https://img.shields.io/badge/JavaScript-f6e158?style=for-the-badge&logo=JavaScript&logoColor=ffffff) ![Git](https://img.shields.io/badge/Git-f05032?style=for-the-badge&logo=git&logoColor=ffffff)

<br/>
<br/>

## 3. Main Features

1. [로컬스토리지 데이터 처리](#3-1-handle-local-storage-data)
2. [할일 생성](#3-2-create-a-new-task)
3. [화면에 렌더링](#3-3-render-tasks)
4. [할일 업데이트](#3-4-update-task)
5. [할일 삭제](#3-5-remove-tasks)
6. [할일 목록 정렬](#3-6-sort-tasks)
7. [음성 인식](#3-7-speech-to-text-using-web-speech-api)

<br/>

### 3-1. Handle Local Storage Data

![taskist-local](https://github.com/cona-tus/js-to-do-list/assets/90844424/34409dfe-0927-4aed-ac61-7db350eb7f4f)

사용자가 새로운 할일을 생성하면 동시에 로컬 스토리지에 데이터가 저장되어 새로고침 시에도 정보가 사라지지 않습니다.

<br/>

`saveTasks()` 함수는 로컬 스토리지에 카테고리별로 할일 데이터를 저장하는 역할을 합니다. `JSON.stringify`를 사용해 배열 데이터를 문자열로 변환하고, 이를 `setItem` 메서드로 로컬 스토리지에 저장합니다.

```js
// 로컬 스토리지에 데이터 저장하기
function saveTasks() {
  tasks = [backlogTasks, progressTasks, completeTasks];

  const taskNames = ['backlog', 'progress', 'complete'];
  taskNames.forEach((taskName, index) => {
    localStorage.setItem(`${taskName}Items`, JSON.stringify(tasks[index]));
  });
}
```

<br/>

`getSavedTask()`는 로컬 스토리지에 저장된 데이터를 확인하여 `JSON.parse()`로 파싱해서 가져오는 함수입니다. 저장된 데이터가 없다면 빈 배열로 설정합니다.

```js
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
```

<br/>
<br/>

### 3-2. Create a new Task

![taskist-create](https://user-images.githubusercontent.com/90844424/221480086-1a2ad34c-ae28-48e6-9570-3a697129f99c.gif)

사용자는 `+` 버튼을 클릭하고 카테고리, 제목, 중요도, 내용을 입력하여 새로운 할일을 생성할 수 있습니다.

<br/>

`submitForm()` 함수는 사용자가 입력한 값을 가져와 유효성 검사를 한 뒤 새로운 할일 항목을 생성합니다. 만약 `isEditMode`가 true인 경우, 수정 모드라는 의미에서 `updateTasks()` 함수를 호출합니다.

```js
// 폼 제출
function submitForm(event) {
  event.preventDefault();

  const category = getValueFromElements(categoryEls);
  const priority = getValueFromElements(priorityEls);
  const taskTitle = taskTitleEl.value;
  const taskDesc = taskDescEl.value;

  // 유효성 검사
  if (!category || !priority || !taskTitle.trim() || !taskDesc.trim()) {
    alert('모든 입력창에 값을 입력해주세요.');
  } else {
    // 할일 객체 생성
    const task = buildTask(category, taskTitle, priority, taskDesc);

    // 수정 모드에서 폼 제출
    if (isEditMode) {
      updateTasks(prevTask.category, prevTask.id);
      isEditMode = false;
    }

    // 생성한 할일을 해당 카테고리 배열에 추가
    pushTasks(task);
    isUpdated = true;
    closeModal();
    modalForm.reset();
  }
}

// 선택된 input radio 값 가져오기
function getValueFromElements(elements) {
  const element = Array.from(elements).find((element) => element.checked);
  return element ? element.value : null;
}
```

<br/>

`buildTask()` 함수는 전달받은 입력값으로 task 객체를 구성합니다.

```js
// task 객체 구성
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
```

<br/>

만들어진 task 객체를 해당되는 카테고리 배열에 `push` 메서드로 추가합니다. 그리고 `renderTasks()`를 호출하여 이를 렌더링 합니다.

```js
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
```

<br/>
<br/>

### 3-3. Render Tasks

![taskist-dom](https://user-images.githubusercontent.com/90844424/221481649-2d2c6aa7-1929-4de8-b8ac-aa49827d720c.jpg)

`generateTaskEl()` 함수는 task 항목을 화면에 표시하기 위해 HTML 요소를 동적으로 생성합니다. `categoryDOM`은 task 항목이 나타날 부모 DOM 요소입니다. 각 요소들을 조합하여 item에 추가하고, 이를 categoryDOM에 추가합니다.

```js
// 돔 요소 동적 생성
const generateTaskEl = (categoryDOM, task) => {
  const { title, priority, desc } = task;

  const item = document.createElement('li');
  item.classList.add('task-item');
  // 항목 클릭 시 수정 모드
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
```

<br/>

`renderCategoryTasks()` 함수는 특정 카테고리의 할일 항목을 렌더링 합니다. `categoryTasks` 배열의 길이를 검사하여 할일 항목이 없는 경우 해당 카테고리를 비우고, 사용자에게 이미지를 표시합니다. 항목이 있다면 `generateTaskEl()` 함수를 호출해 각 할일 항목을 순회하며 렌더링 합니다.

```js
// 특정 카테고리 할일 목록 렌더링
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
```

<br/>

`renderTasks()`는 모든 카테고리의 할일 항목을 렌더링 합니다. `updatedOnLoad` 값을 이용해 페이지 로딩 시 로컬 스토리지에 저장된 데이터를 확인합니다. 각 카테고리에 대해 `renderCategoryTasks()` 함수를 호출하여 할일 항목을 렌더링 합니다. 이후 `saveTasks()` 함수를 호출하여 변경된 데이터를 로컬 스토리지에 저장합니다.

```js
// 할일 목록 렌더링
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
```

<br/>
<br/>

### 3-4. Update Task

![taskist-update](https://github.com/cona-tus/js-to-do-list/assets/90844424/9150e3b4-43b0-4896-a183-0cb07540f99b)

사용자는 할일 항목을 클릭하여 해당 항목을 수정할 수 있습니다. 업데이트는 기존의 할일 항목을 삭제하고, 수정된 항목을 추가하는 방식으로 이루어집니다.

<br/>

`getPrevTask()` 함수는 모달 폼에 편집하려는 항목의 정보를 미리 채우는 역할을 합니다. `prevTask` 변수에 현재 수정 중인 항목을 저장하여 수정된 폼을 제출할 때 어느 카테고리에서 무엇을 삭제해야 하는지 알려줍니다.

```js
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

  // 삭제하기 버튼 클릭 시 해당 할일 항목 삭제
  removeBtn.classList.remove('hidden');
  removeBtn.onclick = () => removeTask(category, id);

  openModal();
}
```

<br/>

전달받은 prevTask의 category와 id를 이용해 특정 카테고리에서 할일 항목을 삭제합니다. 이때 `filter` 메서드를 사용해 id로 필터링합니다.

```js
// 할일 목록 업데이트
function updateTasks(category, id) {
  if (category === 'backlog') {
    backlogTasks = backlogTasks.filter((task) => task.id !== id);
  } else if (category === 'progress') {
    progressTasks = progressTasks.filter((task) => task.id !== id);
  } else {
    completeTasks = completeTasks.filter((task) => task.id !== id);
  }
}
```

<br/>
<br/>

### 3-5. Remove Tasks

![taskist-remove](https://user-images.githubusercontent.com/90844424/221482802-242e2de0-80e4-4fa0-ac13-01fd6ecb227f.gif)

사용자는 개별 아이템을 선택했을 시에만 나타나는 삭제하기 버튼을 눌러 해당 항목을 목록에서 제거할 수 있습니다. 매개변수로 받은 카테고리에서 `filter` 메서드를 사용해 `task.id`와 id가 다른 모든 할일 목록을 필터링합니다. 그리고 이를 반영하여 화면에 표시합니다.

```js
// 할일 삭제
function removeTask(category, id) {
  if (category === 'backlog') {
    backlogTasks = backlogTasks.filter((task) => task.id !== id);
  } else if (category === 'progress') {
    progressTasks = progressTasks.filter((task) => task.id !== id);
  } else if (category === 'complete') {
    completeTasks = completeTasks.filter((task) => task.id !== id);
  }

  // 업데이트된 할일 목록 렌더링
  renderTasks();
  closeModal();
}
```

<br/>
<br/>

### 3-6. Sort Tasks

![taskist-sort](https://user-images.githubusercontent.com/90844424/221484641-436d8980-97bd-49d2-9f3e-23f09f95bf14.gif)

사용자는 옵션을 선택하여 등록일순, 중요도순, 제목순으로 할일 목록을 정렬할 수 있습니다.

<br/>

select 요소에 `onchange` 이벤트를 등록하여 `sortTasks()` 함수로 backlog(0), progress(1), complete(2)의 index를 전달합니다.

```html
<select class="task-select" onchange="sortTasks(0)">
  <option value="created">등록일 순 [기본]</option>
  <option value="priority">중요도 순</option>
  <option value="alphabetical">제목 순</option>
</select>
```

<br/>

전달받은 index와 일치하는 select 요소의 option 값을 `selectedOption` 변수에 할당합니다. 이렇게 하면 사용자가 선택한 정렬 방법을 알 수 있습니다. 선택된 옵션(`selectedOption`)에 따라 `sort` 메서드를 사용해 `tasks` 배열을 정렬합니다. 그리고 renderTasks() 함수를 호출하여 정렬된 할일 목록을 표시합니다.

```js
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
```

<br/>

main.js 파일을 모듈화하였으므로 HTML에서 호출한 sortTasks() 함수가 접근 가능하도록 `window` parent로 재할당이 필요합니다.

```js
window.sortTasks = sortTasks;
```

<br/>
<br/>

### 3-7. Speech-to-Text using Web Speech API

![taskist-speech](https://github.com/cona-tus/js-to-do-list/assets/90844424/490a24bf-aaf8-4f09-b029-79e14f3a5a6e)

Taskist는 사용자의 편의를 위해 음성 받아쓰기 기능을 제공합니다. 마이크 버튼을 클릭하면 음성 인식이 시작됩니다. 이를 구현하기 위해 `Web Speech API`를 사용합니다. `startSpeech()` 함수는 음성을 텍스트로 변환하여 지정된 입력 필드에 자동으로 입력하는 역할을 합니다.

```js
// 브라우저 호환성
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = 'ko-KR';
recognition.maxAlternatives = 1;

const startSpeech = (event) => {
  const selectedInput = event.target.parentNode.nextElementSibling;

  // 자동 포커스
  selectedInput.focus();

  // 음성 인식 시작
  recognition.start();

  recognition.addEventListener('result', (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join('');

    // 포커스된 input 확인
    if (document.activeElement === selectedInput) {
      selectedInput.value = '';
      selectedInput.value = transcript;

      // 인식이 종료되었는지 확인
      if (event.results[0].isFinal) {
        recognition.stop();
        selectedInput.blur();
      }
    } else {
      return;
    }
  });
};

export default startSpeech;
```

<br/>
<br/>

## 4. UI/UX

### 4-1. Modal

![taskist-modal](https://user-images.githubusercontent.com/90844424/221508801-82bb8536-813c-444e-b253-6b346d6e99c2.gif)

Taskist는 모바일 앱과 유사한 사용자 경험을 제공하는 것을 목표로 합니다. 사용자가 할일 목록을 간편하게 확인하고 관리할 수 있도록 싱글 페이지로 개발하였으며, 모달창을 구현하여 사용자가 빠르게 투두리스트 작업을 수행할 수 있도록 만들었습니다.

<br/>
<br/>

### 4-2. Responsive Web Design

![taskist-responsive](https://user-images.githubusercontent.com/90844424/221505310-255227e0-ca33-40ba-b2a9-73b3c45d6ff1.jpg)

Taskist는 반응형 웹 사이트입니다. 모바일 환경에서 접속 시 어플처럼 기능하도록 구현하였습니다. 이로써 사용자가 웹 사이트를 더 편리하게 이용할 수 있습니다.

<br/>
<br/>

## 5. Trouble shooting

### 5-1. Update Tasks

#### 1. 목표

사용자가 할일 목록을 수정할 때 기존 항목을 삭제하고, 수정된 항목을 새롭게 생성하도록 구현하는 것이 목표입니다. 만약 사용자가 편집 모드에서 변경 사항 없이 모달 창을 닫을 경우, 아무런 동작이 발생하지 않도록 만들고자 했습니다.

<br/>

#### 2. 문제 상황

사용자가 아무런 변경 사항 없이 편집 모드에서 나온 뒤, 어떤 항목을 다른 카테고리로 이동시킬 때 다수의 항목이 삭제되었습니다.

<br/>

#### 3. 해결 방법

이를 해결하기 위해 prevTask, isEditMode 변수를 만들어 상태를 관리했습니다. `isEditMode` 변수는 현재 모달 창이 편집 모드인지 여부를 나타내는 데 사용되며, `prevTask` 변수는 현재 수정 중인 할일의 이전 정보를 저장하고 있습니다.

```js
let isEditMode = false;
let prevTask = null;
```

편집 모드일 때, `updateTasks()` 함수를 사용해 prevTask의 category와 id를 전달하여 해당 카테고리에서 기존 항목을 필터링하여 업데이트 합니다.

```js
// function submitForm
if (isEditMode) {
  updateTasks(prevTask.category, prevTask.id);
  isEditMode = false;
}
```

그리고 `closeModal()` 함수에서 `isEditMode`를 false로 초기화하여 모달 창이 닫힐 때 아무런 동작도 발생하지 않도록 만듭니다.

```js
function closeModal() {
  if (isUpdated) {
    removeBtn.classList.add('hidden');
    isUpdated = false;
  }

  modal.classList.remove('visible');
  modalForm.reset();
  isEditMode = false;
}
```

이렇게 하면 항목을 추가하거나 수정할 때 데이터의 일관성을 유지할 수 있으며, 불특정 항목이 삭제되지 않습니다.

<br/>
<br/>

### 5-2. Render Remove Button

#### 1. 목표

사용자가 새로운 할일 항목을 추가할 때 삭제 버튼이 보이지 않아야 하며, 편집 모드에서는 삭제 버튼을 화면에 표시해야 합니다.

<br/>

#### 2. 문제 상황

사용자가 새로운 항목을 추가하는 경우에도 삭제 버튼이 화면에 표시되어 사용자에게 혼란을 주었습니다.

<br/>

#### 3. 해결 방법

문제를 해결하기 위해 `isUpdated` 변수를 사용해, 사용자가 모달 창에서 폼을 제출하면 isUpdated를 true로 설정합니다. 모달 창을 닫을 때 `isUpdated`가 true일 경우 삭제 버튼(`removeBtn`)에 `hidden` 클래스를 추가하여 버튼을 숨깁니다.

```js
// function closeModal
if (isUpdated) {
  removeBtn.classList.add('hidden');
  isUpdated = false;
}
```

`openModal()` 함수 내에서 `isEditMode` 상태에 따라 삭제 버튼을 표시하거나 숨겨서 렌더링을 결정합니다. 이러한 조건부 렌더링을 통해 사용자 경험을 향상시킬 수 있었습니다.

```js
function openModal() {
  modal.classList.add('visible');

  if (isEditMode) {
    removeBtn.classList.remove('hidden');
  } else {
    removeBtn.classList.add('hidden');
  }
}
```

<br/>
<br/>

[맨위로 이동하기](#%EF%B8%8F-효율적인-투두리스트-앱-taskist-프로젝트)
