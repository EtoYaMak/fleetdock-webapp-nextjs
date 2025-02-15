"use client"

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Message } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Loader2, X, Download, ExternalLink, FileText, MoreVertical } from "lucide-react";
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
import Image from "next/image";

interface ChatWindowProps {
  chatRoomId: string;
  messages: Message[];
}

export function ChatWindow({ chatRoomId, messages }: ChatWindowProps) {
  const { sendMessage, editMessage, uploadFile, getFileUrl } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedFile, setSelectedFile] = useState<Message | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [thumbnailUrls, setThumbnailUrls] = useState<Record<string, { url: string, expiresAt: number }>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const scrollToBottom = useCallback((force = false) => {
    if (!scrollRef.current) return;

    const { scrollHeight, scrollTop, clientHeight } = scrollRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

    if (force || (shouldAutoScroll && isNearBottom)) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [shouldAutoScroll]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      const { scrollHeight, scrollTop, clientHeight } = scrollElement;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShouldAutoScroll(isNearBottom);
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    scrollToBottom(true);
  }, [scrollToBottom]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileClick = async (message: Message) => {
    if (!message.file_url) return;

    // For images, reuse the existing thumbnail URL if available
    if (isImageFile(message.file_name || '') && thumbnailUrls[message.id]?.url) {
      setFileUrl(thumbnailUrls[message.id].url);
      setSelectedFile(message);
      return;
    }

    // For non-images or if thumbnail URL doesn't exist, get a new signed URL
    const url = await getFileUrl(message.file_url);
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
    if (!chatRoomId || !newMessage.trim()) return;

    try {
      if (editingMessageId) {
        await editMessage(editingMessageId, newMessage);
        setEditingMessageId(null);
      } else {
        let attachmentData = null;
        if (file) {
          setIsUploading(true);
          attachmentData = await handleFileUpload();
        }
        await sendMessage(chatRoomId, newMessage, attachmentData, replyingTo?.id);
        setReplyingTo(null);
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
        const url = await getFileUrl(message.file_url);
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
  }, [messages, getFileUrl, thumbnailUrls]);

  const startReply = (message: Message) => {
    setReplyingTo(message);
    textareaRef.current?.focus();
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const getRepliedMessage = (replyToId: string | undefined) => {
    if (!replyToId) return null;
    return messages.find(m => m.id === replyToId);
  };

  const ReplyPreview = ({ message }: { message: Message }) => (
    <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b">
      <div className="flex items-center gap-2">
        <div className="w-1 h-full bg-primary/50" />
        <div>
          <span className="text-xs font-medium">
            Replying to {message.sender_id === user?.id ? 'yourself' : 'them'}
          </span>
          <p className="text-sm text-muted-foreground truncate">
            {message.content || (message.file_url ? 'File' : '')}
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={cancelReply}
        className="h-6 w-6 p-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );

  const MessageReply = ({ replyToId }: { replyToId: string }) => {
    const repliedMessage = messages?.find(m => m.id === replyToId);
    if (!repliedMessage) return null;

    return (
      <div className="ml-4 pl-2 border-l-2 border-gray-300 dark:border-gray-600 mb-1">
        <p className="text-sm text-gray-500">
          {repliedMessage.sender_id === user?.id ? 'You' : 'They'} replied to
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {repliedMessage.content}
        </p>
      </div>
    );
  };

  const handleFileUpload = async () => {
    if (!file || !chatRoomId) return null;
    try {
      return await uploadFile(file, chatRoomId);
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

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
                  <Image
                    src={fileUrl}
                    alt={selectedFile.file_name || 'Preview'}
                    className="w-full h-full object-contain"
                    width={800}
                    height={600}
                    unoptimized
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

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-2">
        {messages.map((message, index) => {
          const isCurrentUser = message.sender_id === user?.id;
          const showSeparator =
            index === 0 ||
            new Date(message.created_at).toDateString() !==
            new Date(messages[index - 1].created_at).toDateString();

          return (
            <React.Fragment key={message.id}>
              {showSeparator && renderDateSeparator(message.created_at)}
              <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
                <div className={`flex relative ${isCurrentUser ? "justify-end" : "justify-start"} w-full max-w-[70%] group`}>
                  {!isCurrentUser && !message.is_deleted && (
                    <div className="absolute right-0 top-0 z-10">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0 hover:bg-accent/50 bg-transparent rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4 " />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-24 p-0" align="start" side="top">
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              className="justify-start rounded-none"
                              onClick={() => startReply(message)}
                            >
                              Reply
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                  <div className={cn(
                    "rounded-lg p-3 w-full break-words whitespace-pre-wrap",
                    message.is_deleted ? "bg-muted" : isCurrentUser ? "bg-primary text-primary-foreground" : "bg-accent",
                    isCurrentUser ? "rounded-br-sm" : "rounded-bl-sm"
                  )}>
                    {message.is_deleted ? (
                      <p className="text-sm italic">Message deleted</p>
                    ) : (
                      <>
                        {message.reply_to_id && (
                          <div className="mb-1 -mt-1 mr-2 border-l-4 border-black/50 bg-accent rounded-lg">
                            {(() => {
                              const repliedMessage = getRepliedMessage(message.reply_to_id);
                              if (!repliedMessage) return null;
                              return (
                                <div className="text-xs text-primary-foreground/70 px-2 py-1">
                                  <span className="font-medium text-muted-foreground">
                                    {repliedMessage.sender_id === user?.id ? 'You' : 'They'} replied to{" "}
                                  </span>
                                  <p className="truncate text-primary font-bold">
                                    {repliedMessage.content || (repliedMessage.file_url ? 'File' : 'Message unavailable')}
                                  </p>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                        <p className={`break-words whitespace-pre-wrap text-sm ${isCurrentUser ? "text-white" : ""}`}>{message.content}</p>
                        {message.file_url && (
                          <button
                            onClick={() => handleFileClick(message)}
                            className="mt-2 flex items-center gap-2 hover:bg-black/10 p-1.5 rounded-md transition-colors"
                          >
                            {isImageFile(message.file_name || "") ? (
                              <div className="relative w-32 h-32 bg-black/20 rounded-md overflow-hidden">
                                {thumbnailUrls[message.id]?.url ? (
                                  <Image
                                    src={thumbnailUrls[message.id].url}
                                    alt={message.file_name || 'Preview'}
                                    className="w-full h-full object-cover"
                                    width={128}
                                    height={128}
                                    unoptimized
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <>
                                <FileText className="h-5 w-5 shrink-0" />
                                <span className="text-xs font-medium underline break-all text-left">
                                  {message.file_name}
                                </span>
                              </>
                            )}
                          </button>
                        )}
                        <div className={cn(
                          "text-xs mt-1 flex items-center gap-1",
                          isCurrentUser ? "text-white/80" : "text-muted-foreground"
                        )}>
                          <span>{formatMessageDate(message.created_at)}</span>
                          {message.edited_at && (
                            <span className="italic">(edited)</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  {isCurrentUser && !message.is_deleted && (
                    <div className="absolute right-0 top-0 z-10">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0 hover:bg-accent/50 bg-transparent rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4 text-white" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-24 p-0" align="end" side="top">
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              className="justify-start rounded-none"
                              onClick={() => startReply(message)}
                            >
                              Reply
                            </Button>
                            {canEditMessage(message) && (
                              <Button
                                variant="ghost"
                                className="justify-start rounded-none"
                                onClick={() => {
                                  setNewMessage(message.content);
                                  setEditingMessageId(message.id);
                                  textareaRef.current?.focus();
                                }}
                              >
                                Edit
                              </Button>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {replyingTo && <ReplyPreview message={replyingTo} />}

      <form onSubmit={handleSendMessage} className="sticky bottom-0 bg-background border-t">
        {replyingTo && <ReplyPreview message={replyingTo} />}
        {editingMessageId && (
          <div className="flex items-center justify-between mb-2 px-2">
            <span className="text-xs text-muted-foreground">Editing message</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={cancelEditing}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
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
