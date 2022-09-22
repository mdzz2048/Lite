
/* ----------------------------------为打开文档的标题下显示文档创建日期----------------------------------*/
// REF: https://github.com/UFDXD/HBuilderX-Light/blob/main/theme.js#L979

function showDocumentCreationDate() {

    setInterval(DocumentCreationDate, 300); /* 块级计数 */
}

function DocumentCreationDate() {

    var openDoc = document.querySelectorAll(".layout-tab-container>.fn__flex-1.protyle:not(.fn__none):not([CreatTimeOK])");
    var allDocumentTitleElement = [];
    for (let index = 0; index < openDoc.length; index++) {
        const element = openDoc[index];
        element.setAttribute("CreatTimeOK", true);
        allDocumentTitleElement.push(element.children[1].children[1].children[1]);
    }

    for (let index = 0; index < allDocumentTitleElement.length; index++) {
        const element = allDocumentTitleElement[index];
        var documentCreatTimeElement = creatTimeSpanElement(element.parentElement);
        documentCreatTimeElement.innerText = "获取文档创建日期中……";
        tilteWhlie(element, documentCreatTimeElement);
    }
}

function tilteWhlie(element, documentCreatTimeElement) {
    var setID = setInterval(() => {
        var time = getDocumentTime(element);
        if (time != "") {
            documentCreatTimeElement.innerText = time;
            clearInterval(setID);
        };
    }, 3000);
}

/* 获取所有打开文档的标题元素 */
function getAllDocumentTitleElement() {
    var openDoc = document.querySelectorAll(".layout-tab-container>.fn__flex-1.protyle:not(.fn__none)");
    var arr = [];
    for (let index = 0; index < openDoc.length; index++) {
        const element = openDoc[index];
        arr.push(element.children[1].children[1].children[1]);
    }
    return arr;
}

/* 为文档标题元素下创建时间容器元素 */
function creatTimeSpanElement(tilteElement) {
    var item = tilteElement.children;
    for (let index = 0; index < item.length; index++) {
        const element = item[index];
        if (element.getAttribute("documentCreatTimeElement") != null) return element;
    }
    var documentCreatTimeElement = addinsertCreateElement(tilteElement, "span");
    documentCreatTimeElement.setAttribute("documentCreatTimeElement", "true");
    documentCreatTimeElement.style.display = "block";
    documentCreatTimeElement.style.marginLeft = "7px";
    documentCreatTimeElement.style.marginBottom = "0px";
    documentCreatTimeElement.style.fontSize = "61%";
    documentCreatTimeElement.style.color = "#767676";
    return documentCreatTimeElement;
}


/* 获得这个文档的创建时间 */
function getDocumentTime(tilteElement) {
    try {
        var tS = tilteElement.parentElement.parentElement.previousElementSibling.firstElementChild.firstElementChild.getAttribute("data-node-id");
        if (tS == null) return "";
        var year = tS.substring(0, 4);
        var moon = tS.substring(4, 6);
        var day = tS.substring(6, 8);
        var hour = tS.substring(8, 10);
        var minute = tS.substring(10, 12);
        var second = tS.substring(12, 14);
        return year + "-" + moon + "-" + day + "  " + hour + ":" + minute + ":" + second;
    } catch (error) {
        return "";
    }
}

