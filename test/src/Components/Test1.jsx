import React, { useState } from 'react';
import '../Style/Test.css';
import { gql, useQuery, useMutation } from '@apollo/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Запрос на получение данных коллекции
const GET_COLLECTION = gql`
 query{
   getCollectionActive{
    id
    title
    questions
    createdAt
  }
}
`;

// Мутация для отправки ответов студента
const CREATE_STUDENT_ANSWER = gql`
  mutation CreateStudentAnswer($collectionId: ID!, $answers: [String!]!, $code: String!) {
    createStudentAnswer(collectionId: $collectionId, answers: $answers, code: $code) {
      statusCode
      message
    }
  }
`;

function Test1() {
  const showSuccessToast = () => {
    toast.success('Good!', {
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

  const showErrorToast = () => {
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

  const { data: Collection, loading, error } = useQuery(GET_COLLECTION);
  const [inputs, setInputs] = useState({});
  const [code, setCode] = useState('');
  const [createStudentAnswer] = useMutation(CREATE_STUDENT_ANSWER);

  // Обработка изменений в инпутах
  const handleInputChange = (e, index) => {
    setInputs((prev) => ({
      ...prev,
      [index]: e.target.value,
    }));
  };

  // Функция для парсинга текста с инпутами
  const parseTextWithInputs = (text) => {
    let inputIndex = 0; // Глобальный индекс для инпутов

    return text.split('\n').flatMap((part, index) => {
      const subParts = part.split(/(\[qazwsxedc\])/); // Разделяем текст по маркеру

      return (
        <React.Fragment key={index}>
          {subParts.map((subPart) => {
            if (subPart === '[qazwsxedc]') {
              const currentIndex = inputIndex; // Запоминаем текущий индекс
              inputIndex++; // Увеличиваем индекс для следующего инпута

              return (
                <input
                  key={currentIndex}
                  type="text"
                  value={inputs[currentIndex] || ''}
                  onChange={(e) => handleInputChange(e, currentIndex)}
                  placeholder=""
                />
              );
            } else {
              return <React.Fragment key={inputIndex}>{subPart}</React.Fragment>;
            }
          })}
          {index < text.split('\n').length - 1 && <br />} {/* Добавляем <br /> после каждой строки, кроме последней */}
        </React.Fragment>
      );
    });
  };

  // Обработка отправки формы
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const collectionId = Collection?.getCollectionActive?.id;

    if (!collectionId) {
      showErrorToast();
      return;
    }

    // Определяем общее количество инпутов, чтобы даже пустые поля отправлялись
    const totalInputs = (Collection?.getCollectionActive?.questions.match(/\[qazwsxedc\]/g) || []).length;

    // Собираем ответы, заполняя пустые поля пустыми строками
    const answers = Array.from({ length: totalInputs }, (_, index) => inputs[index] || '');

    try {
      const { data } = await createStudentAnswer({
        variables: {
          collectionId: collectionId,  // Используем id из getCollectionActive
          answers,
          code,
        },
      });
      if (data.createStudentAnswer.statusCode === 200) {
        showSuccessToast();
        setInputs({});
        setCode('');
      } else {
        showErrorToast();
      }
    } catch (error) {
      showErrorToast();
      console.error('error', error);
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка загрузки данных.</p>;

  return (
    <div className="Test">
      <div className="Test__wrapper">
        <div className="Test__list bg__img">
          {Collection?.getCollectionActive?.questions && parseTextWithInputs(Collection.getCollectionActive.questions)}
        </div>
      </div>
      <div className="Test__code">
        <form onSubmit={handleFormSubmit}>
          <h3 className='bot'>
            To get a 10-minute key from the  <a href="https://t.me/codevanbot" target="_blank" rel="noopener noreferrer">
            @codevanbot</a>  on Telegram
          </h3>
          <label>
            <input
              type="text"
              placeholder="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </label>
          <button type="submit">Sent</button>
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default Test1;
