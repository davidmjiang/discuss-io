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
		_deleteQuestionListener();
		_editQuestionListener();
	};

	var setFlash = function(message){
		$(".flash").text(message).slideDown();
		setTimeout(function(){
				$(".flash").slideUp();
			}, 5000);

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
			if(!creating){
				enableButtons();
				APP.QuestionsModule.clearDeleteQ();
				creating = true;
			}
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
		return _id - 1;
	};

	var _saveListener = function(){
		$('.new-form').on('click', '#save', 
		function(e){
			e.preventDefault();
			//validate form
			var errors = checkValidForm();
			if(errors.length){
				$('#errors').text("Question could not be saved because of these errors: " + errors.join(" / ")).show();
			}
			else{
				if(creating){
					createQuestion();
				}
				else{
					editQuestion();
				}
			}
		});
	};

	var checkValidForm = function(){
		var messages = []; 
		if ($("#question").val() === ""){
			messages.push("Question cannot be blank");
		}
		if ($(".new-answer").length + $(".existing-answer").length < 2){
			messages.push("Question must have at least 2 answers");
		}
		$.each($('.new-answer'), function(){
			var dataId = $(this).attr('data-id');
			var text = $(".new-answer[data-id=" + dataId +"] > input").val();
			if(!text){
				messages.push("Answer cannot be blank");
			}
		});
		return messages;
	};

	var createQuestion = function(){
		var data = {};
		data.text = $("#question").val();
		data.options = _getOptions();
		data.answers = _getAnswers();
		var question = APP.QuestionsModule.create(data);
		closeForm();
		setFlash("Question created");
		addRow(question);
	};

	var editQuestion = function(){
		//delete answers from the queue
		APP.QuestionsModule.deleteAnswers();
		//find data-id of #question
		var id = $("#question").attr('data-id');
		//set question text to $(#question).val()
		var data = {};
		data.text = $("#question").val();
		data.options = _getOptions();
		var newAnswers = _getAnswers();
		var oldAnswers = _getOldAnswers();
		data.answers = newAnswers.concat(oldAnswers);
		APP.QuestionsModule.edit(id, data);
		//data.questions: combo of new and existing questions. if existing, include the answer id
		//set question options to getOptions()
		//for each $(.existing-answer), edit the question text and options
		//for each $(.new-answer), create the answer and add it to question.answers
		creating = true;
		enableButtons();
		//update the question row
		$(".question-row[data-id="+ id+"] > .question-text").text(data.text);
		setFlash("Question edited");
		//close the form
		closeForm();
	};

	//hold on to empty question form
	var $questionForm = $('#new-question').first().clone().html();

	var closeForm = function(){
		$('.new-form').hide();
		//clear the form
		$('#new-question').html($questionForm);
	};

	var editButton = "<button class='btn btn-default edit-question'>Edit</button>";

	var deleteButton = "<button class='btn btn-danger delete-question'>Delete</button>";

	var disableButtons = function(){
		$(".edit-question").prop("disabled", true);
		$(".delete-question").prop("disabled", true);
	};

	var enableButtons = function(){
		$(".edit-question").prop("disabled", false);
		$(".delete-question").prop("disabled", false);
	};

	var addRow = function(q){
		console.log(q);
		var $newRow = $("<div class='row question-row' data-id=" + q.id + " ui-state-default>")
		var $newQuestion = $("<div class='col-md-6 question-text'></div")
		.text(q.text);
		var $newButtons = $("<div class='col-md-6'></div")
		.append($(editButton))
		.append($(deleteButton));
		$newRow.append($newQuestion)
		.append($newButtons);
		$('#all-questions').append($newRow);
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
		$.each($('.new-answer'), function(){
			var dataId = $(this).attr('data-id');
			var text = $(".new-answer[data-id=" + dataId +"] > input").val();
			//only add if not blank
			if(text){
				var answer = {};
				answer.text = text;
				answer.options = $(".new-answer[data-id=" + dataId +"] > select").val();
				answers.push(answer);
			}
		});
		return answers;
	};

	var _getOldAnswers = function(){
		var answers = [];
		$.each($('.existing-answer'), function(){
			var answer = {};
			var dataId = $(this).attr('data-id');
			answer.id = dataId;
			answer.text = $(".existing-answer[data-id=" + dataId +"] > input").val();
			answer.options = $(".existing-answer[data-id=" + dataId +"] > select").val();
			answers.push(answer);
		});
		return answers;
	};

	var creating = true;

	var _deleteAnswerListener = function(){
		$('.new-form').on('click', '.delete-answer', function(event){
			event.preventDefault();
			var element = $(event.target);
			if(element.closest('.existing-answer').length){
				var parent = (element.closest('.existing-answer'));
				APP.QuestionsModule.deleteQueue(parent.attr('data-id'));
			}
			else{
				parent = (element.closest('.new-answer'));
			}
			parent.remove();
		});
	};

	var _deleteQuestionListener = function(){
		$('#all-questions').on('click', '.delete-question', function(e){
			var element = $(e.target);
			var parent = $(element.closest('.question-row'));
			//delete from model
			APP.QuestionsModule.delete(parent.attr('data-id'));
			//remove from view
			parent.remove();
			setFlash("Question deleted");
		});
	};

 var tempQuestion;

 var _editQuestionListener = function(){
 	$('#all-questions').on('click', '.edit-question', function(e){
 		var element = $(e.target);
 		var parent = element.closest('.question-row');
 		var id = parent.attr('data-id');
 		var question = APP.QuestionsModule.getQuestion(id);
 		_populateEditForm(question);
 		creating = false;
 		//disable buttons
 		disableButtons();
 		tempQuestion = question;
 		//show the form
 		$('.new-form').show();
 	});
 };

 var _populateEditForm = function(question){
 	//recreate the new form with the already existing information
	$("#question").val(question.text)
	.attr('data-id', question.id);
	//remove the empty answer
	$('.new-answer[data-id=1]').remove();
	//fill in every answer
	question.answers.forEach(function(a){
		_addExistingAnswer(a.id);
		$('.existing-answer[data-id=' + a.id +'] > select').val(a.options);
		$('.existing-answer[data-id=' + a.id +'] > input').val(a.text);
	});
	//fill in the options
	question.options.forEach(function(o){
		$('#new-question > input[value=' + o + ']').prop('checked', true);
	});
 };

 var _addExistingAnswer = function(id){
 	var toAdd = $('<div></div>')
		.attr('data-id', id)
		.removeClass('new-answer')
		.addClass('existing-answer')
		.html(newAnswer);
		$('.all-answers').append(toAdd);
 };


	return{init: init};

})();
