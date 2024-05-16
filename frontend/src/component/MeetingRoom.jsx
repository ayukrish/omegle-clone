import { useEffect, useRef } from "react";

const MeetingRoom  = ({
  name,
  localAudioTrack,
  localVideoTrack
}) => {
  const currentVideoRef = useRef(null);

  useEffect(() => {
    if(currentVideoRef.current) {
      currentVideoRef.current.srcObject = new MediaStream([localVideoTrack]);
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