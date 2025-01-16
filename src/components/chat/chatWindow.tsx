"use client"

import React, { useEffect, useRef, useState } from "react";
import { Message } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ChevronDown, Paperclip, Loader2, X, Download, ExternalLink, FileText } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";

interface ChatWindowProps {
  chatRoomId: string;
  messages: Message[];
}

export function ChatWindow({ chatRoomId, messages }: ChatWindowProps) {
  const { sendMessage, editMessage, uploadFile } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedFile, setSelectedFile] = useState<Message | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [thumbnailUrls, setThumbnailUrls] = useState<Record<string, { url: string, expiresAt: number }>>({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const getFileUrl = async (filePath: string, messageId: string) => {
    const now = Date.now();
    const cached = thumbnailUrls[messageId];

    // Return cached URL if it exists and isn't expired (5 minutes before actual expiry)
    if (cached && now < cached.expiresAt - 300000) {
      return cached.url;
    }

    const { data } = await supabase.storage
      .from('chat-attachments')
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (data?.signedUrl) {
      // Cache the URL with expiration (1 hour from now)
      setThumbnailUrls(prev => ({
        ...prev,
        [messageId]: {
          url: data.signedUrl,
          expiresAt: now + 3600000 // 1 hour in milliseconds
        }
      }));
      return data.signedUrl;
    }
    return null;
  };

  const handleFileClick = async (message: Message) => {
    if (!message.file_url) return;

    const url = await getFileUrl(message.file_url, message.id);
    if (url) {
      setFileUrl(url);
      setSelectedFile(message);
    }
  };

  const isImageFile = (fileName: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName || '');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setIsUploading(true);

      let attachmentData = null;
      if (file) {
        attachmentData = await uploadFile(file, chatRoomId);
      }
      if (editingMessageId) {
        await editMessage(editingMessageId, newMessage);
        setEditingMessageId(null);
      } else {
        await sendMessage(chatRoomId, newMessage, attachmentData);
      }
      setNewMessage("");
      setFile(null);
      setIsUploading(false);
    } catch (error) {
      console.error("Failed to send/edit message:", error);
    }
  };

  const formatMessageDate = (date: string) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return format(messageDate, "h:mm a");
    }
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return format(messageDate, "MMM d");
  };

  const renderDateSeparator = (date: string) => (
    <div className="flex items-center justify-center my-4">
      <div className="bg-muted text-muted-foreground text-xs font-medium px-3 py-1 rounded-full">
        {formatMessageDate(date)}
      </div>
    </div>
  );

  const startEditing = (message: Message) => {
    setEditingMessageId(message.id);
    setNewMessage(message.content);
    textareaRef.current?.focus();
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setNewMessage("");
  };

  const canEditMessage = (message: Message) => {
    if (!user) return false;
    const messageDate = new Date(message.created_at);
    const now = new Date();
    const hoursDiff = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    return message.sender_id === user.id && hoursDiff <= 24 && !message.is_deleted;
  };

  useEffect(() => {
    // Load and cache URLs for all images in messages
    const now = Date.now();
    messages.forEach(async (message) => {
      if (message.file_url &&
        (!thumbnailUrls[message.id] || now >= thumbnailUrls[message.id].expiresAt - 300000)) {
        const url = await getFileUrl(message.file_url, message.id);
        if (url) {
          setThumbnailUrls(prev => ({
            ...prev,
            [message.id]: {
              url,
              expiresAt: now + 3600000
            }
          }));
        }
      }
    });
  }, [messages]);

  return (
    <div className="flex flex-col min-h-full">
      <Dialog open={!!selectedFile} onOpenChange={() => {
        setSelectedFile(null);
        setFileUrl(null);
      }}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="truncate">{selectedFile?.file_name}</span>
              <div className="flex items-center gap-2">
                {selectedFile && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(fileUrl!, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (fileUrl) {
                          const a = document.createElement('a');
                          a.href = fileUrl;
                          a.download = selectedFile.file_name || 'download';
                          a.click();
                        }
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedFile && fileUrl && (
              isImageFile(selectedFile.file_name || '') ? (
                <div className="relative aspect-auto max-h-[70vh] overflow-auto rounded-lg">
                  <img
                    src={fileUrl}
                    alt={selectedFile.file_name || 'Preview'}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                  <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {selectedFile.file_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFile.file_size || 0)}
                  </p>
                </div>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {messages.map((message, index) => {
          const isCurrentUser = message.sender_id === user?.id;
          const showSeparator =
            index === 0 ||
            new Date(message.created_at).toDateString() !==
            new Date(messages[index - 1].created_at).toDateString();

          return (
            <React.Fragment key={message.id}>
              {showSeparator && renderDateSeparator(message.created_at)}
              <div className={`flex relative  ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                {isCurrentUser && canEditMessage(message) && (
                  <div className="absolute right-0 top-0 z-10">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 hover:bg-accent/50 bg-transparent rounded-full"
                        >
                          <ChevronDown className="h-4 w-4 text-white" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[140px] p-0"
                        align="end"
                        side="top"
                      >
                        <button
                          onClick={() => startEditing(message)}
                          className="w-full px-2 py-1.5 text-sm text-left hover:bg-accent"
                        >
                          Edit message
                        </button>
                        {/* TODO: Add delete option */}
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[90%] rounded-lg p-3",
                    message.is_deleted ? "bg-muted" : isCurrentUser ? "bg-primary text-primary-foreground" : "bg-accent",
                    isCurrentUser ? "rounded-br-sm" : "rounded-bl-sm"
                  )}
                >
                  {message.is_deleted ? (
                    <p className="text-sm italic">Message deleted</p>
                  ) : (
                    <>
                      <p className="break-words text-sm max-w-[90%]">{message.content}</p>
                      {message.file_url && (
                        <button
                          onClick={() => handleFileClick(message)}
                          className="mt-2 flex items-center gap-2 hover:bg-black/10 p-1.5 rounded-md transition-colors"
                        >
                          {isImageFile(message.file_name || "") ? (
                            <div className="relative w-32 h-32 bg-black/20 rounded-md overflow-hidden">
                              {thumbnailUrls[message.id]?.url ? (
                                <img
                                  src={thumbnailUrls[message.id].url}
                                  alt={message.file_name || 'Preview'}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          ) : (
                            <>
                              <FileText className="h-5 w-5" />
                              <span className="text-xs font-medium underline">
                                {message.file_name}
                              </span>
                            </>
                          )}
                        </button>
                      )}
                    </>
                  )}
                  <div className={cn(
                    "text-xs mt-1 flex items-center gap-2",
                    isCurrentUser ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    <span>{formatMessageDate(message.created_at)}</span>
                    {message.edited_at && (
                      <span className="italic">(edited)</span>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="sticky bottom-0 bg-background border-t">
        {editingMessageId && (
          <div className="flex items-center justify-between mb-2 px-2">
            <span className="text-sm text-muted-foreground">Editing message</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={cancelEditing}
            >
              Cancel
            </Button>
          </div>
        )}
        <div className="flex gap-2 p-4">
          <span className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={editingMessageId ? "Edit message..." : "Type a message..."}
              className="flex-1 min-h-[40px] max-h-[150px] resize-none bg-input rounded-md border px-3 py-2 text-sm
              ring-offset-background placeholder:text-muted-foreground
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-ring focus-visible:ring-offset-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <Input
              id="file-input"
              type="file"
              className="sr-only"
              onChange={handleFileSelect}
            />
            <Label
              htmlFor="file-input"
              className="absolute right-2 top-2 p-2 cursor-pointer hover:bg-accent/50 rounded-full"
            >
              <Paperclip className="h-[18px] w-[18px]" />
            </Label>
          </span>
          <Button type="submit" size="icon" disabled={isUploading || (!newMessage.trim() && !file)}>
            {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </Button>
        </div>
        {file && (
          <div className="px-4 pb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Paperclip className="h-4 w-4" />
            <span className="truncate ">{file.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setFile(null)}
            >
              ✕
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
