/* ------------------------ 初始设置 ------------------------ */

window.theme = {};

/**
 * 静态资源请求 URL 添加参数
 * @params {string} url 资源请求 URL
 * @return {string} 返回添加参数后的 URL
 */
window.theme.addURLParam = function (
    url,
    param = {
        // t: Date.now().toString(),
        v: window.siyuan.config.appearance.themeVer,
    },
) {
    let new_url;
    switch (true) {
        case url.startsWith('//'):
            new_url = new URL(`https:${url}`);
            break;
        case url.startsWith('http://'):
        case url.startsWith('https://'):
            new_url = new URL(url);
            break;
        case url.startsWith('/'):
            new_url = new URL(url, window.location.origin);
            break;
        default:
            new_url = new URL(url, window.location.origin + window.location.pathname);
            break;
    }
    for (let [key, value] of Object.entries(param)) {
        new_url.searchParams.set(key, value);
    }
    switch (true) {
        case url.startsWith('//'):
            return new_url.href.substring(new_url.protocol.length);
        case url.startsWith('http://'):
        case url.startsWith('https://'):
            return new_url.href;
        case url.startsWith('/'):
            return new_url.href.substring(new_url.origin.length);
        default:
            return new_url.href.substring((window.location.origin + window.location.pathname).length);
    }
}

/**
 * 加载 meta 标签
 * @params {object} attributes 属性键值对
 */
window.theme.loadMeta = function (attributes) {
    let meta = document.createElement('meta');
    for (let [key, value] of Object.entries(attributes)) {
        meta.setAttribute(key, value);
    }
    document.head.insertBefore(meta, document.head.firstChild);
}

/**
 * 加载样式文件引用
 * @params {string} href 样式地址
 * @params {string} id 样式 ID
 * @params {string} position 节点插入位置
 * @params {HTMLElementNode} element 节点插入锚点
 */
window.theme.loadLink = function (
    href,
    id = null,
    position = "afterend",
    element = document.getElementById('themeStyle'),
) {
    let link = document.createElement('link');
    if (id) link.id = id;
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = href;
    // document.head.appendChild(link);
    element.insertAdjacentElement(position, link);
}

/**
 * 更新样式文件
 * @params {string} id 样式文件 ID
 * @params {string} href 样式文件地址
 */
window.theme.updateStyle = function (id, href) {
    let style = document.getElementById(id);
    if (style) {
        style.setAttribute('href', href);
    } else {
        window.theme.loadLink(href, id);
    }
}

/**
 * 获取主题配置文件，json 格式
 * @returns {object} 主题配置文件
 */
async function getThemeConfig() {
    const config = await getFile('/data/snippets/Lite.config.json');
    return config;
}

/**
 * 更新主题配置文件，传入配置文件的 object
 * @param {object} data 
 */
function updateThemeConfig(data) {
    putFile('/data/snippets/Lite.config.json', JSON.stringify(data));
}

async function getFile(path) {
    const url = '/api/file/getFile';
    const body = { path: path };
    const res = await request(url, JSON.stringify(body));
    return res?.code === 0 ? res.data : null;
}

async function putFile(path, data, isDir = false) {
    const url = '/api/file/putFile';
    const body = new FormData();
    body.append('path', path);
    body.append('file', new Blob([data]));
    body.append('isDir', isDir);
    body.append('modTime', Date.now());
    await request(url, body);
}

async function request(url, body) {
    const response = await fetch(url, {
        body: body,
        method: 'POST'
    })
    if (!response.ok) {
        return null;
    }
    try {
        const result = await response.json();
        return result;
    } catch(SyntaxError) {
        console.log(SyntaxError);
        return null;
    }
}

/* ------------------------ 主题设置菜单 ------------------------ */

let CONFIG = {};
const DEFAULT_CONFIG = {
    showMarkDefault: false,
    useCardStyle: false
}
getThemeConfig().then(data => CONFIG = data ? data : DEFAULT_CONFIG);
const MENU_OPTIONS = [
    {
        id: 'showMarkDefault',
        icon: `<svg class="b3-menu__icon"><use xlink:href="#iconMark"></use></svg>`,
        label: "标记样式",
        click: (event) => {
            clickCommonMenu('showMarkDefault', '/appearance/themes/Lite/custom/mark-display.css');
            updateCommonMenu(event);
        },
        mouseover: (event) => {
            showToolTip(event);
        },
        tooltip: type => type ? "点击隐藏标记文本" : "点击显示标记文本",
    },
    {
        id: 'useCardStyle',
        icon: `<svg class="b3-menu__icon"><use xlink:href="#iconRiffCard"></use></svg>`,
        label: "闪卡样式",
        click: (event) => {
            clickCommonMenu('useCardStyle', '/appearance/themes/Lite/custom/flashcard.css');
            updateCommonMenu(event);
        },
        mouseover: (event) => {
            showToolTip(event);
        },
        tooltip: type => type ? "点击禁用" : "点击启用",
    },
]

/**
 * 添加主题按钮
 */
function addThemeButton() {
    const vip = document.getElementById('toolbarVIP');
    const toolbar = vip.parentElement;
    const themeButton = document.createElement('div');
    themeButton.id = "themeToolbar";
    themeButton.setAttribute("aria-label", "主题设置");
    themeButton.className = "toolbar__item ariaLabel";
    themeButton.innerHTML = `<svg><use xlink:href="#iconTheme"></use></svg>`;
    themeButton.addEventListener('click', addCommonMenu);
    toolbar.insertBefore(themeButton, vip);
}

/**
 * 添加主题菜单
 * @param {Event} event 
 */
