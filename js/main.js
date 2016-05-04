var getNiceHostname = () => {
	var href = window.location.href;
	var parts = href.split('//');
	var protocol = parts[0] + '//';
	var hostname = parts[1].split('/')[protocol === 'file://' ? 1 : 0];
	var nice = protocol + hostname;
	return nice;
};

(() => {
	var hostname = getNiceHostname();

	var viewHandlers = {};

	//	handler for Open Document Format files
	viewHandlers.odf = (el, src) => {
		var docSource = src;
		if (src[0] === '.') docSource = hostname + src.substring(2);
		var docIframe = document.createElement('iframe');
		docIframe.style.width = "100%";
		docIframe.style.height = "100%";
		docIframe.style.position = "relative";
		docIframe.src = 'https://view.officeapps.live.com/op/view.aspx?src=' + docSource;
		el.appendChild(docIframe);
	};

	//	Aliases for various ODF doc types
	viewHandlers.odt = viewHandlers.odf;
	viewHandlers.ods = viewHandlers.odf;
	viewHandlers.odp = viewHandlers.odf;
	viewHandlers.odg = viewHandlers.odf;
	viewHandlers.odf = viewHandlers.odf;
	viewHandlers.tods = viewHandlers.odf;
	viewHandlers.todp = viewHandlers.odf;
	viewHandlers.todt = viewHandlers.odf;
	viewHandlers.todg = viewHandlers.odf;

	//	handler for images
	viewHandlers.image = (el, src) => {
		var imgEl = document.createElement('img');
		imgEl.style.width = "100%";
		imgEl.style.height = "100%";
		imgEl.style.position = "relative";
		imgEl.src = src;
		el.appendChild(imgEl);
	};

	//	Aliases for various images types
	viewHandlers.jpg = viewHandlers.image;
	viewHandlers.jpeg = viewHandlers.image;
	viewHandlers.png = viewHandlers.image;
	viewHandlers.gif = viewHandlers.image;
	viewHandlers.tiff = viewHandlers.image;

	//	handler for all other types (like doc, docx etc)
	viewHandlers.google = (el, src) => {
		var docSource = src;
		if (src[0] === '.') docSource = hostname + src.substring(2);
		var docIframe = document.createElement('iframe');
		docIframe.style.width = "100%";
		docIframe.style.height = "100%";
		docIframe.style.position = "relative";
		docIframe.src = 'http://docs.google.com/viewer?url=' + docSource + '&embedded=true';
		el.appendChild(docIframe);
	};

	var docElements = document.querySelectorAll('div[doc-src]');
	for (var i = 0; i < docElements.length; i++) {
		var docSource = docElements[i].getAttribute('doc-src');
		var extension = docSource.split('.');
		extension = extension[extension.length - 1];
		if (viewHandlers[extension]) viewHandlers[extension](docElements[i], docSource);
		else viewHandlers['google'](docElements[i], docSource);
	};
})();