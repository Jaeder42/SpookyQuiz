import io from "socket.io-client";
const url = "192.168.1.14:3001";

export const Socket = room => {
  return io(url + room);
};
