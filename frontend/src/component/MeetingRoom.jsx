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
        const d = await pc.createOffer();
        await pc.setLocalDescription(d);
        socket.emit('offer', {
          sdp: pc.localDescription,
          roomId
        });
      }
    });

    socket.on('receive-offer', async ({ roomId, sdp }) => {
      const pc = new RTCPeerConnection();
      setReceivingPc(pc);
      await pc.setRemoteDescription(sdp);
      const localSdp = await pc.createAnswer();
      await pc.setLocalDescription(localSdp);
      const stream = new MediaStream();
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
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

      // pc.ontrack = e => {
      //   console.log(e, 'eeeeee');
      //   remoteVideoRef.current.srcObject = new MediaStream([e.streams[0]]);
      // };

      setTimeout(() => {
        const track1 = pc.getTransceivers()[0].receiver.track;
        const track2 = pc.getTransceivers()[1].receiver.track;
        remoteVideoRef.current.srcObject.addTrack(track1);
        remoteVideoRef.current.srcObject.addTrack(track2);
      }, 2000);

      socket.emit('answer', {
        sdp: localSdp,
        roomId,
      });
    });

    socket.on('add-ice-candidate', ({ candidate, type }) => {
      if (type === "sender") {
        setReceivingPc((pc) => {
          console.log('setReceivingPc', pc);
          pc.addIceCandidate(candidate);
          return pc;
        });
      } else {
        setSendingPc((pc) => {
          console.log('setSendingPc', pc);
          pc.addIceCandidate(candidate)
          return pc;
        });
      }
    });

    socket.on('answer', ({ roomId, sdp }) => {
      setSendingPc((pc) => {
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