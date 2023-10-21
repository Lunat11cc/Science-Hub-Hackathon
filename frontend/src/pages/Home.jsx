import React, {useState} from 'react';
import Navbar from "../components/Navbar.jsx";
import '../assets/styles/Home.css'
import List from "../components/List.jsx";

const Home = () => {
  const [data, setData] = useState('')

    return (
        <div className='bg-dark text-light'
             style={
                 {
                     backgroundSize: 'cover',
                     minHeight: '100vh',
                 }
             }>
            <Navbar setData={setData}/>
            <List data={data}/>
        </div>
    );
};

export default Home;