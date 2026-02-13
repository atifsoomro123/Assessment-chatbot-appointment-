from typing import Dict, List, Tuple, Optional
from db.postgres import ensure_session, log_chat, create_appointment

from db.postgres import ensure_session, log_chat
from langchain_core.messages import HumanMessage, AIMessage

from chains.appointment_chain import get_chain
from db.postgres import log_chat, create_appointment

_sessions: Dict[str, List] = {}
_chain = get_chain()


def handle_message(session_id: str, message: str) -> Tuple[str, Optional[dict]]:
    history = _sessions.get(session_id, [])

    # log user message
    log_chat(session_id, "user", message)

    out = _chain.invoke({
        "history": history,
        "input": message
    })

    reply = out.get("reply", "")
    extracted = out.get("extracted", None)

    # log assistant reply
    log_chat(session_id, "assistant", reply)

    # Save appointment when confirmed
    if extracted and extracted.get("confirmed") is True:
        name = extracted.get("name") or "Unknown"
        service = extracted.get("service_type") or "General"
        start_time = extracted.get("appointment_time_iso")

        if start_time:
            appt_id = create_appointment(session_id, name, service, start_time)
            reply += f"\n\n✅ Appointment saved (ID: {appt_id})."

    # update memory
    history = history + [HumanMessage(content=message), AIMessage(content=reply)]
    _sessions[session_id] = history

    return reply, extracted

