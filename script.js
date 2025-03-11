let boxes = document.querySelectorAll(".resize");

// Store original background colors
boxes.forEach(box => {
    box.dataset.originalBackground = box.style.background;

    box.addEventListener("click", () => {
        let grid = document.querySelector(".grid-container");

        let numCols = 6; // Fixed number of columns
        let numRows = 6; // Fixed number of rows

        grid.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;

        let usedPositions = new Set(); // Track occupied positions

        boxes.forEach(box => {
            let colSpan = Math.random() > 0.5 ? 1 : 2;
            let rowSpan = Math.random() > 0.5 ? 1 : 2;

            let colStart, rowStart;
            let attempts = 0; // Prevent infinite loops

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

// Scroll event listeners
let lastScrollTop = window.scrollY;

window.addEventListener("scroll", () => {
    let currentScroll = document.documentElement.scrollTop;

    if (currentScroll < lastScrollTop) {
        // Scroll Up: Remove background, add border
        boxes.forEach(box => {
            box.style.transition = "background 0.5s ease, border 0.5s ease";
            box.style.background = "none";
            box.style.border = "1px solid black";
        });
    } else {
        // Scroll Down: Restore original background & remove border
        boxes.forEach(box => {
            box.style.transition = "background 0.5s ease, border 0.5s ease";
            box.style.background = "rgba(204, 213, 174, 0.6)";
            box.style.background = box.dataset.originalBackground || "rgba(204, 213, 174, 0.6)";
            box.style.border = "none";
        });
    }

    lastScrollTop = Math.max(0, currentScroll);
});

document.addEventListener("DOMContentLoaded", () => {
    const folders = ["abstract", "sculpture", "contemporary"]; // Image folders
    let currentIndex = 0; // Start with abstract images
    const boxes = document.querySelectorAll(".resize");

    function updateBackgrounds() {
        let folder = folders[currentIndex];

        // Clear all divs before applying new images
        boxes.forEach(box => {
            box.style.background = "none"; // Removes previous backgrounds
            box.style.background = "rgba(204, 213, 174, 0.6)";
        });

        // Convert NodeList to array and shuffle
        let boxesArray = Array.from(boxes);
        for (let i = boxesArray.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [boxesArray[i], boxesArray[j]] = [boxesArray[j], boxesArray[i]];
        }

        // Select 6 random divs to receive new images
        let selectedBoxes = boxesArray.slice(0, 5);
        selectedBoxes.forEach((box, index) => {
            // Force the browser to reload new images using a timestamp
            let imageUrl = `${folder}/image${index + 1}.jpg?t=${Date.now()}`;

            // Apply new background
            box.style.background = `url('${imageUrl}') center/cover no-repeat`;

            // Store in dataset for scroll restoration
            box.dataset.originalBackground = box.style.background;
        });

        // Cycle through folders
        currentIndex = (currentIndex + 1) % folders.length;
    }

    // Initial background setting
    updateBackgrounds();

    // Change images every 10 seconds
    setInterval(updateBackgrounds, 10000);
});
