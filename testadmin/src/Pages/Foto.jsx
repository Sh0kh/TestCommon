import React, { useState } from 'react';
import '../Style/Foto.css';
import { gql, useMutation, useQuery } from '@apollo/client';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useOutletContext } from 'react-router-dom';

// Запрос для получения коллекций
const GET_ALL_COLLECTION = gql`
  query {
    getCollection {
      id
      title
      createdAt
      isActive
    }
  }
`;

// Мутация для создания ответов
const CREATE_ANSWER = gql`
  mutation CreateAnswer($collectionId: ID!, $answers: [String!]!, $isUpdated: Boolean!) {
    createAnswer(code:"KEY_ADM", collectionId: $collectionId, answers: $answers, isUpdated: $isUpdated) {
      statusCode
      message
    }
  }
`;

const ACTIVE_COLLECTION = gql`
  mutation updateCollectionActive($collectionId: ID!) {
    updateCollectionActive(code: "KEY_ADM", collectionId: $collectionId) {
      statusCode
      message
    }
  }
`;

const DELETE_COLLECTION = gql`
  mutation deleteCollection($code: String!, $id: ID!) {
    deleteCollection(code: $code, id: $id) {
      statusCode
      message
    }
  }
`;

function Foto() {
  const [isDelete, setDelete] = useState(false);
  const [active, setActive] = useState(false);
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [numberOfInputs, setNumberOfInputs] = useState(0); // Начальное количество инпутов
  const [dynamicInputs, setDynamicInputs] = useState([]);

  const [createAnswer] = useMutation(CREATE_ANSWER);
  const [updateCollectionActive] = useMutation(ACTIVE_COLLECTION, {
    onCompleted: () => {  
      refetch();
    },
  });
  const [deleteCollection] = useMutation(DELETE_COLLECTION, {
    refetchQueries: [{ query: GET_ALL_COLLECTION }],
    onError(error) {
      console.error(error);
      ShowDeleteFalse();
    },
  });

  const { data: Collection, refetch } = useQuery(GET_ALL_COLLECTION);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleNumberOfInputsChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value < 0) {
      setNumberOfInputs(0);
      setDynamicInputs([]);
    } else if (value > 100) {
      setNumberOfInputs(100);
      setDynamicInputs(Array(100).fill(''));
      toast.warn('Maximum number of inputs is 100!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      setNumberOfInputs(value);
      setDynamicInputs(value > 0 ? Array(value).fill('') : []);
    }
  };
  const handleDynamicInputChange = (index, event) => {
    const newInputs = [...dynamicInputs];
    newInputs[index] = event.target.value;
    setDynamicInputs(newInputs);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Создание коллекции
    const formData = new FormData();
    formData.append('operations', JSON.stringify({
      query: `
        mutation($name: String!, $file: Upload!) {
          createCollection(code:"KEY_ADM", name: $name, file: $file) {
            statusCode
            message
          }
        }
      `,
      variables: { name, file: null }
    }));
    formData.append('map', JSON.stringify({ '0': ['variables.file'] }));
    if (file) {
      formData.append('0', file);
    }

    try {
      const response = await axios.post('/query', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      ShowCreatetrue();
      refetch();
      const collectionId = response.data.data.createCollection.message;

      // Создание ответов
      await createAnswer({
        variables: {
          collectionId,
          answers: dynamicInputs,
          isUpdated: false,
        }
      });

      setActive(false);
    } catch (error) {
      ShowCreatedFalse();
    }
  };

  const handleUpdateActive = (id) => {
    updateCollectionActive({ variables: { collectionId: id } });
  };

  const handleDelete = (id) => {
    deleteCollection({ variables: { code: 'KEY_ADM', id } })
      .then(() => {
        refetch();
        ShowDeleteTrue();
        setDelete(null);
      })
      .catch((error) => {
        console.error("Error deleting collection:", error);
      });
  };

  const { setIsSidebarFull } = useOutletContext();

  const handleButtonClick = () => {
    setIsSidebarFull(true); // При нажатии на кнопку добавляем класс
  };

  // Toast notifications
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

  return (
    <div className='Foto'>
      <div className="header">
        <div className='header__wrapper'>
          <div className='header__grid'>
            <h1>Collection</h1>
            <button onClick={() => setActive(true)}>Create Collection</button>
          </div>
          <button className='header__burger' onClick={handleButtonClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15"><path fill="currentColor" fillRule="evenodd" d="M1.5 3a.5.5 0 0 0 0 1h12a.5.5 0 0 0 0-1zM1 7.5a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 0 1h-12a.5.5 0 0 1-.5-.5m0 4a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 0 1h-12a.5.5 0 0 1-.5-.5" clipRule="evenodd"></path></svg>
          </button>
        </div>
      </div>
      <div className='Foto__main'>
        <div className='Foto__table'>
          <table>
            <thead>
              <tr>
                <th className='Table__number'><h3>#</h3></th>
                <th><h3>Name</h3></th>
                <th><h3>Creation date</h3></th>
                <th><h3>State</h3></th>
                <th><h3>Setting</h3></th>
              </tr>
            </thead>
            <tbody>
              {Collection?.getCollection?.map((i, index) => (
                <tr key={i.id}>
                  <td className='Table__number'><h3>{index + 1}</h3></td>
                  <td><h3>{i.title}</h3></td>
                  <td><h3>{i.createdAt.split('T')[0]}</h3></td>
                  <td className='Btn_wrapper'><button className={`defBtn ${i.isActive ? 'activeBtn' : ''}`}
                    onClick={() => handleUpdateActive(i.id)}
                  >
                    {i.isActive ? 'Active' : 'Not active'}
                  </button></td>
                  <td>
                    <div className='Table__setting'>
                      <button className='btn' onClick={() => setDelete(i.id)}>
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
      {/* Модальное окно для создания коллекции */}
      <div className={`modal ${active ? "modal__active" : ''}`}>
        <div className='modal__content'>
          <div className='modal__con'>
            <div className='modal__header'>
              <h2>Create Collection</h2>
              <button onClick={() => setActive(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14">
                  <path fill="currentColor" fillRule="evenodd" d="M1.707.293A1 1 0 0 0 .293 1.707L5.586 7L.293 12.293a1 1 0 1 0 1.414 1.414L7 8.414l5.293 5.293a1 1 0 0 0 1.414-1.414L8.414 7l5.293-5.293A1 1 0 0 0 12.293.293L7 5.586z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <label>
                <h3>Name:</h3>
                <input type="text" value={name} onChange={handleNameChange} />
              </label>
              <div className="modal-foto">
                <h3>File</h3>
                <label className="file-input-container" htmlFor="editPhoto">
                  <span className='sl'>File</span>
                  <input id="editPhoto" accept="image/*" type="file" onChange={handleFileChange} />
                </label>
              </div>
              <label className='inp'>
                <h3>Number of:</h3>
                <input
                  type="number"
                  value={numberOfInputs}
                  onChange={handleNumberOfInputsChange}
                  min="0" // Позволяет значение 0
                />
              </label>
              {numberOfInputs > 0 && (
                <div className='Modal__wrapper'>
                  {dynamicInputs.map((input, index) => (
                    <div key={index} className="dynamic-input">
                      <label>
                        <h3>Input {index + 1}:</h3>
                        <input
                          type="text"
                          value={input}
                          onChange={(event) => handleDynamicInputChange(index, event)}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              )}
              <button type='submit'>Create</button>
            </form>
          </div>
        </div>
      </div>
      {/* Модальное окно для подтверждения удаления */}
      <div className={`modal ${isDelete ? "modal__active" : ''}`}>
        <div className='Delete__modal'>
          <div className='modal__header'>
            <h2>Delete Collection</h2>
            <button onClick={() => setDelete(null)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14">
                <path fill="currentColor" fillRule="evenodd" d="M1.707.293A1 1 0 0 0 .293 1.707L5.586 7L.293 12.293a1 1 0 1 0 1.414 1.414L7 8.414l5.293 5.293a1 1 0 0 0 1.414-1.414L8.414 7l5.293-5.293A1 1 0 0 0 12.293.293L7 5.586z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
          <div className='Delete__wrapper'>
            <button onClick={() => handleDelete(isDelete)}>Yes</button>
            <button onClick={() => setDelete(null)}>No</button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Foto;
