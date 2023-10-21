import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  
  useEffect(() => {
    axios.get(`http://localhost:5000/api/news/${id}`)
      .then(response => setArticle(response.data))
      .catch(error => console.error('Ошибка при получении данных о статье: ' + error));
  }, [id]);

  if (!article) {
    return <div>Loading...</div>;
  }

    return (
        <div
            style={{
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
            <div
                style={{
                    backgroundColor: '#3b3b3b',
                    borderRadius: '5px',
                    width: '450px',
                    padding: '20px',
                    margin: '10px',
                }}
            >
                <h1
                    style={{
                        textAlign: 'center',
                    }}
                >
                    {article.title}
                </h1>
                <p
                    style={{
                        textAlign: 'justify',
                        wordWrap: 'break-word',
                    }}
                >
                    {article.content}
                </p>
                <img
                    src={article.img}
                    alt=""
                    style={{
                        maxWidth: '100%',
                        maxHeight: 'auto',
                        borderRadius:'10%',
                    }}
                />
                <p>Автор: {article.author}</p>
                <p>Год: {new Date(article.created_at).getFullYear()}</p>
            </div>
        </div>
    );
};

export default Article;
