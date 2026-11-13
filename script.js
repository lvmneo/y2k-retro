
/* ==========================================
   MY PIXEL WORLD
   ========================================== */

/* ЧАСЫ */

const clock = document.getElementById("clock");

function updateClock() {
  if (!clock) return;

  clock.textContent = new Date().toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

updateClock();
setInterval(updateClock, 30000);


/* ==========================================
   ПЛАНЕТА
   ========================================== */

const planet = document.getElementById("planet");

if (planet) {
  let planetDrag = null;

  planet.style.touchAction = "none";

  // Восстановление позиции
  try {
    const saved = JSON.parse(
      localStorage.getItem("pixelPlanetPosition")
    );

    if (
      saved &&
      Number.isFinite(saved.x) &&
      Number.isFinite(saved.y)
    ) {
      planet.style.left = saved.x + "px";
      planet.style.top = saved.y + "px";
      planet.style.right = "auto";
    }
  } catch (error) {
    console.warn("Ошибка загрузки позиции планеты", error);
  }

  planet.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });

  planet.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;

    event.preventDefault();

    const rect = planet.getBoundingClientRect();

    planet.style.animation = "none";
    planet.style.left = rect.left + "px";
    planet.style.top = rect.top + "px";
    planet.style.right = "auto";

    planetDrag = {
      id: event.pointerId,
      dx: event.clientX - rect.left,
      dy: event.clientY - rect.top
    };

    planet.setPointerCapture(event.pointerId);
  });

  planet.addEventListener("pointermove", (event) => {
    if (!planetDrag || planetDrag.id !== event.pointerId) return;

    const x = Math.max(
      0,
      Math.min(
        window.innerWidth - planet.offsetWidth,
        event.clientX - planetDrag.dx
      )
    );

    const y = Math.max(
      0,
      Math.min(
        window.innerHeight - planet.offsetHeight,
        event.clientY - planetDrag.dy
      )
    );

    planet.style.left = x + "px";
    planet.style.top = y + "px";
  });

  function stopPlanet(event) {
    if (!planetDrag || planetDrag.id !== event.pointerId) return;

    planetDrag = null;

    try {
      localStorage.setItem(
        "pixelPlanetPosition",
        JSON.stringify({
          x: parseFloat(planet.style.left),
          y: parseFloat(planet.style.top)
        })
      );
    } catch (error) {
      console.warn("Не удалось сохранить позицию планеты", error);
    }

    planet.style.animation = "float 4s ease-in-out infinite";

    if (planet.hasPointerCapture(event.pointerId)) {
      planet.releasePointerCapture(event.pointerId);
    }
  }

  planet.addEventListener("pointerup", stopPlanet);
  planet.addEventListener("pointercancel", stopPlanet);
}



/* ==========================================
   MY BUTTONS.EXE — ПЕРЕТАСКИВАНИЕ
   ========================================== */

const buttons = document.getElementById("buttons-window");
const handle = document.getElementById("buttons-handle");

if (buttons && handle) {
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  handle.style.cursor = "grab";
  handle.style.touchAction = "none";

  handle.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    if (event.target.closest("button")) return;

    const rect = buttons.getBoundingClientRect();

    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;

    if (buttons.parentElement !== document.body) {
      document.body.appendChild(buttons);
    }

    buttons.classList.add("is-floating");

    buttons.style.position = "absolute";
buttons.style.left = (rect.left + window.scrollX) + "px";
buttons.style.top = (rect.top + window.scrollY) + "px";
    buttons.style.right = "auto";
    buttons.style.bottom = "auto";
    buttons.style.margin = "0";
    buttons.style.transform = "none";
    buttons.style.zIndex = "2000";

    dragging = true;
    handle.style.cursor = "grabbing";

    handle.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  handle.addEventListener("pointermove", (event) => {
    if (!dragging) return;

    // Двигаем только при зажатой левой кнопке
    if (!(event.buttons & 1)) {
      stopDragging();
      return;
    }

    buttons.style.left = (event.clientX - offsetX) + "px";
    buttons.style.top = (event.clientY - offsetY) + "px";
  });

  function stopDragging() {
    dragging = false;
    handle.style.cursor = "grab";
  }

  handle.addEventListener("pointerup", stopDragging);
  handle.addEventListener("pointercancel", stopDragging);
  handle.addEventListener("lostpointercapture", stopDragging);
  window.addEventListener("blur", stopDragging);
}



