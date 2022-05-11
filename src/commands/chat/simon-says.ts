import { SlashCommand } from "slashasaurus";
import SimonSaysPage from "../../pages/SimonSays";

export default new SlashCommand(
	{
		name: "simon",
		description: "Start a game of Simon.",
		options: [],
	},
	{
		run: (interaction) => {
			console.log("Starting a game of simon for " + interaction.user.tag);
			const page = new SimonSaysPage();
			page.sendAsReply(interaction, true);
		},
	}
);
