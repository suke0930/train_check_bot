"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.channelsend = exports.login = void 0;
const discord_js_1 = require("discord.js");
function login(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const DIclient = new discord_js_1.Client({
            intents: [
                discord_js_1.GatewayIntentBits.Guilds,
                discord_js_1.GatewayIntentBits.GuildMembers,
                discord_js_1.GatewayIntentBits.GuildEmojisAndStickers,
                discord_js_1.GatewayIntentBits.GuildMessages,
                discord_js_1.GatewayIntentBits.GuildMessageReactions,
                discord_js_1.GatewayIntentBits.MessageContent,
            ],
            partials: [
                discord_js_1.Partials.Message,
                discord_js_1.Partials.Reaction,
            ],
        });
        return new Promise((resolve, reject) => {
            try {
                function connectDiscord(token) {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield DIclient.login(token);
                    });
                }
                DIclient.once('ready', () => {
                    var _a;
                    console.log(`${(_a = DIclient.user) === null || _a === void 0 ? void 0 : _a.tag} Ready`);
                    resolve(DIclient);
                });
                connectDiscord(token);
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.login = login;
/**
 * チャンネルにメッセージを送信
 * @param {string} ID - チャンネルのID
 * @param {string} text - 送信するメッセージ
 */
function channelsend(this2, ID, text) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = this2.channels.cache.get(ID);
        if (channel) {
            yield channel.send(text);
        }
        else {
            console.error(`Channel with ID ${ID} not found`);
        }
    });
}
exports.channelsend = channelsend;
