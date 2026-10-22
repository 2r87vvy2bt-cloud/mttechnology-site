import os
import threading
from app import app, init_db, _refresh_loop

init_db()
translate = os.getenv("TRANSLATE_ENABLED", "true").lower() != "false"
t = threading.Thread(target=_refresh_loop, kwargs={"translate": translate}, daemon=True)
t.start()
