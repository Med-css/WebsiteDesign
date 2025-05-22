if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

const section1 = document.querySelector('.section1');
const smoothScrollContainer = document.getElementById("smooth-scroll-container");
const sections = Array.from(document.querySelectorAll("section, header"));
const totalSections = sections.length;
const container2 = document.querySelector('.container2');
const container3 = document.querySelector('.container3');
const sodamark2 = container2.querySelector('.soda');
const sodamark3 = container3.querySelector('.soda');
const herotext = document.querySelector('.hero-text');
const tropicalchoose = document.querySelector('.tropicalchoose');
const raisinchoose = document.querySelector('.raisinchoose');
const fraisechoose = document.querySelector('.fraisechoose');
const bgoverlay = document.getElementById('bgoverlay');
let home2firstindicator = false;

let currentSection = 0;
let targetY = 0;
let currentY = 0;
let isAnimating = false;
const speed = 0.04;

function lerp(a, b, t) {
    return a * (1 - t) + b * t;
}

function animateScroll() {
    if (!isAnimating) return;

    currentY = lerp(currentY, targetY, speed);
    smoothScrollContainer.style.transform = `translateY(-${currentY}px)`;

    if (Math.abs(currentY - targetY) < 1) {
        currentY = targetY;
        smoothScrollContainer.style.transform = `translateY(-${currentY}px)`;
        isAnimating = false;
    } else {
        requestAnimationFrame(animateScroll);
    }
}

function goToSection(index) {
    if (index < 0 || index >= totalSections || isAnimating) return;

    isAnimating = true;
    currentSection = index;

    sessionStorage.setItem('currentSectionId', sections[index].id);

    if (sections[index].id === "home3") {
        const additionalScroll = window.innerHeight * 0.80;
        targetY = sections[index].offsetTop + additionalScroll;
    } else {
        targetY = sections[index].offsetTop;
    }

    animateScroll();
}

let scrollLocked = false;

function handleScroll(e) {
    if (scrollLocked || isAnimating) return;

    scrollLocked = true;
    const direction = e.deltaY > 0 ? 1 : -1;
    goToSection(currentSection + direction);

    setTimeout(() => {
        scrollLocked = false;
    }, 700);
}

window.addEventListener("wheel", handleScroll, { passive: false });

let touchStartY = 0;
const touchThreshold = 25;

window.addEventListener("touchstart", (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: false });

window.addEventListener("touchmove", (e) => {
    if (scrollLocked || isAnimating) {
        e.preventDefault();
        return;
    }

    const touchY = e.touches[0].clientY;
    const diff = touchStartY - touchY;

    if (diff > touchThreshold) {
        // Balayage vers le haut avec un seuil plus grand
        goToSection(currentSection + 1);
    } else if (diff < -touchThreshold) {
        // Balayage vers le bas avec un seuil plus grand
        goToSection(currentSection - 1);
    }

    scrollLocked = true;
    setTimeout(() => {
        scrollLocked = false;
    }, 700);

    e.preventDefault();
}, { passive: false });

window.addEventListener("keydown", (e) => {
    if (scrollLocked || isAnimating) return;
    if (e.key === "ArrowDown") {
        goToSection(currentSection + 1);
        scrollLocked = true;
        setTimeout(() => scrollLocked = false, 700);
    }
    if (e.key === "ArrowUp") {
        goToSection(currentSection - 1);
        scrollLocked = true;
        setTimeout(() => scrollLocked = false, 700);
    }
});

window.addEventListener("resize", () => {
    window.location.reload();
});

window.addEventListener("load", () => {
    const currentSectionId = sessionStorage.getItem('currentSectionId');

    if (currentSectionId) {
        const sectionIndex = sections.findIndex(section => section.id === currentSectionId);
        if (sectionIndex !== -1) {
            goToSection(sectionIndex);
        }
        sessionStorage.removeItem('currentSectionId');
    }
});

const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5
};

