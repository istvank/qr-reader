'use strict';

(function(definition) {
	if (typeof define === 'function' && define.amd) {
		define(['QRReader'], definition);
	} else if (typeof module === 'object' && module.exports) {
		//var QRCode = require('qrjs');
		//module.exports = definition(QRCode);
	} else {
		definition(window.QRReader);
	}
})(function(QRReader) {

	var interval_id,
		stream_obj,
		onRead;

//
// Prototype
//
	var proto = Object.create(HTMLElement.prototype, {
		//
		// Attributes
		//
		attrs: {
			value: {
				output: '',
				outputAttr: 'textContent',
				onRead: '',
				interval: 1000
			}
		},
		defineAttributes: {
			value: function () {
				var attrs = Object.keys(this.attrs),
					attr;
				for (var i=0; i<attrs.length; i++) {
					attr = attrs[i];
					(function (attr) {
						Object.defineProperty(this, attr, {
							get: function () {
								var value = this.getAttribute(attr);
								return value === null ? this.attrs[attr] : value;
							},
							set: function (value) {
								this.setAttribute(attr, value);
							}
						});
					}.bind(this))(attr);
				}
			}
		},
		//
		// LifeCycle Callbacks
		//
		createdCallback: {
			value: function () {
				this.createShadowRoot();
				this.defineAttributes();

				var me = this,
					media_options,
					success,
					error;

				qrcode.callback = function (value) {
					onRead(me, value);
				};

				navigator.getUserMedia =
					navigator.getUserMedia ||
					navigator.webkitGetUserMedia ||
					navigator.mozGetUserMedia ||
					navigator.msGetUserMedia;

				if (navigator.getUserMedia) {
					media_options = {
						"audio": false,
						"video": true
					};

					success = function (stream) {
						me.$.video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
						stream_obj = stream;
						me.startScan();
					};

					error = function (error) {
						if (error && error.message) {
							console.log(error.message);
						}
					};

					navigator.getUserMedia(media_options, success, error);
				}
				else {
					this.$.output.innerHTML = 'Sorry, native web camera streaming is not supported by this browser...';
				}

				//this.generate();
			}
		},
		attributeChangedCallback: {
			value: function (attrName, oldVal, newVal) {
				var fn = this[attrName+'Changed'];
				if (fn && typeof fn === 'function') {
					fn.call(this, oldVal, newVal);
				}
				this.generate();
			}
		},
		//
		// Methods
		//
		startScan: {
			value: function () {
				var me = this;

				if (interval_id) {
					me.stop();
				}
				interval_id = setInterval(function (video, scale) {
					me.capture()
				}, this.interval);
			}
		},
		stopScan: {
			value: function () {
				clearInterval(interval_id);
			}
		},
		capture: {
			value: function () {
				var w = this.$.video.videoWidth * this.scale,
					h = this.$.video.videoHeight * this.scale,
					canvas = this.$.canvas.getContext('2d');

				canvas.drawImage(this.$.video.impl, 0, 0, w, h);
				try {
					qrcode.decode();
				}
				catch (err) {
					// console.log(err);
				}
			}
		},
		stop: {
			value: function () {
				this.stopScan();
				if (stream_obj) {
					if ('stop' in stream_obj) {
						stream_obj.stop();
					}
					else {
						this.$.video.pause();
						this.$.video.src = null;
					}
				}
			}
		},


		getOptions: {
			value: function () {
				var modulesize = this.modulesize,
					margin = this.margin;
				return {
					modulesize: modulesize !== null ? parseInt(modulesize) : modulesize,
					margin: margin !== null ? parseInt(margin) : margin
				};
			}
		},
		generate: {
			value: function () {
				if (this.data !== null) {
					if (this.format === 'png') {
						this.generatePNG();
					}
					else if (this.format === 'html') {
						this.generateHTML();
					}
					else if (this.format === 'svg') {
						this.generateSVG();
					}
					else {
						this.shadowRoot.innerHTML = '<div>qr-code: '+ this.format +' not supported!</div>'
					}
				}
				else {
					this.shadowRoot.innerHTML = '<div>qr-code: no data!</div>'
				}
			}
		},
		generatePNG: {
			value: function () {
				try {
					var img = document.createElement('img');
					img.src = QRCode.generatePNG(this.data, this.getOptions());
					this.clear();
					this.shadowRoot.appendChild(img);
				}
				catch (e) {
					this.shadowRoot.innerHTML = '<div>qr-code: no canvas support!</div>'
				}
			}
		},
		generateHTML: {
			value: function () {
				var div = QRCode.generateHTML(this.data, this.getOptions());
				this.clear();
				this.shadowRoot.appendChild(div);
			}
		},
		generateSVG: {
			value: function () {
				var div = QRCode.generateSVG(this.data, this.getOptions());
				this.clear();
				this.shadowRoot.appendChild(div);
			}
		},
		clear: {
			value: function () {
				while (this.shadowRoot.lastChild) {
					this.shadowRoot.removeChild(this.shadowRoot.lastChild);
				}
			}
		}
	});
//
// Register
//
	document.registerElement('qr-reader', {
		prototype: proto
	});
});

