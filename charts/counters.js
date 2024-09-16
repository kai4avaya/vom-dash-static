// function animateCounter(element, start, end, duration) {
//     let startTimestamp = null;
//     const step = (timestamp) => {
//       if (!startTimestamp) startTimestamp = timestamp;
//       const progress = Math.min((timestamp - startTimestamp) / duration, 1);
//       const currentValue = Math.floor(progress * (end - start) + start);
//       element.textContent = currentValue.toLocaleString();
//       if (progress < 1) {
//         window.requestAnimationFrame(step);
//       }
//     };
//     window.requestAnimationFrame(step);
//   }
  
//   export function initializeCounters() {
//     // Initialize counters with 0 or any default values
//     document.getElementById('us-counter').textContent = '0';
//     document.getElementById('ru-counter').textContent = '0';
//     document.getElementById('cn-counter').textContent = '0';
//     document.getElementById('other-counter').textContent = '0';
//   }
  
//   export function updateCounters(data) {
//     const duration = 2000; // 2 seconds for the animation
  
//     animateCounter(document.getElementById('us-counter'), 0, data.us, duration);
//     animateCounter(document.getElementById('ru-counter'), 0, data.ru, duration);
//     animateCounter(document.getElementById('cn-counter'), 0, data.cn, duration);
//     animateCounter(document.getElementById('other-counter'), 0, data.other, duration);
//   }



//   // Example of updating counters after 2 seconds
//   setTimeout(() => {
//     updateCounters({
//       us: 12934,
//       ru: 5877,
//       cn: 1409,
//       other: 2368
//     });
//   }, 2000);
let currentData = {
  us: 12934,
  ru: 5877,
  cn: 1409,
  other: 2368
};

function animateCounter(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const currentValue = Math.floor(progress * (end - start) + start);
    element.textContent = currentValue.toLocaleString();
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

export function initializeCounters() {
  document.getElementById('us-counter').textContent = '0';
  document.getElementById('ru-counter').textContent = '0';
  document.getElementById('cn-counter').textContent = '0';
  document.getElementById('other-counter').textContent = '0';
}

function updateCounter(key, value) {
  const element = document.getElementById(`${key}-counter`);
  const start = parseInt(element.textContent.replace(/,/g, ''), 10);
  animateCounter(element, start, value, 1000);
  currentData[key] = value;
}

export function updateCounters(data) {
  Object.keys(data).forEach(key => {
    updateCounter(key, data[key]);
  });
}

function generateDataSet(version) {
  const baseData = {
    us: 12934,
    ru: 5877,
    cn: 1409,
    other: 2368
  };
  const increaseFactor = 1 + (version - 1) * 0.2; // 20% increase per version
  return {
    us: Math.floor(baseData.us * increaseFactor),
    ru: Math.floor(baseData.ru * increaseFactor),
    cn: Math.floor(baseData.cn * increaseFactor),
    other: Math.floor(baseData.other * increaseFactor)
  };
}

export function updateCountersWithVersion(version) {
  if (version < 1 || version > 5) {
    console.error('Version must be between 1 and 5');
    return;
  }
  const data = generateDataSet(version);
  updateCounters(data);
  currentData = { ...data };
}

function randomShift() {
  const keys = Object.keys(currentData);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const shiftAmount = Math.floor(Math.random() * 201) - 100; // Random number between -100 and 100
  const newValue = Math.max(0, currentData[randomKey] + shiftAmount); // Ensure the value doesn't go below 0
  updateCounter(randomKey, newValue);
}

function scheduleNextShift() {
  const delay = Math.random() * 3000 + 1000; // Random delay between 1 to 4 seconds
  setTimeout(() => {
    randomShift();
    scheduleNextShift();
  }, delay);
}

// Initial update with version 1
updateCountersWithVersion(1);

// Start the random shifts
scheduleNextShift();

// Export a function to allow manual updates
export function manualUpdate(version) {
  updateCountersWithVersion(version);
}