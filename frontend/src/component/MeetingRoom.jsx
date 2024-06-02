import { useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client';
const URL = "http://localhost:3003";

const MeetingRoom  = ({
  name,
  stream
}) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [sendingPc, setSendingPc] = useState(null);
  const [receivingPc, setReceivingPc] = useState(null);

  useEffect(() => {
    const socket = io(URL);

    socket.on('send-offer', async ({ roomId }) => {
      console.log('event to send offer to other user', roomId);

      const pc = new RTCPeerConnection();
      setSendingPc(pc);
      if(stream) {
        pc.addStream(stream);
      }
      pc.onicecandidate = async (e) => {
        console.log(e, 'onicecandidate');
        if (!e.candidate) {
          return;
        }
        socket.emit('add-ice-candidate', {
          candidate: e.candidate,
          // type: "sender",
          roomId
        })
      };

      pc.onnegotiationneeded = async (e) => {
        console.log(e, 'onnegotiationneeded');
        const sdp = await pc.createOffer();
        pc.setLocalDescription(sdp);
        socket.emit('offer', {
          sdp,
          roomId
        });
      }
    });

    socket.on('receive-offer', async (roomId) => {
      console.log('event of receiving offer');
    });

    socket.on('add-ice-candidate', (candidate) => {
      console.log('add-ice-candidate');
      const pc = new RTCPeerConnection();
      pc.addIceCandidate(candidate);
      setReceivingPc(pc);
    });
  }, []);

  useEffect(() => {
    if(localVideoRef.current) {
      if(stream) {
        const localAudioTrack = stream.getAudioTracks()[0];
        const localVideoTrack = stream.getVideoTracks()[0];
        localVideoRef.current.srcObject = new MediaStream([localVideoTrack, localAudioTrack]);
      }
    }
  }, [localVideoRef]);

  return (
    <>
      <div>Hi  {name}</div>
      <video autoPlay ref={localVideoRef} height={300} width={300}/>
      <video autoPlay ref={remoteVideoRef} height={300} width={300}/>
    </>
  )
}

export default MeetingRoom;