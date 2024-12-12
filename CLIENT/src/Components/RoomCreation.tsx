'use client'

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle } from "lucide-react";

interface RoomCreationProps {
  onRoomCreated: (roomId: string) => void;
}

const RoomCreation: React.FC<RoomCreationProps> = ({ onRoomCreated }) => {
  const [roomName, setRoomName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleCreateRoom = () => {
    if (!roomName.trim()) {
      setError("Room name cannot be empty");
      return;
    }

    setError("");
    setSuccess("");

    const ws = new WebSocket("ws://localhost:9000");

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "create", payload: { roomName } }));
    };

    ws.onmessage = (event: MessageEvent) => {
      const response = JSON.parse(event.data);
      if (response.type === "success") {
        setSuccess(response.payload.message);
        onRoomCreated(roomName);
        ws.close();
      } else if (response.type === "error") {
        setError(response.payload.message);
        ws.close();
      }
    };

    ws.onerror = () => {
      setError("Failed to connect to the server.");
    };
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Create Chat Room</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Enter Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          aria-label="Room Name"
        />
        {error && (
          <Alert variant="destructive"> {/* Change to "destructive" instead of "success" */}
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert variant="default"> {/* Change to "default" instead of "success" */}
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleCreateRoom} className="w-full">
          Create Room
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoomCreation;
