// variables
var welcomeScreen = document.querySelector("#welcome");
var welcomeOpen = document.querySelector("#welcomeopen");
var welcomeClose = document.querySelector("#welcomeclose");

// Initialize dragging functionality
dragElement(document.getElementById("welcome"));
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

function closewindow(element) {
  element.style.display = "none";
}
function openwindow(element) {
  element.style.display = "flex";
}

welcomeOpen.addEventListener("click", function() {
  openwindow(welcomeScreen);
});
welcomeClose.addEventListener("click", function() {
  closewindow(welcomeScreen);
});
