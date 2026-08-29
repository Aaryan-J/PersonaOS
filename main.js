document.addEventListener("DOMContentLoaded", function () {

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
      if (e.target.classList.contains("closeButton")) return;

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
  var biggestIndex = 10;

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
    if (!element) return;

    element.classList.remove("windowOpening");
    element.classList.add("windowClosing");

    element.addEventListener("animationend", function handleClose() {
      if (element.classList.contains("windowClosing")) {
        element.style.display = "none";
        element.classList.remove("windowClosing");
      }
      element.removeEventListener("animationend", handleClose);
    });

  }
  function openwindow(element) {
    if (!element) return;
    element.style.display = "flex";
    element.style.zIndex = biggestIndex;
    biggestIndex++;
    topbar.style.zIndex = biggestIndex + 1;

    element.classList.remove("windowClosing");
    element.classList.add("windowOpening")
  }

  function openAndCloseWindow(window, openButton, closeButton) {

    if (closeButton) {
      closeButton.addEventListener("click", (e) => {
        e.stopPropagation();
        closewindow(window);
      });
    }

    if (openButton) {
      openButton.addEventListener("click", () => openwindow(window));
    }
  }

  // ====== Apps ======-
  // variables
  var selectedIcon = undefined;

  // functions
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
  initializeWindow("media")

  function initializeMusicTabs() {
    var contentArea = document.querySelector("#musicContent");
    var btnArtists = document.querySelector("#artistsButton");
    var btnAlbums = document.querySelector("#albumsButton");

    if (!contentArea) return;

    if (btnArtists) {
      btnArtists.classList.add("activeTab");
    }

    // Html Templates
    var contentData = {
      artists: `
    <h1 style="text-align: center; font-weight: 800; font-size: 50px; margin: 10px 0;">
        ARTISTS
    </h1>
    <h2 style="text-align: center; font-size: 25px; margin: 10px 0;">
        My favourite artists are mentioned below!
    </h2>
    <ul>
        <li tabindex="0">Pierce the Veil</li>
        <li tabindex="0">My Chemical Romance</li>
        <li tabindex="0">Radiohead</li>
    </ul>
    `,
      albums: `
    <h1 style="text-align: center; font-weight: 800; font-size: 50px; margin: 10px 0;">
        ALBUMS
    </h1>
    <h2 style="text-align: center; font-size: 25px; margin: 10px 0;">
        My favourite albums are mentioned below!
    </h2>
    <ul>
        <li tabindex="0">The King of Limbs</li>
        <li tabindex="0">The Velvet Underground</li>
        <li tabindex="0">OKComputer</li>
    </ul>
    `
    };

    function switchActiveTab(clickedButton, contentKey) {
      document.querySelectorAll(".tabButton").forEach(button => {
        button.classList.remove("activeTab");
      });
      clickedButton.classList.add("activeTab");

      contentArea.innerHTML = contentData[contentKey];

      contentArea.classList.remove("contentSwap");
      void contentArea.offsetWidth;
      contentArea.classList.add("contentSwap");
    }

    if (btnArtists) {
      btnArtists.addEventListener("click", () => switchActiveTab(btnArtists, "artists"));
    }

    if (btnAlbums) {
      btnAlbums.addEventListener("click", () => switchActiveTab(btnAlbums, "albums"));
    }
  }

  initializeMusicTabs();

});
