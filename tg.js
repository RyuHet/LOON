// 清洗参数：去掉可能存在的引号和空格
let appName = "Telegram";
if (typeof $argument !== "undefined" && $argument) {
    appName = $argument.replace(/"/g, "").trim();
}

const url = $request.url;

// 协议头映射 (注意大小写)
const schemes = {
    "Telegram": "tg://",
    "Swiftgram": "swiftgram://",
    "Turrit": "turrit://",
    "iMe": "imem://",
    "Nicegram": "nicegram://",
    "Liao": "liao://"
};

// 如果没匹配到，默认回滚到 tg://
let targetScheme = schemes[appName] || "tg://";
let newPath = "";

// --- 路径解析逻辑 ---
// 1. 进群
let joinMatch = url.match(/\/joinchat\/([a-zA-Z0-9_-]+)/);
if (joinMatch) {
    newPath = `join?invite=${joinMatch[1]}`;
} 
// 2. 贴纸
else if (url.match(/\/addstickers\//)) {
    let stickerMatch = url.match(/\/addstickers\/([a-zA-Z0-9_-]+)/);
    if (stickerMatch) newPath = `addstickers?set=${stickerMatch[1]}`;
}
// 3. 代理
else if (url.match(/\/proxy\?/)) {
    let proxyMatch = url.split("/proxy?")[1];
    if (proxyMatch) newPath = `proxy?${proxyMatch}`;
}
// 4. 普通频道/个人
else {
    let path = url.split(/t\.me\//)[1];
    if (path && !path.startsWith("s/") && !path.startsWith("share/")) {
        let cleanPath = path.split("?")[0];
        if (cleanPath) newPath = `resolve?domain=${cleanPath}`;
    }
}

// --- 生成跳转页面 ---
if (newPath) {
    const finalUrl = `${targetScheme}${newPath}`;
    
    const htmlBody = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="refresh" content="0;url=${finalUrl}">
        <title>正在唤起 ${appName}...</title>
        <style>
            body { background-color: #121212; color: #fff; font-family: -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .btn { background: #2481cc; color: #fff; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 20px; display: inline-block; }
            p { color: #888; font-size: 14px; }
        </style>
    </head>
    <body>
        <h2>正在前往 ${appName}</h2>
        <p>如果未自动跳转，请点击下方按钮</p>
        <a href="${finalUrl}" class="btn">点击打开 ${appName}</a>
        <script>
            // JS 暴力跳转
            window.location.href = "${finalUrl}";
            setTimeout(() => { window.location.href = "${finalUrl}"; }, 500);
            setTimeout(() => { window.location.href = "${finalUrl}"; }, 1500);
        </script>
    </body>
    </html>`;

    $done({
        response: {
            status: 200,
            headers: { "Content-Type": "text/html" },
            body: htmlBody
        }
    });
} else {
    $done({});
}
