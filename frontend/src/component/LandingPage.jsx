import { useEffect, useRef, useState } from 'react';
import MeetingRoom from './MeetingRoom';

const LandingPage = () => {
  const [stream, setStream] = useState();
  const [name, setName] = useState();
  const [joinedRoom, setJoinedRoom] = useState(false);
  const videoRef = useRef(null);


  const getCam = async () => {
    const stream = await window.navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const audioTrack = stream.getAudioTracks()[0];
    const videoTrack = stream.getVideoTracks()[0];
    setStream(stream);
    if (!videoRef.current) {
      return;
    }
    videoRef.current.srcObject = new MediaStream([videoTrack, audioTrack]);
  }

  useEffect(() => {
    // getCam();
  }, [videoRef]);

  if(joinedRoom) {
    return (
      <MeetingRoom
        name={name}
        stream={stream}
      />
    )
  }

  return (
    <>
      <div>LandingPage</div>
      <div>
        <input
          type='text'
          val={name}
          onChange={(event) => {
            setName(event.target.value)
          }}
          placeholder='enter your name'
        />
        <button
          type='button'
          onClick={(event) => {
            event.stopPropagation();
            setJoinedRoom(true);
          }}
        >
          Join Room
        </button>
      </div>
      <video autoPlay ref={videoRef} height={300} width={300}/>
    </>
    
  )
}

export default LandingPage