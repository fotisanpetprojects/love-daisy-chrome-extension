(() => {
  if (window.__loveDaisyPetalGame) return;

  const ROOT_ID = "love-daisy-extension-root";
  const MIN_PETALS = 15;
  const MAX_PETALS = 35;
  const FIBONACCI_DAISY_COUNTS = [21, 21, 22, 23, 24, 25, 34];

  const phrases = ["Loves me", "Loves me not"];
  const finalPhrases = ["loves you!!!", "loves you not :("];

  let root = null;
  let state = null;

  const randomBetween = (min, max) => min + Math.random() * (max - min);

  function randomPetalCount() {
    if (Math.random() < 0.22) {
      return FIBONACCI_DAISY_COUNTS[
        Math.floor(Math.random() * FIBONACCI_DAISY_COUNTS.length)
      ];
    }

    const weighted = (Math.random() + Math.random()) / 2;
    return Math.round(MIN_PETALS + weighted * (MAX_PETALS - MIN_PETALS));
  }

  function makePetals(count) {
    const angleOffset = randomBetween(-5, 5);
    const baseWidth = randomBetween(50, 56);
    const baseHeight = randomBetween(162, 178);
    const baseOverlap = randomBetween(31, 36);

    return Array.from({ length: count }, (_, index) => {
      const angle = (360 / count) * index + angleOffset + randomBetween(-1.2, 1.2);

      return {
        id: `petal-${Date.now()}-${index}`,
        angle,
        width: baseWidth + randomBetween(-2.5, 2.5),
        height: baseHeight + randomBetween(-6, 6),
        overlap: baseOverlap + randomBetween(-2, 2),
        twist: randomBetween(-4, 4),
        scale: randomBetween(0.98, 1.02),
        plucked: false
      };
    });
  }

  function newGame() {
    const petalCount = randomPetalCount();

    state = {
      petalCount,
      petals: makePetals(petalCount),
      pluckedCount: 0,
      lastPhrase: "LOVE?",
      isComplete: false
    };
  }

  function ensureRoot() {
    root = document.getElementById(ROOT_ID);

    if (!root) {
      root = document.createElement("div");
      root.id = ROOT_ID;
      root.setAttribute("aria-live", "polite");
      document.documentElement.appendChild(root);
    }
  }

  function removeRoot() {
    root?.remove();
    root = null;
  }

  function burst(kind) {
    if (!root) return;

    const symbols = kind === "love"
      ? ["❤️", "💖", "💘", "💕"]
      : ["💔", "💔", "🖤", "💧"];
    const waves = 8;
    const particlesPerWave = 5;

    for (let wave = 0; wave < waves; wave += 1) {
      window.setTimeout(() => {
        if (!root) return;

        for (let index = 0; index < particlesPerWave; index += 1) {
          const particle = document.createElement("span");
          const symbolIndex = (wave * particlesPerWave + index) % symbols.length;
          particle.className = "love-daisy-particle";
          particle.textContent = symbols[symbolIndex];
          particle.style.setProperty("--x", `${randomBetween(-230, 230)}px`);
          particle.style.setProperty("--y", `${randomBetween(-260, 80)}px`);
          particle.style.setProperty("--rot", `${randomBetween(-70, 70)}deg`);
          root.appendChild(particle);

          window.setTimeout(() => particle.remove(), 980);
        }
      }, wave * 250);
    }
  }

  function pluckPetal(petalId) {
    if (!state || state.isComplete) return;

    const petal = state.petals.find((item) => item.id === petalId);
    if (!petal || petal.plucked) return;

    const phraseIndex = state.pluckedCount % 2;
    petal.plucked = true;
    state.pluckedCount += 1;
    state.lastPhrase = phrases[phraseIndex];

    const button = root?.querySelector(`[data-petal-id="${petalId}"]`);
    if (button) {
      button.classList.add("is-plucked");
      button.style.setProperty("--fall-x", `${randomBetween(-160, 160)}px`);
      button.style.setProperty("--fall-rot", `${randomBetween(-170, 170)}deg`);
    }

    const remaining = state.petalCount - state.pluckedCount;
    const status = root?.querySelector(".love-daisy-status");

    if (status) status.textContent = state.lastPhrase;

    if (remaining === 0) {
      state.isComplete = true;
      const finalKind = phraseIndex === 0 ? "love" : "not-love";
      window.setTimeout(() => {
        root?.classList.add(finalKind === "love" ? "has-love" : "has-heartbreak");
        if (status) {
          status.classList.add("is-final");
          status.textContent = finalPhrases[phraseIndex];
        }
        burst(finalKind === "love" ? "love" : "heartbreak");
      }, 260);
    }
  }

  function renderGame() {
    ensureRoot();
    root.className = "";

    root.innerHTML = `
      <div class="love-daisy-backdrop" role="dialog" aria-label="Love Daisy">
        <div class="love-daisy-toolbar">
          <button class="love-daisy-icon-button" type="button" data-action="restart" title="New daisy" aria-label="New daisy">↻</button>
          <button class="love-daisy-icon-button" type="button" data-action="close" title="Close" aria-label="Close">×</button>
        </div>

        <div class="love-daisy-stage">
          <div class="love-daisy-status">${state.lastPhrase}</div>
          <div class="love-daisy-flower" aria-label="${state.petalCount} petal daisy">
            ${state.petals.map((petal, index) => `
              <span
                class="love-daisy-petal-arm"
                style="
                  --angle: ${petal.angle}deg;
                  --petal-z: ${index};
                "
              >
                <button
                  class="love-daisy-petal"
                  type="button"
                  data-petal-id="${petal.id}"
                  aria-label="Petal ${index + 1}"
                  style="
                  --petal-width: ${petal.width}px;
                  --petal-height: ${petal.height}px;
                  --petal-overlap: ${petal.overlap}px;
                  --petal-twist: ${petal.twist}deg;
                  --petal-scale: ${petal.scale};
                  "
                ></button>
              </span>
            `).join("")}
            <button class="love-daisy-center" type="button" aria-label="Restart finished daisy"></button>
          </div>
        </div>
      </div>
    `;

    root.querySelector('[data-action="close"]')?.addEventListener("click", removeRoot);
    root.querySelector('[data-action="restart"]')?.addEventListener("click", () => {
      newGame();
      renderGame();
    });
    root.querySelector(".love-daisy-center")?.addEventListener("click", (event) => {
      event.preventDefault();
      if (!state?.isComplete) return;
      newGame();
      renderGame();
    });

    root.querySelectorAll(".love-daisy-petal").forEach((button) => {
      button.addEventListener("click", () => pluckPetal(button.dataset.petalId));
    });
  }

  function open() {
    newGame();
    renderGame();
  }

  function toggle() {
    if (document.getElementById(ROOT_ID)) {
      removeRoot();
      return;
    }

    open();
  }

  window.__loveDaisyPetalGame = { open, toggle };
})();
