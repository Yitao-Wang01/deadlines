document.addEventListener('DOMContentLoaded', function () {
  const deadlines = [
    { date: '2023-11-29', program: 'CMU', color: 'red' },
    { date: '2023-12-15', program: 'Dartmouth', color: 'blue' },
    { date: '2024-03-15', program: 'BU', color: 'black' },
    { date: '2024-04-15', program: 'NEU', color: 'purple' },
    { date: '2023-12-15', program: 'Amherst', color: 'orange' },
    { date: '2023-12-01', program: 'NYU', color: 'pink' },
    { date: '2024-01-15', program: 'Columbia', color: 'brown' },
    { date: '2023-12-15', program: 'UCLA', color: 'gray' },
    { date: '2024-03-15', program: 'UWM', color: 'cyan' },
    { date: '2024-01-16', program: 'DUKE', color: 'magenta' },
    { date: '2024-04-01', program: 'W PAUL G ALLEN SCHOOL', color: 'yellow' },
    // Add more deadlines here if needed
  ];

  const container = document.getElementById('timeline-container');
  const timeline = document.getElementById('timeline');

  // Define the range of months for the timeline
  const startMonth = 9; // October (months are 0-indexed)
  const endMonth = 3; // April
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr']; // for labels
  const monthLengths = [31, 30, 31, 31, 28, 31, 30]; // days in each month from Oct to Apr

  // Calculate the start and end dates of the timeline
  const startDate = new Date(2023, startMonth, 1); // October 1, 2023
  const endDate = new Date(2024, endMonth, 30); // April 30, 2024
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
  // Object to hold grouped deadlines by date
  const groupedDeadlines = {};

  // Group deadlines by date
  deadlines.forEach(deadline => {
    if (!groupedDeadlines[deadline.date]) {
      groupedDeadlines[deadline.date] = [];
    }
    groupedDeadlines[deadline.date].push(deadline);
  });

  // Create arrows for each grouped deadline
  for (const date in groupedDeadlines) {
    createArrow(groupedDeadlines[date]);
  }

  // Function to create an arrow for each grouped deadline
  function createArrow(deadlineGroup) {
    const arrowContainer = document.createElement('div');
    arrowContainer.className = 'arrow-container';

    // Ensure there's at least one deadline in the group before proceeding
    if (deadlineGroup.length > 0) {
      const position = calculatePosition(deadlineGroup[0].date);
      arrowContainer.style.left = `calc(${position}% + 20px)`; // Added space for visibility

      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.innerHTML = deadlineGroup.map(deadline => `Program: ${deadline.program}<br>Deadline: ${deadline.date}`).join('<br><br>');

      const arrow = document.createElement('div');
      arrow.className = 'arrow';
      arrow.style.borderTopColor = deadlineGroup[0].color; // Use the color for the first arrow in the group

      arrow.onmouseover = function () {
        tooltip.style.visibility = 'visible';
      };

      arrow.onmouseout = function () {
        tooltip.style.visibility = 'hidden';
      };

      arrowContainer.appendChild(tooltip);
      arrowContainer.appendChild(arrow);
      container.appendChild(arrowContainer);
    }
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

  // ... rest of your code ...

  // Create arrows for each deadline
  deadlines.forEach(createArrow);

  // Add current date indicator
  addTodayArrow();

  function addTodayArrow() {
    console.log('Adding Today Arrow');  // Log when the function is called
    const currentDate = new Date();
    if (currentDate >= startDate && currentDate <= endDate) {

      const currentDateIndicator = document.createElement('div');
      currentDateIndicator.className = 'arrow-container today-container'; // added 'today-container' class
      currentDateIndicator.style.left = `calc(${((currentDate - startDate) / (1000 * 60 * 60 * 24) / totalDays) * 100}% + 20px)`; // Position based on day difference

      const todayLabel = document.createElement('div');
      todayLabel.className = 'arrow-label';
      todayLabel.textContent = 'Today';

      const arrow = document.createElement('div');
      arrow.className = 'arrow today';
      arrow.style.borderTopColor = 'green';  // Use a different color for today

      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = 'Today';

      tooltip.appendChild(arrow);
      currentDateIndicator.appendChild(todayLabel);
      currentDateIndicator.appendChild(tooltip);
      container.appendChild(currentDateIndicator);  // Append the currentDateIndicator to the container
    }
    console.log('Today Arrow Left:', currentDateIndicator.style.left);  // Log the left position of the Today arrow
  }


  // ... rest of your code ...


  // Function to update the 'today' arrow based on the current date
  function updateToday() {
    const todayContainer = document.querySelector('.today-container'); // updated selector to target 'today-container'
    if (todayContainer) {
      const today = new Date();
      if (today >= startDate && today <= endDate) {
        const daysFromStart = (today - startDate) / (1000 * 60 * 60 * 24);
        todayContainer.style.left = `calc(${(daysFromStart / totalDays) * 100}% + 20px)`;  // updated target to todayContainer
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
});



