
/* ----------------------------------为打开文档的标题下显示文档创建日期----------------------------------*/
// REF: https://github.com/UFDXD/HBuilderX-Light/blob/main/theme.js#L979
// REF: https://github.com/Achuan-2/siyuan-themes-tsundoku-stone/blob/main/theme.js#L315

/**获取所有打开文档的标题元素 */
function getAllDocumentTitleElement() {
    return document.querySelectorAll(".protyle-title__input");
}

/**
 * 向指定父级创建追加一个子元素，并可选添加ID,
 * @param {Element} fatherElement
 * @param {string} addElementTxt 要创建添加的元素标签
 * @param {string} setId
 * @returns addElementObject
 */
 function addinsertCreateElement(fatherElement, addElementTxt, setId = null) {
	if (!fatherElement) console.error("指定元素对象不存在！");
	if (!addElementTxt) console.error("未指定字符串！");

	var element = document.createElement(addElementTxt);

	if (setId) element.id = setId;

	fatherElement.appendChild(element);

	return element;
}

/**为文档标题元素下创建时间容器元素 */
function creatTimeSpanElement(tilteElement) {
    var item = tilteElement.children;
    
	for (let index = 0; index < item.length; index++) {
        const element = item[index];
        
		if (element.getAttribute("documentCreatTimeElement") != null) {
            return element;
		}
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

/**获得这个文档的创建时间 */
function getDocumentTime(tilteElement) {
    var tS =
    tilteElement.parentElement.previousElementSibling.getAttribute(
        "data-node-id"
		);
        
        if (tS == null) {
            return "日期获取中……";
        }
        var year = tS.substring(0, 4);
        var moon = tS.substring(4, 6);
        var day = tS.substring(6, 8);
        var hour = tS.substring(8, 10);
        var minute = tS.substring(10, 12);
        var second = tS.substring(12, 14);
        
        return year + "-" + moon + "-" + day + " " + hour + ":" + minute + ":" + second;
}
    
function DocumentCreationDate() {
    var allDocumentTitleElement = getAllDocumentTitleElement();
    
    for (let index = 0; index < allDocumentTitleElement.length; index++) {
        const element = allDocumentTitleElement[index];
        
        var documentCreatTimeElement = creatTimeSpanElement(element.parentElement);
        
        var spanTxt = documentCreatTimeElement.innerText;
        
        if (spanTxt == "" || spanTxt == "日期获取中……") {
            var documentCreatTimeTxt = getDocumentTime(element);
            documentCreatTimeElement.innerText = documentCreatTimeTxt;
        }
    }
}

function showDocumentCreationDate() {
    setInterval(DocumentCreationDate, 300); /**块级计数 */
}

setTimeout(() => {
    
    showDocumentCreationDate(); /**为打开文档标题下面显示文档创建日期 */
    
    console.log(
        "other-theme 已执行"
        );
}, 500);
        