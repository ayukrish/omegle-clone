import { useEffect, useRef, useState } from 'react';
import Room from './MeetingRoom';

const LandingPage = () => {
  const [localAudioTrack, setLocalAudioTrack] = useState();
  const [localVideoTrack, setLocalVideoTrack] = useState();
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
    setLocalAudioTrack(audioTrack);
    setLocalVideoTrack(videoTrack);
    if (!videoRef.current) {
      return;
    }
    videoRef.current.srcObject = new MediaStream([videoTrack]);
  }

  useEffect(() => {
    // getCam();
  }, [videoRef]);

  if(joinedRoom) {
    return (
      <Room
        name={name}
        localAudioTrack={localAudioTrack}
        localVideoTrack={localVideoTrack}
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