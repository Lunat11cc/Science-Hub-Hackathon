import React, {useEffect, useState} from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import '../assets/styles/ConfirmPanel.css';
import {useLocation, useNavigate} from "react-router-dom";

const ConfirmPanel = () => {
    const [news, setNews] = useState([]);

    const navigate = useNavigate()

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    let userEmail = searchParams.get('email');

    useEffect(() => {
        axios
            .get('http://localhost:5000/api/confirm')
            .then((response) => setNews(response.data))
            .catch((error) => console.error('Ошибка при получении данных: ' + error));
    }, []);

    console.log(news)

    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:5000/api/confirm/${id}`)
            .then((response) => {
                setNews(news.filter((item) => item.id !== id));
            })
            .catch((error) => console.error('Ошибка при удалении записи: ' + error));
    };

    console.log(news)

    const handleAccept = (id) => {
        const post = {
            title: news.find((item) => item.id === id).title,
            content: news.find((item) => item.id === id).content,
            author: news.find((item) => item.id === id).author,
            imageURL: news.find((item) => item.id === id).img,
        };

        axios
            .post('http://localhost:5000/api/news', post)
            .then((response) => {
                console.log('Пост успешно создан', response.data);
            })
            .catch((error) => console.error('Ошибка при создании поста: ' + error));

        handleDelete(id);
    };

    const exit = () => {
        navigate(`/?email=${userEmail}`)
    }

    return (
        <div
            style={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#212529',
                padding: '20px',
                color: 'white',
                backgroundSize: 'cover',
                minHeight: '100vh',
            }}
        >
            {news.length === 0 ? (
                <div style={{
                    display: "flex",
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    height: '95vh'
                }}>
                    <h3 style={{fontSize: 35}}>Нет статей для подтверждения.</h3>
                    <button
                        onClick={() => exit()}
                        type='submit'
                        className='btn btn-success w-25 rounded-5 mx-auto mt-4'
                    >
                        Выйти
                    </button>
                </div>
            ) : (
                news.map((item) => (
                    <div
                        key={item.id}
                        style={{
                            margin: '10px',
                            padding: '20px',
                            borderRadius: '5px',
                            backgroundColor: '#3b3b3b',
                            width: '450px',
                        }}
                    >
                        <h2
                            style={{
                                textAlign: 'center',
                            }}
                        >
                            {item.title}
                        </h2>
                        <img
                            style={{
                                maxWidth: '100%',
                                maxHeight: 'auto',
                                borderRadius:'10%',
                            }}
                            src={item.img}
                            alt=""
                        />
                        <p
                            style={{
                                textAlign: 'center',
                                wordWrap: 'break-word',
                            }}
                        >
                            {item.content}
                        </p>
                        <hr></hr>
                        <p
                            style={{
                                textAlign: 'left',
                                fontStyle: 'italic',
                                marginBottom: -1
                            }}
                        >
                            Дата отправки статьи на проверку:
                        </p>
                        <p
                            style={{
                                color: '#86D3FF',
                                textAlign: 'left',
                            }}
                        >
                            {moment(item.created_at).tz('Europe/Moscow').format('DD.MM.YYYY')}
                        </p>
                        <p
                            style={{
                                textAlign: 'left',
                                fontStyle: 'italic',
                                marginBottom: -1
                            }}
                        >
                            Автор:
                        </p>
                        <p
                            style={{
                                color: '#86D3FF',
                                textAlign: 'left',
                            }}>
                            {item.author}
                        </p>
                        <hr></hr>
                        <button
                            className='accept-btn'
                            onClick={() => handleAccept(item.id)}
                            style={{
                                marginBottom: '15px',
                                color: 'white',
                                border: 'none',
                                borderRadius: '25px',
                                padding: '10px 20px',
                                cursor: 'pointer',
                                marginRight: '10px',
                                float: 'left',
                                backgroundColor: '#198754',
                            }}
                        >
                            Принять
                        </button>
                        <button
                            onClick={() => handleDelete(item.id)}
                            className='decline-btn'
                            style={{
                                color: 'white',
                                border: 'none',
                                borderRadius: '25px',
                                padding: '10px 20px',
                                cursor: 'pointer',
                                float: 'left',
                                backgroundColor: '#dc3545',
                            }}
                        >
                            Отклонить
                        </button>
                        <button
                            onClick={() => exit()}
                            type='submit'
                            className='decline-btn'
                            style={{
                                color: 'white',
                                border: 'none',
                                borderRadius: '25px',
                                padding: '10px 20px',
                                cursor: 'pointer',
                                backgroundColor: '#198754',
                                position: 'absolute',
                                top: 25,
                                right: 100
                            }}
                        >
                            Главная
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default ConfirmPanel;
