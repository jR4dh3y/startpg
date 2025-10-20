// Main fuzzy search controller

(function () {
	let searchQuery = '';
	let matchedLinks = [];
	let currentMatchIndex = -1;
	let isSearchMode = false;

	// Perform fuzzy search
	function performSearch(query) {
		if (!query.trim()) {
			exitSearch();
			return;
		}

		const allLinks = getAllLinks();
		matchedLinks = allLinks
			.map(link => ({
				...link,
				score: fuzzyMatch(query, link.text)
			}))
			.filter(link => link.score > 0)
			.sort((a, b) => b.score - a.score);

		if (matchedLinks.length > 0) {
			isSearchMode = true;
			enterSearchMode();
			highlightMatches(matchedLinks);
			currentMatchIndex = 0;
			selectMatch(0);
		} else {
			exitSearch();
		}
	}

	// Exit search
	function exitSearch() {
		if (!isSearchMode) return;
		isSearchMode = false;
		searchQuery = '';
		matchedLinks = [];
		currentMatchIndex = -1;
		exitSearchMode();
	}

	// Select a specific match
	function selectMatch(index) {
		if (matchedLinks.length === 0) return;

		// Remove previous selection
		matchedLinks.forEach(match => {
			match.element.classList.remove('search-selected');
		});

		// Set new selection
		currentMatchIndex = (index + matchedLinks.length) % matchedLinks.length;
		matchedLinks[currentMatchIndex].element.classList.add('search-selected');
		updateSearchDisplay(searchQuery, currentMatchIndex, matchedLinks.length);
	}

	function nextMatch() {
		if (matchedLinks.length === 0) return;
		selectMatch(currentMatchIndex + 1);
	}

	function prevMatch() {
		if (matchedLinks.length === 0) return;
		selectMatch(currentMatchIndex - 1);
	}

	function openSelectedLink() {
		if (matchedLinks.length > 0 && currentMatchIndex >= 0) {
			const link = matchedLinks[currentMatchIndex].element;
			window.open(link.href, '_blank');
		}
	}

	// Handle keyboard input
	document.addEventListener('keydown', (e) => {
		// Escape key - exit search mode
		if (e.key === 'Escape') {
			if (isSearchMode) {
				exitSearch();
				e.preventDefault();
			}
			return;
		}

		if (e.key === 'Tab' && isSearchMode) {
			e.preventDefault();
			if (e.shiftKey) {
				prevMatch();
			} else {
				nextMatch();
			}
			return;
		}

		if (e.key === 'Enter' && isSearchMode) {
			e.preventDefault();
			openSelectedLink();
			return;
		}

		if (e.key === 'Backspace' && isSearchMode) {
			e.preventDefault();
			searchQuery = searchQuery.slice(0, -1);
			performSearch(searchQuery);
			return;
		}

		// Regular character input
		if (!isSearchMode && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
			// Don't start search on modifier key combinations
			searchQuery = e.key;
			performSearch(searchQuery);
			return;
		}

		// Continue typing in search mode
		if (isSearchMode && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
			e.preventDefault();
			searchQuery += e.key;
			performSearch(searchQuery);
			return;
		}
	});

	// Clear search when clicking outside
	document.addEventListener('click', (e) => {
		if (isSearchMode && !e.target.closest('#links') && !e.target.closest('#search-overlay')) {
			exitSearch();
		}
	});
})();
