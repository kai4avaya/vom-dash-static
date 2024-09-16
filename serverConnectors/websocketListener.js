// import {configs} from "../configs/configs"
// import { transformData } from "../orchestration/chooseData";
// import {initializeCharts} from "../orchestration/initializeCharts";
// let currentState = null;
// let socket = null;
// let reconnectAttempts = 0;
// const MAX_RECONNECT_ATTEMPTS = 5;

// function toggleNotificationClass(isAlert) {
//   const notificationElement = document.getElementById('notification');
//   const notificationNotice = document.getElementById('notification-notice')
//   if (notificationElement) {
//     if (isAlert) {
//       notificationElement.classList.remove('neo-notification--info');
//       notificationElement.classList.add('neo-notification--alert');
//       notificationNotice.textContent = 'Unable to connect to the VOM server';
//     } else {
//       notificationElement.classList.remove('neo-notification--alert');
//       notificationElement.classList.add('neo-notification--info');
//       notificationNotice.textContent = 'Dashboard is connected to all systems';

//     }
//   } else {
//     console.error('Notification element not found');
//   }
// }


// export function initializeWebSocket() {
//   const socketUrl = configs.prodUrl+'/vom' //'wss://localhost:3000/vom';  // Update this to your actual backend URL
//   // const socketUrl = configs.devUrl+'/vom' //'wss://localhost:3000/vom';  // Update this to your actual backend URL


//   socket = new WebSocket(socketUrl);

//   socket.onopen = function(event) {
//     reconnectAttempts = 0; // Reset reconnect attempts on successful connection
//   };

//   socket.onmessage = function(event) {
//     try {
//       const newData = JSON.parse(event.data);
//       console.log('Received data:', newData);
//       // Usage example:
//       // toggleNotificationClass(false); // To toggle back to info class

//       // Compare new data with current state
//       if (JSON.stringify(newData) !== JSON.stringify(currentState)) {
//         console.log('State changed:', newData);
//         // Update the current state
//         currentState = newData;
//         // Update your UI here
//         updateGraphs(newData);
//       } 
//     } catch (error) {
//       console.error('Error processing message:', error);
//       // toggleNotificationClass(true); // To toggle to alert class

//     }
//   };

//   socket.onerror = function(error) {
//     // toggleNotificationClass(true); 
//     console.error('WebSocket error:', error);
//   };

//   socket.onclose = function(event) {
//     console.log('WebSocket connection closed');
    
//     if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
//       const timeout = Math.min(1000 * 2 ** reconnectAttempts, 30000);
//       console.log(`Attempting to reconnect in ${timeout/1000} seconds...`);
//       setTimeout(() => {
//         reconnectAttempts++;
//         initializeWebSocket();
//       }, timeout);
//     } else {
//       console.error('Max reconnection attempts reached. Please refresh the page.');
//     }
//   };

//   return socket;
// }

// export function updateGraphs(data) {
//   // Update your UI elements here
//  const dataToUpdate = transformData(data)
//  initializeCharts(dataToUpdate)

// }

// // Initialize the WebSocket connection when the module is imported
// initializeWebSocket();

// // Optionally, you can export the socket if you need to use it in other parts of your app
// export { socket };


import {configs} from "../configs/configs"
import { transformData } from "../orchestration/chooseData";
import {initializeCharts} from "../orchestration/initializeCharts";

let currentState = null;
let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

function toggleNotification(show, isAlert = false) {
  const notificationElement = document.querySelector('.neo-notification');
  if (notificationElement) {
    if (show) {
      notificationElement.style.display = 'flex';
      if (isAlert) {
        notificationElement.classList.remove('neo-notification--info');
        notificationElement.classList.add('neo-notification--alert');
        notificationElement.querySelector('.neo-notification__title').textContent = 'Alert';
        notificationElement.querySelector('.neo-notification__description').textContent = 'Predicted Emergency Notice';
      } else {
        notificationElement.classList.remove('neo-notification--alert');
        notificationElement.classList.add('neo-notification--info');
        notificationElement.querySelector('.neo-notification__title').textContent = 'Info';
        notificationElement.querySelector('.neo-notification__description').textContent = 'Predicted Emergency Notice';
      }
    } else {
      notificationElement.style.display = 'none';
    }
  } else {
    console.error('Notification element not found');
  }
}

export function initializeWebSocket() {
  const socketUrl = configs.prodUrl+'/vom';
  
  socket = new WebSocket(socketUrl);

  console.log("I AM SOCKET!", socket)

  socket.onopen = function(event) {
    reconnectAttempts = 0;
  };

  socket.onmessage = function(event) {
    try {
      const newData = JSON.parse(event.data);
      console.log('Received data:', newData);
      
      // Check if emergencytype contains 'f' d
      if (newData.emergencytype && newData.emergencytype.includes('f')) {
        toggleNotification(true, true);
        return;
      } else {
        toggleNotification(false);
      }

      if (JSON.stringify(newData) !== JSON.stringify(currentState)) {
        console.log('State changed:', newData);
        currentState = newData;
        updateGraphs(newData);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      toggleNotification(true, true);
    }
  };

  socket.onerror = function(error) {
    console.error('WebSocket error:', error);
    toggleNotification(true, true);
  };

  socket.onclose = function(event) {
    console.log('WebSocket connection closed');
    toggleNotification(true, true);
    
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      const timeout = Math.min(1000 * 2 ** reconnectAttempts, 30000);
      console.log(`Attempting to reconnect in ${timeout/1000} seconds...`);
      setTimeout(() => {
        reconnectAttempts++;
        initializeWebSocket();
      }, timeout);
    } else {
      console.error('Max reconnection attempts reached. Please refresh the page.');
    }
  };

  return socket;
}

export function updateGraphs(data) {
  const dataToUpdate = transformData(data)
  initializeCharts(dataToUpdate)
}

initializeWebSocket();

export { socket };