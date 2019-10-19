import io from "socket.io-client";
const url = "";

export const Socket = room => {
  return io(url + room);
};
