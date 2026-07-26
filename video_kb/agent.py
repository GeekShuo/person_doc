from knowledge_base import query as kb_query
from llm import complete


def ask(question: str, n: int = 5) -> str:
    """基于知识库的 RAG 问答。"""
    res = kb_query(question, n)
    docs = res["documents"][0]
    metas = res["metadatas"][0]
    context = "\n\n---\n\n".join(
        f"来源: {m.get('title', '')}  ({m.get('url', '')})\n{d}"
        for d, m in zip(docs, metas)
    )
    prompt = (
        f"以下是某博主视频知识库中的相关片段：\n\n{context}\n\n"
        f"请根据以上内容回答问题：{question}\n"
        f"如果信息不足，请明确说明。"
    )
    return complete(prompt)
