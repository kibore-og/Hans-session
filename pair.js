const zlib = require('zlib'); // For compression
const PastebinAPI = require('pastebin-js'),
pastebin = new PastebinAPI('QwAWl9_B_9DlMXv0sZPWKUUQxYr-maij');
const { makeid } = require('./id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const {
    default: Ibrahim_Adams,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require("maher-zubair-baileys");

// List of retained audio URLs
const audioUrls = [
    "https://files.catbox.moe/8fvjby.mp3",
    "https://files.catbox.moe/8fvjby.mp3",
    "https://files.catbox.moe/r4thnz.mp3",
    "https://files.catbox.moe/r4thnz.mp3",
    "https://files.catbox.moe/3mjyhh.mp3",
    "https://files.catbox.moe/3mjyhh.mp3",
    "https://files.catbox.moe/3mjyhh.mp3",
    "https://files.catbox.moe/3mjyhh.mp3",
    "https://files.catbox.moe/3mjyhh.mp3",
    "https://files.catbox.moe/3mjyhh.mp3",
    "https://files.catbox.moe/8fvjby.mp3",
    "https://files.catbox.moe/r4thnz.mp3",
    "https://files.catbox.moe/3mjyhh.mp3",
    "https://files.catbox.moe/3mjyhh.mp3",
    "https://files.catbox.moe/3mjyhh.mp3",
    "https://files.catbox.moe/r4thnz.mp3"
];

// List of random thumbnail URLs
const thumbnailUrls = [
    "https://files.catbox.moe/aktbgo.jpg",
    "https://files.catbox.moe/aktbgo.jpg",
    "https://files.catbox.moe/aktbgo.jpg",
    "https://files.catbox.moe/aktbgo.jpg",
    "https://files.catbox.moe/aktbgo.jpg",
    "https://files.catbox.moe/aktbgo.jpg",
    "https://files.catbox.moe/aktbgo.jpg",
    "https://files.catbox.moe/aktbgo.jpg",
    "https://files.catbox.moe/aktbgo.jpg",
    "https://files.catbox.moe/aktbgo.jpg",
    "https://files.catbox.moe/aktbgo.jpg",
    "https://files.catbox.moe/aktbgo.jpg",
    "https://files.catbox.moe/aktbgo.jpg"
];

// Function to get a random audio URL
function getRandomAudioUrl() {
    return audioUrls[Math.floor(Math.random() * audioUrls.length)];
}

// Function to get a random thumbnail URL
function getRandomThumbnailUrl() {
    return thumbnailUrls[Math.floor(Math.random() * thumbnailUrls.length)];
}

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function BWM_XMD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        try {
            let Pair_Code_By_Ibrahim_Adams = Ibrahim_Adams({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                browser: ["Chrome (Linux)", "", ""]
            });

            if (!Pair_Code_By_Ibrahim_Adams.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await Pair_Code_By_Ibrahim_Adams.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            Pair_Code_By_Ibrahim_Adams.ev.on('creds.update', saveCreds);
            Pair_Code_By_Ibrahim_Adams.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection === "open") {
                    await delay(5000);
                    let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                    await delay(800);

                    // Compress and encode session data
                    let compressedData = zlib.gzipSync(data); // Compress
                    let b64data = compressedData.toString('base64'); // Base64 encode

                    // Send session data first
                    await Pair_Code_By_Ibrahim_Adams.sendMessage(Pair_Code_By_Ibrahim_Adams.user.id, {
                        text: 'RAHMANI-MD;;;' + b64data
                    });

                    // Send the random audio URL as a voice note
                    const randomAudioUrl = getRandomAudioUrl();
                    const randomThumbnailUrl = getRandomThumbnailUrl(); // Get a random thumbnail

                    await Pair_Code_By_Ibrahim_Adams.sendMessage(Pair_Code_By_Ibrahim_Adams.user.id, { 
                        audio: { url: randomAudioUrl },
                        mimetype: 'audio/mp4',
                        ptt: true,
                        waveform: [100, 0, 100, 0, 100, 0, 100],
                        fileName: 'shizo',
                        contextInfo: {
                            mentionedJid: [Pair_Code_By_Ibrahim_Adams.user.id],
                            externalAdReply: {
                                title: 'Thanks for choosing Rahman Md Deploy Your Bot Now 🚀',
                                body: 'Regards HansTz',
                                thumbnailUrl: randomThumbnailUrl, // Now using a random thumbnail
                                sourceUrl: 'https://whatsapp.com/channel/0029VatokI45EjxufALmY32X',
                                mediaType: 1,
                                renderLargerThumbnail: true,
                            },
                        },
                    });

                    await delay(100);
                    await Pair_Code_By_Ibrahim_Adams.ws.close();
                    return await removeFile('./temp/' + id);
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    BWM_XMD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("service restarted");
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: "Service is Currently Unavailable" });
            }
        }
    }

    return await BWM_XMD_PAIR_CODE();
});

module.exports = router;
