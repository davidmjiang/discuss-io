"use strict";
var APP = APP || {};

APP.ListenersModule = (function(){

	var init = function(){
		_saveListener();
		_newListener();
		_cancelListener();
		_enterListener();
	};

	var _newListener = function(){
		$('#open-new').click(function(e){
			e.preventDefault();
			$('#new-question').show();
		});
	};

	var _cancelListener = function(){
		$('#cancel').click(function(e){
			e.preventDefault();
			$('#new-question').hide();
		});
	};

	var _enterListener = function(){
		$('#new-question').on('focus', 'input', function(event){
			$(event.target).keydown(function(e){
					if(e.which === 13){
						e.preventDefault();
						_addAnswer();
					}
			})
		});
	};

	var _id = 2;

	var _addAnswer = function(){
		var $newAnswer = $('.new-answer').clone().eq(0);
		$newAnswer.attr('data-id', _id);
		$('.all-answers').append($newAnswer);
		$('div[data-id='+_id+'] > input').val("");
		_id ++;
	};

	var _saveListener = function(){
		$("#save").click(function(e){
			e.preventDefault();
			var data = {};
			data.text = $("#question").val();
			data.options = _getOptions();
			data.answers = _getAnswers();
			APP.QuestionsModule.create(data);
			closeForm();
			render();
		});
	};

	var closeForm = function(){
		//clear the form
		$('#new-question').hide();
	};

	var render = function(){
		var questions = APP.QuestionsModule.getAll();
		for(var q in questions){
			console.log(questions[q]);
			var $newQ = $('<p></p>').text(questions[q].text);
			$('#all-questions').append($newQ);
		};
	};

	var _getOptions = function(){
		var options = [];
		$.each($("input[name='options']:checked"), function(){
			options.push($(this).val());
		});
		return options;
	};

	var _getAnswers = function(){
		var answers = [];
		var counter = 1;
		while($('div[data-id='+counter+']').length){
			var answer = {};
			answer.text = $("div[data-id="+counter+"] > input").val();
			answer.options = $('div[data-id='+counter+"] > select").val();
			answers.push(answer);
			counter ++;
		}
		return answers;
	};

	return{init: init};

})();
