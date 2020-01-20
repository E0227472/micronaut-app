import React, { useState, useEffect } from 'react';
import './question.css';
import {randomQuestion, postResult, getUserResponse} from '../../utils/service';
import Remarks from '../remarks/remarks';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';


/*
 const [question, setQuestion] = useState({});
 question: initial state
 setQuestion: equivalent to setState
 useState(args): args is the initial state value 
*/ 

const Question = props => {
  const [question, setQuestion] = useState({});
  const [answer, setAnswer] = useState(-1);
  const [answerDetails, setAnswerDetails] = useState('');
  const [alias, setAlias] = useState('');
  const [inputStyle, setInputStyle] = useState({ border: 'gray solid 1px' });
  // const [isCorrect, setIsCorrect] = useState(false);

/*
useEffect: equivalent to componentDidMount, componentDidUpdate and
componentWillUnMount. 

Once elements of the dom has been rendered, the question state is set.
Empty array passed as 2nd arguement so that method only called when
there are changes in the array only and not in the component. 
*/ 
  useEffect(() => {
    randomQuestion().then(response => {
      setQuestion(response);
    });
  }, []);

/*
If user's past data exist, it will be fetched from the back-end to display gameStats
*/
  useEffect( () => {
    if (alias) {
      getUserResponse(alias).then(data => {
        props.loadAttempts(data);
      })
    }
  }, [alias, props]);

/*
When user clicks button submit
*/ 
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


     /*
    Posting the user's response to the database 
    */
   postResult(payLoad);
   
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
      props.onAttempt(payLoad);

    event.preventDefault();
  };

  


  /*
  Capture the user's response when user chooses radio button's options 
  */  
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

/*
Number of attempts are being recorded and stored in the redux store 
*/ 
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
      })
  };
};

export default connect(null, mapDispatchToProps)(Question);
