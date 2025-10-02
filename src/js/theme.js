let currentIndex = localStorage.getItem("currentIndex") || document.currentScript.getAttribute('currentIndex');
currentIndex = parseInt(currentIndex);

const images = ["cover1.webp", "cover2.png", "cover3.webp", "cover4.jpg", "cover5.png" ];

if (!Number.isInteger(currentIndex) || currentIndex < 0) {
	currentIndex = 0;
} else {
	currentIndex = currentIndex % images.length;
}
const colorSets = [
	{
		"--text-color": "#c0caf5",
		"--hover-color": "#bb9af7",
		"--accent-color": "#7aa2f7",
		"--accent-color-2": "#f7768e",
		"--background-color": "#1a1b26",
	},
	{
		"--text-color": "#9fadc6",
		"--hover-color": "#9B5856",
		"--accent-color": "#28725A",
		"--accent-color-2": "#D2C7CB",
		"--background-color": "#15191d",
	},
	{
		"--text-color": "#c0caf5",
		"--hover-color": "#e0af68",
		"--accent-color": "#7aa2f7",
		"--accent-color-2": "#bb9af7",
		"--background-color": "#1a1b26",
	},
	{
		"--text-color": "#dfe6ff",
		"--hover-color": "#9ee8cf",
		"--accent-color": "#caa8ff",
		"--accent-color-2": "#ffd72a",
		"--background-color": "#21211e"
	},

	{
		"--text-color": "#f6f4f0",
		"--hover-color": "#ff9f43",
		"--accent-color": "#ff6b6b",
		"--accent-color-2": "#ffd166",
		"--background-color": "#1f2233",
	},
];

function preloadImages() {
	for (let i = 0; i < images.length; i++) {
		const img = new Image();
		img.src = "https://raw.githubusercontent.com/jR4dh3y/startpg/main/src/images/" + images[i];
	}
}

function updateIndexAndPersist(nextIndex) {
	currentIndex = (nextIndex + images.length) % images.length;
	localStorage.setItem("currentIndex", currentIndex);
}

function swapImage() {
	const imageElement = document.getElementById("carouselImage");
	imageElement.style.opacity = 0;
	updateColors();

	setTimeout(() => {
		imageElement.src = "https://raw.githubusercontent.com/jR4dh3y/startpg/main/src/images/" + images[currentIndex];
		imageElement.style.opacity = 1;
	}, 200); // Match the transition duration in style.css
}

function nextImage() {
	updateIndexAndPersist(currentIndex + 1);
	swapImage();
}

function previousImage() {
	updateIndexAndPersist(currentIndex - 1);
	swapImage();
}

function updateColors() {
	const colorSet = colorSets[currentIndex];
	if (!colorSet) {
		return;
	}
	for (const [property, value] of Object.entries(colorSet)) {
		document.documentElement.style.setProperty(property, value);
	}
}

// Set colors with current index first
updateColors();

// Set the initial image
document.getElementById("carouselImage").src = "https://raw.githubusercontent.com/jR4dh3y/startpg/main/src/images/" + images[currentIndex];

// Image is opacity 0 and text is translated off screen by default
// Add the loaded class to the image and text to animate them in
window.onload = function() {
	document.getElementById("image").classList.add('loaded');
	document.getElementById("text").classList.add('loaded');
	// Preload the remaining images
	preloadImages();
};

document.addEventListener("keydown", (event) => {
	if (event.defaultPrevented) {
		return;
	}

	const target = event.target;
	if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
		return;
	}

	switch (event.key) {
		case "ArrowRight":
			nextImage();
			event.preventDefault();
			break;
		case "ArrowLeft":
			previousImage();
			event.preventDefault();
			break;
		default:
			break;
	}
});
