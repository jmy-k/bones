let boxes = document.querySelectorAll(".resize");
// Scroll event listeners
let lastScrollTop = window.scrollY;
let isEmptyMode = false; // Track whether images should be hidden


const folders = ["abstract", "sculpture", "contemporary", "photos"]; // Image folders
let currentIndex = 0; // Start with abstract images

boxes.forEach(box => {
    box.dataset.originalBackground = box.style.background; // Store original background colors

    box.addEventListener("click", () => {

        applyRandomFilter(box);

        let grid = document.querySelector(".grid-container");

        let numCols = 6;
        let numRows = 6;

        grid.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;

        let usedPositions = new Set(); // Track occupied positions

        boxes.forEach(box => {
            let colSpan = Math.random() > 0.5 ? 1 : 2;
            let rowSpan = Math.random() > 0.5 ? 1 : 2;

            let colStart, rowStart;
            let attempts = 0;

            do {
                colStart = Math.floor(Math.random() * (numCols - colSpan + 1)) + 1;
                rowStart = Math.floor(Math.random() * (numRows - rowSpan + 1)) + 1;
                attempts++;
            } while (usedPositions.has(`${colStart},${rowStart}`) && attempts < 10);

            usedPositions.add(`${colStart},${rowStart}`);

            box.style.gridColumn = `${colStart} / span ${colSpan}`;
            box.style.gridRow = `${rowStart} / span ${rowSpan}`;
        });
    });
});

window.addEventListener("scroll", () => {
    let currentScroll = document.documentElement.scrollTop;

    if (currentScroll < lastScrollTop) {
        // Scroll up: remove images, enter "empty mode"
        isEmptyMode = true;
        removeImages();
    } else {
        // Scroll down: update images immediately, exit "empty mode"
        if (isEmptyMode) {
            isEmptyMode = false;
            updateBackgrounds(); // Ensures the correct folder is used
        }
    }

    lastScrollTop = Math.max(0, currentScroll);
});

document.addEventListener("DOMContentLoaded", () => {
    // Initial background setting
    updateBackgrounds();

    // Change folder every 10 seconds
    setInterval(checkScrollState, 10000);
});


function updateBackgrounds() {
    let folder = folders[currentIndex];

    // Clear all divs before applying new images
    boxes.forEach(box => {
        box.style.background = "none"; // Remove previous backgrounds
        box.style.background = "rgba(170, 170, 170, 0.6)";
    });

    // Shuffle array of boxes
    let boxesArray = Array.from(boxes);
    for (let i = boxesArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [boxesArray[i], boxesArray[j]] = [boxesArray[j], boxesArray[i]];
    }

    // Select 5 random divs to receive new images
    let selectedBoxes = boxesArray.slice(0, 5);
    selectedBoxes.forEach((box, index) => {
        let imageUrl = `${folder}/image${index + 1}.jpg?t=${Date.now()}`;

        // Apply new background
        box.style.background = `url('${imageUrl}') center/cover no-repeat`;

        // Store in dataset for future use
        box.dataset.originalBackground = box.style.background;
    });

    // Cycle through folders
    currentIndex = (currentIndex + 1) % folders.length;
}

function removeImages() {
    boxes.forEach(box => {
        box.style.transition = "background 0.5s ease, border 0.5s ease";
        box.style.background = "none";
        box.style.border = "1px solid black";
    });
}

// Restore images based on the latest folder, not stored backgrounds
function restoreImages() {
    updateBackgrounds();
}

function checkScrollState() {
    if (!isEmptyMode) {
        updateBackgrounds(); // Update images only when scrolled down
    }
}





function applyRandomFilter(box) {
    const filters = ["grayscale(100%)", "sepia(50%)", "blur(3px)", "contrast(200%)"];
    let randomFilter = filters[Math.floor(Math.random() * filters.length)];
    box.style.filter = randomFilter;
}

boxes.forEach(box => {
    box.addEventListener("click", () => applyRandomFilter(box));
});
