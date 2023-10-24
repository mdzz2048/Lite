/* ------------------------ 初始设置 ------------------------ */

window.theme = {};

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
    return res ? res : null;
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

/* ------------------------ 列表子弹线 ------------------------ */

/**
 * 获得焦点所在的块
 * @return {HTMLElement} 光标所在块
 * @return {null} 光标不在块内
 */
function getFocusedBlock() {
    let block = document.getSelection()?.focusNode?.parentElement; // 当前光标
    while (block != null && block.dataset.nodeId == null) block = block.parentElement;
    return block;
}

/**
 * 给焦点块父级元素设置属性
 * @param {HTMLElement} block 
 */
function setFocusAttr(block) {
    while (block != null && !block.classList.contains('protyle-wysiwyg')) {
        block.setAttribute('has-block-focus', 'true');
        block = block.parentElement;
    }
}

function focusHandler() {
    // 获取当前光标所在块
    let block = getFocusedBlock();

    // 重设父级元素属性
    // document.querySelectorAll('[has-block-focus]').forEach(element => element.removeAttribute('has-block-focus'));
    // setFocusAttr(block?.parentElement);
    
    // 已设置焦点
    if (block?.hasAttribute('block-focus')) return;

    // 未设置焦点
    document.querySelectorAll('[block-focus]').forEach((element) => element.removeAttribute('block-focus'));
    block.setAttribute('block-focus', 'true');
}

function bulletMain() {
    // 跟踪当前所在块
    window.addEventListener('mouseup', focusHandler, true);
    window.addEventListener('keyup', focusHandler, true);
}

/* ------------------------ 主题设置菜单 ------------------------ */

let CONFIG = {};
const DEFAULT_CONFIG = {
    showMarkDefault: false,
    useCardStyle: false,
    useZenMode: false,
}
const MENU_OPTIONS = [
    {
        id: 'showMarkDefault',
        icon: `<svg class="b3-menu__icon"><use xlink:href="#iconMark"></use></svg>`,
        label: "标记样式",
        accelerator: "",
        href: '/appearance/themes/Lite/custom/mark-display.css',
        load: true,
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
        accelerator: "",
        href: '/appearance/themes/Lite/custom/flashcard.css',
        load: true,
        click: (event) => {
            clickCommonMenu('useCardStyle', '/appearance/themes/Lite/custom/flashcard.css');
            updateCommonMenu(event);
        },
        mouseover: (event) => {
            showToolTip(event);
        },
        tooltip: type => type ? "点击禁用" : "点击启用",
    },
    {
        id: 'verticalTabBar',
        icon: `<svg class="b3-menu__icon"><use xlink:href="#iconSort"></use></svg>`,
        label: "垂直页签",
        accelerator: "",
        href: '/appearance/themes/Lite/custom/tab-bar-vertical.css',
        load: true,
        click: (event) => {
            clickCommonMenu('verticalTabBar', '/appearance/themes/Lite/custom/tab-bar-vertical.css');
            updateCommonMenu(event);
        },
        mouseover: (event) => {
            showToolTip(event);
        },
        tooltip: type => type ? "关闭垂直页签" : "打开垂直页签",
    },
    {
        id: 'listBullet',
        icon: `<svg class="b3-menu__icon"><use xlink:href="#iconList"></use></svg>`,
        label: "列表子弹线",
        accelerator: "",
        href: '/appearance/themes/Lite/custom/list-bullet.css',
        load: true,
        click: (event) => {
            clickCommonMenu('listBullet', '/appearance/themes/Lite/custom/list-bullet.css');
            updateCommonMenu(event);
        },
        mouseover: (event) => {
            showToolTip(event);
        },
        tooltip: type => type ? "关闭列表子弹线" : "打开列表子弹线",
    },
    {
        id: 'useZenMode',
        icon: `<svg class="b3-menu__icon"><use xlink:href="#iconDock"></use></svg>`,
        label: "Zen 模式",
        accelerator: "Alt+Z",
        href: '/appearance/themes/Lite/custom/zen-mode.css',
        load: false,
        click: (event) => {
            setZenModeStyle(CONFIG["useZenMode"]);
            clickCommonMenu('useZenMode', '/appearance/themes/Lite/custom/zen-mode.css');
            updateCommonMenu();     // 不传入事件，销毁菜单
        },
        mouseover: (event) => {
            showToolTip(event);
        },
        tooltip: type => type ? "退出 Zen 模式" : "进入 Zen 模式",
    },
]

