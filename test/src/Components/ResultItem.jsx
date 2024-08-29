import React from 'react';
import { useLocation } from 'react-router-dom';

function ResultItem() {
  const location = useLocation();
  const { collection } = location.state;

  const validGroups = collection?.requestGroup?.filter(group => group.id !== "") || [];
 
  
  return (
    <div className='Result__Item'>
      <div className='Result__table'>
        <table>
          <thead>
            <tr>
              <th className='Result__table__number'>
                <h3>#</h3>
              </th>
              <th>
                <h3>Answer</h3>
              </th>
              <th>
                <h3>Correct answer</h3>
              </th>
              <th>
                <h3>Result</h3>
              </th>
            </tr>
          </thead>
          <tbody>
            {collection?.answerField?.map((i, index) => (
              <tr key={index}>
                <td>
                  <h3>{index + 1}</h3>
                </td>
                <td>
                  <h3>{i.studentAnswer}</h3>
                </td>
                <td>
                  <h3>{i.trueAnswer}</h3>
                </td>
                <td>
                  <h3>{i.isTrue === true ? 'True' : 'False'}</h3>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='Result__Table__wrapper'>
          <div className='Res__flex'>
            <h2>Question:</h2>
            <span>{collection.answerField.length}</span>
          </div>
          <div className='Res__flex'>
            <h2>Right:</h2>
            <span>{collection.trueCount}</span>
          </div>
        </div>
      </div>

      <div className='Result__group'>
        <h2>Recommended Groups</h2>
        <div className='Result__group__Wrapper'>
          {validGroups.length > 0 ? (
            validGroups.map((i, index) => (
              <div key={index} className='Result__group__card'>
                <h3>{i.name}</h3>
                <span>{i.level}</span>
                <span>{i.days_week}</span>
                <span>{i.start_at}</span>
                <span>{i.started_date}</span>
                <span>{i.teacherName}</span>
              </div>
            ))
          ) : (
            <div className='Result__no__groups'>
              <h3>No groups available</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultItem;
