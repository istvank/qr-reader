# &lt;qr-reader&gt; Web Component

A QR Code Reader Web Component. A custom event makes it easy to get notified about new reads.

This repository was forked from https://github.com/educastellano/qr-reader.
It is using the [jsqrcode](https://github.com/LazarSoft/jsqrcode) lib.

Feel free to send me any issues or pull requests!


## Demo
Check the [component page](https://istvank.github.io/qr-reader/) for more information.


## Compatibility
This is a highly experimental piece of software. To the best of my knowledge the QR reader only works on recent Chrome
browsers (Desktop and Mobile on Android) and was tested with Chrome >= 48.0.


## Usage

As simple as that:

```html
<link rel="import" href="qr-reader.html">

<qr-reader autostart></qr-reader>

<script>
	var qrReader = document.querySelector('qr-reader');

	qrReader.addEventListener("qr-code-read", function(e) {
		alert(e.detail);
	});
</script>
```

Instead of defining the `autostart` attribute feel free to call `qrReader.startScan()` whenever your application is
ready to scan.


## License

[MIT License](http://opensource.org/licenses/MIT)
