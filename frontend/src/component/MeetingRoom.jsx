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

      const pc = new RTCPeerConnection();
      setSendingPc(pc);
      if(stream) {
        pc.addStream(stream);
      }
      pc.onicecandidate = async (e) => {
        if (!e.candidate) {
          return;
        }
        socket.emit('add-ice-candidate', {
          candidate: e.candidate,
          type: "sender",
          roomId
        })
      };

      pc.onnegotiationneeded = async () => {
        const sdp = await pc.createOffer();
        pc.setLocalDescription(sdp);
        socket.emit('offer', {
          sdp,
          roomId
        });
      }
    });

    socket.on('receive-offer', async ({ roomId, sdp }) => {
      const pc = new RTCPeerConnection();
      console.log(sdp);
      pc.setRemoteDescription(sdp);
      setReceivingPc(pc);
      const localSdp = await pc.createAnswer();
      pc.setLocalDescription(localSdp);
      socket.emit('answer', {
        sdp: localSdp,
        roomId,
      });

      pc.onicecandidate = async (e) => {
        if (!e.candidate) {
          return;
        }
        socket.emit('add-ice-candidate', {
          candidate: e.candidate,
          type: "receiver",
          roomId
        })
      };

      pc.ontrack = e => {
        console.log(e);
      };
    });

    socket.on('add-ice-candidate', ({ candidate, type }) => {
      if (type === "sender") {
        setReceivingPc((pc) => {
          pc?.addIceCandidate(candidate);
          return pc;
        });
      } else {
        setSendingPc((pc) => {
          pc?.addIceCandidate(candidate)
          return pc;
        });
      }
    });

    socket.on('answer', ({ roomId, sdp }) => {
      setSendingPc((pc) => {
        console.log(sdp);
        pc.setRemoteDescription(sdp);
        return pc;
      });
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