/**
 * 添加主题按钮
 */
function addThemeButton() {
    const vip = document.getElementById('toolbarVIP');
    const themeButton = document.createElement('div');
    themeButton.id = "themeToolbar";
    themeButton.setAttribute("aria-label", "主题设置");
    themeButton.className = "toolbar__item ariaLabel";
    themeButton.innerHTML = `<svg><use xlink:href="#iconTheme"></use></svg>`;
    themeButton.addEventListener('click', addCommonMenu);
    vip.insertAdjacentElement("afterend", themeButton);
    MENU_OPTIONS.forEach(option => {
        const id = option.id;
        const load = option.load;
        if (CONFIG[id] && load) { window.theme.loadLink(option.href, id) }
        if (!load) { CONFIG[id] = false }
    })
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
    CONFIG[id] = !CONFIG[id];
    window.theme.updateStyle(id, CONFIG[id] ? href: "");
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

        const menuAccelerator = document.createElement('span');
        menuAccelerator.className = 'b3-menu__accelerator';
        menuAccelerator.innerHTML = option.accelerator;

        element.appendChild(menuLabel);
        element.appendChild(menuAccelerator);
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

const setZenModeStyle = (type) => {
    const protyle = document.querySelector("#layouts .protyle:not(.fn__none) > .protyle-content");
    const protyles = document.querySelectorAll("#layouts .protyle > .protyle-content");
    const isFullWidth = protyle.getAttribute("data-fullwidth");
    const configFullWidth = window.theme.fullWidth;
    if (isFullWidth && !type) {
        protyles.forEach(protyle => {
            const protyleTitle = protyle.querySelector(".protyle-title");
            const protyleWysiwyg = protyle.querySelector(".protyle-wysiwyg");
            protyleTitle.setAttribute("style", "margin: 16px 323px 0px;");
            protyleWysiwyg.setAttribute("style", "padding: 16px 323px 221.5px;");
            protyle.removeAttribute("data-fullwidth");
        })
        // 这里只是为了方便切换页签的时候确保边距正确，不会改变思源实际配置
        window.siyuan.config.editor.fullWidth = false;
    }
    if (configFullWidth && type) {
        protyles.forEach(protyle => {
            const protyleTitle = protyle.querySelector(".protyle-title");
            const protyleWysiwyg = protyle.querySelector(".protyle-wysiwyg");
            protyleTitle.setAttribute("style", "margin: 16px 96px 0px;");
            protyleWysiwyg.setAttribute("style", "padding: 16px 96px 221.5px;");
            protyle.setAttribute("data-fullwidth", "true");
        })
        window.siyuan.config.editor.fullWidth = true;
    }
}

/**
 * 添加快捷键监听事件
 * @param {KeyboardEvent} event 
 */
const keyboardEventListener = (event) => {
    if (event.altKey && event.key === "z") {
        const useZenMode = MENU_OPTIONS.find(option => option.id === "useZenMode");
        useZenMode.click();
        // 如果安装了打字机插件，则默认开启打字机模式
        window.siyuan.ws.app.plugins.forEach(plugin => {
            if (plugin.name === "typewriter") {
                const enable = plugin.data["global-config"].typewriter.enable;
                const config = window.theme.typewriter;
                if (!enable) {  // 关闭，则开启
                    plugin.data["global-config"].typewriter.enable = !enable;
                    plugin.toggleEnableState();
                }
                if (enable && !config) {    // 开启，且原配置是关着的
                    plugin.data["global-config"].typewriter.enable = !enable;
                    plugin.toggleEnableState();
                }
            }
        })
    }
}

const cacheConfig = () => {
    window.theme.fullWidth = window.siyuan.config.editor.fullWidth;
    window.siyuan.ws.app.plugins.forEach(plugin => {
        if (plugin.name === "typewriter") {
            window.theme.typewriter = plugin.data["global-config"].typewriter.enable;
        }
    })
}

/* ------------------------加载主题功能------------------------ */

getThemeConfig()
    .then(data => {
        CONFIG = data ? data : DEFAULT_CONFIG;
        cacheConfig();
        addThemeButton();
        document.addEventListener("keydown", keyboardEventListener);
        bulletMain();
    });

/* ------------------------测试用例------------------------ */
