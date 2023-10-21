import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/Login.css';

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post('http://localhost:5000/login', values)
      .then((res) => {
        if (res.data.Status === 'Успешно!') {
          navigate(`/?email=${values.email}`)
        } else {
          alert(res.data.Error);
        }
      })
      .then((err) => console.log(err));
  };

  return (
    <div className='d-flex justify-content-center align-items-center bg-dark vh-100'>
      <div
        id='form__login'
        className='p-3 rounded w-25 d-flex flex-column align-items-center'>
        <div className='mb-4 text-center'>
          <h2 className='text-light'>Авторизация</h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className='d-flex flex-column align-items-center'>
          <div className='mb-4' style={{width: '130%'}}>
            <input
              type='email'
              placeholder='Email'
              name='email'
              onChange={(e) => setValues({...values, email: e.target.value})}
              className='form-control rounded-2'
            />
          </div>
          <div className='mb-4' style={{width: '130%'}}>
            <input
              type='password'
              placeholder='Пароль'
              name='password'
              onChange={(e) => setValues({...values, password: e.target.value})}
              className='form-control rounded-2'
            />
          </div>
          <button
            onClick={handleSubmit}
            type='submit'
            className='btn btn-danger w-75 rounded-5 mx-auto'>
            Войти
          </button>
        </form>
        <div className='text-center mt-2'>
          <Link
            to='/register'
            className='text-light text-decoration-none'>
            Нет аккаунта? Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;