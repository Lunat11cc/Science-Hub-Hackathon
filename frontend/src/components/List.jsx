import React, {useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import axios from "axios";
import '../assets/styles/List.css'

const List = ({data}) => {
  const [news, setNews] = useState([]);
  const [admin, setAdmin] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let userEmail = searchParams.get('email');

  const savedEmail = localStorage.getItem('email');
  const [email, setEmail] = useState(savedEmail && userEmail);

  useEffect(() => {
    localStorage.setItem('email', email);
  }, [email]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/news')
      .then(response => setNews(response.data))
      .catch(error => console.error('Ошибка при получении данных: ' + error));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/news/${id}`)
      .then(response => {
        setNews(news.filter(item => item.id !== id));
      })
      .catch(error => console.error('Ошибка при удалении записи: ' + error));
  };

  useEffect(() => {
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
          console.log('Пользователь не имеет роли админа');
          setAdmin(false)
        }
      } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
      }
    };

    checkAdminRole()
  }, [email]);

  return (
    <div className="d-flex justify-content-center flex-column">
      {data && data !== 'Личный кабинет' ? (
        <div>
          <h1>Популярные статьи и достижения</h1>
          <table style={{marginLeft: '25%'}} className="table w-75">
            <thead>
            <tr>
              <th style={{background: 'none', border: 'none', color: '#86D3FF', fontSize: 25}}>№</th>
              <th style={{
                background: 'none',
                border: 'none',
                color: '#86D3FF',
                fontSize: 25
              }}>Название
              </th>
              <th style={{background: 'none', border: 'none', color: '#86D3FF', fontSize: 25}}>Автор</th>
              <th style={{background: 'none', border: 'none', color: '#86D3FF', fontSize: 25}}>Год</th>
              {admin && <th style={{
                background: 'none',
                border: 'none',
                color: '#86D3FF',
                fontSize: 25
              }}>Действия</th>}
            </tr>
            <hr style={{
              width: '70%',
              height: 2,
              backgroundColor: 'white',
              position: 'fixed',
              top: '29%',
              right: '9.2%',
              marginTop: '-50px'
            }}></hr>
            </thead>
            <tbody>
            {news.map((item, index) => (
              <tr key={item.id}>
                <td style={{background: 'none', border: 'none', color: 'white', fontSize: 25}}>
                  {index + 1}
                </td>
                <td style={{background: 'none', border: 'none', color: 'white', fontSize: 25}}>
                  <Link className='trans-btn' to={`/article/${item.id}`}>{item.title}</Link>
                </td>
                <td style={{background: 'none', border: 'none', color: 'white', fontSize: 25}}>{item.author}</td>
                <td style={{background: 'none', border: 'none', color: 'white', fontSize: 25}}>
                  {new Date(item.created_at).getFullYear()}
                </td>
                <td style={{background: 'none', border: 'none', color: 'white', fontSize: 25}}>
                  {admin && (
                    <button onClick={() => handleDelete(item.id)} className="btn btn-danger w-25 rounded-5 mx-auto">
                      Удалить
                    </button>
                  )}
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      ) : (
        <h1 style={{display: 'flex', justifyContent: 'center', marginTop: '17%', fontSize: 35}}>
          Пожалуйста, <Link className="link-list" to="/login">
          авторизируйтесь
        </Link>, чтобы просматривать записи!
        </h1>
      )}
    </div>
  );
};

export default List;
