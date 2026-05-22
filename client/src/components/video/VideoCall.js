import React, { useState, useEffect, useRef } from 'react';
import { getSocket } from '../../services/socket';
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiPhoneOff } from 'react-icons/fi';

const VideoCall = ({ groupId, onEnd }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [inCall, setInCall] = useState(false);
  const [peerId, setPeerId] = useState(null);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnection = useRef(null);
  const socket = getSocket();

  const servers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  const stopAll = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    setLocalStream(null);
    setRemoteStream(null);
    setInCall(false);
    if (socket) socket.emit('end_call', { to: groupId });
  };

  const createPeerConnection = (targetId) => {
    const pc = new RTCPeerConnection(servers);
    peerConnection.current = pc;

    if (localStream) {
      localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && targetId) {
        socket.emit('ice_candidate', { to: targetId, candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        stopAll();
        if (onEnd) onEnd();
      }
    };

    return pc;
  };

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    } catch {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      } catch { /* no media */ }
    }
  };

  useEffect(() => {
    startLocalStream();
    return () => {
      stopAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('video_offer', async ({ from, offer }) => {
      setPeerId(from);
      setInCall(true);
      const pc = createPeerConnection(from);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('video_answer', { to: from, answer });
    });

    socket.on('video_answer', async ({ from, answer }) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on('ice_candidate', async ({ from, candidate }) => {
      if (peerConnection.current && candidate) {
        try {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch { /* ignore */ }
      }
    });

    socket.on('call_ended', () => {
      stopAll();
      if (onEnd) onEnd();
    });

    return () => {
      socket.off('video_offer');
      socket.off('video_answer');
      socket.off('ice_candidate');
      socket.off('call_ended');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, onEnd]);

  const startCall = async () => {
    const pc = createPeerConnection(peerId || 'broadcast');
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit('video_offer', { to: groupId, offer });
    setInCall(true);
  };

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => { track.enabled = !micOn; });
      setMicOn(!micOn);
    }
  };

  const toggleCam = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => { track.enabled = !camOn; });
      setCamOn(!camOn);
    }
  };

  const handleEndCall = () => {
    stopAll();
    if (onEnd) onEnd();
  };

  return (
    <div className="bg-black rounded-xl overflow-hidden">
      <div className="relative">
        {remoteStream ? (
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-48 sm:h-64 object-cover" />
        ) : (
          <div className="w-full h-48 sm:h-64 flex items-center justify-center text-white">
            <p className="text-sm">{inCall ? 'Connecting...' : 'Ready to connect'}</p>
          </div>
        )}
        {localStream && (
          <div className="absolute bottom-3 right-3 w-24 h-18 sm:w-32 sm:h-24 rounded-lg overflow-hidden border-2 border-white/50">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-4 p-3 bg-gray-900">
        <button onClick={toggleMic} className={`p-3 rounded-full ${micOn ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600'} text-white`}>
          {micOn ? <FiMic size={18} /> : <FiMicOff size={18} />}
        </button>
        {!inCall ? (
          <button onClick={startCall} disabled={!localStream}
            className="px-6 py-2.5 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 disabled:opacity-50">
            Join Call
          </button>
        ) : (
          <button onClick={handleEndCall} className="p-3 bg-red-600 rounded-full text-white hover:bg-red-700">
            <FiPhoneOff size={18} />
          </button>
        )}
        <button onClick={toggleCam} className={`p-3 rounded-full ${camOn ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600'} text-white`}>
          {camOn ? <FiVideo size={18} /> : <FiVideoOff size={18} />}
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
