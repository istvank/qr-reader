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
				interval: 1000,
				scale: 0.5,
				autostart: false
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
				// create the template programmatically
				var root = this.createShadowRoot();
				var div = document.createElement('div');
				var video = document.createElement('video');
				video.setAttribute('id', 'video');
				video.setAttribute('autoplay', 'true');
				video.setAttribute('width', '320');
				video.setAttribute('height', '240');
				div.appendChild(video);
				var canvas = document.createElement('canvas');
				canvas.setAttribute('id', 'canvas');
				canvas.setAttribute('width', '320');
				canvas.setAttribute('height', '240');
				canvas.style.display = 'none';
				div.appendChild(canvas);
				var divOutput = document.createElement('div');
				divOutput.setAttribute('id', 'output');
				div.appendChild(divOutput);
				root.appendChild(div); // Append elements to the Shadow Root

				this.defineAttributes();

				if (this.autostart !== false) {
					this.startScan();
				}
			}
		},
		attributeChangedCallback: {
			value: function (attrName, oldVal, newVal) {
				var fn = this[attrName+'Changed'];
				if (fn && typeof fn === 'function') {
					fn.call(this, oldVal, newVal);
				}
			}
		},
		//
		// Methods
		//
		startScan: {
			value: function () {
				var me = this,
					media_options,
					success,
					error;

				qrcode.callback = function (value) {
					me.onReadFunc(me, value);
				};


				navigator.getUserMedia =
					navigator.getUserMedia ||
					navigator.webkitGetUserMedia ||
					navigator.mozGetUserMedia ||
					navigator.msGetUserMedia;

				if (navigator.getUserMedia) {

					// List cameras and microphones.

					navigator.mediaDevices.enumerateDevices()
						.then(function(devices) {
							devices.forEach(function(device) {
								if (device.kind === 'videoinput') {
									var backCamId = device.deviceId;

									media_options = {
										"audio": false,
										"video": {
											optional: [{sourceId: backCamId}]
										}
									};

									success = function (stream) {
										me.shadowRoot.getElementById('video').src = (window.URL && window.URL.createObjectURL(stream)) || stream;
										stream_obj = stream;
										me.stream = stream;
										//me.startScan();
									};

									error = function (error) {
										if (error && error.message) {
											console.error(error.message);
										}
									};

									navigator.getUserMedia(media_options, success, error);

								}
							});
						})
						.catch(function(err) {
							console.log(err.name + ": " + error.message);
						});

				} else {
					console.log('Sorry, native web camera access is not supported by this browser...');
				}


				if (interval_id) {
					me.stop();
				}
				interval_id = setInterval(function(video, scale) {
					me.capture()
				}, this.interval);
			}
		},
		stopScan: {
			value: function () {
				// close the stream from the webcam
				this.stream.getTracks()[0].stop();

				// stop trying to detect QR codes in the stream
				clearInterval(interval_id);
			}
		},
		capture: {
			value: function () {
				var w = this.shadowRoot.getElementById('video').videoWidth * this.scale,
					h = this.shadowRoot.getElementById('video').videoHeight * this.scale,
					canvas = this.shadowRoot.getElementById('canvas').getContext('2d');

				canvas.drawImage(this.shadowRoot.getElementById('video'), 0, 0, w, h);
				try {
					qrcode.decode();
				}
				catch (err) {
					//console.log(err);
				}
			}
		},
		stop: {
			value: function () {
				var me = this;

				this.stopScan();
				if (stream_obj) {
					if ('stop' in stream_obj) {
						stream_obj.stop();
					}
					else {
						me.shadowRoot.getElementById('video').pause();
						me.shadowRoot.getElementById('video').src = null;
					}
				}
			}
		},
		onReadFunc: {
			value: function(el, value) {
				var output,
					attrs,
					obj = window,
					i;

				if (el.output !== null) {
					//output = el.output ? document.querySelector(el.output) : this.shadowRoot.getElementById('output');
					//output[el.outputAttr] = value;

					// fire an event
					var event = new CustomEvent("qr-code-read", { "detail": value });
					// Dispatch/Trigger/Fire the event
					this.dispatchEvent(event);
				}
				if (el.onRead) {
					attrs = el.onRead.split('.');
					for (i=0; i<attrs.length; i++) {
						obj = obj[attrs[i]];
					}
					obj(value);
				}
			}
		},

	});
//
// Register
//
	document.registerElement('qr-reader', {
		prototype: proto
	});
});

