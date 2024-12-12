'use client'

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle } from 'lucide-react';

interface RoomEntryProps {
  onJoin: (roomId: string, ws: WebSocket) => void;
}

const RoomEntry: React.FC<RoomEntryProps> = ({ onJoin }) => {
  const [roomId, setRoomId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId.trim()) {
      setError("Room ID cannot be empty");
      return;
    }

    setIsLoading(true);
    setError("");

    const ws = new WebSocket("ws://localhost:9000");

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join", payload: { roomId } }));
    };

    ws.onmessage = (event: MessageEvent) => {
      const response = JSON.parse(event.data);
      if (response.type === "success") {
        onJoin(roomId, ws); // This will transition to the chatroom
      } else if (response.type === "error") {
        setError(response.payload.message);
        setIsLoading(false);
        ws.close();
      }
    };

    ws.onerror = () => {
      setError("Failed to connect to the server. Please try again.");
      setIsLoading(false);
    };
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Join Chat Room</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleJoin} className="space-y-4">
          <Input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoomId(e.target.value)}
            disabled={isLoading}
            aria-label="Room ID"
          />
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Joining..." : "Join Room"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RoomEntry;
