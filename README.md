# &lt;qr-reader&gt;

Webcomponent wrapper to read QR codes.

> Maintained by [Your Name](https://github.com/yourname).

## Demo

> [Check it live](http://educastellano.github.io/qr-reader).

## Usage

1. Import Web Components' polyfill:

	```html
	<script src="//cdnjs.cloudflare.com/ajax/libs/polymer/0.0.20130711/polymer.min.js"></script>
	```

2. Import Custom Element:

	```html
	<link rel="import" href="src/qr-reader.html">
	```

3. Start using it!

	```html
	<qr-reader></qr-reader>
	```

## Options

Attribute     | Options                | Default             | Description
---           | ---                    | ---                 | ---
`interval`    | *int*                  | `1000`              | Interval of time in each capture (in ms).
`output`      | *string*               | `undefined`         | Optional. CSS selectors to get the tag element where the QR code will be written.
`outputAttr`  | *string*          	   | `textContent`       | Optional. Attribute of the output element where the value will be set.


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

* v0.0.2 September 18, 2013
	* First working version of the component.
* v0.0.1 September 16, 2013
	* Started project using [boilerplate-element](https://github.com/customelements/boilerplate-element)

## License

[MIT License](http://opensource.org/licenses/MIT)