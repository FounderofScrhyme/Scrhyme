from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
import os
from dotenv import load_dotenv
from lib.supabase import supabase

load_dotenv()

app = FastAPI(title="Scrhyme API")

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # フロントエンドのURL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to Scrhyme API"}

@app.post("/api/upload")
async def upload_song(
    title: str = Form(...),
    vocal_file: UploadFile = File(...),
    instrumental_url: str = Form(...)
):
    """
    ボーカルファイルとインストゥルメンタルURLを受け取り、
    ピッチ補正と合成処理を開始するエンドポイント
    """
    try:
        # TODO: ファイルの保存とCeleryタスクの開始
        return {
            "message": "Upload received",
            "title": title,
            "instrumental_url": instrumental_url
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/songs")
async def get_songs():
    """
    投稿された曲の一覧を取得するエンドポイント
    """
    try:
        response = supabase.table("songs").select("id, title, audio_url, created_at").execute()
        return {"songs": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/songs/{song_id}")
async def get_song(song_id: str):
    """
    特定の曲の詳細情報を取得するエンドポイント
    """
    try:
        response = supabase.table("songs").select("id, title, audio_url, created_at").eq("id", song_id).single().execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Song not found")
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 