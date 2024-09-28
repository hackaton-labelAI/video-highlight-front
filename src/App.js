import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import ProcessingPage from './pages/ProcessingPage';
import VideoPreviewPage from './pages/VideoPreviewPage';
import EditPage from './pages/EditPage';

function App() {

  const [videoInfo, setVideoInfo ] = useState({})
  useEffect(()=>{
    console.log(videoInfo)
  },[videoInfo])
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/processing" element={<ProcessingPage />} />
        <Route path="/session_id/:session_id" element={<VideoPreviewPage setVideoInfo={setVideoInfo} />} />
        <Route path="/video/:session_id/chunk/:chunk_id" element={<EditPage videoInfo={videoInfo} />} />
      </Routes>
    </Router>
  );
}

export default App;
