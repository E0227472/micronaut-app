import React, { useState, useEffect } from 'react';
import './question.css';
import {randomQuestion, postResult} from '../../utils/service';
import Remarks from "../remarks/remarks";
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

const Question = props => {
  const [question, setQuestion] = useState({});
  const [answer, setAnswer] = useState(-1);
  const [answerDetails, setAnswerDetails] = useState('');
  const [alias, setAlias] = useState('');
  const [inputStyle, setInputStyle] = useState({ border: 'gray solid 1px' });
 

  useEffect(() => {
    randomQuestion().then(response => {
      setQuestion(response);
    });
  }, []);


  const handleAnswer = event => {

    const payLoad = {
      user: {
        name: alias
      },
      question: question.question,
      choices: question.choices1,
      answer: question.choices[parseInt(answer)],
     correctAnswer: parseInt(question.answer)
    };

     const result = postResult(payLoad);
     result.then((data) => {
       props.onAttempt(data)
       props.getUserId(data.userId);
      });
     
    if (alias) {
      setInputStyle({ border: 'gray solid 1px' });
      if (parseInt(answer) === parseInt(question.answer)) {
        setAnswerDetails('Your answer is correct');
        randomQuestion().then(response => {
          setQuestion(response);
        });
      } else {
        randomQuestion().then(response => {
          setQuestion(response);
        });
        setAnswerDetails('The answer is wrong. Please try again.');
      }
    } else {
      setInputStyle({ border: 'red solid 1px' });
      setAnswerDetails('Name or Alias is needed. Please try again.');
    }

    event.preventDefault();
  };

 
  const handleChoices = event => {
    setAnswer(event.target.value);
  };

  return (
    <div className="Question">
      <form onSubmit={handleAnswer}>
        <div className="User">
          <label>Username</label>
          <input
            type="text"
            name="name"
            onChange={event => setAlias(event.target.value)}
            value={alias}
            style={inputStyle}
            placeholder="Please enter name/alias"
          />
        </div>
        {alias ? (
          <div>
            <label>{question.question}</label>
            <div className="choices">
              {question.choices ? (
                question.choices.map((choice, index) => {
                  return (
                    <div key={index}>
                      <input
                        className="radio-btn-choices"
                        type="radio"
                        name="site_name"
                        value={index}
                        onChange={handleChoices}
                      />
                      {choice}
                    </div>
                  );
                })
              ) : (
                <span>Loading Questions ....</span>
              )}
            </div>
            <input type="submit" value="Submit"/>
            <Remarks answerDetails={answerDetails} />
          </div>
        ) : (
          <span className="required">Required</span>
        )}
      </form>
    </div>
  );
};


const mapDispatchToProps = dispatch => {
  return {
    onAttempt: attempt =>
      dispatch({
        type: actionTypes.ANSWER_QUESTION,
        payload: attempt
      }),
    loadAttempts: attempts =>
      dispatch({
        type: actionTypes.SET_ATTEMPTS,
        payload: attempts
      }),
      getUserId: userId =>
      dispatch({
        type: actionTypes.GET_USERID,
        payload: userId
      })
  };
};

export default connect(null, mapDispatchToProps)(Question);
