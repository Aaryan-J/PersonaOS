// ====== Universal Variables ======
var topbar = document.querySelector("#top");

// ====== Window Dragging ======
// Initialize dragging functionality
function dragElement(element) {
  if (!element) return;

  var initialX = 0, initialY = 0;
  var currentX = 0, currentY = 0;

  var header = document.getElementById(element.id + "header");
  if (header) {
    header.onmousedown = startDragging;
  } else {
    element.onmousedown = startDragging;
  }

  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();

    // Get mouse cursor position at start
    initialX = e.clientX;
    initialY = e.clientY;

    document.onmouseup = stopDragging;
    document.onmousemove = elementDrag; // Fixed function link
  }

  // Renamed this inner function from dragElement to elementDrag to fix the loop crash as it was wrong in the demo itself
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    // Calculate new position
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;

    element.style.transform = "none";

    // Set element's new positions
    element.style.top = (element.offsetTop - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// ====== Window Rise ======
// variables
var biggestIndex = 1;

// function
function addWindowTapHandling(window) {

  window.addEventListener("mousedown", () => handleWindowTap(window));
}
function handleWindowTap(window) {
  window.style.zIndex = biggestIndex;
  biggestIndex++;
  topbar.style.zIndex = biggestIndex + 1;
  deselectApp(selectedIcon)
}

// ====== Clock ======
function updateTime() {
  var currentTime = new Date().toLocaleString();
  var timeString = document.querySelector("#dateAndTimeElement");
  if (timeString) {
    timeString.innerHTML = currentTime;
  }
}
// Update time instantly, then run every second
updateTime();
setInterval(updateTime, 1000);

// ====== Open/Close Window ======
function closewindow(element) {
  element.style.display = "none";
}
function openwindow(element) {
  element.style.display = "flex";
  element.style.zIndex = biggestIndex;
  biggestIndex++;
  topbar.style.zIndex = biggestIndex + 1;
}

function openAndCloseWindow(window, openButton, closeButton) {

  if (openButton) {
    closeButton.addEventListener("click", () => closewindow(window));
  }

  if (closeButton) {
    openButton.addEventListener("click", () => openwindow(window));
  }
}

// ====== Apps ======-
// variables
var selectedIcon = undefined;

// functions
function selectApp(icon) {
  icon.classList.add("selectedApp");
  selectedIcon = icon;
}

function deselectApp(icon) {
  icon.classList.remove("selectedApp");
  selectedIcon = undefined;
}

function handleAppClick(icon) {
  if (icon.classList.contains("selectedApp")) {
    deselectApp(icon);
    openwindow(window)
  } else {
    selectApp(icon);
  }
}

function initializeWindow(window) {
  var screen = document.querySelector("#" + window);
  var closeButton = document.querySelector("#" + window + "close");
  var openButton = document.querySelector("#" + window + "open");

  addWindowTapHandling(screen)
  dragElement(screen)
  openAndCloseWindow(screen, openButton, closeButton)
}

initializeWindow("welcome");
initializeWindow("music");
