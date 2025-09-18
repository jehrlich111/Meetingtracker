import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const getSocket = (): Socket | null => {
  if (typeof window !== 'undefined' && !socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000')
  }
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