/* ==========================================
   ЗАКРЫТИЕ И ОТКРЫТИЕ MY BUTTONS
   ========================================== */

const hideButtons = document.getElementById("buttons-hide");
const showButtons = document.getElementById("show-buttons");
const startButton = document.getElementById("start");

function openButtonsWindow() {
  if (!buttons) return;

  buttons.hidden = false;
  buttons.style.display = "";
  buttons.style.zIndex = "2000";
}

if (hideButtons) {
  hideButtons.addEventListener("click", () => {
    if (!buttons) return;

    buttons.hidden = true;
    buttons.style.display = "none";
  });
}

if (showButtons) {
  showButtons.addEventListener("click", openButtonsWindow);
}

if (startButton) {
  startButton.addEventListener("click", () => {
    openButtonsWindow();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}


/* ==========================================
   ПЕРЕТАСКИВАНИЕ GIF-ДЕКОРАЦИЙ
   ========================================== */

document.querySelectorAll(
  ".welcome-decorations img"
).forEach((gif, index) => {

  const storageKey = "decoration-position-" + index;

  let dragging = null;

  gif.style.touchAction = "none";
  gif.style.cursor = "grab";
  gif.style.pointerEvents = "auto";

  // Восстановление сохранённого положения
  try {
    const saved = JSON.parse(
      localStorage.getItem(storageKey)
    );

    if (
      saved &&
      Number.isFinite(saved.x) &&
      Number.isFinite(saved.y)
    ) {
      gif.style.left = saved.x + "px";
      gif.style.top = saved.y + "px";
      gif.style.right = "auto";
    }
  } catch (error) {
    console.warn("Ошибка загрузки позиции GIF", error);
  }

  gif.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });

  gif.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;

    event.preventDefault();

    const parent = gif.offsetParent;
    const parentRect = parent.getBoundingClientRect();
    const rect = gif.getBoundingClientRect();

    const left = rect.left - parentRect.left;
    const top = rect.top - parentRect.top;

    gif.style.left = left + "px";
    gif.style.top = top + "px";
    gif.style.right = "auto";
    gif.style.cursor = "grabbing";

    dragging = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      left,
      top
    };

    gif.setPointerCapture(event.pointerId);
  });

  gif.addEventListener("pointermove", (event) => {
    if (!dragging || dragging.id !== event.pointerId) return;

    const dx = event.clientX - dragging.startX;
    const dy = event.clientY - dragging.startY;

    gif.style.left = dragging.left + dx + "px";
    gif.style.top = dragging.top + dy + "px";
  });

  function stopDragging(event) {
    if (!dragging || dragging.id !== event.pointerId) return;

    dragging = null;
    gif.style.cursor = "grab";

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          x: parseFloat(gif.style.left),
          y: parseFloat(gif.style.top)
        })
      );
    } catch (error) {
      console.warn("Ошибка сохранения позиции GIF", error);
    }

    if (gif.hasPointerCapture(event.pointerId)) {
      gif.releasePointerCapture(event.pointerId);
    }
  }

  gif.addEventListener("pointerup", stopDragging);
  gif.addEventListener("pointercancel", stopDragging);
});

/* ==========================================
   MY RETRO 3D MUSEUM
   ========================================== */

