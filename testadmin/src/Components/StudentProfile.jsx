import React from 'react';
import '../Style/StudentProfile.css';
import { useLocation } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
function StudentProfile() {
    const location = useLocation();
    const { collection } = location.state;
    const { setIsSidebarFull } = useOutletContext();
    const handleButtonClick = () => {
      setIsSidebarFull(true); // При нажатии на кнопку добавляем класс
    };
    return (
        <div className='StudentsProfile'>
            <div className='header header__wrapper'>
                <h1>Student</h1>
                <button className='header__burger' onClick={handleButtonClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15"><path fill="currentColor" fillRule="evenodd" d="M1.5 3a.5.5 0 0 0 0 1h12a.5.5 0 0 0 0-1zM1 7.5a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 0 1h-12a.5.5 0 0 1-.5-.5m0 4a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 0 1h-12a.5.5 0 0 1-.5-.5" clipRule="evenodd"></path></svg>
          </button>
            </div>
            <div className='StudentProfile'>
                <div className='StudentProfile__table'>
                    <table>
                        <thead>
                            <tr>
                                <th className='Table__number'><h3>#</h3></th>
                                <th><h3>Answer</h3></th>
                                <th><h3>Correct answer</h3></th>
                                <th><h3>Result</h3></th>
                            </tr>
                        </thead>
                        <tbody>
                            {collection?.answerField?.map((answer, index) => (
                                <tr key={index}>
                                    <td className='Table__number'><h3>{index + 1}</h3></td>
                                    <td><h3>{answer.studentAnswer || 'N/A'}</h3></td>
                                    <td><h3>{answer.trueAnswer || 'N/A'}</h3></td>
                                    <td><h3>{answer.isTrue ? 'True' : 'False'}</h3></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='Student__group'>
                    <h2>
                        Group
                    </h2>
                    <div className='Student__wrapper'>
                        <div className='Result__group'>
                            <div className='Result__group__Wrapper'>
                                {collection?.requestGroup?.map((i, index) => (
                                    <div key={index} className='Result__group__card'>
                                        <h3>
                                            {i.name}
                                        </h3>
                                        <span>
                                            {i.level}
                                        </span>
                                        <span>
                                            {i.days_week}
                                        </span>
                                        <span>
                                            {i.start_at}
                                        </span>
                                        <span>
                                            {i.started_date}
                                        </span>
                                        <span>
                                            {i.teacherName}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentProfile;
