"use strict";
var APP = APP || {};

APP.DragDrop = (function(){
	var init = function(){
		setup();
	};

	var setup = function(){
		$( "#all-questions" ).sortable();
    $( "#all-questions" ).disableSelection();
  };

	return {
		init: init
	};
})();