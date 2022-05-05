import { ButtonInteraction } from "discord.js";
import {
	Page,
	PageActionRow,
	createInteractable,
	PageInteractableButton,
	DeserializeStateFn,
} from "slashasaurus";
import { setTimeout } from "timers/promises";

function randomIntFromInterval(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

enum SimonSaysGameStates {
	WaitingForPlayer,
	ShowingPattern,
	Lost,
}

interface SimonSaysState {
	gameState: SimonSaysGameStates;
	pattern: number[];
	currentPatternIndex: number;
	showIndex: boolean;
}

export default class SimonSays extends Page<{}, SimonSaysState> {
	static pageId = "simon-says";

	constructor() {
		super({});
		const initial = [randomIntFromInterval(0, 3)];
		this.state = {
			gameState: SimonSaysGameStates.ShowingPattern,
			currentPatternIndex: 0,
			pattern: initial,
			showIndex: false,
		};
	}

	createButtonHandler(index: number) {
		return async (i: ButtonInteraction) => {
			if (this.state.gameState !== SimonSaysGameStates.WaitingForPlayer) {
				i.reply({ content: "You can't press buttons now", ephemeral: true });
				return;
			}
			const { pattern, currentPatternIndex } = this.state;
			if (pattern[currentPatternIndex] !== index) {
				// Lost
				this.setState({ gameState: SimonSaysGameStates.Lost });
			} else {
				if (currentPatternIndex === pattern.length - 1) {
					// Finished, next round
					await this.setState({
						gameState: SimonSaysGameStates.ShowingPattern,
						currentPatternIndex: 0,
						pattern: [...pattern, randomIntFromInterval(0, 3)],
					});
					await setTimeout(500);
					setImmediate(() => this.showNext());
				} else {
					this.setState({ currentPatternIndex: currentPatternIndex + 1 });
				}
			}
		};
	}

	private async showNext() {
		await this.setState({ showIndex: true });
		await setTimeout(500);
		await this.setState({
			showIndex: false,
			currentPatternIndex: this.state.currentPatternIndex + 1,
		});
		await setTimeout(500);
		if (this.state.currentPatternIndex === this.state.pattern.length) {
			await this.setState({
				gameState: SimonSaysGameStates.WaitingForPlayer,
				currentPatternIndex: 0,
			});
		} else {
			setImmediate(() => this.showNext());
		}
	}

	pageDidSend() {
		this.showNext();
	}

	serializeState() {
		return JSON.stringify(this.state);
	}

	render() {
		const { gameState, pattern, showIndex, currentPatternIndex } = this.state;
		let content = "";
		switch (gameState) {
			case SimonSaysGameStates.WaitingForPlayer:
				content = "Repeat the pattern";
				break;
			case SimonSaysGameStates.ShowingPattern:
				content = `Watch the pattern`;
				break;
			case SimonSaysGameStates.Lost:
				content = `You lost, you finished ${pattern.length - 1} rounds`;
				break;
		}
		return {
			content: content,
			components: (
				<>
					<PageActionRow>
						<PageInteractableButton
							disabled={gameState !== SimonSaysGameStates.WaitingForPlayer}
							handler={this.createButtonHandler(0)}
							style={
								pattern[currentPatternIndex] === 0 && showIndex
									? "PRIMARY"
									: "SECONDARY"
							}
							emoji="🔴"
						/>
						<PageInteractableButton
							disabled={gameState !== SimonSaysGameStates.WaitingForPlayer}
							handler={this.createButtonHandler(1)}
							style={
								pattern[currentPatternIndex] === 1 && showIndex
									? "PRIMARY"
									: "SECONDARY"
							}
							emoji="🟢"
						/>
					</PageActionRow>
					<PageActionRow>
						<PageInteractableButton
							disabled={gameState !== SimonSaysGameStates.WaitingForPlayer}
							handler={this.createButtonHandler(2)}
							style={
								pattern[currentPatternIndex] === 2 && showIndex
									? "PRIMARY"
									: "SECONDARY"
							}
							emoji="🔵"
						/>
						<PageInteractableButton
							disabled={gameState !== SimonSaysGameStates.WaitingForPlayer}
							handler={this.createButtonHandler(3)}
							style={
								pattern[currentPatternIndex] === 3 && showIndex
									? "PRIMARY"
									: "SECONDARY"
							}
							emoji="🟡"
						/>
					</PageActionRow>
				</>
			),
		};
	}
}

export const deserializeState: DeserializeStateFn = (stateString) => {
	const state = JSON.parse(stateString);
	return {
		props: {},
		state,
	};
};
