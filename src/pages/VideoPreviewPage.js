import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function VideoPreviewPage({ setVideoInfo }) {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { session_id: urlSessionId } = useParams();
  const session_id = localStorage.getItem('sessionId') || urlSessionId;
  
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL_HTTP}project/${session_id}/videos`);
        const data = await response.json();
  
        setVideos(data); 
      } catch (err) {
        setError('Ошибка при загрузке данных: ' + err.message);
      }
    };
  
    fetchVideoData();
  }, [session_id]);
  
  if (error) return <div style={styles.error}>{error}</div>;
  
  if (!videos.length) {
    return <div>Загрузка...</div>;
  }

  const videoInfo = (index, video) => {
    console.log(video);
    setVideoInfo(video);
    navigate(`/video/${session_id}/chunk/${index}`);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentContainer}>
        <h2 style={styles.header}>Найденные моменты</h2>
        <div style={styles.gridContainer}>
          {videos.map((video, index) => (
            <div
              key={index}
              style={styles.card}
              onClick={() => videoInfo(index, video)}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <img
                src={`${process.env.REACT_APP_BACKEND_URL_HTTP}project/${session_id}/video/${video.file_name}/frame`}
                alt={video.file_name || 'Video preview'}
                style={styles.image}
              />
              <h3 style={styles.title}>{index}. {video.json_data.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Пример стилей для контейнера и сетки
const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#f9f9f9', // Фон страницы для визуального разделения
    minHeight: '100vh',
  },
  contentContainer: {
    maxWidth: '1200px',
    width: '100%',
    backgroundColor: '#ffffff', // Белый фон для карточек
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Тень для объема
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  card: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '10px',
    cursor: 'pointer',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s',
    maxWidth: '60ch', 
    maxHeight: '60em',
    overflow: 'hidden',
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
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: '20px',
  },
};

export default VideoPreviewPage;
