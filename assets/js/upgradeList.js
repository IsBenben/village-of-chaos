// upgradeList.js
// Holds the upgrade schema, as well as definitions of all of the game's upgrades
// Includes the upgrades' effects as callbacks

"use strict";

class Upgrade {
	constructor(params = {}) {
		// 使用翻译key
		this.name = params?.name; // Primary text, shown as header
		this.description = params?.description; // Secondary text, shown as paragraph

		this.type = params?.type; // "craft" or "research"
		this.cost = params?.cost; // An object with at least one of the keys "wood", "food", "stone"
		this.duration = params?.duration; // Time it takes for the upgrade to complete (in seconds)
		this.once = params?.once; // True if upgrade should disappear once bought
		this.scaling = params.scaling; // Optional if once=true. If once=false, cost is multiplied by this amount every completion
		this.requirement = params?.requirement; // Optional, array of Game.levels fields and their minimum values for the upgrade to show up
		this.effect = params?.effect; // Function to run on buy
	}
}

Game.prototype.upgradeList = [
	// Major system progression upgrades
	new Upgrade({
		name: "upgrade.build-tent.title",
		description: "upgrade.build-tent.description",
		type: "craft",
		cost: {
			wood: 10,
			food: 10,
		},
		duration: 2,
		once: true,
		effect: function (game) {
			game.levels.tent += 1;
			game.lumberjack += 2;
			game.unlock("assign");
			game.unlock("income");
			game.logMessage("event", "log.event.build-tent");
		},
	}),
	new Upgrade({
		name: "upgrade.expand-tent.title",
		description: "upgrade.expand-tent.description",
		type: "craft",
		cost: {
			wood: 20,
			food: 40,
		},
		duration: 2,
		once: false,
		scaling: 1.5,
		requirement: ["tent", 1],
		effect: function (game) {
			game.levels.tent += 1;
			game.lumberjack += 1;
			game.logMessage("event", "log.event.expand-tent");
		},
	}),
	new Upgrade({
		name: "upgrade.build-pier.title",
		description: "upgrade.build-pier.description",
		type: "craft",
		cost: {
			wood: 100,
		},
		duration: 4,
		once: true,
		requirement: ["tent", 1],
		effect: function (game) {
			game.levels.pier += 1;
			game.unlock("fisherman");
			game.logMessage("event", "log.event.build-pier");
		},
	}),
	new Upgrade({
		name: "upgrade.extend-pier.title",
		description: "upgrade.extend-pier.description",
		type: "craft",
		cost: {
			wood: 200,
		},
		duration: 4,
		once: false,
		scaling: 4,
		requirement: ["pier", 1],
		effect: function (game) {
			game.production.fisherman *= 2;
			game.levels.pier += 1;
			game.logMessage("event", "log.event.extend-pier");
		},
	}),
	new Upgrade({
		name: "upgrade.build-quarry.title",
		description: "upgrade.build-quarry.description",
		type: "craft",
		cost: {
			wood: 200,
		},
		duration: 5,
		once: true,
		requirement: ["pier", 1],
		effect: function (game) {
			game.unlock("stone");
			game.unlock("miner");
			game.logMessage("event", "log.event.build-quarry");
			game.levels.quarry += 1;
		},
	}),
	new Upgrade({
		name: "upgrade.develop-quarry.title",
		description: "upgrade.develop-quarry.description",
		type: "craft",
		cost: {
			wood: 250,
			stone: 100,
		},
		duration: 5,
		once: false,
		scaling: 4,
		requirement: ["quarry", 1],
		effect: function (game) {
			game.levels.quarry += 1;
			game.production.miner *= 2;
			game.logMessage("event", "log.event.develop-quarry");
		},
	}),
	new Upgrade({
		name: "upgrade.build-smithy.title",
		description: "upgrade.build-smithy.description",
		type: "craft",
		cost: {
			wood: 200,
			stone: 200,
		},
		duration: 6,
		once: true,
		requirement: ["quarry", 2],
		effect: function (game) {
			game.levels.smithy += 1;
			game.unlock("blacksmith");
			game.unlock("craftSpeed");
			game.logMessage("event", "log.event.build-smithy");
		},
	}),
	new Upgrade({
		name: "upgrade.modernize-smithy.title",
		description: "upgrade.modernize-smithy.description",
		type: "craft",
		cost: {
			wood: 400,
			stone: 400,
		},
		duration: 6,
		once: false,
		scaling: 2,
		requirement: ["smithy", 1],
		effect: function (game) {
			game.levels.smithy += 1;
			game.production.blacksmith *= 0.75;
			game.logMessage("event", "log.event.modernize-smithy");
		},
	}),
	new Upgrade({
		name: "upgrade.build-academy.title",
		description: "upgrade.build-academy.description",
		type: "craft",
		cost: {
			wood: 1000,
			stone: 1000,
		},
		duration: 10,
		once: true,
		requirement: ["smithy", 3],
		effect: function (game) {
			game.levels.academy += 1;
			game.unlock("professor");
			game.unlock("research");
			game.unlock("researchSpeed");
			game.logMessage("event", "log.event.build-academy");
		},
	}),
	new Upgrade({
		name: "upgrade.grow-academy.title",
		description: "upgrade.grow-academy.description",
		type: "craft",
		cost: {
			wood: 1500,
			stone: 2000,
		},
		duration: 10,
		once: false,
		scaling: 2,
		requirement: ["academy", 1],
		effect: function (game) {
			game.levels.academy += 1;
			game.production.professor *= 0.75;
			game.logMessage("event", "log.event.grow-academy");
		},
	}),
	new Upgrade({
		name: "upgrade.mentorship-program.title",
		description: "upgrade.mentorship-program.description",
		type: "research",
		cost: {
			food: 1500,
		},
		duration: 6,
		once: true,
		requirement: ["academy", 1],
		effect: function (game) {
			game.mentorUnlocked = true;
			game.unlock("mentor");
			game.logMessage("event", "log.event.mentorship-program");
		},
	}),
	new Upgrade({
		name: "upgrade.people-management.title",
		description: "upgrade.people-management.description",
		type: "research",
		cost: {
			food: 6000,
		},
		duration: 12,
		once: true,
		requirement: ["academy", 3],
		effect: function (game) {
			game.managerUnlocked = true;
			game.unlock("manager");
			game.logMessage("event", "log.event.people-management");
		},
	}),

	// Job upgrades
	new Upgrade({
		name: "upgrade.craft-wooden-axes.title",
		description: "upgrade.craft-wooden-axes.description",
		type: "craft",
		cost: {
			wood: 40,
		},
		duration: 3,
		once: true,
		requirement: ["tent", 1],
		effect: function (game) {
			game.production.lumberjack *= 1.75;
			game.logMessage("event", "log.event.craft-wooden-axes");
		},
	}),
	new Upgrade({
		name: "upgrade.craft-wooden-fishing-rods.title",
		description: "upgrade.craft-wooden-fishing-rods.description",
		type: "craft",
		cost: {
			wood: 100,
		},
		duration: 3,
		once: true,
		requirement: ["pier", 1],
		effect: function (game) {
			game.production.fisherman *= 1.75;
			game.logMessage("event", "log.event.craft-wooden-fishing-rods");
		},
	}),
	new Upgrade({
		name: "upgrade.craft-wooden-pickaxes.title",
		description: "upgrade.craft-wooden-pickaxes.description",
		type: "craft",
		cost: {
			wood: 120,
		},
		duration: 3,
		once: true,
		requirement: ["quarry", 1],
		effect: function (game) {
			game.production.miner *= 1.75;
			game.logMessage("event", "log.event.craft-wooden-pickaxes");
		},
	}),
	new Upgrade({
		name: "upgrade.craft-stone-axes.title",
		description: "upgrade.craft-stone-axes.description",
		type: "craft",
		cost: {
			wood: 20,
			stone: 50,
		},
		duration: 4,
		once: true,
		requirement: ["quarry", 1],
		effect: function (game) {
			game.production.lumberjack *= 1.75;
			game.logMessage("event", "log.event.craft-stone-axes");
		},
	}),
	new Upgrade({
		name: "upgrade.craft-stone-pickaxes.title",
		description: "upgrade.craft-stone-pickaxes.description",
		type: "craft",
		cost: {
			wood: 50,
			stone: 100,
		},
		duration: 5,
		once: true,
		requirement: ["quarry", 2],
		effect: function (game) {
			game.production.miner *= 1.75;
			game.logMessage("event", "log.event.craft-stone-pickaxes");
		},
	}),
	new Upgrade({
		name: "upgrade.sharpen-pickaxes.title",
		description: "upgrade.sharpen-pickaxes.description",
		type: "craft",
		cost: {
			wood: 60,
			stone: 120,
		},
		duration: 8,
		once: true,
		requirement: ["smithy", 1],
		effect: function (game) {
			game.production.miner *= 1.25;
			game.logMessage("event", "log.event.sharpen-pickaxes");
		},
	}),
	new Upgrade({
		name: "upgrade.comfortable-stools.title",
		description: "upgrade.comfortable-stools.description",
		type: "craft",
		cost: {
			wood: 160,
			stone: 40,
		},
		duration: 8,
		once: true,
		requirement: ["smithy", 1],
		effect: function (game) {
			game.production.fisherman *= 1.25;
			game.logMessage("event", "log.event.comfortable-stools");
		},
	}),
	new Upgrade({
		name: "upgrade.log-storage.title",
		description: "upgrade.log-storage.description",
		type: "craft",
		cost: {
			wood: 200,
			stone: 120,
		},
		duration: 10,
		once: true,
		requirement: ["smithy", 2],
		effect: function (game) {
			game.production.lumberjack *= 1.25;
			game.logMessage("event", "log.event.log-storage");
		},
	}),
	new Upgrade({
		name: "upgrade.multi-level-quarry.title",
		description: "upgrade.multi-level-quarry.description",
		type: "craft",
		cost: {
			wood: 400,
			stone: 100,
		},
		duration: 10,
		once: true,
		requirement: ["smithy", 2],
		effect: function (game) {
			game.production.miner *= 1.5;
			game.logMessage("event", "log.event.multi-level-quarry");
		},
	}),
	new Upgrade({
		name: "upgrade.fish-traps.title",
		description: "upgrade.fish-traps.description",
		type: "craft",
		cost: {
			wood: 500,
		},
		duration: 12,
		once: true,
		requirement: ["smithy", 3],
		effect: function (game) {
			game.production.fisherman *= 1.5;
			game.logMessage("event", "log.event.fish-traps");
		},
	}),
	new Upgrade({
		name: "upgrade.back-supports.title",
		description: "upgrade.back-supports.description",
		type: "craft",
		cost: {
			wood: 300,
			stone: 300,
		},
		duration: 12,
		once: true,
		requirement: ["smithy", 3],
		effect: function (game) {
			game.production.lumberjack *= 1.75;
			game.logMessage("event", "log.event.back-supports");
		},
	}),
	new Upgrade({
		name: "upgrade.time-management.title",
		description: "upgrade.time-management.description",
		type: "research",
		cost: {
			food: 2000,
		},
		duration: 15,
		once: true,
		requirement: ["academy", 1],
		effect: function (game) {
			game.production.blacksmith -= 0.05;
			game.production.professor -= 0.05;
			game.logMessage("event", "log.event.time-management");
		},
	}),
	new Upgrade({
		name: "upgrade.swing-smarter.title",
		description: "upgrade.swing-smarter.description",
		type: "research",
		cost: {
			food: 600,
		},
		duration: 15,
		once: true,
		requirement: ["academy", 1],
		effect: function (game) {
			game.production.lumberjack *= 2;
			game.logMessage("event", "log.event.swing-smarter");
		},
	}),
	new Upgrade({
		name: "upgrade.task-mastery.title",
		description: "upgrade.task-mastery.description",
		type: "research",
		cost: {
			food: 3000,
		},
		duration: 16,
		once: true,
		requirement: ["academy", 2],
		effect: function (game) {
			game.production.mentorBoost += 0.1;
			game.logMessage("event", "log.event.task-mastery");
		},
	}),

	// Story upgrades
	new Upgrade({
		name: "upgrade.survey-monolith.title",
		description: "upgrade.survey-monolith.description",
		type: "craft",
		cost: {
			food: 50,
		},
		duration: 60,
		once: true,
		requirement: ["quarry", 2],
		effect: function (game) {
				game.showStory(
					"story.survey-monolith",
					"button.story.return"
				);
			},
	}),
	new Upgrade({
		name: "upgrade.study-monolith.title",
		description: "upgrade.study-monolith.description",
		type: "research",
		cost: {
			food: 800,
		},
		duration: 240,
		once: true,
		requirement: ["academy", 2],
		effect: function (game) {
				game.showStory(
					"story.study-monolith",
					"button.story.leave"
				);
			},
	}),
	new Upgrade({
		name: "upgrade.destroy-monolith.title",
		description: "upgrade.destroy-monolith.description",
		type: "research",
		cost: {
			wood: 10000,
			food: 30000,
			stone: 50000,
		},
		duration: 1200,
		once: true,
		requirement: ["academy", 4],
		effect: function (game) {
				game.showStory(
					"story.destroy-monolith-1",
					"button.story.advance",
					() => {
						game.showStory(
							"story.destroy-monolith-2",
							"button.story.trigger",
							() => {
								game.showStory(
									"story.destroy-monolith-3",
									"button.story.join",
									() => {
										game.gameOver();
									}
								);
							}
						);
					}
				);
			},
	}),

	// Random upgrades
	new Upgrade({
		name: "upgrade.hunt-wildlife.title",
		description: "upgrade.hunt-wildlife.description",
		type: "craft",
		cost: {
			wood: 5,
			food: 5,
		},
		duration: 2,
		once: true,
		requirement: ["tent", 1],
		effect: function (game) {
			game.food += 40;
			game.logMessage("event", "log.event.hunt-wildlife");
			},
	}),
	new Upgrade({
		name: "upgrade.fell-oak.title",
		description: "upgrade.fell-oak.description",
		type: "craft",
		cost: {
			wood: 20,
		},
		duration: 4,
		once: true,
		requirement: ["pier", 1],
		effect: function (game) {
			game.wood += 100;
			game.logMessage("event", "log.event.fell-oak");
		},
	}),
	new Upgrade({
		name: "upgrade.level-ground.title",
		description: "upgrade.level-ground.description",
		type: "craft",
		cost: {
			stone: 20,
		},
		duration: 5,
		once: true,
		requirement: ["quarry", 1],
		effect: function (game) {
			game.stone += 120;
			game.logMessage("event", "log.event.level-ground");
		},
	}),
	new Upgrade({
		name: "upgrade.fish-monster.title",
		description: "upgrade.fish-monster.description",
		type: "craft",
		cost: {
			food: 40,
		},
		duration: 5,
		once: true,
		requirement: ["quarry", 2],
		effect: function (game) {
			game.food += 200;
			game.logMessage("event", "log.event.fish-monster");
		},
	}),
	new Upgrade({
		name: "upgrade.exploration-basics.title",
		description: "upgrade.exploration-basics.description",
		type: "research",
		cost: {
			wood: 50,
			stone: 50,
			food: 100,
		},
		duration: 10,
		once: true,
		requirement: ["academy", 1],
		effect: function (game) {
			game.wood += 1000;
			game.stone += 1000;
			game.logMessage("event", "log.event.exploration-basics");
		},
	}),
	new Upgrade({
		name: "upgrade.foreign-customs.title",
		description: "upgrade.foreign-customs.description",
		type: "research",
		cost: {
			food: 400,
		},
		duration: 15,
		once: true,
		requirement: ["academy", 2],
		effect: function (game) {
			game.wood += 1600;
			game.stone += 1600;
			game.food += 800;
			game.logMessage("event", "log.event.foreign-customs");
		},
	}),
];
