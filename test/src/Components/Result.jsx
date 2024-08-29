import React, { useState } from 'react';
import '../Style/Result.css';
import { useNavigate } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GET_RESULT = gql`
  query GetStudentTestExams($code: String!) {
    getStudentTestExams(code: $code, page: 1, size: 100) {
      items {
        ... on UserCollectionTestExams {
          collectionId
          trueCount
          falseCount
          createdAt
          answerField {
            trueAnswer
            studentAnswer
            isTrue
          }
          requestGroup {
            name
            teacherName
            level
            start_at
            started_date
            days_week
          }
        }
      }
      totalPage
    }
  }
`;

function Result() {
  const showErrorToast = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const [code, setCode] = useState(''); // State to store the code
  const [submittedCode, setSubmittedCode] = useState(''); // State to store the code when form is submitted
  const navigate = useNavigate();

  // Query only runs when submittedCode is updated
  const { data: ResultData, } = useQuery(GET_RESULT, {
    variables: { code: submittedCode },
    skip: !submittedCode, // Skip the query if no code is submitted
    onError: (error) => {
      showErrorToast(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code) {
      showErrorToast('Code cannot be empty.');
      return;
    }
    setSubmittedCode(code); 
  };

  const handleViewDetails = (collection) => {
    navigate(`/resultItem/${collection.collectionId}`, { state: { collection } });
  };

  return (
    <div className="Result">
      <h3 className='bot res'>
        To get a 10-minute key from the  <a href="https://t.me/codevanbot" target="_blank" rel="noopener noreferrer">
        @codevanbot</a>  on Telegram
      </h3>
      <div className="Result__wrapper">
        <form onSubmit={handleSubmit}>
          <label htmlFor="codeInput">
            <input
              id="codeInput"
              type="text"
              placeholder="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)} // Update code state on input change
            />
          </label>
          <button type="submit">Result</button>
        </form>
      </div>
      <div className="Result__history">
        <div className="Result__history__wrapper">
          {ResultData?.getStudentTestExams?.items?.map((collection) => (
            <div
              key={collection.collectionId}
              className="Result__history__card"
              onClick={() => handleViewDetails(collection)}
            >
              <p>{collection.createdAt.split('T')[0]}</p>
              <div className="Result__history__card__felx">
                <span>True count:</span>
                <span>{collection.trueCount}</span>
              </div>
              <div className="Result__history__card__felx">
                <span>False count:</span>
                <span>{collection.falseCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Result;