function addCommonMenu(event) {
    const menu = document.getElementById('commonMenu');
    const name = menu.getAttribute('data-name');
    if (name === 'siyuanThemeLite') {   // 重复点击图标，则关闭菜单
        menu.lastElementChild.innerHTML = '';
        return
    }
    const menuItems = getMenuItems();
    menu.setAttribute('data-name', 'siyuanThemeLite');
    menu.lastElementChild.innerHTML = '';   // 清空菜单
    menu.lastElementChild.append(...menuItems);
    popupMenu();
    if (event) event.stopPropagation();    // 阻止事件传播，不然菜单会被 remove
}

/**
 * 更新主题菜单
 * @param {Event} event 点击事件
 */
function updateCommonMenu(event) {
    const menu = document.getElementById('commonMenu');
    const menuItems = getMenuItems();
    // todo: 重复点击会重复清空菜单，会触发强制回流，可能存在性能问题
    menu.lastElementChild.innerHTML = '';   // 清空菜单
    menu.lastElementChild.append(...menuItems);
    if (event) event.stopPropagation();    // 阻止事件传播，不然菜单会被 remove
}

/**
 * 显示 ToolTip 作为主题菜单的提示内容
 * @param {MouseEvent} event 
 */
function showToolTip(event) {
    const text = event.target.innerText;
    const rect = event.target.getBoundingClientRect();
    MENU_OPTIONS.forEach(option => { 
        const label = option.label;
        const tooltip = option.tooltip(CONFIG[option.id]);
        if (label === text) {
            removeTooltip();
            addToolTip(tooltip, rect);
        }
    })
    event.stopPropagation();
}

/**
 * 点击菜单后，更新引用和配置文件
 * @param {string} id 样式的 ID，对应 config 文件的键
 * @param {string} href 样式路径，根目录为工作空间
 */
function clickCommonMenu(id, href) {
    // todo: 这里的判断逻辑还需要改进
    if (CONFIG[id]) {
        window.theme.updateStyle(id, '');
    } else {
        window.theme.loadLink(href, id);
    }
    CONFIG[id] = !CONFIG[id];
    updateThemeConfig(CONFIG);
}

/**
 * 根据 MENU_OPTIONS 生成主题菜单项列表
 * @returns {HTMLElement[]} 生成主题菜单项列表
 */
function getMenuItems() {
    const menuItems = [];
    for (const option of MENU_OPTIONS) {
        const element = document.createElement('button');
        element.className = 'b3-menu__item';
        element.innerHTML = option.icon;
        element.setAttribute('data-use', CONFIG[option.id] ? '1' : '0');
        
        const menuLabel = document.createElement('span');
        menuLabel.className = 'b3-menu__label';
        menuLabel.innerHTML = option.label;

        element.appendChild(menuLabel);
        element.addEventListener('click', option.click);
        element.addEventListener('mouseover', option.mouseover);
        element.addEventListener('mouseout', removeTooltip);
        menuItems.push(element);
    }
    return menuItems;
}

/**
 * 弹出主题菜单
 * @returns void
 */
function popupMenu() {
    const themeMenu = document.getElementById('commonMenu');
    const themeButton = document.getElementById('themeToolbar');
    if (!themeButton) { return }
    const rect = themeButton.getBoundingClientRect();
    themeMenu.style.zIndex = (++window.siyuan.zIndex).toString();
    themeMenu.classList.remove('fn__none');
    setPosition(themeMenu, rect.x - (rect.isLeft ? window.siyuan.menus.menu.element.clientWidth : 0), rect.y, rect.h, rect.w)
}


const addToolTip = (text, rect) => {
    const tooltip = document.createElement('div');
    tooltip.id = 'tooltip';
    tooltip.className = 'tooltip';
    tooltip.innerText = text;
    document.body.appendChild(tooltip);
    setPosition(tooltip, rect.left, rect.bottom, rect.h, rect.w);
}

const removeTooltip = () => {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

/**
 * 设置元素位置
 * REF: https://github.com/siyuan-note/siyuan/blob/master/app/src/util/setPosition.ts#L3
 * @param {Element} element 
 * @param {number} x 
 * @param {number} y 
 * @param {number} targetHeight 
 * @param {number} targetLeft 
*/
const setPosition = (element, x, y, targetHeight = 0, targetLeft = 0) => {
    element.style.top = y + "px";
    element.style.left = x + "px";
    const rect = element.getBoundingClientRect();
    const toolbarHight = isMobile() ? 0 : 32;
    // 上下超出屏幕
    if (rect.bottom > window.innerHeight || rect.top < toolbarHight) {
        const top = y - rect.height - targetHeight;
        if (top > toolbarHight && (top + rect.height) < window.innerHeight) {
            // 上部
            element.style.top = top + "px";
        } else if (top <= toolbarHight) {
            // 位置超越到屏幕上方外时，需移动到屏幕顶部。eg：光标在第一个块，然后滚动到上方看不见的位置，按 ctrl+a
            element.style.top = toolbarHight + "px";
        } else {
            // 依旧展现在下部，只是位置上移
            element.style.top = Math.max(toolbarHight, window.innerHeight - rect.height) + "px";
        }
    }
    if (rect.right > window.innerWidth) {
        // 展现在左侧
        element.style.left = `${window.innerWidth - rect.width - targetLeft}px`;
    } else if (rect.left < 0) {
        // 依旧展现在左侧，只是位置右移
        element.style.left = "0";
    }
}

const isMobile = () => {
    return document.getElementById("sidebar") ? true : false;
};

/* ------------------------加载主题功能------------------------ */
import(window.theme.addURLParam("/appearance/themes/Lite/custom/bullet/main.js"));

addThemeButton();

/* ------------------------测试用例------------------------ */
