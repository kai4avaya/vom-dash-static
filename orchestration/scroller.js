const excludedElements = ['animated-line-graph-panel', 'animated-area-graph-panel'];
let isScrolling = false;
let scrollInterval;
let currentIndex = 0;
let previousElement = null;

export function orchestrateScrolling(elementIds, interval) {
  if (isScrolling) {
    stopScrolling();
  }

  isScrolling = true;
  currentIndex = 0;

  function scrollToNextElement() {
    if (!isScrolling) {
      return;
    }

    if (currentIndex >= elementIds.length) {
      currentIndex = 0;
    }

    // Remove 'make-big' class and red border from previous element
    if (previousElement) {
      previousElement.classList.remove('make-big');
      previousElement.style.border = '';
    }

    const currentElement = document.getElementById(elementIds[currentIndex]);
    if (!currentElement) {
      currentIndex = (currentIndex + 1) % elementIds.length;
      scrollInterval = setTimeout(scrollToNextElement, interval);
      return;
    }

    // Add 'make-big' class to current element if it's not in the excluded list
    if (!excludedElements.includes(currentElement.id)) {
      currentElement.classList.add('make-big');
    }

    // Add red border to current element if it's in the excluded list
    if (excludedElements.includes(currentElement.id)) {
      currentElement.style.border = '2px solid red';
    }

    previousElement = currentElement;

    // Scroll to the element
    currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Move to next element after interval
    currentIndex = (currentIndex + 1) % elementIds.length;
    scrollInterval = setTimeout(scrollToNextElement, interval);
  }

  // Start the scrolling process
  scrollToNextElement();
}

export function stopScrolling() {
  isScrolling = false;
  clearTimeout(scrollInterval);

  // Remove 'make-big' class and red border from the last element
  if (previousElement) {
    previousElement.classList.remove('make-big');
    previousElement.style.border = '';
  }
}
// Example usage:
// const elementIds = ['element1', 'element2', 'animated-line-graph-panel', 'animated-area-graph-panel', 'element3'];
// const interval = 5000; // 5 seconds
// 
// // Start scrolling
// orchestrateScrolling(elementIds, interval);