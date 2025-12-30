/* Telegram Universal Redirect
   Powered by Roger
   
*/

const targetApp = $argument || "Turrit";
const requestUrl = $request.url;

// 1. 独立的协议匹配函数 (写法完全不同)
function getCustomScheme(appName) {
    // 使用 Switch 结构，看起来更像正经编程
    switch (appName) {
        case "Swiftgram": return "swiftgram";
        case "iMe":       return "imem";
        case "Nicegram":  return "nicegram";
        case "Telegram":  return "tg"; // 官方兜底
        default:          return "turrit"; // 默认只跳 Turrit
    }
}

// 2. 提取关键路径 (抛弃正则，使用切割法)
function getPath(url) {
    if (url.includes("t.me/")) {
        return url.split("t.me/")[1];
    }
    return null;
}

// --- 执行逻辑 ---
const path = getPath(requestUrl);

if (path) {
    const scheme = getCustomScheme(targetApp);
    // 构造万能链接 (App 都能识别这种格式)
    const finalUrl = `${scheme}://resolve?domain=${path}`;

    // 使用 307 状态码 (效果最好)
    $done({
        response: {
            status: 307,
            headers: { "Location": finalUrl }
        }
    });
} else {
    $done({});
}
