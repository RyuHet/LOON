// --- Telegram 302 强力重定向版 ---
// 专治安装了官方客户端后无法跳转的问题

let appName = "Turrit"; // 默认值
if (typeof $argument !== "undefined" && $argument) {
    appName = $argument.replace(/"/g, "").trim();
}

// 1. 强制使用第三方独有的协议头
// 只要不用 tg://，官方 App 就抢不走！
const schemes = {
    "Telegram": "tg://", // 只有选 Telegram 时才用通用协议
    "Turrit": "turrit://",
    "Swiftgram": "swiftgram://",
    "iMe": "imem://",
    "Nicegram": "nicegram://",
    "Liao": "liao://"
};

let targetScheme = schemes[appName] || "turrit://";
const url = $request.url;
let newPath = "";

// 2. 解析链接
// 无论链接带什么参数，我们只取核心部分
if (url.indexOf("/joinchat/") !== -1) {
    let match = url.match(/\/joinchat\/([a-zA-Z0-9_-]+)/);
    if (match) newPath = `join?invite=${match[1]}`;
} else if (url.indexOf("/addstickers/") !== -1) {
    let match = url.match(/\/addstickers\/([a-zA-Z0-9_-]+)/);
    if (match) newPath = `addstickers?set=${match[1]}`;
} else {
    // 处理 t.me/xxx
    let cleanUrl = url.split("?")[0];
    let pathParts = cleanUrl.split(/t\.me\//);
    if (pathParts.length > 1) {
        let path = pathParts[1];
        if (path && !path.startsWith("s/") && !path.endsWith(".jpg") && !path.endsWith(".ico")) {
            newPath = `resolve?domain=${path}`;
        }
    }
}

// 3. 核心：返回 302 重定向，而不是 HTML
if (newPath) {
    const finalUrl = `${targetScheme}${newPath}`;
    console.log(`🚀 正在将 ${url} 重定向到 ${finalUrl}`);
    
    $done({
        response: {
            status: 302, // 302 状态码：浏览器会立即执行跳转，不给官方 App 反应时间
            headers: { "Location": finalUrl }
        }
    });
} else {
    $done({});
}
