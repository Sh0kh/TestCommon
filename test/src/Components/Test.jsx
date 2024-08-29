import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import '../Style/Test.css';

const QuizFromImage = () => {
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [image, setImage] = useState(null);
    const canvasRef = useRef(null);

    const handleImageUpload = (e) => {
        setImage(e.target.files[0]);
    };


    // Recognize text from image
    const recognizeText = () => {
        if (image) {
            Tesseract.recognize(
                image,
                'eng',
                { logger: info => console.log(info) }
            ).then(({ data: { text } }) => {
                console.log(text); // Check the recognized text in the console
            
                const parsedQuestions = parseQuestions(text);
                setQuestions(parsedQuestions);
                setSelectedAnswers({});
                setShowResults(false);
            }).catch(err => {
                console.error('Error recognizing text:', err);
            });
        } else {
            alert('Please select an image first.');
        }
    };

    // Parse recognized text and replace red areas with inputs
    const parseQuestions = (text) => {
      // Замените слово "qazwsxedc" на уникальный плейсхолдер
      const formattedText = text.replace(/\bqazwsxedc\b/g, '{input}');
  
      // Разделите форматированный текст на строки для обработки
      const lines = formattedText.split('\n');
      const parsedQuestions = [];
      let currentQuestion = null;
  
      lines.forEach(line => {
          if (line.trim().length === 0) return;
  
          if (!line.startsWith(' ')) {
              if (currentQuestion) {
                  parsedQuestions.push(currentQuestion);
              }
              currentQuestion = { question: line, options: [], correctAnswer: null };
          } else if (line.trim().startsWith('*')) {
              currentQuestion.correctAnswer = line.trim().slice(1).trim();
              currentQuestion.options.push(currentQuestion.correctAnswer);
          } else {
              // Добавляем форматированную строку в опции текущего вопроса
              currentQuestion.options.push(line);
          }
      });
  
      if (currentQuestion) {
          parsedQuestions.push(currentQuestion);
      }
  
      // Преобразуйте текст с плейсхолдерами в формат, который React может отобразить
      return parsedQuestions.map(q => ({
          ...q,
          question: q.question.split('{input}').map((part, index) => ({
              text: part,
              isInput: index < q.question.split('{input}').length - 1
          }))
      }));
  };
  
  
  
  

    // Handle input change
    const handleOptionChange = (questionIndex, e) => {
        const newAnswer = e.target.value;
        setSelectedAnswers({
            ...selectedAnswers,
            [questionIndex]: newAnswer,
        });
    };

    // Handle form submission
    const handleSubmit = () => {
        let score = 0;
        questions.forEach((question, index) => {
            if (selectedAnswers[index] === question.correctAnswer) {
                score += 1;
            }
        });
        setScore(score);
        setShowResults(true);
    };

    return (
        <div className="quiz-container bg__img">
            <h1>Quiz from Image</h1>
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="file-input"
            />
            <button onClick={recognizeText} className="btn">Recognize Text</button>
            {questions.length > 0 && (
    <div className="questions-container">
        {questions.map((question, index) => (
            <div key={index} className="question">
                <h3>
                    {question.question.map((part, partIndex) => (
                        <React.Fragment key={partIndex}>
                            <span>{part.text}</span>
                            {part.isInput && (
                                <input 
                                    type="text" 
                                    placeholder="Enter your answer" 
                                    style={{ width: '100px' }} 
                                    value={selectedAnswers[index] || ''}
                                    onChange={(e) => handleOptionChange(index, e)}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </h3>
            </div>
        ))}
        <button onClick={handleSubmit} className="btn submit-btn">Submit</button>
    </div>
)}


            {showResults && (
                <div className="results-container bg__img">
                    <h2>Your Score: {score}/{questions.length}</h2>
                    {questions.map((question, index) => (
                        <div key={index} className="result">
                            <span>{question.question}</span>
                            <p>
                                Your answer: {selectedAnswers[index] || 'Not answered'} - 
                                {selectedAnswers[index] === question.correctAnswer ? 'Correct' : 'Incorrect'}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Hidden canvas for processing image */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
};

export default QuizFromImage;
