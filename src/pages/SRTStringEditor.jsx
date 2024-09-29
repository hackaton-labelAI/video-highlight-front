import React, { useEffect, useState } from 'react';
import { TextField, Card, CardContent, Typography, Button } from '@mui/material';


const convertPlainTextToEscaped = (plainText) => {
    return plainText.replace(/\n/g, '\\n');
  };
  

const SRTStringEditor = ({ initialSRT, session_id, video_id }) => {
  const [srtString, setSrtString] = useState(()=>(initialSRT.replace(/\\n/g, '\n')));

  const handleChange = (event) => {
    setSrtString(event.target.value);
  };

  useEffect(()=>{
    setSrtString(()=>(initialSRT.replace(/\\n/g, '\n')))
  }, [initialSRT])


  const handleSaveSubtitles = async () => {
    const srtOutput = convertPlainTextToEscaped(srtString);
    const url = `${process.env.REACT_APP_BACKEND_URL_HTTP}project/${session_id}/subtitles/${video_id}?input_str=${srtOutput}`;
    try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'accept': 'application/json'
          }
        });
        if (response.ok) {
          console.log('Subtitles saved successfully!');
        } else {
          console.error('Failed to save subtitles:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
  };

  return (
    <Card variant="outlined" style={{ margin: '16px', padding: '16px' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Edit SRT String
        </Typography>
        <TextField
          fullWidth
          multiline
          variant="outlined"
          value={srtString}
          onChange={handleChange}
          rows={10}
          inputProps={{
            style: { fontFamily: 'monospace' }, // Устанавливаем шрифт для отображения SRT
          }}
        />
      </CardContent>
      <Button 
          variant="contained" 
          color="primary" 
          style={{ marginTop: '16px' }} 
          onClick={handleSaveSubtitles}
        >
          Сохранить субтитры
        </Button>
    </Card>
  );
};

export default SRTStringEditor;
