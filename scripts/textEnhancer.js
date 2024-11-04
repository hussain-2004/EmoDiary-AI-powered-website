const textOptions = [
    "Mind",
    "Heart",
    "Potential",
    "Peace",
    "Resilience"
];

let index = 0;
const changeInterval = 2000; // Interval for text change (2 seconds)

function changeText() {
    const textElement = document.getElementById("changingText1");

    // Add roll class to trigger animation
    textElement.classList.add("roll");

    // After animation completes, change text and remove the roll class
    setTimeout(() => {
        textElement.textContent = textOptions[index];
        
        // Move to the next index; wrap around if at the end
        index = (index + 1) % textOptions.length;

        // Remove roll class after animation is done
        textElement.classList.remove("roll");
    }, 500); // 0.5s to match CSS animation duration
}

// Start the text change interval
setInterval(changeText, changeInterval);