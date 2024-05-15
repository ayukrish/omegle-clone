import { useEffect, useRef, useState } from 'react';

const LandingPage = () => {
  const [localAudioTrack, setLocalAudioTrack] = useState();
  const [localVideoTrack, setLocalVideoTrack] = useState();
  const videoRef = useRef(null);


  const getCam = async () => {
    const stream = await window.navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const audioTrack = stream.getAudioTracks()[0];
    const videoTrack = stream.getVideoTracks()[0];
    // setLocalAudioTrack(audioTrack);
    // setLocalVideoTrack(videoTrack);
    if (!videoRef.current) {
      return;
    }
    videoRef.current.srcObject = new MediaStream([videoTrack]);
  }

  useEffect(() => {
    getCam();
  }, [videoRef]);

  return (
    <>
      <div>LandingPage</div>
      <video autoPlay ref={videoRef} height={300} width={300}/>
    </>
    
  )
}

export default LandingPage