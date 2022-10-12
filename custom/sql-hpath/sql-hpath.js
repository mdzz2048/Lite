/* REF: https://ld246.com/article/1665129901544 */

/* todo:
1. 单击图标两次恢复原嵌入块样式
2. 使用 Dark+ 的 js 模块，去重 API 
*/

function request(url, data, method = "POST") {
	return new Promise((resolve, reject) => {
		if (method.toUpperCase() == "POST") {
			fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
				.then(handleResponse)
				.then((data) => resolve(data))
				.then((error) => reject(error));
		} else {
			fetch(url)
				.then(handleResponse)
				.then((data) => resolve(data))
				.then((error) => reject(error));
		}
	});

	function handleResponse(response) {
		let contentType = response.headers.get("content-type");
		if (contentType.includes("application/json")) {
			return handleJSONResponse(response);
		} else if (contentType.includes("text/html")) {
			return handleTextResponse(response);
		} else {
			throw new Error(`Sorry, content-type ${contentType} not supported`);
		}
	}

	function handleJSONResponse(response) {
		return response.json().then((json) => {
			if (response.ok) {
				return json;
			} else {
				return Promise.reject(
					Object.assign({}, json, {
						status: response.status,
						statusText: response.statusText,
					})
				);
			}
		});
	}
	function handleTextResponse(response) {
		return response.text().then((text) => {
			if (response.ok) {
				return text;
			} else {
				return Promise.reject({
					status: response.status,
					statusText: response.statusText,
					err: text,
				});
			}
		});
	}
}

function getHPathByPath(data) {
	return request("/api/filetree/getHPathByID", data);
}

function addRenderNoteRoute() {
	const box = {};
	// 将 class css 加入 theme.css
	const sqlClass = "sql-hpath-render";
	const list = document.querySelectorAll(
		".render-node .protyle-wysiwyg__embed"
	);

	list.forEach((e) => {
		const id = e.dataset.id;
		const content = e.parentNode.dataset.content;

		if (box[content] === undefined) {
			box[content] = {};
		}

		const count = Object.keys(box[content]).length;
		box[content][id] = count + 1;
	});

	list.forEach((e) => {
		const id = e.dataset.id;
		const content = e.parentNode.dataset.content;
		if (!e.firstChild.className.includes(sqlClass)) {
			getHPathByPath({
				id,
			}).then((res) => {
				const showIndex = box[content][id];
				const showHpath = "📄" + res.data.slice(1);
				const p = document.createElement("p");
				p.innerHTML = `<span data-index=${showIndex}>#${showIndex}</span><span>${showHpath}</span>`;
				p.className = sqlClass;
				e.prepend(p);
			});
		}
	});
}

function initDOM() {
	const rightDom = document.querySelector("#dockRight > div:nth-child(1)");

	const domList = [
		{
			label: "展示 SQL 嵌入块的 hpath",
			// 建议下载到主题本地，然后修改路径
			// 改为 /appearance/themes/themeName/xxx.png
			href: "/appearance/themes/Lite/icon/sql.png",
			bindAction: addRenderNoteRoute,
		},
	];

	domList.forEach((item) => {
		const span = document.createElement("span");
		span.ariaLabel = item.label;
		if (item.id) {
			span.id = item.id;
		}
		span.className =
			"dock__item b3-tooltips b3-tooltips__w sy-theme-add-right-bar";
		span.innerHTML = `<img src="${item.href}">`;
		span.addEventListener("click", item.bindAction);
		rightDom.appendChild(span);
	});
}

setTimeout(() => {
	initDOM();
}, 300);