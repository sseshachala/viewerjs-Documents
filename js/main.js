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

	viewHandlers.other = (el, src) => {
		var docSource = src;
		if (src[0] === '.') docSource = hostname + src.substring(2);
		var docIframe = document.createElement('iframe');
		docIframe.style.width = "100%";
		docIframe.style.height = "100%";
		docIframe.style.position = "relative";
		docIframe.src = 'http://docs.google.com/viewer?url=' + docSource + '&embedded=true';
		el.appendChild(docIframe);
	};

	viewHandlers.video = (el, src) => {
		var docSource = src;
		setTimeout(() => {
			var videoEl = document.createElement('video');
			videoEl.style.width = "100%";
			videoEl.style.height = "100%";
			videoEl.style.position = "relative";
			videoEl.controls = true;
			videoEl.src = docSource;
			videoEl.id = Math.round(Math.random * 10000).toString();
			try {
				var coverSource = el.getAttribute('cover-src');
				if (coverSource) videoEl.poster = coverSource;
			} catch (e) { console.log('no cover specified'); }

			el.appendChild(videoEl);
			var player = new MediaElementPlayer(videoEl.id, {
				features: [ 'playpause', 'progress', 'current', 'duration', 'volume', 'fullscreen' ],
				pauseOtherPlayers: true,
				enableKeyboard: true
			});
			el.appendChild(videoEl);
		}, 1000);		
	};

	//	Aliases for various video types
	viewHandlers.webm = viewHandlers.video;
	viewHandlers.mp4 = viewHandlers.video;
	viewHandlers.m4v = viewHandlers.video;
	viewHandlers.m4a = viewHandlers.video;
	viewHandlers.ogg = viewHandlers.video;
	viewHandlers.ogv = viewHandlers.video;
	viewHandlers.oga = viewHandlers.video;

	viewHandlers.zip = (el, src) => {
		var docSource = src;
		var loadButtonEl = document.createElement('a');
		loadButtonEl.href = '';
		loadButtonEl.innerHTML = 'Load ZIP from ' + docSource;
		loadButtonEl.onclick = (ev) => {
			loadButtonEl.innerHTML = '';
			ev.preventDefault();
			JSZipUtils.getBinaryContent(docSource, (err, data) => { if (err) { loadButtonEl.innerHTML = err; return false; };
				var zip = new JSZip();
				zip.loadAsync(data).then((loadedZip) => {
					var fileList = docSource + ' contents:<br><br>';
					loadedZip.forEach((relativePath, file) => {
						fileList += relativePath + '<br>';
					});
					var fileListEl = document.createElement('p');
					fileListEl.innerHTML = fileList;
					el.appendChild(fileListEl);
				}).catch((e) => { if (e) { loadButtonEl.innerHTML = err; return false; }; });
			});
			return false;
		};
		el.appendChild(loadButtonEl);
	};

	var docElements = document.querySelectorAll('div[doc-src]');
	for (var i = 0; i < docElements.length; i++) {
		var docSource = docElements[i].getAttribute('doc-src');
		var extension = docSource.split('.');
		extension = extension[extension.length - 1];
		if (viewHandlers[extension]) viewHandlers[extension](docElements[i], docSource);
		else viewHandlers.other(docElements[i], docSource);
	};
})();