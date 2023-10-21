import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './Home.jsx';
import Registration from './Registration';
import Login from './Login';
import AddNews from "../components/AddNews.jsx";
import ConfirmPanel from "./ConfirmPanel.jsx";
import Article from "./Article.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<Registration/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/addTask" element={<AddNews/>}/>
        <Route path="/confirm" element={<ConfirmPanel/>}/>
        <Route path="/article/:id" element={<Article />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;