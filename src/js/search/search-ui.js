// Search UI management

let searchOverlay = null;
let searchDisplay = null;

// Enter search mode
function enterSearchMode() {
	// Create overlay
	if (!searchOverlay) {
		searchOverlay = document.createElement('div');
		searchOverlay.id = 'search-overlay';
		searchOverlay.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: rgba(0, 0, 0, 0.2);
			z-index: 100;
			pointer-events: none;
		`;
		document.body.appendChild(searchOverlay);
	}

	// Create search display
	if (!searchDisplay) {
		searchDisplay = document.createElement('div');
		searchDisplay.id = 'search-display';
		searchDisplay.style.cssText = `
			position: fixed;
			top: 20px;
			left: 50%;
			transform: translateX(-50%);
			background-color: rgba(0, 0, 0, 0.6);
			color: var(--accent-color);
			padding: 8px 16px;
			border-radius: 6px;
			font-size: 1em;
			font-weight: 600;
			border: 1px solid var(--accent-color);
			z-index: 101;
			font-family: SpaceMono Nerd Font, monospace;
		`;
		document.body.appendChild(searchDisplay);
	}
}

// Exit search mode
function exitSearchMode() {
	// Remove overlay and display
	if (searchOverlay) {
		searchOverlay.remove();
		searchOverlay = null;
	}
	if (searchDisplay) {
		searchDisplay.remove();
		searchDisplay = null;
	}

	// Remove highlight class from all links
	document.querySelectorAll('#links a.search-highlight').forEach(link => {
		link.classList.remove('search-highlight', 'search-selected', 'search-dimmed');
	});
	document.querySelectorAll('#links a.search-dimmed').forEach(link => {
		link.classList.remove('search-dimmed');
	});
}

// Highlight matched links
function highlightMatches(matchedLinks) {
	document.querySelectorAll('#links a').forEach(link => {
		link.classList.remove('search-highlight', 'search-selected');
		link.classList.add('search-dimmed'); // Dim all during search
	});

	matchedLinks.forEach(match => {
		match.element.classList.add('search-highlight');
		match.element.classList.remove('search-dimmed'); // Keep matches bright
	});
}

// Update search display text
function updateSearchDisplay(searchQuery, currentMatchIndex, totalMatches) {
	if (searchDisplay) {
		const count = `${currentMatchIndex + 1}/${totalMatches}`;
		searchDisplay.textContent = `Search: "${searchQuery}" (${count})`;
	}
}
