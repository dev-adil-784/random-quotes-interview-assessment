let intervalId;

const startGradientFadeInInterval = () => {
  intervalId = setInterval(gradientFadeIn, 6 * 1000);
};

const stopGradientFadeInInterval = () => {
  clearInterval(intervalId);
};

const randomBackgroundColor = () => {
  const x = Math.floor(Math.random() * 256);
  const y = Math.floor(Math.random() * 256);
  const z = Math.floor(Math.random() * 256);
  const bgColor = `rgb(${x},${y},${z})`;
  return bgColor;
};

const gradientFadeIn = () => {
  const bodyElement = document.getElementById("quote-container");
  const initialColor =
    bodyElement.style.backgroundColor ||
    getComputedStyle(bodyElement).backgroundColor;
  const newColor = randomBackgroundColor();

  bodyElement.style.transition = "";

  // amount of keyframes to be used in animation
  const gradientSteps = 60;
  // duration of the animation itself
  const duration = 3;

  const keyframes = [];

  for (let i = 0; i <= gradientSteps; i++) {
    const percent = Math.floor((i / gradientSteps) * 100);
    const colorStop = `${percent}%`;

    keyframes.push(
      `${colorStop} { background: linear-gradient(45deg, ${newColor} ${percent}%, ${initialColor} 0%); } `
    );
  }

  const animationName = `gradientFadeAnimation${Date.now()}`;
  const animationCSS = `@keyframes ${animationName} {
        ${keyframes.join("\n")}
    }`;

  const styleTag = document.createElement("style");
  styleTag.textContent = animationCSS;
  document.head.appendChild(styleTag);

  bodyElement.style.animation = `${animationName} ${duration}s ease-in-out forwards`;

  setTimeout(() => {
    bodyElement.style.animation = "";
    styleTag.remove();
    bodyElement.style.backgroundColor = newColor;
  }, duration * 1000);
};

const getQuote = async () => {
  try {
    const response = await fetch(
      "http://safetybelt.pythonanywhere.com/quotes/random"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    alert("Something went wrong" + error.message);
  }
};

function generate() {
  (async () => {
    try {
      const data = await getQuote();
      if (data.error) {
        const elem = document.getElementById("quote-alert");
        elem.innerHTML = data.error;
        elem.classList.remove("quote-alert-hidden");
        setTimeout(() => {
          elem.classList.add("quote-alert-hidden");
        }, 2000);
      } else {
        const quoteElement = document.getElementById("quote-text");
        const authorElement = document.getElementById("quote-author");

        quoteElement.innerHTML = data.quote;
        authorElement.innerHTML = data.author;
        gradientFadeIn();
      }
    } catch (error) {
      alert("Something went wrong" + error.message);
    }
  })();
}

(function () {
  const button = document.getElementById("generate");
  if (button) {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      stopGradientFadeInInterval();
      generate();
    });
  }
})();

startGradientFadeInInterval();
