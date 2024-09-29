import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function ProcessingPage() {
  const [processingPercentage, setProcessingPercentage] = useState(0);
  const { session_id: urlSessionId } = useParams();
  const session_id = localStorage.getItem('sessionId') || urlSessionId;
  // const sessionId = localStorage.getItem('sessionId');
  const chunks = localStorage.getItem('chunks');
  const navigate = useNavigate(); // Используйте useNavigate вместо useHistory
  const [vv, setVV]= useState(false)
  useEffect(() => {
    if (!session_id || !chunks) {
      console.error('Session ID or chunks not found in localStorage');
      return;
    }

    const websocketUrl = `${process.env.REACT_APP_BACKEND_URL_WS}ws/video-processing/${session_id}`;
    const ws = new WebSocket(websocketUrl);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      const data = event.data;
      console.log(data);
      if (data === "1") {
        setProcessingPercentage((prev) => Math.min(prev + (100 / chunks), 100));
      }else if (data === "2") {
        setVV(true)
        // Redirect to session ID page after 2 seconds
        setTimeout(() => {
          navigate(`/session_id/${session_id}`);
        }, 2000);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, [session_id, chunks]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Обработка видео</h1>
      <progress style={styles.progress} value={processingPercentage} max="100"></progress>
      <p style={styles.percentage}>{processingPercentage}% обработано</p>
      <p style={styles.percentage}>клипы созданы: {vv?  "ДА": "НЕТ"}</p>
      
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#333',
  },
  progress: {
    width: '60%',
    height: '40px',
    marginBottom: '20px',
  },
  percentage: {
    fontSize: '1.5rem',
    color: '#555',
  },
};

export default ProcessingPage;
