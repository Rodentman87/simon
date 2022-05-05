import { SlashCommand } from "slashasaurus";
import SimonSaysPage from "../../pages/SimonSays";

export default new SlashCommand(
	{
		name: "simon-says",
		description: "Start a game of Simon Says.",
		options: [],
	},
	{
		run: (interaction) => {
			console.log("Starting a game of simon says for " + interaction.user.tag);
			const page = new SimonSaysPage();
			page.sendAsReply(interaction, true);
		},
	}
);
