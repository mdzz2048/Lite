/****************************最近打开文档****************************************** */
//https://ld246.com/article/1662697317986 来自社区分享
function init() {
    // 日期-时间格式化
    Date.prototype.Format = function(fmt) {
        var o = {
            "M+": this.getMonth() + 1,
            //月份
            "d+": this.getDate(),
            //日
            "h+": this.getHours(),
            //小时
            "m+": this.getMinutes(),
            //分
            "s+": this.getSeconds(),
            //秒
            "q+": Math.floor((this.getMonth() + 3) / 3),
            //季度
            S: this.getMilliseconds(),
            //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        return fmt;
    }
    ;
    // 历史条目保存到该数组
    let historyArr = [];
    if (localStorage.getItem("historyArr")) {
        historyArr = JSON.parse(localStorage.getItem("historyArr"));
    }
    // 新打开页签后更新历史记录
    function update_history_tags(newTag) {
        if (!newTag)
            return;
        let tag = undefined;
        if (newTag.tagName === "DIV") {
            tag = newTag.querySelector("li[data-type='tab-header']");
        } else if (newTag.tagName === "LI") {
            tag = newTag;
        } else {
            return;
        }
        // 历史记录条目的默认图标
        let historyItemIcon = `<use xlink:href="#icon-1f4c4"></use>`;
        let docIcon = tag.querySelector(".item__icon > svg");
        // 如果设置了其他图标，就换成其他图标
        if (docIcon) {
            historyItemIcon = docIcon.innerHTML;
        }

        // 页签标题
        let nodeText = tag.querySelector("span.item__text").innerText;
        // 页签打开的时间
        let timeStamp = tag.getAttribute("data-activetime");
        timeStamp = new Date(parseInt(timeStamp)).Format("yyyy-MM-dd hh:mm:ss");
        let data_id = tag.getAttribute("data-id");
        setTimeout(()=>{
            let current_doc = document.querySelector(`div.fn__flex-1.protyle[data-id="${data_id}"] >div.protyle-content>div.protyle-background`);
            if (current_doc) {
                let doc_link = "siyuan://blocks/" + current_doc.getAttribute("data-node-id");
                let newTag = `${timeStamp}--${nodeText}--${doc_link}--${historyItemIcon}`;
                if (!historyArr.includes(newTag)) {
                    historyArr.push(newTag);
                }
                //只保留最近200条历史记录
                while (historyArr.length > 200) {
                    historyArr.shift();
                }
                localStorage.setItem("historyArr", JSON.stringify(historyArr));
            }
        }
        , 700);
    }

    // 标签页容器ul，观测其子元素的变动
    let tab_containers = document.querySelectorAll("div[data-type='wnd'] > div.fn__flex ul.fn__flex.layout-tab-bar.fn__flex-1");
    const config = {
        attributes: false,
        childList: true,
        subtree: false
    };

    // 新增标签页时，更新历史记录
    const tag_change = function(mutationsList, observer) {
        if (mutationsList[0].type === "childList" && mutationsList[0].addedNodes.length) {
            update_history_tags(mutationsList[0].addedNodes[0]);
        }
    };

    // 标签页容器发生变化——通常是出现分屏、关闭分屏 或者关闭了所有标签页的情况，此时需要更新观测的节点
    const tab_container_change = function(mutationsList, observer) {
        if (mutationsList[0].type === "childList") {
            update_history_tags(mutationsList[0].addedNodes[0]);
            updateNode();
        }
    };

    // 创建实例——观测页签的新增
    const tabs_observer = new MutationObserver(tag_change);
    // 创建实例——观测标签容器发生的变动
    const tabs_container_observer = new MutationObserver(tab_container_change);

    // 初始化
    for (let tab_container of tab_containers) {
        tabs_observer.observe(tab_container, config);
    }

    // 更新观测的节点
    function updateNode() {
        tabs_observer.disconnect();
        // 重新获取节点
        tab_containers = document.querySelectorAll("div[data-type='wnd'] > div.fn__flex ul.fn__flex.layout-tab-bar.fn__flex-1");
        // 对节点重新进行观测
        for (let tab_container of tab_containers) {
            tabs_observer.observe(tab_container, config);
        }
    }

    let parentNode = document.querySelector("div#layouts > div.fn__flex.fn__flex-1 >div.layout__center.fn__flex.fn__flex-1");
    tabs_container_observer.observe(parentNode, config);

    // 【设置】按钮的前面添加一个【历史记录】按钮
    var settingBtn = document.getElementById("barSetting");
    settingBtn.insertAdjacentHTML("beforebegin", '<div id="history"class="toolbar__item b3-tooltips b3-tooltips__se" aria-label="历史记录" ></div>');
    // 历史记录面板
    settingBtn.insertAdjacentHTML("afterend", `
        <div 
            id="myHistory" 
            style="position:fixed;
                z-index:1000;
                top:43%;
                left:18%;
                width:30vw;
                height:70vh;
                background-color: var(--b3-theme-background);
                box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px;
                border-radius: 5px; 
                visibility:hidden;
                transform: translate(-50%, -50%);
                overflow:auto;
                padding:10px 15px;"
        >
            <div style="position:sticky; top:0px; padding-top:10px; margin-bottom:20px; flex:auto" class="topBar">
                <input id="history_input" style="margin-left:5px; border:1px solid black; justify-content:space-between;" type="text" placeholder="搜索历史记录" size="30">
                <button id="showAllHistory" style="margin-left:5px; justify-content:space-between;">显示全部</button>
                <button id="clearHistory" style="margin-left:5px; justify-content:space-between;">清除历史</button>
            </div>
            <div id="historyContainer"></div>
        </div>
    `);

    let showAllHistoryBtn = document.getElementById("showAllHistory");
    let historyInputArea = document.getElementById("history_input");
    var historyDom = document.getElementById("history");
    historyDom.style.width = "auto";
    var historyIcon = '<svg id="_x30_1" style="enable-background:new 0 0 1024 1024;" version="1.1" viewBox="0 0 1024 1024" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M513 1024c131 0 262-50.4 361.6-151.2 199.2-199 199.2-524.6 0-723.5-199.2-199-525.3-199-724.5 0-96.9 96.7-150.1 226.1-150.1 362.4 0 137.6 53.2 265.7 150.1 362.4 100.9 99.5 231.9 149.9 362.9 149.9zM272.8 512.7v120.4h347v-400.1h-134.6v265.5h-212.4v14.2zM134.6 511.7c0-100.8 39.6-195.3 111.2-266.8 146.8-146.6 386.7-146.8 533.8-0.6 0.2 0.2 0.4 0.4 0.6 0.6 147 146.8 147 386.8 0 533.6s-387.4 146.8-534.4 0c-71.6-71.6-111.2-166-111.2-266.8z"></g></svg>';
    historyDom.innerHTML = historyIcon;
    let myHistory = document.getElementById("myHistory");

    // DOM——放置历史条目的容器
    let historyContainer = document.getElementById("historyContainer");

    // 打开某个历史文档
    function openHistoryDoc(e) {
        e.stopPropagation();
        if (e.target.tagName == "SPAN" && e.target.getAttribute("data-href")) {
            try {
                window.open(e.target.getAttribute("data-href"));
            } catch (err) {
                console.error(err);
            }
        }
    }

    // 点击某一条历史记录后——跳转到对应的文档
    myHistory.addEventListener("click", openHistoryDoc, false);

    let clearHistory = document.getElementById("clearHistory");
    // callback——清空历史
    function clearAllHistory(e) {
        e.stopPropagation();
        historyArr = [];
        localStorage.setItem("historyArr", JSON.stringify(historyArr));
        historyContainer.innerHTML = "";
        myHistory.style.visibility = "hidden";
    }
    clearHistory.addEventListener("click", clearAllHistory, false);

    // callback——显示最近打开过的文档
    function showAllHistoryItems(e) {
        e.stopPropagation();
        if (myHistory.style.visibility === "hidden") {
            myHistory.style.visibility = "visible";
        }
        if (localStorage.getItem("historyArr") && JSON.parse(localStorage.getItem("historyArr")).length > 0) {
            historyArr = JSON.parse(localStorage.getItem("historyArr"));
            const fragment = document.createDocumentFragment();
            historyContainer.innerHTML = "";
            // 时间最新的记录显示在上方
            let tempArr = [...historyArr];
            tempArr.reverse();
            tempArr.forEach((value)=>{
                let[item_time,item_text,href,history_item_icon] = value.split("--");
                item_text = item_text.replace(/</g, "&lt;");
                item_text = item_text.replace(/>/g, "&gt;");
                const elem_div = document.createElement("div");
                elem_div.className = "historyItem";
                elem_div.style.marginTop = "10px";
                elem_div.innerHTML = `<span class="historyTimeStamp" style="color: black;margin-right: 2em;">${item_time}</span>
        <span><svg class="history-icon" style="height:16px;width:16px;vertical-align: middle;">${history_item_icon}</svg></span>
        <span style="color:#3481c5;margin-left:5px;cursor: pointer;" data-href="${href}" title="${href}">${item_text}</span>`;
                fragment.appendChild(elem_div);
            }
            );
            historyContainer.appendChild(fragment);
        }
    }

    // 简要处理一下防抖
    function debounce(func, wait=500) {
        let timer = null;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(()=>{
                func.apply(this, args);
            }
            , wait);
        }
        ;
    }

    // 处理提交的关键词
    function historyKeySubmit(e) {
        if (historyInputArea.value.trim()) {
            let keyword = historyInputArea.value.trim();
            if (localStorage.getItem("historyArr") && JSON.parse(localStorage.getItem("historyArr")).length > 0) {
                historyArr = JSON.parse(localStorage.getItem("historyArr"));
                const fragment = document.createDocumentFragment();
                historyContainer.innerHTML = "";
                let tempArr = [...historyArr];
                tempArr.reverse();
                tempArr = tempArr.filter((item)=>item.includes(keyword));
                tempArr.forEach((value)=>{
                    let[item_time,item_text,href,history_item_icon] = value.split("--");
                    const regExp = new RegExp(`${keyword}`,"g");
                    item_text = item_text.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(regExp, function(value) {
                        return `<span style="background-color:#ffe955;color:black;">${value}</span>`;
                    });
                    item_time = item_time.replace(regExp, function(value) {
                        return `<span style="background-color:#ffe955;color:black;">${value}</span>`;
                    });
                    const elem_div = document.createElement("div");
                    elem_div.className = "historyItem";
                    elem_div.style.marginTop = "10px";
                    elem_div.innerHTML = `<span class="historyTimeStamp" style="color: black;margin-right: 2em;">${item_time}</span>
          <span><svg class="history-icon" style="height:16px;width:16px;vertical-align: middle;">${history_item_icon}</svg></span>
          <span style="color:#3481c5;margin-left:5px;cursor: pointer;" data-href="${href}" title="${href}">${item_text}</span>`;
                    fragment.appendChild(elem_div);
                }
                );
                historyContainer.appendChild(fragment);
            }
        } else {
            showAllHistoryItems(e);
        }
    }
    // 顶栏【历史记录】图标
    historyDom.addEventListener("click", showAllHistoryItems, false);
    // 按钮——显示全部
    showAllHistoryBtn.addEventListener("click", showAllHistoryItems, false);
    // 输入框——搜索历史记录
    historyInputArea.addEventListener("input", debounce(historyKeySubmit), false);

    // 隐藏历史面板
    function hideHistoryPanel() {
        if (myHistory.style.visibility === "visible") {
            myHistory.style.visibility = "hidden";
        }
    }
    // 点击其他区域时，隐藏历史面板
    window.addEventListener("click", hideHistoryPanel, false);
}

setTimeout(()=>{

    /* 生成历史面板 */
    init();

    console.log("history-edit-doc 已执行");
}
, 500);
