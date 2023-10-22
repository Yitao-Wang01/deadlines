document.addEventListener('DOMContentLoaded', function () {
  const deadlines = [
    { date: '2023-12-01', program: 'Program A', color: 'red' },
    { date: '2023-11-10', program: 'Program B', color: 'blue' },
    // Add more deadlines here
  ];

  const container = document.getElementById('timeline-container');
  const timeline = document.getElementById('timeline');

  // Define the range of months for the timeline
  const startMonth = 9; // October (months are 0-indexed)
  const endMonth = 0; // January
  const months = ['Oct', 'Nov', 'Dec', 'Jan']; // for labels
  const monthLengths = [31, 30, 31, 31]; // days in each month from Oct to Jan

  // Calculate the start and end dates of the timeline
  const startDate = new Date(2023, startMonth, 1); // October 1, 2023
  const endDate = new Date(2024, endMonth, 31); // January 31, 2024
  const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24); // total days in the timeline

  // Function to create an increment for each month
  function createIncrement(month, index) {
    const increment = document.createElement('div');
    increment.className = 'increment';
    increment.style.left = `calc(${index * (100 / months.length)}% + 20px)`; // added space for visibility

    const label = document.createElement('span');
    label.textContent = month;
    increment.appendChild(label); 

    timeline.appendChild(increment);
  }

  // Function to create smaller increments for dates
  function createDateIncrements() {
    let totalDays = 0;
    monthLengths.forEach((numDays, index) => {
      for (let i = 1; i <= numDays; i++) {
        const increment = document.createElement('div');
        increment.className = 'increment date-increment';
        increment.style.left = `calc(${totalDays * (100 / monthLengths.reduce((a, b) => a + b, 0))}% + 20px)`; // added space for visibility
        timeline.appendChild(increment);
        totalDays++;
      }
    });
  }

  // Function to create an arrow for each deadline
  function createArrow(deadline) {
    const arrow = document.createElement('div');
    arrow.className = 'arrow';
    arrow.style.borderTopColor = deadline.color; // use the color for the arrow
    arrow.style.left = `calc(${calculatePosition(deadline.date)}% + 20px)`; // added space for visibility

    arrow.onclick = function () {
      alert('Deadline: ' + deadline.date);
    };

    container.appendChild(arrow);
  }

  // Function to calculate the position of each arrow on the timeline
  function calculatePosition(date) {
    const deadlineDate = new Date(date);
    const daysFromStart = (deadlineDate - startDate) / (1000 * 60 * 60 * 24);
    return (daysFromStart / totalDays) * 100;
  }

  // Create increments for each month
  months.forEach(createIncrement);

  // Create smaller increments for dates
  createDateIncrements();

  // Create arrows for each deadline
  deadlines.forEach(createArrow);

  // Add current date indicator
  const currentDate = new Date();
  if (currentDate >= startDate && currentDate <= endDate) {
    const currentDateIndicator = document.createElement('div');
    currentDateIndicator.className = 'arrow today';
    const daysFromStart = (currentDate - startDate) / (1000 * 60 * 60 * 24);
    currentDateIndicator.style.left = `calc(${(daysFromStart / totalDays) * 100}% + 20px)`; // position based on day difference
    container.appendChild(currentDateIndicator);
  }
});

// Function to update the 'today' arrow based on the current date
function updateToday() {
  const todayArrow = document.querySelector('.arrow.today');
  if (todayArrow) {
    const today = new Date();
    if (today >= startDate && today <= endDate) {
      const daysFromStart = (today - startDate) / (1000 * 60 * 60 * 24);
      todayArrow.style.left = `calc(${(daysFromStart / totalDays) * 100}% + 20px)`;
    }
  }
}

// Update the 'today' arrow at midnight
let midnightUpdate = new Date();
midnightUpdate.setDate(midnightUpdate.getDate() + 1);
midnightUpdate.setHours(0, 0, 0, 0); // set to next midnight

const msUntilMidnight = midnightUpdate - new Date(); // milliseconds until midnight
setTimeout(function () {
  updateToday();
  setInterval(updateToday, 24 * 60 * 60 * 1000); // then update every 24 hours
}, msUntilMidnight);
