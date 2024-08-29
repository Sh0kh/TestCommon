import React, { useState } from 'react'
import '../Style/Group.css'
import axios from '../service/axios.js'
import { gql, useQuery, useMutation } from '@apollo/client'
import { useOutletContext } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const GET_AllGroups = gql`
  query GetGroups($page: Int!){
  getGroups(code:"KEY_ADM", page:$page size:10){
    items{
      ...on Group{
        id
        name
        teacherName
        level
        start_at
        started_date
        days_week
        createdAt
      }
    }
    totalPage
  }
}
`

const DELETE_GROUPS = gql`
  mutation deleteGroup($code: String!, $id: ID!) {
    deleteGroup(code: $code, id: $id) {
      statusCode
      message
    }
  }
`;
function Group() {

    const [page, setPage] = useState(1);


    const [active, setActive] = useState(false)
    const CreateModal = () => {
        setActive(!active)
    }
    const [isDelete, setDelete] = useState(false)
    const DeleteModal = (id) => {
        setDelete(id);
    };
    const ShowDeleteTrue = () => {
        toast.success('Deleted!', {
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
    const ShowCreatetrue = () => {
        toast.success('Created!', {
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


    const ShowDeleteFalse = () => {
        toast.error('Error!', {
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
    const ShowCreatedFalse = () => {
        toast.error('Error!', {
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
    // post Group 
    const [name, setName] = useState('')
    const [teacherName, setTeacherName] = useState('')
    const [level, setLevel] = useState('')
    const [startAt, setStartAt] = useState('')
    const [startDate, setStartdate] = useState('')
    const [daysWeek, setDayWeek] = useState('')
    const createGroup = (e) => {
        e.preventDefault()
        const mutation = `
    mutation {
      createGroup(
        code:"KEY_ADM",
        name: "${name}",
        teacherName: "${teacherName}",
        level: ${level},
        startAt: "${startAt}",
        startDate: "${startDate}",
        daysWeek: ${daysWeek}
      ) {
        statusCode
        message
      }
    }
  `;
        axios
            .post("/query", { query: mutation })
            .then((response) => {
                ShowCreatetrue()
                refetch()
                CreateModal()
                setName('')
                setTeacherName('')
                setLevel('')
                setStartAt('')
                setStartdate('')
                setDayWeek('')
            })
            .catch((error) => {
                ShowCreatedFalse()
            });
    }
    const { data: Groups, refetch } = useQuery(GET_AllGroups, {
        variables: { page }
    })
    const handleNextPage = () => {
        if (page < Groups?.getGroups?.totalPage) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(prevPage => prevPage - 1);
        }
    };
    const isLastPage = page === Groups?.getGroups?.totalPage;


    const [deleteGroup] = useMutation(DELETE_GROUPS, {
        refetchQueries: [{ query: GET_AllGroups }],
        onError(error) {
            console.error(error);
            ShowDeleteFalse()
        },
    });

    const handleDelete = (id) => {
        deleteGroup({ variables: { code: 'KEY_ADM', id } })
            .then(() => {
                refetch();
                ShowDeleteTrue();
                setDelete(null);
            })
            .catch((error) => {
                console.error("Error deleting group:", error);
            });
    };

    const { setIsSidebarFull } = useOutletContext();

  const handleButtonClick = () => {
    setIsSidebarFull(true); // При нажатии на кнопку добавляем класс
  };
    return (
        <div className='Group'>
            <div className="header">
                <div className='header__wrapper'>
                    <div className='header__grid'>
                        <h1>
                            Group
                        </h1>
                        <button onClick={CreateModal}>
                            Create group
                        </button>
                    </div>
                    <button className='header__burger' onClick={handleButtonClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15"><path fill="currentColor" fillRule="evenodd" d="M1.5 3a.5.5 0 0 0 0 1h12a.5.5 0 0 0 0-1zM1 7.5a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 0 1h-12a.5.5 0 0 1-.5-.5m0 4a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 0 1h-12a.5.5 0 0 1-.5-.5" clipRule="evenodd"></path></svg>
                    </button>
                </div>
            </div>
            <div className='Group__main'>
                <div className='Group__table'>
                    <table>
                        <thead>
                            <tr>
                                <th className='Table__number'>
                                    <h3>
                                        #
                                    </h3>
                                </th>
                                <th>
                                    <h3>
                                        Name
                                    </h3>
                                </th>
                                <th>
                                    <h3>
                                        Teacher name
                                    </h3>
                                </th>
                                <th>
                                    <h3>
                                        Level
                                    </h3>
                                </th>
                                <th>
                                    <h3>
                                        Day
                                    </h3>
                                </th>
                                <th>
                                    <h3>
                                        Time
                                    </h3>
                                </th>
                                <th>
                                    <h3>
                                        Start At
                                    </h3>
                                </th>
                                <th>
                                    <h3>
                                        Setting
                                    </h3>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Groups?.getGroups?.items?.map((i, index) => (
                                <tr key={i.id}>
                                    <td className='Table__number'>
                                        <h3>
                                            {index + 1}
                                        </h3>
                                    </td>
                                    <td>
                                        <h3>
                                            {i.name}
                                        </h3>
                                    </td>
                                    <td>
                                        <h3>
                                            {i.teacherName}
                                        </h3>
                                    </td>
                                    <td>
                                        <h3>
                                            {i.level}
                                        </h3>
                                    </td>
                                    <td>
                                        <h3>
                                            {i.days_week}
                                        </h3>
                                    </td>
                                    <td>
                                        <h3>
                                            {i.start_at}
                                        </h3>
                                    </td>
                                    <td>
                                        <h3>
                                            {i.started_date.split('T')[0]}
                                        </h3>
                                    </td>
                                    <td>
                                        <div className='Table__setting'>
                                            <button onClick={() => DeleteModal(i.id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"></path></svg>
                                            </button>
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
                            <path fill="currentColor" fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"></path>
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
                            {Groups?.getGroups?.totalPage}
                        </span>
                    </div>
                    <button
                        onClick={handleNextPage}
                        disabled={isLastPage}
                        className={`btn ${isLastPage ? 'btn-dark' : ''}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
                            <path fill="currentColor" fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div className={`modal ${active ? "modal__active" : ''}`}>
                <div className='modal__content'>
                    <div className='modal__header'>
                        <h2>
                            Create Group
                        </h2>
                        <button onClick={CreateModal}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14"><path fill="currentColor" fillRule="evenodd" d="M1.707.293A1 1 0 0 0 .293 1.707L5.586 7L.293 12.293a1 1 0 1 0 1.414 1.414L7 8.414l5.293 5.293a1 1 0 0 0 1.414-1.414L8.414 7l5.293-5.293A1 1 0 0 0 12.293.293L7 5.586z" clipRule="evenodd"></path></svg>
                        </button>
                    </div>
                    <form onSubmit={createGroup}>
                        <label htmlFor="">
                            <h3>
                                Name:
                            </h3>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="text" />
                        </label>
                        <label htmlFor="">
                            <h3>
                                Teacher Name:
                            </h3>
                            <input
                                value={teacherName}
                                onChange={(e) => setTeacherName(e.target.value)}
                                type="text" />
                        </label>
                        <label htmlFor="">
                            <h3>
                                Group level:
                            </h3>
                            <select
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                name="" id="">
                                <option value="" disabled selected>Select Level</option>
                                <option value="BEGINNER">BEGINNER</option>
                                <option value="ELEMENTARY">ELEMENTARY</option>
                                <option value="PRE_INTERMEDIATE">PRE_INTERMEDIATE</option>
                                <option value="INTERMEDIATE">INTERMEDIATE</option>
                                <option value="UPPER_INTERMEDIATE">UPPER_INTERMEDIATE</option>
                                <option value="ADVANCED">ADVANCED</option>
                                <option value="PROFICIENT">PROFICIENT</option>
                            </select>
                        </label>
                        <label htmlFor="">
                            <h3>
                                Time:
                            </h3>
                            <input
                                value={startAt}
                                onChange={(e) => setStartAt(e.target.value)}
                                type="text" />
                        </label>
                        <label htmlFor="">
                            <h3>
                                Start Date:
                            </h3>
                            <input
                                value={startDate}
                                onChange={(e) => setStartdate(e.target.value)}
                                type="date" />
                        </label>
                        <label htmlFor="">
                            <h3>
                                Day Week:
                            </h3>
                            <select name="" id=""
                                value={daysWeek}
                                onChange={(e) => setDayWeek(e.target.value)}
                            >
                                <option value="" disabled selected>Select DAY</option>
                                <option value="ODD_DAYS">ODD_DAYS</option>
                                <option value="EVEN_DAYS">EVEN_DAYS</option>
                                <option value="CUSTOM">CUSTOM</option>
                            </select>
                        </label>
                        <button type='submit'>
                            Create
                        </button>
                    </form>
                </div>
            </div>
            <div className={`modal ${isDelete ? "modal__active" : ''}`}>
                <div className='Delete__modal'>
                    <div className='modal__header'>
                        <h2>
                            Delete Group
                        </h2>
                        <button onClick={() => setDelete(null)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14"><path fill="currentColor" fillRule="evenodd" d="M1.707.293A1 1 0 0 0 .293 1.707L5.586 7L.293 12.293a1 1 0 1 0 1.414 1.414L7 8.414l5.293 5.293a1 1 0 0 0 1.414-1.414L8.414 7l5.293-5.293A1 1 0 0 0 12.293.293L7 5.586z" clipRule="evenodd"></path></svg>
                        </button>
                    </div>
                    <div className='Delete__wrapper'>
                        <button onClick={() => handleDelete(isDelete)}>
                            Yes
                        </button>
                        <button onClick={() => setDelete(null)}>
                            No
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Group