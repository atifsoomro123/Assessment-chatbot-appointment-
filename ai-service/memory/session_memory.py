from typing import Dict
from langchain.memory import ConversationBufferMemory
from langchain_core.messages import HumanMessage, AIMessage

_mem: Dict[str, ConversationBufferMemory] = {}

def get_memory(session_id: str):
    if session_id not in _mem:
        _mem[session_id] = ConversationBufferMemory(return_messages=True)
    return _mem[session_id]
