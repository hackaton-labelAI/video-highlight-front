import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function VideoPreviewPage({setVideoInfo}) {
    const [videos, setVideos] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const session_id = localStorage.getItem('sessionId');
  
    useEffect(() => {
      const fetchVideoData = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL_HTTP}project/${session_id}/videos`);
          const data = await response.json();
  
          // Устанавливаем данные о видео
          setVideos(data); // Сохраняем данные в стейт
        } catch (err) {
          setError('Ошибка при загрузке данных: ' + err.message);
        }
      };
  
      fetchVideoData();
    }, [session_id]);
  
    if (error) return <div>{error}</div>;
  
    if (!videos.length) {
      // Показать сообщение о загрузке или пустое состояние, пока данные не пришли
      return <div>Загрузка...</div>;
    }

    const videoInfo = (index, video) =>{
        console.log(video)
        setVideoInfo(video)
        navigate(`/video/${session_id}/chunk/${index}`)
    }
  
    return (
      <div style={styles.gridContainer}>
        {videos.map((video, index) => (
          <div
            key={index}
            style={styles.card}
            onClick={() => videoInfo(index, video)}
          >
            <img
              src={`${process.env.REACT_APP_BACKEND_URL_HTTP}project/${session_id}/video/${video.file_name}/frame`}
              alt={video.file_name || 'Video preview'}
              style={styles.image}
            />
            <h3 style={styles.title}>{video.json_data.title}</h3>
          </div>
        ))}
      </div>
    );
  }
// Пример стилей для сетки
const styles = {
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    padding: '20px',
  },
  card: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '10px',
    cursor: 'pointer',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s',
  },
  cardHover: {
    transform: 'scale(1.05)',
  },
  image: {
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  title: {
    marginTop: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
  },
};

export default VideoPreviewPage;
