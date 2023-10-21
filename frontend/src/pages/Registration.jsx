import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import '../assets/styles/Registration.css'


const Register = () => {

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  })

  const navigate = useNavigate()
  const handleSubmit = (event) => {
    console.log(values)
    event.preventDefault();
    axios.post('http://localhost:5000/register', values)
      .then(res => {
        if (res.data.Status === 'Успешно!') {
          navigate('/login')
        } else {
          alert('Ошибка!');
        }
      })
      .then(err => console.log(err));
  }

  return (
    <div className='d-flex justify-content-center align-items-center bg-dark vh-100'>
      <div
        id='form__reg'
        className='p-3 rounded w-25 d-flex flex-column align-items-center'>
        <div className='mb-4 text-center'>
          <h2 className='text-light'>Регистрация</h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className='d-flex flex-column align-items-center'>
          <div className='mb-4' style={{width: '130%'}}>
            <input
              type='text'
              placeholder='Имя'
              name='name'
              onChange={e => setValues({...values, name: e.target.value})}
              className='form-control rounded-2'
            />
          </div>
          <div className='mb-4' style={{width: '130%'}}>
            <input
              type='email'
              placeholder='Email'
              name='email'
              onChange={e => setValues({...values, email: e.target.value})}
              className='form-control rounded-2'
            />
          </div>
          <div className='mb-4' style={{width: '130%'}}>
            <input
              type='password'
              placeholder='Пароль'
              name='password'
              onChange={e => setValues({...values, password: e.target.value})}
              className='form-control rounded-2'/>
          </div>
          <button
            type='submit'
            className='btn btn-danger w-100 rounded-5 mx-auto'>
            Зарегистрироваться
          </button>
          <div className='text-center mt-2'>
            <Link
              to='/login'
              className='text-light text-decoration-none'>
              Уже есть аккаунт? Войти
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;