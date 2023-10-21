import React, {useEffect, useState} from 'react';
import '../assets/styles/Navbar.css';
import logo from '../assets/images/logo.svg';
import acc from '../assets/images/acc.svg';
import add from '../assets/images/add.svg';
import mark from '../assets/images/mark.svg'
import {Link, useLocation, useNavigate} from 'react-router-dom';
import axios from "axios";

const Navbar = ({setData}) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let userEmail = searchParams.get('email');

  const storedEmail = localStorage.getItem('userEmail');

  const navigate = useNavigate()

  if (userEmail && userEmail !== 'Личный кабинет') {
    localStorage.setItem('userEmail', userEmail);
  } else if (storedEmail) {
    userEmail = storedEmail;
  } else {
    userEmail = 'Личный кабинет';
  }

  const exit = () => {
    setEmail('')
    navigate('/')
    setAdmin(false)
    setMenuOpen(false)
  }

  const [email, setEmail] = useState(userEmail);
  const [author, setAuthor] = useState('')
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('userEmail', email);
    setData(email)
  }, [email]);

  const [admin, setAdmin] = useState(false)

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

  useEffect(() => {
    axios.get(`http://localhost:5000/api/user/${email}`)
      .then((response) => {
        const user = response.data;
        setAuthor(user.username)
      })
      .catch((error) => {
        console.error('Ошибка при выполнении запроса:', error);
      });
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <div className='nav'>
        <img className='logo' src={logo} alt="logo"/>
        <div className='d-flex justify-content-center flex-column gap-5'>
          <div className='d-flex align-items-center justify-content-start'>
            <img className='acc' src={acc} alt="acc"/>
            <Link onClick={toggleMenu} className='link-btn' to={email && email !== 'Личный кабинет' ? '#' : '/login'}>
              <h2 className='tp text-dark fs-5'>{email ? email : 'Личный кабинет'}</h2>
            </Link>
          </div>
          {menuOpen && (
            <button
              onClick={() => exit()}
              type='submit'
              className='btn btn-danger w-50 rounded-5 mx-auto'
              style={{marginTop: -30}}
            >
              Выйти
            </button>
          )}
          {email && email !== 'Личный кабинет' ? (<div className='d-flex align-items-center justify-content-start'>
            <img className='add' src={add} alt="add"/>
            <Link className='link-btn' to={'/addTask?name=' + author + '&email=' + email}>
              <h2 className='tp text-dark fs-5'>Добавить статью</h2>
            </Link>
          </div>) : <div></div>}
          {admin ? <div className='d-flex align-items-center justify-content-start'>
            <img className='acc' src={mark} alt="acc"/>
            <Link className='link-btn' to={'/confirm?email=' + email}>
              <h2 className='tp text-dark fs-5'>Панель управления</h2>
            </Link>
          </div> : <div></div>}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
