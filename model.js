"use strict";
var APP = APP || {};

APP.QuestionsModule = (function(){
	function Question(text, answers, options){
		this.id = getQuestionID();
		this.text = text;
		this.answers = answers;
		this.options = options;
	}

	function Answer(text, options){
		this.id = getAnswerID();
		this.text = text;
		this.options = options;
	}

	var _questionId;

	var _answerId;

	function getQuestionID(){
		if(_questionId){
			_questionId ++;
			return _questionId;
		}
		else{
			return 0;
		}
	}

	function getAnswerID(){
		if(_answerId){
			_answerId ++;
			return _answerId;
		}
		else{
			return 0;
		}
	}

	var _questions = {};

	var _answers = {};

	var createQuestion = function (data){
		var answers = _createAnswers(data);
		var q = new Question(data.text, answers, data.options);
		_questions[q.id] = q;
	};

	var _createAnswers = function (data){
		var answers = [];
		data.answers.forEach(function(answer){
			var a = new Answer(answer.text, answer.options);
			answers.push(a);
			_answers[a.id] = a;
		});
		return answers;
	};

	var getAll = function(){
		return _questions;
	};

	var editQuestion = function(id, data){
		var question = _questions[id];
		question.text = data.text;
		question.options = data.options;
		_editAnswers(question, data);
	};

	var _editAnswers = function(question, data){
		data.answers.forEach(function(answer){
			if(answer.id){
				var a = _answers[answer.id];
				a.text = answer.text;
				a.options = answer.options;
			}
			else{
				 var newA = new Answer(answer.text, answer.options);
				question.answers.push(newA);
			}
		});
	};

	var deleteQuestion = function(id){
		delete _questions[id];
	};

	return{
		create: createQuestion,
		getAll: getAll,
		edit: editQuestion,
		delete: deleteQuestion
	};
})();

