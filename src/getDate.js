// get Current Date
const getDate = () => {
  const dateEl = document.getElementById('date');
  const monthEl = document.getElementById('month');
  const dayEl = document.getElementById('day');

  const today = new Date();

  const date = today.getDate();
  const month = today.toLocaleString('en-US', { month: 'short' });
  const day = today.toLocaleString('en-US', { weekday: 'short' });

  dateEl.textContent = date;
  monthEl.textContent = month;
  dayEl.textContent = day;

  switch (today.getDay()) {
    case 0:
      dateEl.style.color = '#BA3E27';
      break;
    case 6:
      dateEl.style.color = '#2350A9';
      break;
  }
};

export default getDate;
