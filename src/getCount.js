import globalContext from './globalContext.js';

// get Count
const getCount = () => {
  const taskTotalCountEl = document.getElementById('total-count');
  const backlogCountEl = document.getElementById('backlog-count');
  const completeCountEl = document.getElementById('complete-count');
  const progressCountEl = document.getElementById('progress-count');
  const progressStatusEl = document.getElementById('progress-status');
  const progressbarEl = document.getElementById('progress-bar');

  progressbarEl.style.width = '';

  let backlogCount = globalContext.backlogTasks.length;
  let progressCount = globalContext.progressTasks.length;
  let completeCount = globalContext.completeTasks.length;

  backlogCountEl.textContent = backlogCount;
  progressCountEl.textContent = progressCount;
  completeCountEl.textContent = completeCount;

  let totalCount = +backlogCount + +progressCount + +completeCount;
  taskTotalCountEl.textContent = `${+totalCount} Tasks`;

  progressStatusEl.textContent = `${completeCount} / ${totalCount}`;

  let percentage = (completeCount / totalCount) * 100;
  progressbarEl.style.width = `${percentage}%`;
};

export default getCount;
