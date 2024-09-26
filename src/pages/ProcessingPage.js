import React, { useEffect, useState } from 'react';

function ProcessingPage() {
  const [processingPercentage, setProcessingPercentage] = useState(0);
  const sessionId = localStorage.getItem('sessionId');
  const chunks = localStorage.getItem('chunks');

  useEffect(() => {
    if (!sessionId || !chunks) {
      console.error('Session ID or chunks not found in localStorage');
      return;
    }

    const websocketUrl = `ws://localhost:8000/ws/video-processing/${sessionId}`;
    const ws = new WebSocket(websocketUrl);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      const data = event.data;
      console.log(data);
      if (data === "1") {
        setProcessingPercentage((prev) => Math.min(prev + (100 / chunks), 100));
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, [sessionId, chunks]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Обработка видео</h1>
      <progress style={styles.progress} value={processingPercentage} max="100"></progress>
      <p style={styles.percentage}>{processingPercentage}% обработано</p>
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
