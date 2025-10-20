// Search utility functions

// Fuzzy search algorithm
function fuzzyMatch(query, text) {
	if (!query) return 0;

	query = query.toLowerCase();
	text = text.toLowerCase();

	let queryIdx = 0;
	let score = 0;
	let consecutiveMatches = 0;

	for (let i = 0; i < text.length; i++) {
		if (queryIdx < query.length && query[queryIdx] === text[i]) {
			queryIdx++;
			score += 10 + consecutiveMatches;
			consecutiveMatches += 5;
		} else {
			consecutiveMatches = 0;
		}
	}

	// Perfect match bonus
	if (queryIdx === query.length) {
		if (text.startsWith(query)) {
			score += 50;
		}
		return score;
	}

	return 0;
}

// Get all bookmark links with their display text
function getAllLinks() {
	const links = [];
	const allAnchors = document.querySelectorAll('#links a');

	allAnchors.forEach((link) => {
		links.push({
			element: link,
			text: link.textContent,
			href: link.href,
			score: 0
		});
	});

	return links;
}
