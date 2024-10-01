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