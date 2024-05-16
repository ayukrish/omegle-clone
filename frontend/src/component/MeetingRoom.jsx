import { useEffect, useRef } from "react";
import { io } from 'socket.io-client';
const URL = "http://localhost:3003";

const MeetingRoom  = ({
  name,
  localAudioTrack,
  localVideoTrack
}) => {
  const currentVideoRef = useRef(null);
  const socket = io(URL);
  useEffect(() => {
    if(currentVideoRef.current) {
      if(localVideoTrack) {
        currentVideoRef.current.srcObject = new MediaStream([localVideoTrack]);
      }
    }
  }, [currentVideoRef]);

  return (
    <>
      <div>Hi  {name}</div>
      <video autoPlay ref={currentVideoRef} height={300} width={300}/>
    </>
  )
}

export default MeetingRoom;