"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Loader2Icon,
  SendIcon,
  MusicIcon,
  MicIcon,
  SquareIcon,
  PlayIcon,
} from "lucide-react";
import { createPost } from "../app/actions/post.action";
import toast from "react-hot-toast";

function CreatePost() {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showRecording, setShowRecording] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to start recording");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success("Recording stopped");
    }
  };

  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsPosting(true);
    try {
      // 音声ファイルをアップロードする場合はここで処理
      // 現在はaudioBlobをBase64に変換して保存する例
      let audioData = null;
      if (audioBlob) {
        const arrayBuffer = await audioBlob.arrayBuffer();
        const base64 = btoa(
          String.fromCharCode(...new Uint8Array(arrayBuffer))
        );
        audioData = `data:audio/wav;base64,${base64}`;
      }

      const result = await createPost(
        title.trim(),
        lyrics.trim() || undefined,
        audioData || undefined
      );

      if (result?.success) {
        // reset the form
        setTitle("");
        setLyrics("");
        setAudioBlob(null);
        setAudioUrl("");
        setShowLyrics(false);
        setShowRecording(false);
        toast.success("Post created successfully");
      } else {
        toast.error(result?.error || "Failed to create post");
      }
    } catch (error) {
      console.error("Failed to create post", error);
      toast.error("Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.imageUrl || "/avatar.png"} />
            </Avatar>
            <div className="flex-1 space-y-3">
              <Input
                placeholder="Song title..."
                className="border-none focus-visible:ring p-0 text-lg font-medium"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTitle(e.target.value)
                }
                disabled={isPosting}
              />

              {showLyrics && (
                <Textarea
                  placeholder="Write your lyrics..."
                  className="min-h-[120px] resize-none border-none focus-visible:ring p-0 text-base"
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  disabled={isPosting}
                />
              )}

              {showRecording && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {!isRecording && !audioBlob && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={startRecording}
                        disabled={isPosting}
                      >
                        <MicIcon className="size-4 mr-2" />
                        Start Recording
                      </Button>
                    )}
                    {isRecording && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={stopRecording}
                        disabled={isPosting}
                      >
                        <SquareIcon className="size-4 mr-2" />
                        Stop Recording
                      </Button>
                    )}
                    {audioBlob && !isRecording && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={playRecording}
                        disabled={isPosting}
                      >
                        <PlayIcon className="size-4 mr-2" />
                        Play Recording
                      </Button>
                    )}
                  </div>
                  {audioBlob && (
                    <p className="text-sm text-muted-foreground">
                      Recording saved ({Math.round(audioBlob.size / 1024)}KB)
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => setShowLyrics(!showLyrics)}
                disabled={isPosting}
              >
                <MicIcon className="size-4 mr-2" />
                Lyrics
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => setShowRecording(!showRecording)}
                disabled={isPosting}
              >
                <MusicIcon className="size-4 mr-2" />
                Record
              </Button>
            </div>
            <Button
              className="flex items-center"
              onClick={handleSubmit}
              disabled={isPosting || !title.trim()}
            >
              {isPosting ? (
                <>
                  <Loader2Icon className="size-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <SendIcon className="size-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CreatePost;
