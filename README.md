# &lt;qr-reader&gt; Web Component

A QR Code Reader Web Component. A custom event makes it easy to get notified about new reads.

This repository was forked from https://github.com/educastellano/qr-reader.
It is using [jsqrcode](https://github.com/LazarSoft/jsqrcode) lib.


## Usage

As simple as that:

	```html
	<link rel="import" href="qr-reader.html">

	<qr-reader output></qr-reader>

	<script>
    	var qrReader = document.querySelector('qr-reader');

    	qrReader.addEventListener("qr-code-read", function(e) {
    		alert(e.detail);
    	});
    </script>
	```

## License

[MIT License](http://opensource.org/licenses/MIT)