import React, { useRef, useState, useEffect } from 'react';

export default function WebcamCapture({ onCapture, onCancel }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access your camera. Please check your browser permissions.");
      }
    }
    startCamera();

    return () => {
      // Cleanup: stop all tracks when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    // Draw the current frame of the video onto the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get Data URI
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    
    // Convert Data URI to File object for the backend upload
    canvas.toBlob((blob) => {
      const file = new File([blob], "webcam-capture.jpg", { type: "image/jpeg" });
      onCapture(dataUrl, file);
      
      // Stop stream after capture
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 rounded-2xl overflow-hidden">
      {error ? (
        <div className="text-white text-center">
          <p className="mb-4">⚠️ {error}</p>
          <button onClick={onCancel} className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold">Close</button>
        </div>
      ) : (
        <>
          <div className="relative w-full max-w-sm aspect-[3/4] bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-700">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover mirror-horizontally"
              style={{ transform: 'scaleX(-1)' }} 
            />
            {/* Camera Overlay Guides */}
            <div className="absolute inset-0 pointer-events-none border-2 border-white/20 m-4 rounded-lg"></div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <button 
              onClick={onCancel}
              className="bg-gray-800 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button 
              onClick={capturePhoto}
              className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-200 transition shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
              📸 Snap Photo
            </button>
          </div>
        </>
      )}
    </div>
  );
}
