'use client'

import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ChatMessage {
  message: string;
  isSelf: boolean;
}

interface ChatRoomProps {
  roomId: string;
  ws: WebSocket;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomId, ws }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ws.onmessage = (event: MessageEvent) => {
      const response = JSON.parse(event.data);
      if (response.type === "chat") {
        setMessages((prev) => [
          ...prev,
          { message: response.payload.message, isSelf: response.payload.isSelf },
        ]);
      }
    };

    
  }, [ws]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      ws.send(JSON.stringify({ type: "chat", payload: { message: input } }));
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Room: {roomId}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-4 ${msg.isSelf ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end ${msg.isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={msg.isSelf ? "/user-avatar.png" : "/other-avatar.png"} alt={msg.isSelf ? "Your avatar" : "Other user's avatar"} />
                  <AvatarFallback>{msg.isSelf ? "You" : "Other"}</AvatarFallback>
                </Avatar>
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${msg.isSelf ? 'bg-primary text-primary-foreground ml-2' : 'bg-secondary text-secondary-foreground mr-2'}`}
                >
                  {msg.message}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); sendMessage(); }} className="flex w-full gap-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-grow"
          />
          <Button type="submit">Send</Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatRoom;
