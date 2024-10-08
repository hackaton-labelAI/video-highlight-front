import React, { useState } from 'react';
import { Button, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Используйте useNavigate вместо useHistory

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Пожалуйста, выберите файл.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL_HTTP}upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json(); // Предполагаем, что сервер возвращает JSON
        setMessage('Файл успешно загружен!');
        localStorage.setItem('sessionId', data.session_id);
        localStorage.setItem('chunks', data.chunks);
        navigate('/processing');
      } else {
        setMessage('Ошибка при загрузке файла.');
      }
    } catch (error) {
      setMessage('Произошла ошибка: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Загрузить MP4 файл
      </Typography>

      <Button
        variant="contained"
        component="label"
        sx={{ mb: 2 }}
      >
        Выберите файл
        <input type="file" accept="video/mp4" hidden onChange={handleFileChange} />
      </Button>

      {selectedFile && (
        <Typography variant="body1" sx={{ mb: 2 }}>
          Выбран файл: {selectedFile.name}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Загрузить'}
      </Button>

      {message && (
        <Alert severity={message.includes('успешно') ? 'success' : 'error'} sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}
    </Box>
  );
}

export default UploadPage;
