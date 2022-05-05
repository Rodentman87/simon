import "dotenv/config";
import { Intents } from "discord.js";
import path from "path";
import { SlashasaurusClient } from "slashasaurus";

const pageStorage: Record<
	string,
	{ pageId: string; state: string; messageData: string }
> = {};

const client = new SlashasaurusClient(
	{
		intents: [Intents.FLAGS.GUILDS],
		restRequestTimeout: 30 * 1000,
	},
	{
		devServerId: "561807594516381749",
		pageTtl: 5000,
		storePageState: async (
			messageId: string,
			pageId: string,
			state: string,
			messageData: string
		) => {
			pageStorage[messageId] = { pageId, state, messageData };
		},
		getPageState: async (messageId: string) => {
			return {
				...pageStorage[messageId],
				stateString: pageStorage[messageId]?.state,
			};
		},
	}
);

client.once("ready", () => {
	console.log(`Client ready and logged in as ${client.user?.tag}`);

	client.registerCommandsFrom(
		path.join(__dirname, "commands"),
		process.env.NODE_ENV === "development" ? "dev" : "global"
	);
});

client.registerPagesFrom(path.join(__dirname, "/pages"));

client.login(process.env.TOKEN);
