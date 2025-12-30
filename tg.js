// --- Telegram Pro 跳转脚本 ---
// 1. 获取 Loon 插件传入的参数 (App名称)
let appName = "Telegram";
// 处理参数，去除可能的引号
if (typeof $argument !== "undefined" && $argument) {
    appName = $argument.replace(/"/g, "").trim();
}

// 2. 映射表：名字 -> 协议头
const schemes = {
    "Telegram": "tg://",
    "Swiftgram": "swiftgram://",
    "Turrit": "turrit://",
    "iMe": "imem://",
    "Nicegram": "nicegram://",
    "Liao": "liao://"
};

// 3. 确定目标协议 (找不到就默认 tg://)
let targetScheme = schemes[appName] || "tg://";
const url = $request.url;
let newPath = "";

// 4. 解析路径逻辑
if (url.indexOf("/joinchat/") !== -1) {
    let match = url.match(/\/joinchat\/([a-zA-Z0-9_-]+)/);
    if (match) newPath = `join?invite=${match[1]}`;
} else if (url.indexOf("/addstickers/") !== -1) {
    let match = url.match(/\/addstickers\/([a-zA-Z0-9_-]+)/);
    if (match) newPath = `addstickers?set=${match[1]}`;
} else {
    // 处理普通 t.me/xxx
    let cleanUrl = url.split("?")[0]; // 去掉参数干扰
    let pathParts = cleanUrl.split(/t\.me\//);
    if (pathParts.length > 1) {
        let path = pathParts[1];
        // 排除资源文件
        if (path && !path.startsWith("s/") && !path.endsWith(".jpg") && !path.endsWith(".ico")) {
            newPath = `resolve?domain=${path}`;
        }
    }
}

// 5. 拦截并返回 HTML (防止 302 跳转官方)
if (newPath) {
    const finalUrl = `${targetScheme}${newPath}`;
    
    // 生成跳转页
    const html = `<!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="0;url=${finalUrl}">
    <title>跳转中...</title>
    <style>body{background:#121212;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;}</style>
    </head>
    <body>
        <h2>正在唤起 ${appName} 🚀</h2>
        <p>如果未自动跳转，请点击下方按钮</p>
        <br>
        <a href="${finalUrl}" style="padding:12px 24px;background:#2481cc;color:#fff;text-decoration:none;border-radius:8px;">点击打开 ${appName}</a>
        <script>window.location.href = "${finalUrl}";</script>
    </body>
    </html>`;

    $done({
        response: {
            status: 200,
            headers: { "Content-Type": "text/html" },
            body: html
        }
    });
} else {
    $done({});
}
