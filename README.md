1. There are several Javascript files are used to show documents:
	'jszip.min.js'
	'jszip-utils.min.js'
	'mediaelement-and-player.min.js'
	'main.js'
I used http://dean.edwards.name/packer/ service to pack Javascript into one file. To do it, just open each file, select all of it's content and copy it to 'Paste' field on provided site, appending contents of several files one-by-one. Then press the 'Pack' button and in second field, the 'Copy', you will see resulted minified Javascript. Select all of it and copy to a new file, then save this file. For example, name it 'packed.js'.

2. Now you are free to connect 'packed.js' to any HTML file in which you would to show documents. Just add this line at the end (!) of the <body> tag, just like this:

<html>
	<head>
	...
	</head>
	<body>
	...
	<script src="full/path/to/packed.js"></script>
	</body>
</html>

3. That's all you need to do to convert the divs to iframes with documents. You don't need to run any functions, all will be done automatically.

4. Now if you want to show a document, just place <div> tag with 'doc-src' attribute, just like this:

<div doc-src="./full/path/to/document.doc"></div>
or
<div doc-src="http://example.com/document.doc"></div>

5. Do not forget this to rules:

5.1 If you want to show local document (the one which is saved right on your website), add the './' to beginning of document path, just like this:

<div doc-src="./someFolder/anotherFolder/document.doc"></div>

5.2 If you want to show remote document (the one which is saved on some another website), add the protocol name to beginning of document path (one of 'http://' or 'https://'), just like this:

<div doc-src="http://example.com/document.doc"></div>
or
<div doc-src="https://anotherexample.com/document.doc"></div>

So, for example this divs WILL NOT BE SHOWN:

<div doc-src="docs/document.doc"></div>
there are no './' at the beginning of local path

<div doc-src="secondanotherexample.com/document.doc"></div>
there are no http:// at the beginning of remote path

6. Notice: divs, which is added AFTER <script> tag, will NOT BE SHOWN, that's why you must add the <script> tag at the end of <body> tag. Look for 'index.htm' in provided archive.