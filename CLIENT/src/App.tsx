'use client'

import React, { useState } from "react";
import RoomCreation from "./Components/RoomCreation";
import RoomEntry from "./Components/RoomEntry";
import ChatRoom from "./Components/ChatRoom";

const App: React.FC = () => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const handleRoomCreated = (roomId: string) => {
    setRoomId(roomId);
  };

  const handleJoin = (roomId: string, ws: WebSocket) => {
    setRoomId(roomId);
    setWs(ws); // Store the WebSocket reference
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {roomId && ws ? (
        <ChatRoom roomId={roomId} ws={ws} />
      ) : (
        <>
          <RoomCreation onRoomCreated={handleRoomCreated} />
          <RoomEntry onJoin={handleJoin} />
        </>
      )}
    </div>
  );
};

export default App;