const element = document.querySelector('.soda2');
let start = -100;
const increment = -673;
const duration = 10000;
let ishome2 = false;
let indicator = 0;

function animate() {
    let startTime = null;
    let currentStart = start;

    function step(timestamp) {
        if (ishome2) {
            element.style.backgroundPosition = `-150px 0, 0 0`;
        } else {
            if (!startTime) startTime = timestamp;
            const elapsedTime = timestamp - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const currentPosition = currentStart + (currentStart + increment - currentStart) * progress;
            element.style.backgroundPosition = `${currentPosition}px 0, 0 0`;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                currentStart += increment;
                startTime = null;
                requestAnimationFrame(step);
                indicator = indicator + 1;
            }
        }
    }

    requestAnimationFrame(step);
}

const backgroundtropical = document.querySelector('.backgroundtropical');
const backgroundviolet = document.querySelector('.backgroundviolet');
const backgroundred = document.querySelector('.backgroundred');

const container1 = document.querySelector('.container1');
const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.id === "home1") {
                ishome2 = false;
                container1.style.left = '50%';
                animate();
                toggleDisplay(container2, 'flex');
                toggleDisplay(container3, 'flex');
                if (window.innerWidth < 501) {
                    container1.style.top = '50%';
                }

                container1.style.transform = 'translate(-50%, -50%)';
            } else if (entry.target.id === "home2") {
                container1.style.opacity = '1';
                container1.style.pointerEvents = 'all';
                container2.classList.add('home2');
                container3.classList.add('home2');
                herotext.classList.add('active');
                container1.style.left = '80%';
                if (window.innerWidth < 501) {
                container1.style.top = '70%';
                }


                ishome2 = true;
                container1.style.transform = 'translate(-80%, -50%) scale(0.9) rotate(20deg)';
                setTimeout(() => backgroundtropical.style.opacity = '1', 1500);
                setTimeout(() => {
                    toggleDisplay(container2, 'none');
                    toggleDisplay(container3, 'none');
                    container2.classList.remove('home2');
                    container3.classList.remove('home2');
                    setTimeout(activateCards, 500);
                }, 1800);
            }
            else if (entry.target.id === "home3") {
                container1.style.opacity = '0';
                container1.style.pointerEvents = 'none';
            }
        }
    });
};

function toggleDisplay(element, displayValue) {
    if (element) {
        element.style.display = displayValue;
    }
}

function activateCards() {
    const cardchoose = document.querySelectorAll('.cardchoose');
    cardchoose.forEach((element, index) => {
        element.classList.add('home2');
        element.style.animationDelay = `${0.2 * index}s`;
    });

    const totalDelay = 200 * (cardchoose.length - 1);
    const animationDuration = 600;
    const finalTimeout = totalDelay + animationDuration;

    setTimeout(() => {
        if(!home2firstindicator){
            tropicalchoose.classList.add('active', 'disabled');
            home2firstindicator = true;
        }
        else{
            tropicalchoose.classList.add('disabled');
        }
        raisinchoose.classList.add('disabled');
        fraisechoose.classList.add('disabled');
        herotext.style.pointerEvents = 'all';
    }, finalTimeout);
}

const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach(section => observer.observe(section));

const cardchooseElements = document.querySelectorAll('.cardchoose');
const soda2 = document.querySelector('.soda2');

function animateLetters(wordElement) {
    const letters = wordElement.textContent.split('');
    wordElement.textContent = '';

    letters.forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.classList.add('letter');
        span.style.animationDelay = `${i * 0.1}s`;
        wordElement.appendChild(span);
    });
}

