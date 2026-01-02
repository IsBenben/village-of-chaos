// tutorial.js
// Extends the Game class with tutorial handling
// Keeps track of which pop-ups were already shown, their contents, and their
// requirements, as well as handling the actual display

"use strict";

// List of all possible pop-ups
// Value is true if shown
Game.prototype.tutorial = {
	resource: false,
	tent: false,
	assign: false,
	pier: false,
	chaos: false,
	stone: false,
	smithy: false,
	academy: false,
	mentor: false,
	manager: false,
};

// Show the relevant pop-up if a requirement has been meet
// Call this every update
Game.prototype.updatePopups = function () {
	if (this.wood >= 4 && !this.tutorial.resource) {
		this.showPopup(
		  'tutorial.resource',
			"#warehouse"
		);
		this.tutorial.resource = true;
	}
	if (this.wood >= 10 && this.food >= 10 && !this.tutorial.tent) {
		this.showPopup(
			'tutorial.tent',
			"#craft"
		);
		this.tutorial.tent = true;
	}
	if (this.levels.tent >= 1 && !this.tutorial.assign) {
		this.showPopup(
			'tutorial.assign',
			"#assign",
			"assign"
		);
		this.tutorial.assign = true;
	}
	if (this.levels.pier >= 1 && !this.tutorial.pier) {
		this.showPopup(
			'tutorial.pier',
			"#assign",
			"assign"
		);
		this.tutorial.pier = true;
	}
	if (this.chaos.pier > 0 && !this.tutorial.chaos) {
		this.showPopup(
			'tutorial.chaos',
			"#assign"
		);
		this.tutorial.chaos = true;
	}
	if (this.levels.quarry >= 1 && !this.tutorial.stone) {
		this.showPopup(
			'tutorial.stone',
			"#warehouse"
		);
		this.tutorial.stone = true;
	}
	if (this.levels.smithy >= 1 && !this.tutorial.smithy) {
		this.showPopup(
			'tutorial.smithy',
			"#warehouse"
		);
		this.tutorial.smithy = true;
	}
	if (this.levels.academy >= 1 && !this.tutorial.academy) {
		this.showPopup(
			'tutorial.academy',
			"#research",
			"research"
		);
		this.tutorial.academy = true;
	}
	if (this.unlocks.mentor && !this.tutorial.mentor) {
		this.showPopup(
			'tutorial.mentor',
			"#assign",
			"assign"
		);
		this.tutorial.mentor = true;
	}
	if (this.unlocks.manager && !this.tutorial.manager) {
		this.showPopup(
			'tutorial.manager',
			"#assign",
			"assign"
		);
		this.tutorial.manager = true;
	}
};

// Show a pop-up to the player by modifying the DOM, with a small delay
// text: Main pop-up content plaintext
// atSelector (optional): CSS selector of a DOM element next to which the pop-up
//   will be placed. If undefined, pop-up will be centered
// switchTab (optional): name of an interface tab. If defined, the tab will be
//   activated when the pop-up appears
Game.prototype.showPopup = function (text, atSelector, switchTab) {
	setTimeout(() => {
		this.dom.popupShroud.style.display = "block";
		this.dom.popupText.innerHTML = `<t-i18n k="${text}"></t-i18n>`;

		// Switch the tab first in case it contains the atSelector element
		if (switchTab) this.dom[switchTab + "Button"].click();

		if (atSelector) {
			let target = document.querySelector(atSelector);
			const targetRect = target.getBoundingClientRect();
			const margin = parseInt(
				window.getComputedStyle(this.dom.popup).marginTop
			);

			// Determine if we're portrait or landscape
			const isPortrait = window.innerWidth >= window.innerHeight;

			// Start out overlapping the target
			let left = targetRect.left;
			let top = targetRect.top;

			if (isPortrait) {
				// Try positioning to the right of the target,
				// go to the left if that's off-screen
				left += target.offsetWidth;
				if (
					left + margin + this.dom.popup.offsetWidth >
					window.innerWidth
				)
					left =
						targetRect.left -
						margin * 2 -
						this.dom.popup.offsetWidth;
			} else {
				// Try positioning below the target,
				// go above if that's off-screen
				top += target.offsetHeight;
				if (
					top + margin + this.dom.popup.offsetHeight >
					window.innerHeight
				)
					top =
						targetRect.top -
						margin * 2 -
						this.dom.popup.offsetHeight;
			}

			// Clamp pop-up position to viewport, just in case
			left = Math.max(left, 0);
			left = Math.min(
				left,
				window.innerWidth - this.dom.popup.offsetWidth - margin * 2
			);
			top = Math.max(top, 0);
			top = Math.min(
				top,
				window.innerHeight - this.dom.popup.offsetHeight - margin * 2
			);

			this.dom.popup.style.left = left + "px";
			this.dom.popup.style.top = top + "px";

			target.style.zIndex = 1000; // Bring above the shroud (z 0) but below the pop-up (z 2000)
			target.style.pointerEvents = "none"; // Make sure target can't be interacted with while pop-up is visible
			this.dom.popupDismiss.addEventListener("click", () => {
				target.style.zIndex = "revert";
				target.style.pointerEvents = "revert";
			});
		} else {
			// Default - just center it
			this.dom.popup.style.left =
				window.innerWidth / 2 - this.dom.popup.offsetWidth / 2 + "px";
			this.dom.popup.style.top =
				window.innerHeight / 2 - this.dom.popup.offsetHeight / 2 + "px";
		}
	}, 800);
};
