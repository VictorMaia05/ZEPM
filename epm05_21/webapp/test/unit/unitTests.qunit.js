/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"tra05_21/epm05_21/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