function handleCardHover(element, background, markClass, word1, word2) {
    backgroundtropical.style.opacity = background === 'tropical' ? '1' : '0';
    backgroundviolet.style.opacity = background === 'violet' ? '1' : '0';
    backgroundred.style.opacity = background === 'red' ? '1' : '0';

    container1.style.left = '200%';
    herotext.style.pointerEvents = 'none';
    herotext.style.left = '-200%';

    setTimeout(() => {
        words[0].textContent = word1;
        words[1].textContent = word2;

        words.forEach((word, wordIndex) => {
            animateLetters(word);
        });

        soda2.className = 'soda2';
        soda2.classList.add(markClass);
        setTimeout(() => {
            container1.style.left = '80%';
            herotext.style.left = '0%';
            setTimeout(() => herotext.style.pointerEvents = 'all', 1000);
        }, 300);
    }, 500);
}

cardchooseElements.forEach((element) => {
    element.addEventListener('mouseenter', () => {
        if (element.classList.contains('active')) return;

        cardchooseElements.forEach(el => el.classList.remove('active'));
        element.classList.add('active');

        if (element.classList.contains('tropicalchoose')) {
            handleCardHover(element, 'tropical', 'mark1', 'TROPICAL', 'FIZZ');
            sodamark2.className = '';
            sodamark3.className = '';
            bgoverlay.className = '';

            sodamark2.classList.add('soda', 'mark2')
            sodamark3.classList.add('soda', 'mark3')
            bgoverlay.classList.add('bg-overlay', 'mark1')

        } else if (element.classList.contains('raisinchoose')) {
            handleCardHover(element, 'violet', 'mark3', 'GRAPE', 'FIZZ');
            sodamark2.className = '';
            sodamark3.className = '';
            bgoverlay.className = '';

            sodamark2.classList.add('soda', 'mark2')
            sodamark3.classList.add('soda', 'mark1')
            bgoverlay.classList.add('bg-overlay', 'mark3')

        } else if (element.classList.contains('fraisechoose')) {
            handleCardHover(element, 'red', 'mark2', 'BERRY', 'FIZZ');
            sodamark2.className = '';
            sodamark3.className = '';
            bgoverlay.className = '';

            sodamark2.classList.add('soda', 'mark1')
            sodamark3.classList.add('soda', 'mark3')
            bgoverlay.classList.add('bg-overlay', 'mark2')
        }
    });
});

const bg = document.querySelector('.fruits-bg');
let positionY = 0;

function animateBackground() {
    positionY += 0.5;
    bg.style.backgroundPosition = `0px ${positionY}px`;
    requestAnimationFrame(animateBackground);
}

animateBackground();

const words = document.querySelectorAll('#letteranimation .word');

words.forEach((word, wordIndex) => {
    const letters = word.textContent.split('');
    word.textContent = '';

    letters.forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.classList.add('letter');
        const globalDelay = wordIndex === 1 ? 0.5 : 0;
        span.style.animationDelay = `${globalDelay + i * 0.1}s`;
        word.appendChild(span);
    });
});


  function enableDragOnListcan() {
    const listcan = document.querySelector('.listcan');
    let isDragging = false;
    let startX = 0;
    let currentLeft = 0;

    // Vérifie si on est en dessous de 800px
    if (window.innerWidth >= 800) return;

    // Initialise le style left si ce n'est pas fait
    listcan.style.left = listcan.style.left || "0px";

    // Fonctions utilitaires
    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    // Souris
    listcan.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      currentLeft = parseInt(listcan.style.left) || 0;
      listcan.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      let newLeft = clamp(currentLeft + deltaX, -635, 0);
      listcan.style.left = `${newLeft}px`;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      listcan.style.transition = 'left 0.3s ease';
    });

    // Tactile
    listcan.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
      currentLeft = parseInt(listcan.style.left) || 0;
      listcan.style.transition = 'none';
    });

    listcan.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const deltaX = e.touches[0].clientX - startX;
      let newLeft = clamp(currentLeft + deltaX, -635, 0);
      listcan.style.left = `${newLeft}px`;
    });

    listcan.addEventListener('touchend', () => {
      isDragging = false;
      listcan.style.transition = 'left 0.3s ease';
    });
  }

  window.addEventListener('load', enableDragOnListcan);
  window.addEventListener('resize', enableDragOnListcan); 