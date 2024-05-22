import axios, { Axios, AxiosResponse } from "axios";
import { login, channelsend } from "./lib/discordlib";
import { readFileSync, writeFileSync } from "fs";
import { log } from "console";
import { CacheType, Client, CommandInteractionOption } from "discord.js";
import { parse } from 'node-html-parser';
import { start } from "repl";
import { get } from "http";
import test, { run } from "node:test";
import { setInterval } from "timers";
import { send } from "process";
import { kMaxLength } from "buffer";
let dblist: getlist[] = []//すべてのdb
interface ReturnObj {
    sendmsg: (ID: string, text: string) => void;
}
interface ReturnObj3 {
    sendmsg: (ID: string, text: string) => void;
    Client: Client
}
interface returnobj2 {
    aleat: boolean,
    stringdata: string | null
}
interface getlist {
    url: string,
    name: string,
    channel: string[]
}
const discordtoken = JSON.parse(readFileSync("./config.json").toString())
// const list = [["信越線", "https://transit.yahoo.co.jp/diainfo/474/0"], ["山田線", "https://transit.yahoo.co.jp/diainfo/451/0"]]
if (discordtoken.token == null) {
    console.log("token が ないよ ！");
    process.exit();
}
function main() {
    let IsUpdateBuffer: string[] = [];
    interface slashtemp {
        name: string
        description: string
        type?: number,
        options?: any
    }
    interface returnobj {

        code: number,
        data: AxiosResponse | null

    }
    function initdiscord() {

        return new Promise<ReturnObj3>((resolve, reject) => {
            login(discordtoken.token)
                .then(async (Client) => {
                    await channelsend(Client, "1063886391500611624", "電車遅延通知botですどうも")
                    console.log("ログイン成功");
                    const returnobj = {
                        sendmsg: (ID: string, text: string) => {
                            channelsend(Client, ID, text)
                        },
                        Client: Client
                    }
                    resolve(returnobj)
                })
                .catch((error) => {
                    reject(error.toString());
                })
        })
    }
    /**
     * 返り血かけよ
     */
    class axioshander {
        static checkinternal2(url: string) {
            return new Promise<returnobj>((resolve, reject) => {
                axios.get(url)
                    // thenで成功した場合の処理
                    .then((elem) => {
                        // console.log("ステータスコード:", elem.data);
                        //  writeFileSync("./getdata.html", elem.data.toString());
                        if (String(elem.data).indexOf("class=\"trouble\"") !== -1) {
                            //トラブルの場合
                            const returnobj = {
                                code: 0,
                                data: elem
                            }
                            resolve(returnobj);
                        } else {
                            const returnobj = {
                                code: 1,
                                data: elem
                            }
                            resolve(returnobj);
                        }

                    })
                    // catchでエラー時の挙動を定義
                    .catch(err => {
                        if (err.statusCode === 404) {
                            //console.log("404");
                        } else {
                            //console.log("err:", err.code);
                        }
                        console.log("err");
                        const returnobj = {
                            code: -1,
                            data: null
                        }
                        resolve(returnobj)
                    });
            })
        }
        /**
         * 
         * @param url 
         * @returns aleat: bool, stringdata
         */
        static check(url: string) {
            return new Promise<returnobj2>((resolve) => {
                axioshander.checkinternal2(url)
                    .then((data) => {
                        switch (data.code) {
                            case -1:
                                console.log("取得エラー");
                                const returndata: returnobj2 = { aleat: true, stringdata: "yahooが裏切りやがった!!!!" }
                                resolve(returndata);
                                break;

                            case 0: {
                                console.log("トラブル");
                                function gettextcontents(data: returnobj) {
                                    const startpath = String(data.data?.data).indexOf("class=\"trouble\"");
                                    const endpath = String(data.data?.data).slice(startpath).indexOf("</p>");
                                    const raw1st = String(data.data?.data).slice(startpath).slice(0, endpath);
                                    const raw2st = raw1st.slice(raw1st.indexOf("<p>") + 3);
                                    return (raw2st);
                                }
                                const rawdata = gettextcontents(data)
                                const returndata: returnobj2 = { aleat: true, stringdata: rawdata }
                                resolve(returndata);
                                break;
                            }
                            case 1: {
                                console.log("正常");
                                const returndata: returnobj2 = { aleat: false, stringdata: null }
                                resolve(returndata);
                                break;
                            }


                        }
                    })
            })
        }
    }


    function scanentry(list: getlist[], sec: number, cli: ReturnObj) {

        setInterval(() => {
            const list: getlist[] = JSON.parse(readFileSync("./list.json").toString())//debug
            list.map((elem, index) => {
                const name = elem.name;
                const url = elem.url;
                axioshander.check(url)
                    .then(async (ass) => {//情報取得後
                        console.log(ass)
                        if (IsUpdateBuffer[index] === undefined) {//配列が存在していない場合
                            IsUpdateBuffer.push("nomal");
                            console.log("配列無いよ");
                        }
                        if (ass.stringdata !== null) {

                            if (IsUpdateBuffer[index] !== ass.stringdata) {
                                console.log("更新あるよ");//更新発生時
                                sendmsg(elem, cli, ass.stringdata, 0);
                                IsUpdateBuffer[index] = ass.stringdata;
                            } else {
                                console.log("更新はないよ");
                            }

                        } else {
                            //正常時
                            if (IsUpdateBuffer[index] !== "nomal") {
                                //この路線は正常化
                                console.log("正常化");
                                sendmsg(elem, cli, "", 1)
                                IsUpdateBuffer[index] = "nomal";
                            }
                        }
                    })

            })

        }, sec)

    }
    /**
     * 実際の送信担当
     * @param elem もろもろ
     * @param cli discordjsのクライアント
     * @
     * @param status ステータスコード 1は回復 0はそれ以外
     */
    function sendmsg(elem: getlist, cli: ReturnObj, text: string, status: number) {

        let latest = ""

        switch (status) {
            case 0:
                latest = "------\n:warning:**" + elem.name + " 遅延/運休 情報**:warning:\n"
                latest += "```" + text + "```\n\n"
                break;

            case 1:
                latest = "------\n🟢**" + elem.name + " 正常化情報**🟢\n"
                latest += "```" + "この路線は平常運転に戻りました。" + "```\n\n"
                break;
        }
        elem.channel.map(id => {
            cli.sendmsg(id, latest)
        })

    }
    async function setslash(data: slashtemp[], client: ReturnObj3, id: string[]) {
        id.map(async (elem) => {
            if (client.Client.application) {

                await client.Client.application.commands.set(data, elem);

            } else {
                console.log("頭おかしいんじゃないの?");
            }
        })
    }
    class dbhandler {
        static reload() {
            dblist = JSON.parse(readFileSync("./list.json").toString());
        }
        static update(reloaddata: getlist[]) {
            writeFileSync("./list.json", JSON.stringify(reloaddata))
            dbhandler.reload();
        }
        static addchannel(channelid: string, value: readonly CommandInteractionOption<CacheType>[]) {
            return new Promise<string>((resolve, reject) => {
                let list2 = dblist;
                const num = value[0].value//路線情報が増えた場合に拡張性がやばい
                if (typeof num === "number") {
                    list2[num].channel.map((elem) => {
                        if (elem === channelid) {
                            resolve("すでに存在してるじゃねぇか\n脳みそついてんのか？");
                        }
                    })
                    list2[num].channel.push(channelid);
                    //更新処理をする
                    this.update(list2);
                    resolve("追加できたぞアホ");
                } else {
                    resolve("型がnumじゃないよ");
                }
            })
        }
    }
    async function slashhandler(client: Client) {
        function getRandomNumber(min: number, max: number) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
        client.on("interactionCreate", async (interaction) => {
            if (!interaction.isCommand()) {
                return;
            }
            if (interaction.commandName === 'addchannel') {
                // console.log();
                // writeFileSync("./data.json", JSON.stringify(interaction));
                const returnstr = ["知るか", "ワイも忙しいんだわ", "自分でやれよ", "それすら自分で出来んのか？", "金払ってから言え^^", "脳みそ湧いてんじゃねぇの？"];
                // const returnstr = ["test"];
                ; const random = getRandomNumber(0, returnstr.length);
                console.log("ランダム:" + random + " その他:" + returnstr.length)
                if (random === returnstr.length) {
                    //当たり
                    const channelid = interaction.channelId;
                    const addvalue = interaction.options.data;
                    const reply = await dbhandler.addchannel(channelid, addvalue);
                    await interaction.reply(reply);
                } else {
                    await interaction.reply(returnstr[random]);
                }

            }
        });
    }
    initdiscord()
        .then(async (cli) => {
            //正常動作確定ルート
            const serverid = cli.Client.guilds.cache.map(g => g.id);
            // const list: getlist[] = JSON.parse(readFileSync("./testurl.json").toString())//debug
            dbhandler.reload();
            console.log(serverid);
            slashhandler(cli.Client);
            setslash([
                {
                    name: "addchannel",
                    description: "特定の路線の情報をこのチャンネルに流します",
                    options: [
                        {
                            choices: dblist.map((elem, index) => {
                                return ({ name: elem.name, value: index })
                            }),
                            name: "路線",
                            type: 4,
                            required: true,
                            description: "追加したい路線を選びなされ",
                        },
                    ],

                },
                {
                    name: "addway",
                    description: "あたらしい路線を登録します"
                }
            ], cli, serverid);

            scanentry([], 10000, cli)//応急処置

        })
        .catch((err: string) => {
            console.log(err);
        })
}
main();