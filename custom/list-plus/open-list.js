/* ------------------------折叠列表自动打开查看------------------------*/
// REF: https://github.com/UFDXD/HBuilderX-Light/blob/main/theme.js#L1063-L1319

/**
 * 递归DOM元素查找深度子级的第一个符合条件的元素-同层全部筛选一遍在依次深度搜索。
 * @param {*} element 要查找DOM元素
 * @param {*} judgeFun 查找函数 : fun(v) return true or false
 * @param {*} xianz 限制递归最大次数
 * @returns element
 */
 function diguiTooONE_2(element, judgeFun, xianz = 999) {

    if (element == null || element.firstElementChild == null) return null;
    if (judgeFun == null) return null;
    var i = xianz <= 0 ? 10 : xianz;
    return digui(element);

    function digui(elem) {

        if (i <= 0) return null;
        xianz--;

        var child = elem.children;
        var newchild = [];
        for (let index = 0; index < child.length; index++) {
            const element2 = child[index];
            if (judgeFun(element2)) {
                return element2;
            } else {
                if (newchild.firstElementChild != null) newchild.push(element2);
            }
        }

        for (let index = 0; index < newchild.length; index++) {
            const element2 = newchild[index];
            var item = digui(element2);
            if (item == null) continue;
            return item;
        }
        return null;
    }
}

/**------------------------自动展开悬浮窗折叠列表, 展开搜索条目折叠列表, 聚焦单独列表------------------------*/

function autoOpenList() {

    setInterval(() => {
        //找到所有的悬浮窗
        var Preview = document.querySelectorAll("[data-oid]");

        //如果发现悬浮窗内首行是折叠列表就展开并打上标记
        if (Preview.length != 0) {
            for (let index = 0; index < Preview.length; index++) {

                diguiTooONE_2(Preview[index], (v) => {
                    if (v.classList.contains("block__content")) {

                        var vs = v.children;

                        for (let index = 0; index < vs.length; index++) {
                            var obj = vs[index].children[1]
                            if (obj == null) continue;
                            const element = obj.firstElementChild.firstElementChild;
                            if (element == null) continue;
                            if (element.className != "li") continue;//判断是否是列表
                            if (element.getAttribute("foldTag") != null) continue;//判断是否存在标记
                            if (element.getAttribute("foid") == 0) continue;//判断是折叠

                            element.setAttribute("fold", 0);
                            element.setAttribute("foldTag", true);
                        }

                        return true;
                    }
                    return false;
                }, 7)
            }
        }

        var searchPreview = document.querySelector("#searchPreview [data-doc-type='NodeListItem'].protyle-wysiwyg.protyle-wysiwyg--attr>div:nth-child(1)");
        if (searchPreview != null && searchPreview.getAttribute("data-type") == "NodeListItem" && searchPreview.getAttribute("fold") == 1) {
            if (searchPreview.getAttribute("foldTag") != null) return;//判断是否存在标记
            searchPreview.setAttribute("fold", 0);
            searchPreview.setAttribute("foldTag", true);
        }

        var contentLIst = document.querySelectorAll(".layout-tab-container>.fn__flex-1.protyle:not(.fn__none) [data-doc-type='NodeListItem'].protyle-wysiwyg.protyle-wysiwyg--attr>div:nth-child(1)");
        for (let index = 0; index < contentLIst.length; index++) {
            const element = contentLIst[index];
            if (element != null && element.getAttribute("data-type") == "NodeListItem" && element.getAttribute("fold") == 1) {
                if (element.getAttribute("foldTag") != null) return;//判断是否存在标记
                element.setAttribute("fold", 0);
                element.setAttribute("foldTag", true);
            }
        }

    }, 500)
}

setTimeout(() => {
    
    autoOpenList();//自动展开悬浮窗内折叠列表（第一次折叠）

    console.log(
        "open-list 已执行"
        );
}, 500);