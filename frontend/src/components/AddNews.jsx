import React, {useEffect, useState} from 'react';
import axios from 'axios';
import '../assets/styles/AddNews.css'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import '../assets/styles/AddNews.css'

const AddNews = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [author, setAuthor] = useState('')

  axios.defaults.withCredentials = true;
  const navigate = useNavigate()

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let userEmail = searchParams.get('name');
  let userAddress = searchParams.get('email')

  useEffect(() => {
    setAuthor(userEmail)
  }, []);

  const [email, setEmail] = useState(userAddress);
  const [admin, setAdmin] = useState(false)
  const [imageURL, setImageURL] = useState('');

  const checkAdminRole = async () => {
    try {
      const response = await axios.get('http://localhost:5000/checkAdminRole', {
        withCredentials: true,
        params: {
          email: email,
        },
      });

      if (response.data.isAdmin) {
        setAdmin(true)
      } else {
        setAdmin(false)
      }
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
    }
  };

  checkAdminRole()

  const addNews = () => {
    if (title.trim() === '' || content.trim() === '') {
      setError('Название и содержимое не могут быть пустыми.');
      return;
    } else {
      if (admin) {
        alert('Ваша статья создана');
      } else {
        alert('Ваша статья отправлена на рассмотрение');
      }
    }

    const newsData = {
      title,
      content,
      author,
      imageURL,
    };

    if (admin) {
      axios
        .post('http://localhost:5000/api/news', newsData)
        .then(() => {
          setTitle('');
          setContent('');
          setImageURL('');
          setError('');
        })
        .catch((error) =>
          console.error('Ошибка при добавлении новости: ' + error)
        );
    } else {
      axios
        .post('http://localhost:5000/api/confirm', newsData)
        .then((response) => {
          console.log('Пост успешно создан', response.data);
        })
        .catch((error) =>
          console.error('Ошибка при создании поста: ' + error)
        );
    }
  };

  const exit = () => {
    navigate(`/?email=${userAddress}`)
  }

  return (
    <div className='d-flex justify-content-center align-items-center bg-dark vh-100'>
      <div id='form__reg' className='p-3 rounded w-25 d-flex flex-column align-items-center'>
        <div className='mb-4 text-center'>
          <h2 className='text-light'>Создать статью</h2>
        </div>
        <form className='d-flex flex-column align-items-center'>
          <div className={`mb-4 ${error && title.trim() === '' ? 'has-error' : ''}`} style={{width: '140%'}}>
            <input
              required
              type='text'
              placeholder='Название'
              name='name'
              className={`form-control rounded-2 ${error && title.trim() === '' ? 'is-invalid' : ''}`}
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="URL изображения"
              name="imageURL"
              className="form-control rounded-2"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
            />
          </div>
          <div className={`mb-4 ${error && content.trim() === '' ? 'has-error' : ''}`} style={{width: '140%'}}>
            <textarea
              required
              type='email'
              placeholder='Содержимое'
              name='email'
              className={`form-control rounded-2 ${error && content.trim() === '' ? 'is-invalid' : ''}`}
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>
          <div className='d-flex gap-2'>
            <button
              onClick={() => exit()}
              type="button"
              className="btn btn-danger w-100 rounded-5 mx-auto"
            >
              Отмена
            </button>
            <Link to={title && content ? `/?email=${userAddress}` : '#'}>
              <button
                onClick={addNews}
                type='button'
                className='btn btn-success w-100 rounded-5 mx-auto'
              >
                Добавить
              </button>
            </Link>
          </div>
          <div className='text-center mt-2'></div>
        </form>
      </div>
    </div>
  );
};

export default AddNews;
