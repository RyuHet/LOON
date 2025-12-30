const appName = $argument || "Turrit";
const url = $request.url;
let scheme = "turrit";

const mapping = {
    "Turrit": "turrit",
    "Swiftgram": "swiftgram",
    "iMe": "imem",
    "Nicegram": "nicegram",
    "Telegram": "tg"
};

if (mapping[appName]) {
    scheme = mapping[appName];
}

let action = "";
let value = "";

if (url.includes("/joinchat/")) {
    action = "join";
    value = `invite=${url.split("/joinchat/")[1]}`;
} else if (url.includes("/addstickers/")) {
    action = "addstickers";
    value = `set=${url.split("/addstickers/")[1]}`;
} else if (url.includes("/proxy?")) {
    action = "proxy";
    value = url.split("/proxy?")[1];
} else {
    const match = url.match(/t\.me\/(.+)/);
    if (match && !match[1].startsWith("s/") && !match[1].endsWith(".ico")) {
        action = "resolve";
        value = `domain=${match[1]}`;
    }
}

if (action) {
    $done({
        response: {
            status: 307,
            headers: { Location: `${scheme}://${action}?${value}` }
        }
    });
} else {
    $done({});
}
