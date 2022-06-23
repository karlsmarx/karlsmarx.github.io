let JSONData;
const observersBlogData = [];

const setArticles = (data) => {
	const postsSection = document.getElementById("blog-posts");

	const articleElements = [];
	for (let item of data.items) {
		const articleDOMElement = constructDOMPost(item);
		articleElements.push(articleDOMElement);
	}

	postsSection.childNodes[1].replaceWith(...articleElements);
};

const htmlParser = new DOMParser();

function createMetadataElement(author, pubDate) {
	const authorElement = document.createElement("p");
	authorElement.innerText = author;

	const dateElement = document.createElement("p");
	dateElement.innerText = `Publicado em ${new Date(pubDate).toLocaleDateString("pt-br")}`;

	const metadataElement = document.createElement("div");
	metadataElement.classList.add("metadata");

	metadataElement.append(authorElement, dateElement);

	return metadataElement;
}

function createMetadataEndElement(categories) {
	const metadataEndElement = document.createElement("div");
	metadataEndElement.classList.add("metadata-end");

	const textElement = document.createElement("p");
	textElement.innerText = categories.join(", ");

	metadataEndElement.append(textElement);

	return metadataEndElement;
}

function constructDOMPost(data) {
	const titleElement = document.createElement("p");
	titleElement.classList.add("title");
	titleElement.innerText = data.title;
	
	const metadataElement = createMetadataElement(data.author, data.pubDate);
	const metadataEndElement = createMetadataEndElement(data.categories);

	const dividerElement = document.createElement("hr");

	const articleElement = document.createElement("article");
	articleElement.classList.add("blog-post");

	const content = htmlParser
		.parseFromString(data.content, 'text/html')
		.body;

	// Remove advise
	content.removeChild(content.lastElementChild);

	content.childNodes.forEach((child) => {
		if (child.nodeName == "A") {
			const iframeElement = document.createElement("iframe");

			iframeElement.id = child.href;
			iframeElement.classList.add("iframe-gist");

			iframeElement.setAttribute(
				"onload",
				`injectJS("${iframeElement.id}", "${iframeElement.id}")`
			);

			child.replaceWith(iframeElement);
		}
	});

	articleElement.append(
		titleElement,
		metadataElement,
		dividerElement,
		...content.childNodes,
		metadataEndElement,
	);

	return articleElement;
}

function injectJS(iframeID, src) {
	const iframeData = document.getElementById(iframeID);
	const iframeDocument = (iframeData.contentWindow || iframeData.contentDocument);

	const embedScript = document.createElement('script');
	embedScript.type = 'text/javascript';
	embedScript.async = true;
	embedScript.src = src;

	const iframeInsideBody = iframeDocument.document.getElementsByTagName("body")[0];       
	postscribe(iframeInsideBody, embedScript.outerHTML, {
		afterAsync: () => {
			// Remove margin of body
			iframeInsideBody.style.margin = 0;

			// Set height
			iframeData.setAttribute("height", iframeInsideBody.scrollHeight + 'px');
		},
	});
}

const xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = () => {
	if (xhttp.readyState == 4) {
		try {
			// TODO iterate and add dom status, if error set to "unable to load"
			const data = JSON.parse(xhttp.responseText);
			JSONData = data;

			setArticles(JSONData);
		} catch (err) {
			console.log(err);
		}
	}
}

xhttp.open("GET", "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@iho", true);
xhttp.send();

const setLoadFail = () => {
	const postsSection = document.getElementById("blog-posts");

	postsSection
		.childNodes[1]
		.childNodes[1].childNodes[1].innerText = "Houve uma falhar ao carregar.";
}

setTimeout(() => {
	if (!JSONData) xhttp.abort();
	setLoadFail();
}, 5000);