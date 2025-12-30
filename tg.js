// 1. 获取 Loon 插件设置的参数
let appName = "Turrit"; // 默认值
if (typeof $argument !== "undefined" && $argument) {
    appName = $argument.replace(/"/g, "").trim();
}

// 2. 协议头映射 (核心修改：使用 App 独有协议，避开 tg://)
const schemes = {
    "Telegram": "tg://",         // 只有选官方时才用这个
    "Turrit": "turrit://",       // Turrit 专用
    "Swiftgram": "swiftgram://", // Swiftgram 专用
    "iMe": "imem://",            // iMe 专用
    "Nicegram": "nicegram://",   // Nicegram 专用
    "Liao": "liao://"            // Liao 专用
};

let targetScheme = schemes[appName] || "turrit://";
const url = $request.url;
let newPath = "";

// 3. 解析路径
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
        // 排除资源文件
        if (path && !path.startsWith("s/") && !path.endsWith(".jpg") && !path.endsWith(".ico")) {
            newPath = `resolve?domain=${path}`;
        }
    }
}

// 4. 执行 302 重定向
if (newPath) {
    const finalUrl = `${targetScheme}${newPath}`;
    console.log(`[TG跳转] 目标: ${finalUrl}`);
    
    $done({
        response: {
            status: 302,
            headers: { "Location": finalUrl }
        }
    });
} else {
    $done({});
}
