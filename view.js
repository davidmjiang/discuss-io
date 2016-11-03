"use strict";
var APP = APP || {};

APP.ListenersModule = (function(){

	var init = function(){
		_saveListener();
		_newListener();
		_cancelListener();
		_enterListener();
		_deleteAnswerListener();
		_addAnswerListener();
	};

	var _newListener = function(){
		$('#open-new').click(function(e){
			e.preventDefault();
			$('.new-form').show();
		});
	};

	var _cancelListener = function(){
		$('.new-form').on('click', '#cancel',
			function(e){
			e.preventDefault();
			closeForm();
		});
	};

	var _enterListener = function(){
		$('#new-question').on('focus', 'input', function(event){
			$(event.target).keydown(function(e){
					if(e.which === 13){
						e.preventDefault();
						_addAnswer();
					}
			});
		});
	};

	var _addAnswerListener = function(){
		$('#new-question').on('click', '#add-answer', function(e){
			e.preventDefault();
			_addAnswer();
		});
	};

	var _id = 2;

	var newAnswer = $('.new-answer').first().html();

	var _addAnswer = function(){
		var toAdd = $('<div></div>')
		.attr('data-id', _id)
		.addClass('new-answer')
		.html(newAnswer);
		$('.all-answers').append(toAdd);
		$('div[data-id='+_id+'] > input').val("");
		_id ++;
	};

	var _saveListener = function(){
		$('.new-form').on('click', '#save', 
		function(e){
			e.preventDefault();
			var data = {};
			//validate question text
			data.text = $("#question").val();
			data.options = _getOptions();
			data.answers = _getAnswers();
			APP.QuestionsModule.create(data);
			closeForm();
			render();
		});
	};

	//hold on to empty question form
	var $questionForm = $('#new-question').first().clone().html();

	var closeForm = function(){
		$('.new-form').hide();
		//clear the form
		$('#new-question').html($questionForm);
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
			//validate
			var answer = {};
			answer.text = $("div[data-id="+counter+"] > input").val();
			answer.options = $('div[data-id='+counter+"] > select").val();
			answers.push(answer);
			counter ++;
		}
		return answers;
	};

	var _deleteAnswerListener = function(){
		$('.new-form').on('click', '.delete-answer', function(event){
			event.preventDefault();
			var element = $(event.target);
			$(element.closest('.new-answer')).remove();
		});
	};

	return{init: init};

})();
