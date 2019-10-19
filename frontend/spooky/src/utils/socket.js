import io from "socket.io-client";
const url = "localhost:3001";

export const Socket = room => {
  return io(url + room);
};
