import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import Button from '@mui/material/Button';

const InterviewPage = () => {
  const [question, setQuestion] = useState('Tell me about yourself');
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturedChunks, setCapturedChunks] = useState([]);

  const handleStartRecording = () => {
    setCapturedChunks([]);
    setRecording(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: 'video/webm',
    });
    mediaRecorderRef.current.addEventListener(
      'dataavailable',
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  };

  const handleDataAvailable = useCallback(({ data }) => {
    if (data.size > 0) {
      setCapturedChunks((prev) => prev.concat(data));
    }
  }, []);

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const handleSaveVideo = () => {
    const blob = new Blob(capturedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    setVideoUrl(url);
    // Optionally send blob to the server for AI processing
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8 space-y-8'>
      {/* <h2 className='text-4xl font-bold text-gray-800 mb-4'>Interview Page</h2> */}

      <p className='text-xl font-medium text-gray-600'>
        <span className='font-bold'>Question:</span> {question}
      </p>

      <div className='relative w-full max-w-lg rounded-lg overflow-hidden shadow-lg bg-white'>
        <Webcam
          audio={true}
          muted={true}
          ref={webcamRef}
          className='w-full h-auto rounded-lg'
        />
      </div>

      <div className='flex space-x-4'>
        {recording ? (
          <Button
            onClick={handleStopRecording}
            variant='contained'
            color='secondary'
            sx={{ padding: '12px 24px', fontSize: '16px' }}
          >
            Stop Recording
          </Button>
        ) : (
          <Button
            onClick={handleStartRecording}
            variant='contained'
            color='primary'
            sx={{ padding: '12px 24px', fontSize: '16px' }}
          >
            Start Recording
          </Button>
        )}
      </div>

      {capturedChunks.length > 0 && !recording && (
        <div className='mt-4'>
          <Button
            onClick={handleSaveVideo}
            variant='contained'
            color='primary'
            sx={{ padding: '12px 24px', fontSize: '16px' }}
          >
            Save Video
          </Button>
        </div>
      )}

      {videoUrl && (
        <div className='mt-8'>
          <h3 className='text-2xl font-bold text-gray-800 mb-4'>
            Recorded Video:
          </h3>
          <video src={videoUrl} controls className='rounded-lg shadow-lg w-full max-w-lg' />
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
