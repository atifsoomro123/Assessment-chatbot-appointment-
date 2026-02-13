import os
from pathlib import Path
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")
DATABASE_URL = os.getenv("DATABASE_URL")


def get_conn():
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL missing in ai-service/.env")
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)


def ensure_session(session_id: str, user_id=None):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO chat_sessions (session_id, user_id)
                VALUES (%s, %s)
                ON CONFLICT (session_id) DO NOTHING
                """,
                (session_id, user_id),
            )


def log_chat(session_id: str, role: str, content: str):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO chat_messages (session_id, role, content)
                VALUES (%s, %s, %s)
                """,
                (session_id, role, content),
            )


def create_appointment(session_id: str, name: str, service: str, start_time_iso: str):
    """
    Assumes appointments table has:
      session_id, customer_name, service_type, start_time, status
    If your column names differ, tell me and I'll map them.
    """
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO appointments (session_id, customer_name, service_type, start_time, status)
                VALUES (%s, %s, %s, %s::timestamptz, 'confirmed')
                RETURNING id
                """,
                (session_id, name, service, start_time_iso),
            )
            row = cur.fetchone()
            return row["id"]
