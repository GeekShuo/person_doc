import chromadb
from chromadb.utils import embedding_functions

from config import KB_DIR

_client = chromadb.PersistentClient(path=KB_DIR)
# 默认本地 embedding 模型（首次运行会自动下载 all-MiniLM-L6-v2）
_ef = embedding_functions.DefaultEmbeddingFunction()
_col = _client.get_or_create_collection("video_notes")


def add_note(video_id: str, title: str, text: str, url: str = "") -> None:
    _col.add(
        ids=[video_id],
        documents=[text],
        metadatas=[{"title": title, "url": url}],
    )


def query(q: str, n: int = 5):
    return _col.query(query_texts=[q], n_results=n)
