(function () {
	const AUTOPLAY_INTERVAL_MS = 3000;
	let autoplayTimerId = null;
	let isPointerInsideCarousel = false;
	let isManuallyPaused = false;

	function stopAutoplay() {
		if (autoplayTimerId !== null) {
			clearInterval(autoplayTimerId);
			autoplayTimerId = null;
		}
	}

	function scheduleNextRun() {
		stopAutoplay();

		if (isManuallyPaused || typeof nextImage !== "function") {
			return;
		}

		autoplayTimerId = setInterval(() => {
			if (document.hidden || isPointerInsideCarousel) {
				return;
			}

			nextImage();
		}, AUTOPLAY_INTERVAL_MS);
	}

	function pauseAutoplay() {
		isManuallyPaused = true;
		stopAutoplay();
	}

	function resumeAutoplay() {
		isManuallyPaused = false;
		scheduleNextRun();
	}

	function handleVisibilityChange() {
		if (document.hidden) {
			stopAutoplay();
		} else {
			scheduleNextRun();
		}
	}

	window.addEventListener("DOMContentLoaded", () => {
		const imageContainer = document.getElementById("image");
		const greetingElement = document.getElementById("greeting");

		if (imageContainer) {
			imageContainer.addEventListener("mouseenter", () => {
				isPointerInsideCarousel = true;
			});

			imageContainer.addEventListener("mouseleave", () => {
				isPointerInsideCarousel = false;
			});

			imageContainer.addEventListener("click", scheduleNextRun);
		}

		if (greetingElement) {
			greetingElement.style.cursor = "pointer";
			greetingElement.title = "Click to toggle autoplay";
			greetingElement.addEventListener("click", () => {
				if (isManuallyPaused) {
					resumeAutoplay();
				} else {
					pauseAutoplay();
				}
			});
		}

		document.addEventListener("keydown", (event) => {
			if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
				scheduleNextRun();
			}
		});

		scheduleNextRun();
	});

	document.addEventListener("visibilitychange", handleVisibilityChange);
	window.addEventListener("focus", scheduleNextRun);
	window.addEventListener("blur", stopAutoplay);

	window.startThemeAutoplay = resumeAutoplay;
	window.stopThemeAutoplay = pauseAutoplay;
})();
