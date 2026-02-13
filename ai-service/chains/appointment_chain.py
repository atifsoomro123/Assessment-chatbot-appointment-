from dotenv import load_dotenv
load_dotenv()

import os
import json
from pathlib import Path
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder


PROMPT_PATH = Path(__file__).resolve().parents[1] / "prompts" / "booking_prompt.txt"


def get_chain():
    system_prompt = PROMPT_PATH.read_text(encoding="utf-8")

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        MessagesPlaceholder("history"),
        ("human", "{input}"),
        ("human",
         "Return ONLY valid JSON with keys: reply (string) and extracted (object or null). "
         "If booking is confirmed, extracted must include confirmed:true and appointment_time_iso.")
    ])

    # ✅ Important: set request timeout so it doesn't hang forever
    # also log errors through exceptions
    llm = ChatOpenAI(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        temperature=0.2,
        timeout=30,         # <--- stops infinite hang
        max_retries=0       # <--- fail fast so we see errors
    )

    class Chain:
        def invoke(self, x):
            try:
                content = (prompt | llm).invoke(x).content
                try:
                    data = json.loads(content)
                    if "reply" not in data:
                        return {"reply": content, "extracted": None}
                    if "extracted" not in data:
                        data["extracted"] = None
                    return data
                except Exception:
                    # model didn't return JSON
                    return {"reply": content, "extracted": None}

            except Exception as e:
                # ✅ Never hang / never crash: return error as a reply
                return {"reply": f"AI error: {str(e)}", "extracted": None}

    return Chain()
