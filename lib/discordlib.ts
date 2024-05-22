import { Client, GatewayIntentBits, Partials, TextChannel } from 'discord.js';

async function login(token: string): Promise<Client> {
    const DIclient = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.MessageContent,
        ],
        partials: [
            Partials.Message,
            Partials.Reaction,
        ],
    });

    return new Promise((resolve, reject) => {
        try {
            async function connectDiscord(token: string) {
                await DIclient.login(token);
            }
            DIclient.once('ready', () => {
                console.log(`${DIclient.user?.tag} Ready`);
                resolve(DIclient);
            });
            connectDiscord(token);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * チャンネルにメッセージを送信
 * @param {string} ID - チャンネルのID
 * @param {string} text - 送信するメッセージ
 */
async function channelsend(this2: Client, ID: string, text: string): Promise<void> {
    const channel = this2.channels.cache.get(ID) as TextChannel;
    if (channel) {
        await channel.send(text);
    } else {
        console.error(`Channel with ID ${ID} not found`);
    }
}

export {
    login,
    channelsend
};
