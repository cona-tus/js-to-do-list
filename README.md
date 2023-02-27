# ☑️ 할 일 관리 앱, 'Taskist' 프로젝트

![taskist-thumb](https://user-images.githubusercontent.com/90844424/221479336-6a5c7dd1-5ec8-4c85-a2c6-3ae8ee73437f.jpg)

<br />

[![Netlify Status](https://api.netlify.com/api/v1/badges/e8ae57cf-8a6a-48bd-95c5-246d4f5de67c/deploy-status)](https://app.netlify.com/sites/conatus-js-to-do-list/deploys) | [Live Demo](https://conatus-js-to-do-list.netlify.app/)

<br/>
<br/>

# 1. Project

## 1-1. Project Information

> Taskist는 할 일을 관리할 수 있는 투두리스트 애플리케이션입니다. 단순히 작업을 추가하고 삭제하는 것이 아니라, 사용자가 일정을 파악하고, 다음 단계로 나아갈 수 있도록 생산적이고 사용자 친화적인 앱을 만드는 데 주력했습니다.

<br/>

#### # 일 처리에 용이한 체계적 구조

- [x] 일 처리를 <u>시작전, 진행중, 완료 순</u>으로 단계적으로 구분하여 작업을 체계적으로 관리할 수 있습니다. 달성률이 화면에 표시되어 생산성 증대를 도와줍니다.

#### # 메모 기능 구현

- [x] 할 일을 추가할 때 <u>상세설명</u>을 작성할 수 있어 메모의 기능으로서도 유용합니다.

#### # 사용자 편의를 고려한 받아쓰기 기능

- [x] 보다 간편하게 할 일을 작성하기 위해 <u>받아쓰기 기능</u>을 제공합니다.

#### # 업무 관리를 위한 정렬 기능

- [x] 할 일 목록을 <u>등록일 순, 중요도 순, 제목 순</u>으로 필터하여 업무를 정리하는 데 도움을 줍니다.

#### # 모바일에 최적화 된 반응형 웹

- [x] 모바일에 적합한 UI로, <u>반응형 웹</u>으로 동작합니다.

<br/>

## 1-2. Project Duration & Participants

- 2023-2-16 ~ 2023-2-24
- 개인 프로젝트 (1인)

<br/>
<br/>

# 2. Skills

![HTML](https://img.shields.io/badge/html-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![SCSS](https://img.shields.io/badge/Sass-bf4080?style=for-the-badge&logo=Sass&logoColor=ffffff) ![JAVASCRIPT](https://img.shields.io/badge/JavaScript-f6e158?style=for-the-badge&logo=JavaScript&logoColor=ffffff) ![Git](https://img.shields.io/badge/Git-f05032?style=for-the-badge&logo=git&logoColor=ffffff)

<br/>
<br/>

# 3. Main Features

## 3-1. Create a new Task

![taskist-create](https://user-images.githubusercontent.com/90844424/221480086-1a2ad34c-ae28-48e6-9570-3a697129f99c.gif)

사용자는 `+` 버튼을 클릭하고 카테고리, 제목, 중요도, 내용을 입력하여 새로운 업무를 생성할 수 있습니다.

- `addTask()`는 사용자 입력 값을 제출하여 새로운 task를 생성하는 함수입니다.
- `input[name="category"]`인 카테고리 element들을 **for...of** 문으로 순회하여 사용자가 체크한 radio input 값을 변수 category에 할당합니다. 마찬가지로 priority도 해당됩니다.

```js
const addTask = (event) => {
  event.preventDefault();

  // 변수 초기화
  let category;
  let priority;
  let taskTitle;
  let taskDesc;

  // 카테고리
  for (const categoryEl of categoryEls) {
    if (categoryEl.checked) {
      category = categoryEl.value;
      break;
    }
  }

  // 중요도
  for (const priorityEl of priorityEls) {
    if (priorityEl.checked) {
      priority = priorityEl.value;
      break;
    }
  }

  // 제목 및 내용
  taskTitle = taskTitleEl.value;
  taskDesc = taskDescEl.value;

  // 유효성 검사
  if (!category || !priority || !taskTitle.trim() || !taskDesc.trim()) {
    alert('모든 입력창에 값을 입력해주세요.');
  } else {
    // task 생성
    globalContext.task = buildTask(category, taskTitle, priority, taskDesc);

    // 배열에 추가
    if (globalContext.task) {
      pushTasks(globalContext.task);
      closeModal();
      modalForm.reset();
    }
  }
};

modalForm.addEventListener('submit', addTask);
```

- 간단한 유효성 검사를 실행한 뒤, `buildTask()` 함수에 값을 전달해 task 오브젝트를 구성합니다. 이때 고유의 id값과 생성시간을 부여합니다.

```js
// task 오브젝트 구성
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
```

- 구성된 task 오브젝트는 `pushTask()` 함수에 전달되어 카테고리 값을 체크한 후 backlog, progress, complete 배열에 각각 추가됩니다.

```js
// task를 해당 배열에 추가
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
```

<br/>

## 3-2. Save Tasks in Local storage

![taskist-storage](https://user-images.githubusercontent.com/90844424/221480537-ebd725ba-4fa0-4fa1-ad20-d137d64b7645.gif)

사용자가 task를 생성하면, 동시에 로컬스토리지에 데이터가 저장됩니다.

- backlogTasks, progressTasks, completeTasks 배열을 `JSON.stringify()`를 통해 JSON 형태로 저장합니다.

```js
// 로컬스토리지에 데이터 저장
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
```

- 삼항 연산자를 사용하여 로컬스토리지에 저장된 데이터가 있다면 `JSON.parse()`로 다시 파싱하여 가져옵니다. 없다면 **빈 배열**로 설정합니다.

```js
// 로컬 스토리지 데이터 확인
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
```

<br/>

## 3-3. Render Tasks

![taskist-dom](https://user-images.githubusercontent.com/90844424/221481649-2d2c6aa7-1929-4de8-b8ac-aa49827d720c.jpg)

사용자가 새로운 task를 생성하면 DOM element가 생성되어 화면에 그려집니다.

- 전역 변수 updatedOnLoad 값을 이용해 페이지를 로드할 때 로컬스토리지에 저장된 데이터를 한번만 확인합니다.
- `forEach`문으로 backlogTasks, progressTasks, completeTasks 배열을 각각 순회하여 해당 카테고리 element와 item을 `generateTaskEl()` 함수에 전달하여 DOM element를 생성합니다.
- backlogTasks, progressTasks, completeTasks 각 배열이 비어있다면, `generateImgEl()` 함수가 entry 이미지를 생성해 메인 페이지에 추가합니다.

```js
// 화면에 렌더링
const renderTasks = () => {
  // 로컬스토리지에 저장된 데이터 확인
  if (!globalContext.updatedOnLoad) {
    getSavedTask();
  }

  // backlog 배열
  if (globalContext.backlogTasks.length === 0) {
    backlogListEl.textContent = '';
    generateImgEl(1, backlogListEl);
  } else {
    backlogListEl.textContent = '';
  }
  globalContext.backlogTasks.forEach((backlogItem) => {
    generateTaskEl(backlogListEl, backlogItem);
  });

  // progress 배열
  if (globalContext.progressTasks.length === 0) {
    progressListEl.textContent = '';
    generateImgEl(2, progressListEl);
  } else {
    progressListEl.textContent = '';
  }
  globalContext.progressTasks.forEach((progressItem) => {
    generateTaskEl(progressListEl, progressItem);
  });

  // complete 배열
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
```

- generateTaskEl() 함수는 task DOM element를 생성하는 함수입니다.
- `document.createElement()` 메서드로 HTML element를 만들고, `appendChild()`를 사용해 DOM에 추가합니다.
- item 항목을 클릭할 때 `updateTask()` 함수에 task 값을 전달하여 추후 값을 불러오고, 수정 가능하도록 만듭니다.
- 또한 제목과 내용의 길이가 너무 길다면 메인 페이지에서 `..` 말줄임표로 생략되어 보이도록 `substring()`를 사용하여 부분 문자열을 반환합니다.

```js
// DOM element 생성
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
```

<br/>

## 3-4. Update Tasks

![taskist-update](https://user-images.githubusercontent.com/90844424/221482284-a6cfa6f8-d2a1-4199-9253-1fb1c0fd6810.gif)

사용자는 개별 task 아이템을 클릭하여 입력 값을 수정하거나, 새롭게 쓸 수 있습니다.

- `updateTask()` 함수는 아이템의 입력 값을 불러와 사용자가 이전 정보를 읽을 수 있도록 합니다. 또한 선택한 아이템을 삭제한 뒤 새로운 정보를 배열에 새로 추가합니다.

```js
// Task 수정
function updateTask(task) {
  const { id, category, title, priority, desc } = task;

// ...
```

- 유사배열인 categoryEls NodeList를 `Array.from()`을 사용하여 배열로 전환합니다.
- 그 후 `find()` 메서드로 task의 카테고리와 일치하는 값을 찾아주고, 해당 radio input에 체크해줍니다.
- 사용자가 클릭한 아이템, 즉 이전 task 정보를 삭제하기 위해 `filter()` 메서드를 사용해 task의 id 값이 일치하지 않는 배열을 반환합니다.
- 해당 방식은 priority에도 동일하게 적용합니다.

```js
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

// ...
```

- 개별 아이템을 삭제할 수 있도록 removeBtn에 onclick을 설정하여 `removeTask()` 함수에 id 값을 전달합니다.

```js
removeBtn.classList.remove('hidden');
removeBtn.onclick = () => removeTask(id);

taskTitleEl.value = title;
taskDescEl.value = desc;

openModal();
}
```

<br/>

## 3-5. Delete Tasks

![taskist-remove](https://user-images.githubusercontent.com/90844424/221482802-242e2de0-80e4-4fa0-ac13-01fd6ecb227f.gif)

사용자는 개별 아이템을 선택했을 시에만 나타나는 삭제하기 버튼을 눌러 해당 항목을 목록에서 제거할 수 있습니다.

- removeTask()는 task의 id를 전달받는 함수입니다.
- `filter()` 메서드로 task의 id 값과 전달받은 id 값이 일치하지 않는 새로운 taskList 배열을 반환합니다.

```js
// Task 삭제
const removeTask = (id) => {
  globalContext.tasks.forEach((taskList) => {
    taskList = taskList.filter((task) => task.id !== id);
  });

  renderTasks();
  closeModal();
};
```

<br/>

## 3-6. Sort Tasks

![taskist-sort](https://user-images.githubusercontent.com/90844424/221484641-436d8980-97bd-49d2-9f3e-23f09f95bf14.gif)

사용자는 옵션을 선택하여 등록일순, 중요도순, 제목순으로 할 일을 정렬할 수 있습니다.

- select element에 `onchange`를 등록하여 sortTasks() 함수로 backlog(0), progress(1), complete(2)의 index를 전달합니다.

```html
<select class="task-select" onchange="sortTasks(0)">
  <option value="created">등록일 순 [기본]</option>
  <option value="priority">중요도 순</option>
  <option value="alphabetical">제목 순</option>
</select>
```

- 전달받은 index와 일치하는 select element의 option 값을 `selectedOption` 변수에 할당합니다.
- selectedOption 값과 옵션의 값이 일치하는지 확인하고, `sort()` 메서드를 사용합니다.
- 중요도는 `+`를 붙여 숫자로 변환한 후 정렬하고, 제목의 경우 `toLowerCase()`로 소문자로 바꿔준 뒤 정렬합니다.

```js
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
```

- main.js 파일을 모듈화하였으므로 `index.html`에서 호출한 sortTasks() 함수는 접근 가능하도록 `window` parent로 재할당이 필요합니다.

```js
window.sortTasks = sortTasks;
```

<br/>

## 3-7. Dictation with Web Speech API

![taskist-speech](https://user-images.githubusercontent.com/90844424/221486559-74adedb1-62ad-44e8-9293-d1c1b8fe4832.gif)

사용자 편의를 돕도록 할 일의 제목과 내용 부분에 받아쓰기 기능이 제공됩니다. 마이크 버튼을 클릭하면 음성 인식이 시작됩니다. `Web Speech API`를 사용하였습니다.

```js
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

speechBtns.forEach((speechBtn) => {
  speechBtn.addEventListener('click', startSpeech);
});
```

<br/>
<br/>

# 4. UI/UX

## 4-1. Modal

![taskist-modal](https://user-images.githubusercontent.com/90844424/221508801-82bb8536-813c-444e-b253-6b346d6e99c2.gif)

`+` 버튼을 눌러 모달창을 열 수 있으며, `×` 버튼을 눌러 모달창을 닫을 수 있습니다.

- DOM element에 `visible` 클래스를 추가하거나 제거하여 동작합니다.

```js
const closeModal = () => {
  modal.classList.remove('visible');
  modalForm.reset();
  removeBtn.classList.add('hidden');
};

const openModal = () => {
  modal.classList.add('visible');
};

addBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
```

<br/>

## 4-2. Responsive Web

![taskist-responsive](https://user-images.githubusercontent.com/90844424/221505310-255227e0-ca33-40ba-b2a9-73b3c45d6ff1.jpg)

Taskist는 **반응형 웹**으로 제작되었습니다. 모바일 디바이스로 웹 페이지에 접속 시 어플처럼 기능하기 위해 글자 크기와 앱의 컨테이너 크기에 변화가 있습니다.

```scss
.container {
  width: 375px;
  height: 700px;
  // ...
  border-radius: 35px;
  box-shadow: 15px 15px 50px 10px rgba(0, 0, 0, 0.25), -14px -14px 30px rgb(255, 255, 255);

  @include mobile {
    width: 100%;
    height: 100%;
    border-radius: 0;
    box-shadow: none;
  }
}

h1 {
  font-size: 1.5rem;
  font-weight: 500;

  @include mobile {
    font-size: 1.25rem;
  }
}

// h2, h3, h4...

$breakpoint-mobile: 480px;

@mixin mobile {
  @media (max-width: #{$breakpoint-mobile}) {
    @content;
  }
}
```

<br/>
<br/>
<br/>
