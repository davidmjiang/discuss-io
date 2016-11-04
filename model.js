"use strict";
var APP = APP || {};

APP.QuestionsModule = (function(){
	function Question(text, options, answers){
		this.id = getQuestionID();
		this.text = text;
		this.answers = answers || [];
		this.options = options;
	}

	function Answer(text, options, questionId){
		this.id = getAnswerID();
		this.text = text;
		this.options = options;
		this.questionId = questionId;
	}

	var _questionId;

	var _answerId;

	function getQuestionID(){
		if(_questionId){
			_questionId ++;
			return _questionId;
		}
		else{
			_questionId = 1;
			return 1;
		}
	}

	function getAnswerID(){
		if(_answerId){
			_answerId ++;
			return _answerId;
		}
		else{
			_answerId = 1;
			return 1;
		}
	}

	var _questions = {};

	var _answers = {};

	var createQuestion = function (data){
		var q = new Question(data.text, data.options);
		 _createAnswers(data, q);
		_questions[q.id] = q;
		return q;
	};

	var _createAnswers = function (data, q){
		var answers = q.answers;
		data.answers.forEach(function(answer){
			var a = new Answer(answer.text, answer.options, q.id);
			answers.push(a);
			_answers[a.id] = a;
		});
	};

	// var getAll = function(){
	// 	return _questions;
	// };

	var editQuestion = function(id, data){
		var question = _questions[id];
		question.text = data.text;
		question.options = data.options;
		_editAnswers(question, data);
		console.log(question);
	};

	var _editAnswers = function(question, data){
		data.answers.forEach(function(answer){
			if(answer.id){
				var a = _answers[answer.id];
				a.text = answer.text;
				a.options = answer.options;
			}
			else{
				 var newA = new Answer(answer.text, answer.options, question.id);
				_answers[newA.id] = newA;
				question.answers.push(newA);
			}
		});
	};

	var getQuestion = function(id){
		return _questions[id];
	};

	var deleteQuestion = function(id){
		delete _questions[id];
	};

	var deleteAnswer = function(id){
		if(id){
			var answer = _answers[id];
			var question = _questions[answer.questionId];
			//delete from questions object
			for(var i = 0; i < question.answers.length; i++){
				if(question.answers[i].id === parseInt(id)){
					question.answers.splice(i,1);
					break;
				}
			}
			delete _answers[id];
		}
	};

	return{
		create: createQuestion,
		getQuestion: getQuestion,
		edit: editQuestion,
		delete: deleteQuestion,
		deleteAnswer: deleteAnswer
	};
})();

