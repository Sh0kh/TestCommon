// Attempt.js
import React from 'react';
import '../Style/Attempt.css';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
const GET_ATTEMPT = gql`
  query GetStudentTestExams($studentId: ID!) {
    getStudentTestExams(code: "KEY_ADM", studentId: $studentId, page: 1, size: 100) {
     items {
      ... on UserCollectionTestExams {
        collectionId
          trueCount
          falseCount
          createdAt
      answerField{
		trueAnswer
        studentAnswer
        isTrue
      }
        requestGroup{
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

function Attempt() {
  const { id } = useParams();
  const studentId = id;
  const navigate = useNavigate();


  const { data: Attempt} = useQuery(GET_ATTEMPT, {
    variables: { studentId },
    skip: !studentId,
  });
  const handleViewDetails = (collection) => {
    // Navigate to the details page, passing data through state
    navigate(`/studentProfile/${collection.collectionId}`, { state: { collection } });
  };

  const { setIsSidebarFull } = useOutletContext();

  const handleButtonClick = () => {
    setIsSidebarFull(true); // При нажатии на кнопку добавляем класс
  };

  return (
    <div className='Attempt'>
      <div className='Attempt__header header__wrapper'>
        <h1>Attempt</h1>
        <button className='header__burger' onClick={handleButtonClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15"><path fill="currentColor" fillRule="evenodd" d="M1.5 3a.5.5 0 0 0 0 1h12a.5.5 0 0 0 0-1zM1 7.5a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 0 1h-12a.5.5 0 0 1-.5-.5m0 4a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 0 1h-12a.5.5 0 0 1-.5-.5" clipRule="evenodd"></path></svg>
          </button>
      </div>
      <div className='Attempt__wrapper'>
        {Attempt?.getStudentTestExams?.items?.map((collection, index) => (
            <div className='Attempt__card'  onClick={() => handleViewDetails(collection)}>
              <h3>
                {collection.createdAt.split('T')[0]}
                <div className='At__card__grid'>
                  <span>True Count:</span>
                  <span>{collection.trueCount}</span>
                </div>
                <div className='At__card__grid'>
                  <span>False Count:</span>
                  <span>{collection.falseCount}</span>
                </div>
              </h3>
            </div>
        ))}
      </div>
    </div>
  );
}

export default Attempt;
