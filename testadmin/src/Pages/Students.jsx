import React, { useState } from 'react';
import '../Style/Students.css';
import { NavLink } from 'react-router-dom';
import { gql, useQuery, useLazyQuery } from '@apollo/client';
import { useOutletContext } from 'react-router-dom';

const GET_ALL_STUDENT = gql`
  query GetStudentsList($page: Int!) {
    getStudentsList(code: "KEY_ADM", page: $page, size: 10) {
      items {
        ...on Student {
          fullName
          phoneNumber
          id
        }
      }
      totalPage
    }
  }
`;

const GET_IN_SEARCH = gql`
  query SearchStudent($value: String!, $page: Int!, $size: Int!) {
    searchStudent(value: $value, page: $page, size: $size) {
      items {
        ...on Student {
          fullName
          phoneNumber
          id
        }
      }
      totalPage
    }
  }
`;

function Students() {
  const [page, setPage] = useState(1);
  const { setIsSidebarFull } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch students data and refetch when page changes
  const { data: Students, refetch } = useQuery(GET_ALL_STUDENT, {
    variables: { page },
    skip: searchTerm.length > 0 // Skip this query when searching
  });

  // Lazy query for search functionality
  const [searchStudent, { data: searchData }] = useLazyQuery(GET_IN_SEARCH);

  const handleNextPage = () => {
    if (page < Students?.getStudentsList?.totalPage) {
      setPage((prevPage) => prevPage + 1);
      refetch({ page: page + 1 });
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
      refetch({ page: page - 1 });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchStudent({ variables: { value: searchTerm, page: 1, size: 10 } });
  };

  const handleButtonClick = () => {
    setIsSidebarFull(true);
  };

  // Determine whether to display students from search or from query
  const displayStudents = searchTerm ? searchData?.searchStudent?.items : Students?.getStudentsList?.items;
  const totalPage = searchTerm ? searchData?.searchStudent?.totalPage : Students?.getStudentsList?.totalPage;

  return (
    <div className='Students'>
      <div className="header">
        <div className='header__wrapper'>
          <div className='header__grid'>
            <h1>Students</h1>
            <form className='header__form' onSubmit={handleSearch}>
              <label htmlFor="inp">
                <input
                  type="text"
                  placeholder='Search'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </label>
              <button type='submit'>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"></path>
                </svg>
              </button>
            </form>
          </div>
            <button className='header__burger' onClick={handleButtonClick}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15">
                <path fill="currentColor" fillRule="evenodd" d="M1.5 3a.5.5 0 0 0 0 1h12a.5.5 0 0 0 0-1zM1 7.5a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 0 1h-12a.5.5 0 0 1-.5-.5m0 4a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 0 1h-12a.5.5 0 0 1-.5-.5" clipRule="evenodd"></path>
              </svg>
            </button>
        </div>
      </div>
      <div className='Group__main'>
        <div className='Group__table'>
          <table>
            <thead>
              <tr>
                <th className='Table__number'><h3>#</h3></th>
                <th><h3>Full Name</h3></th>
                <th><h3>Phone Number</h3></th>
                <th><h3>Setting</h3></th>
                <th><h3>Attempt</h3></th>
              </tr>
            </thead>
            <tbody>
              {displayStudents?.map((i, index) => (
                <tr key={index}>
                  <td className='Table__number'><h3>{index + 1}</h3></td>
                  <td><h3>{i.fullName}</h3></td>
                  <td><h3>{i.phoneNumber}</h3></td>
                  <td>
                    <div className='Table__setting'>
                      <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className='Table__setting'>
                      <NavLink to={`/attempt/${i.id}`}>
                        <svg className='Stpr' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7H9c-1.87 0-2.804 0-3.5.402A3 3 0 0 0 4.402 8.5C4 9.196 4 10.13 4 12s0 2.804.402 3.5A3 3 0 0 0 5.5 16.598C6.196 17 7.13 17 9 17h7m4-10l-3-3m3 3l-3 3"></path>
                        </svg>
                      </NavLink>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className='Footer'>
        <div className='Footer__wrapper'>
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className={`btn ${page === 1 ? 'btn-disabled' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
              <path fill="currentColor" fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5a.5.5 0 0 0 .5-.5z" clipRule="evenodd"></path>
            </svg>
          </button>
          <div>
                        <span>
                            {page}
                        </span>
                        <span>
                            /
                        </span>
                        <span>
                            {Students?.getStudentsList?.totalPage}
                        </span>
                    </div>
          <button
            onClick={handleNextPage}
            disabled={page >= totalPage}
            className={`btn ${page >= totalPage ? 'btn-disabled' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
              <path fill="currentColor" fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5.5H14.293l-3.147 3.146a.5.5 0 1 1-.708.708l4-4a.5.5 0 0 1 0-.708l-4-4a.5.5 0 0 1 .708-.708L14.293 7.5H1.5A.5.5 0 0 1 1 8z" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Students;