const museumItems = [
  {
    name: "Tamagotchi Bug",
    id: "bc37963c11ec4233b442bcb833dbe6fe"
  },
  {
    name: "Takogotchi",
    id: "b8872aade4854834a1240ff1ef2f63b1"
  },
  {
    name: "Pink Tamagotchi",
    id: "a48cf9b6240348eeae6f93e4b4c8225f"
  },
  {
    name: "Purple MiniDisc",
    gif: "https://crystalsweb.neocities.org/gifshop/MD-PURPLE.GIF"
  },
  {
    name: "Dreamcast Controller",
    id: "3ad1b77db4de473b81a84008a13f39d4"
  },
  {
    name: "PlayStation One",
    id: "4afd87cc153346f8a8400a1e8517a6c9"
  },
  {
    name: "iMac G3",
    id: "6b5974d30eb640d294f86c9ad43443e4"
  },
  {
    name: "iMac 98",
    id: "6f62e2160b5041ecb9ec69e5b37af6d7"
  },
  {
    name: "iMac Fish Tank",
    id: "4181261e2eed4eb69317d79c35fd9c56"
  },
  {
    name: "Sony Ericsson W800",
    id: "8912585bc571425db5017185a65e3a7b"
  }
];

const museumGrid = document.getElementById("museum-grid");

if (museumGrid) {
  museumItems.forEach((item) => {

    const card = document.createElement("article");
    card.className = "museum-card";

    const viewer = document.createElement("div");
    viewer.className = "museum-viewer";

    if (item.gif) {
      const img = document.createElement("img");
      img.src = item.gif;
      img.alt = item.name;
      img.loading = "lazy";
      viewer.appendChild(img);

    } else {
      const iframe = document.createElement("iframe");

      iframe.title = item.name;
      iframe.loading = "lazy";

     iframe.src =
    `https://sketchfab.com/models/${item.id}/embed` +
  "?autostart=1" +
  "&autospin=0.5" +
  "&scrollwheel=0" +
  "&ui_controls=0" +
  "&ui_hint=0" +
  "&transparent=1";

      iframe.allow = "autoplay; fullscreen";
      iframe.setAttribute("allowfullscreen", "");

      viewer.appendChild(iframe);
    }

    const label = document.createElement("div");
    label.className = "museum-label";
    label.textContent = item.name;

    card.appendChild(viewer);
    card.appendChild(label);
    museumGrid.appendChild(card);
  });
}

/* =====================================
   RETRO MUSEUM — WINDOW CONTROLS
   ===================================== */

const museumWindow = document.getElementById("retro-museum");

const museumMinimize = document.getElementById("museum-minimize");

const museumClose = document.getElementById("museum-close");

// Свернуть / развернуть

museumMinimize?.addEventListener("click", () => {
  museumWindow.classList.toggle("collapsed");
});

// Закрыть

museumClose?.addEventListener("click", () => {
  museumWindow.hidden = true;
});

/* Бесконечная GIF-лента */

const tickerTrack = document.getElementById("ticker-track");

if (tickerTrack) {
  const tickerGroup = tickerTrack.querySelector(".ticker-group");

  if (tickerGroup) {
    const originalHTML = tickerGroup.innerHTML;

    function updateTicker() {
      tickerTrack.style.animation = "none";

      tickerGroup.innerHTML = originalHTML;

      // Первая группа должна быть шире видимой области
      const containerWidth =
        tickerTrack.parentElement.clientWidth;

      let repetitions = 0;

      while (
        tickerGroup.scrollWidth < containerWidth &&
        repetitions < 50
      ) {
        tickerGroup.insertAdjacentHTML(
          "beforeend",
          originalHTML
        );
        repetitions++;
      }

      // Создаём точную копию для плавного повторения
      tickerTrack
        .querySelectorAll(".ticker-group")
        .forEach((group) => {
          if (group !== tickerGroup) group.remove();
        });

      const clone = tickerGroup.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      tickerTrack.appendChild(clone);

      // Запускаем анимацию заново
      void tickerTrack.offsetWidth;
      tickerTrack.style.animation = "";
    }

    window.addEventListener("load", updateTicker);
    window.addEventListener("resize", updateTicker);
  }
}
