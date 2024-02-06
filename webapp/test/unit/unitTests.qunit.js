/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comodatacrudoperations/capodatacrudoperations/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
