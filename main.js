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

    var openButton = document.querySelector("#" + element.id + "open");
    if (openButton) {
      openButton.classList.remove("activeMenu");
    }

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

    var openButton = document.querySelector("#" + element.id + "open");
    if (openButton) {
      openButton.classList.add("activeMenu");
    }
  }

  function openAndCloseWindow(window, openButton, closeButton) {

    if (closeButton) {
      closeButton.addEventListener("click", (e) => {
        e.stopPropagation();
        playSelectSFX();
        closewindow(window);
      });
    }

    if (openButton) {
      openButton.addEventListener("mouseenter", playHoverSFX);
      openButton.addEventListener("click", () => {
        playSelectSFX();
        openwindow(window);
      });
    }
  }

  // ====== Sound engine ======
  var hoverSFX = new Audio("audio/hover.mp3");
  var selectSFX = new Audio("audio/select.mp3");

  function playHoverSFX() {
    hoverSFX.currentTime = 0;
    hoverSFX.play().catch(function () { });
  }

  function playSelectSFX() {
    selectSFX.currentTime = 0;
    selectSFX.play().catch(function () { });
  }

  // ====== Apps ======
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
  initializeWindow("media");
  initializeWindow("calendar");

  function initializeTabs(config) {
    var contentArea = document.querySelector(config.contentAreaSelector);
    if (!contentArea) return;

    var tabButtons = {};
    var contentDataMap = config.tabsData;

    Object.keys(contentDataMap).forEach(key => {
      var btn = document.querySelector(config.buttonSelectors[key]);
      if (btn) {
        tabButtons[key] = btn;
        btn.addEventListener("mouseenter", playHoverSFX);
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          playSelectSFX();
          var targetHTML = contentDataMap[key];
          switchActiveTab(btn, targetHTML);
        });
      }
    });

    if (config.defaultTab && tabButtons[config.defaultTab]) {
      tabButtons[config.defaultTab].classList.add("activeTab");
      contentArea.innerHTML = config.tabsData[config.defaultTab];
    }

    function switchActiveTab(clickedButton, htmlContent) {
      Object.values(tabButtons).forEach(button => {
        button.classList.remove("activeTab");
      });
      clickedButton.classList.add("activeTab");
      contentArea.innerHTML = htmlContent;

      contentArea.classList.remove("contentSwap");
      void contentArea.offsetWidth;
      contentArea.classList.add("contentSwap");
    }
  }

  // Initialize media tabs
  initializeTabs({
    contentAreaSelector: "#mediaContent",
    defaultTab: "movies",
    buttonSelectors: {
      movies: "#moviesButton",
      anime: "#animeButton"
    },
    tabsData: {
      anime: `
    <h1 style="text-align: center; font-size: 50px; margin: 10px 0;">
        ANIME
    </h1>
    <h2 style="text-align: center; font-size: 25px; margin: 10px 0;">
        Below are some of my top animes OAT. Hope u get some good recommendations!
    </h2>
    <ul>
        <li tabindex="0">Your Lie in April</li>
        <li tabindex="0">Tokyo Ghoul</li>
        <li tabindex="0">That Time I got Reincarnated as a Slime</li>
    </ul>
    `,
      movies: `
    <h1 style="text-align: center; font-weight: 800; font-size: 50px; margin: 10px 0;">
        MOVIES
    </h1>
    <h2 style="text-align: center; font-size: 25px; margin: 10px 0;">
        Hope u can find something you like here!
    </h2>
    <ul>
        <li tabindex="0">La La Land</li>
        <li tabindex="0">Howl's Moving Castle</li>
        <li tabindex="0">BLAME!</li>
        <li tabindex="0">Weathering with You</li>
        <li tabindex="0">Your Name</li>
        <li tabindex="0">Dead Poet's Society</li>
        <li tabindex="0">500 Days of Summer</li>
    </ul>
    `
    }
  });

  // ====== Music App ======
  var playlist = [
    { title: "Full Moon Full Life", artist: "Azumi Takahashi & Lotus Juice", src: "audio/Music/01 Full Moon Full Life.mp3"},
    { title: "Aria of the Soul", artist: "Haruko Komiya", src: "audio/Music/02 Aria of the Soul.mp3" },
    { title: "This Mysterious Feeling", artist: "Azumi Takahashi", src: "audio/Music/03 This Mysterious Feeling.mp3" },
    { title: "Want To Be Close -Reload-", artist: "Azumi Takahashi", src: "audio/Music/04 Want To Be Close -Reload-.mp3" },
    { title: "Peace -Reload-", artist: "Azumi Takahashi", src: "audio/Music/09 Peace -Reload-.mp3" },
    { title: "When The Moon's Reaching Out Starts -Reload-", artist: "Azumi Takahashi", src: "audio/Music/10 When The Moon’s Reaching Out Stars -Reload-.mp3" },
    { title: "Iwatodai Dorm -Reload-", artist: "Lotus Juice", src: "audio/Music/11 Iwatodai Dorm -Reload-.mp3" },
    { title: "Mass Destruction -Reload-", artist: "Azumi Takahashi & Lotus Juice", src: "audio/Music/14 Mass Destruction -Reload-.mp3" },
    { title: "Color Your Night", artist: "Azumi Takahashi & Lotus Juice", src: "audio/Music/16 Color Your Night.mp3" },
    { title: "Deep Breath Deep Breath -Reload-", artist: "Lotus Juice", src: "audio/Music/17 Deep Breath Deep Breath -Reload-.mp3" },
    { title: "Paulownia Mall -Reload-", artist: "Azumi Takahashi", src: "audio/Music/19 Paulownia Mall -Reload-.mp3" },
    { title: "The Meaning of Armbands", artist: "Lotus Juice", src: "audio/Music/20 The Meaning of Armbands.mp3" },
    { title: "It's Going Down Now", artist: "Azumi Takahashi & Lotus Juice", src: "audio/Music/30 It’s Going Down Now.mp3" },
  ]

  var currentSongIndex = 0;
  var bgAudio = new Audio();

  var playPauseButton = document.querySelector("#playPauseButton");
  var prevButton = document.querySelector("#prevTrackButton");
  var nextButton = document.querySelector("#nextTrackButton");
  var titleElement = document.querySelector("#nowPlayingTitle");
  var artistElement = document.querySelector("#nowPlayingArtist");
  var progressBar = document.querySelector("#songProgressBar");
  var trackListContainer = document.querySelector("#trackListContainer");

  function renderTrackList() {
    if (!trackListContainer) return;
    trackListContainer.innerHTML = "";
    playlist.forEach(function (track, idx) {
      var li = document.createElement("li");
      li.textContent = track.title + " - " + track.artist;
      li.tabIndex = 0;
      if (idx === currentSongIndex) li.classList.add("activeTrack");

      li.addEventListener("mouseenter", playHoverSFX);
      li.addEventListener("click", function () {
        playSelectSFX();
        loadTrack(idx);
        bgAudio.play();
        playPauseButton.textContent = "PAUSE";
      });
      trackListContainer.appendChild(li);
    });
  }

  function loadTrack(index) {
    currentSongIndex = index;
    bgAudio.src = playlist[index].src;
    titleElement.textContent = playlist[index].title;
    artistElement.textContent = playlist[index].artist;
    bgMusic.pause();
    renderTrackList();
  }

  function togglePlay() {
    if (!bgAudio.src) loadTrack(0);
    if (bgAudio.paused) {
      bgMusic.pause();
      bgAudio.play();
      playPauseButton.textContent = "PAUSE";
    } else {
      bgAudio.pause();
      bgMusic.play();
      playPauseButton.textContent = "PLAY";
    }
  }

  if (playPauseButton) {
    playPauseButton.addEventListener("click", togglePlay);
    nextButton.addEventListener("click", function() {
      loadTrack((currentSongIndex + 1) % playlist.length);
      bgAudio.play();
      playPauseButton.textContent = "PAUSE";
    });
    prevButton.addEventListener("click", function() {
      loadTrack((currentSongIndex - 1 + playlist.length) % playlist.length);
      bgAudio.play();
      playPauseButton.textContent = "PAUSE";
    });

    bgAudio.addEventListener("timeupdate", function () {
      if (bgAudio.duration) {
        var pct = (bgAudio.currentTime / bgAudio.duration) * 100;
        progressBar.style.width = pct + "%";
      }
    });

    renderTrackList();
  }

  // ====== BG Music ======
  var bgMusic = new Audio("audio/Music/01 Full Moon Full Life.mp3");
  bgMusic.loop = true;
  bgMusic.volume = 0.7;

  function startBGM() {
    bgMusic.play().catch(function () { });
    document.removeEventListener("click", startBGM);
    document.removeEventListener("keydown", startBGM);
  }

  document.addEventListener("click", startBGM);
  document.addEventListener("keydown", startBGM);



  // ====== Splash Screen ======
  var splash = document.querySelector("#splashScreen");

  function dismissSplash() {
    if (!splash || splash.classList.contains("splashFadeOut")) return;

    splash.classList.add("splashFadeOut");
    setTimeout(function () {
      if (splash.parentNode) {
        splash.parentNode.removeChild(splash);
      }
    }, 600);

    document.removeEventListener("keydown", dismissSplash);
    document.removeEventListener("click", dismissSplash);
  }

  if (splash) {
    document.addEventListener("keydown", dismissSplash);
    document.addEventListener("click", dismissSplash);
  }

  // ====== Calendar Tracker ======
  var defaultTasks = [
    "Study in the Library",
    "Work part-time",
    "Explore the City"
  ]

  var savedTasks = localStorage.getItem("personaOS_tasks");
  var tasks = savedTasks ? JSON.parse(savedTasks) : defaultTasks;

  var taskListContainer = document.querySelector("#taskListContainer");
  var taskInput = document.querySelector("#taskInput");
  var addTaskButton = document.querySelector("#addTaskButton");

  function saveTasksToStorage() {
    localStorage.setItem("personaOS_tasks", JSON.stringify(tasks));
  }

  function updateCalendarDisplay() {
    var dateEl = document.querySelector("#calendarDateStr");
    var dayEl = document.querySelector("#calendarDayStr");
    if (!dateEl || !dayEl) return;

    var now = new Date();
    var month = String(now.getMonth() + 1).padStart(2, '0');
    var date = String(now.getDate()).padStart(2, '0');
    var days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

    dateEl.textContent = month + "/" + date;
    dayEl.textContent = days[now.getDay()];
  }

  function renderTasks() {
    if(!taskListContainer) return;
    taskListContainer.innerHTML = "";

    tasks.forEach(function (taskText, index) {
      var li = document.createElement("li");
      li.tabIndex = 0;

      var textSpan = document.createElement("span");
      textSpan.textContent = taskText;

      var deleteButton = document.createElement("button");
      deleteButton.className = "deleteTaskButton";
      deleteButton.textContent = "x";
      deleteButton.title = "Delete task";

      deleteButton.addEventListener("click", function(e) {
        e.stopPropagation();
        playSelectSFX();
        tasks.splice(index, 1);
        saveTasksToStorage();
        renderTasks();
      });

      li.appendChild(textSpan);
      li.appendChild(deleteButton);

      li.addEventListener("mouseenter", playHoverSFX);
      li.addEventListener("click", playSelectSFX);

      taskListContainer.appendChild(li);
    })
  }

  function addNewTask() {
    if (!taskInput) return;
    var value = taskInput.value.trim();
    if (value !== "") {
      playSelectSFX();
      tasks.push(value);
      saveTasksToStorage();
      taskInput.value = "";
      renderTasks();
    }
  }

  if (addTaskButton && taskInput) {
    addTaskButton.addEventListener("mouseenter", playHoverSFX);
    addTaskButton.addEventListener("click", addNewTask);

    taskInput.addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        addNewTask();
      }
    });
  }

  updateCalendarDisplay();
  renderTasks();
});
