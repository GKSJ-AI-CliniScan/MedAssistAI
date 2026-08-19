import { io } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

const socket = io(WS_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
});

export const connectSocket = () => {
  if (!socket.connected) socket.connect();
};

export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};

export const joinDoctorQueue = (doctorId) => {
  socket.emit('join-doctor-queue', doctorId);
};

export const leaveDoctorQueue = (doctorId) => {
  socket.emit('leave-doctor-queue', doctorId);
};

export const onQueueUpdated = (callback) => {
  socket.on('queue-updated', callback);
  return () => socket.off('queue-updated', callback);
};

export default socket;
