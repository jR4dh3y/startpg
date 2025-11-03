(function () {
	const OVERLAY_ID = "dashboard-overlay";
	const DASHBOARD_VISIBLE_CLASS = "dashboard-visible";
	const BODY_OPEN_CLASS = "dashboard-open";

	let overlayElement = null;
	let isVisible = false;
	let domReady = document.readyState !== "loading";
	let listenersBound = false;

	function hydrateDom() {
		if (overlayElement) {
			return;
		}

		overlayElement = document.getElementById(OVERLAY_ID);
		const closeButton = document.getElementById("dashboard-close");

		if (!overlayElement) {
			return;
		}

		if (!listenersBound) {
			listenersBound = true;
			if (closeButton) {
				closeButton.addEventListener("click", hideDashboard);
			}
			overlayElement.addEventListener("click", function (event) {
				if (event.target === overlayElement) {
					hideDashboard();
				}
			});
			document.addEventListener("keydown", handleKeydown, { passive: false });
		}

	}

	function handleKeydown(event) {
		if (event.defaultPrevented) {
			return;
		}

		const activeElement = document.activeElement;
		if (activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA" || activeElement.isContentEditable)) {
			return;
		}

		if (isVisible && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
			event.preventDefault();
			return;
		}

		if (isVisible && event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
			event.preventDefault();
			return;
		}

		if (event.key === "ArrowUp") {
			if (!isVisible) {
				event.preventDefault();
				showDashboard();
			}
		} else if (event.key === "ArrowDown" || event.key === "Escape") {
			if (isVisible) {
				event.preventDefault();
				hideDashboard();
			}
		}
	}

	function showDashboard() {
		hydrateDom();
		if (!overlayElement || isVisible) {
			return;
		}

		isVisible = true;
		overlayElement.setAttribute("aria-hidden", "false");
		document.body.classList.add(BODY_OPEN_CLASS);
		if (typeof window.stopThemeAutoplay === "function") {
			window.stopThemeAutoplay();
		}

		window.requestAnimationFrame(function () {
			overlayElement.classList.add(DASHBOARD_VISIBLE_CLASS);
		});
	}

	function hideDashboard() {
		if (!overlayElement || !isVisible) {
			return;
		}

		isVisible = false;
		overlayElement.classList.remove(DASHBOARD_VISIBLE_CLASS);
		overlayElement.setAttribute("aria-hidden", "true");
		document.body.classList.remove(BODY_OPEN_CLASS);
		if (typeof window.startThemeAutoplay === "function") {
			window.startThemeAutoplay();
		}
	}

	if (!domReady) {
		document.addEventListener("DOMContentLoaded", function () {
			domReady = true;
			hydrateDom();
		});
	} else {
		hydrateDom();
	}

	window.dashboard = {
		show: showDashboard,
		hide: hideDashboard,
		refreshFrame: function (url) {
			const frame = document.getElementById("dashboard-frame");
			if (frame && url) {
				frame.src = url;
			}
		}
	};
})();
