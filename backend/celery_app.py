from celery import Celery
import os
from dotenv import load_dotenv

load_dotenv()

celery_app = Celery(
    "scrhyme",
    broker=os.getenv("REDIS_URL", "redis://localhost:6379/0"),
    backend=os.getenv("REDIS_URL", "redis://localhost:6379/0")
)

celery_app.conf.task_routes = {
    "tasks.*": {"queue": "scrhyme"}
}

@celery_app.task
def process_song(song_id: str, vocal_path: str, instrumental_url: str):
    """
    ボーカルファイルのピッチ補正とインストゥルメンタルとの合成を行うタスク
    """
    # TODO: librosa, pyworld, pydubを使用した音声処理
    return {"status": "completed", "song_id": song_id} 