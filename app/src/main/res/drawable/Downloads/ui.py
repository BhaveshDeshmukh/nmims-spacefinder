import sys
import os
import json
import html
import time
from textwrap import dedent


PROJECT_ROOT = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

import streamlit as st

def render_html(content):
    st.markdown(
        dedent(content),
        unsafe_allow_html=True
    )

from app.vector_store import VectorStore
from app.chunker import AdvancedChunker
from app.guardrails import Guardrails
from app.generator import GroundedGenerator
from app.harness import RAGHarness
from app.stt import SarvamSTT
from app.tts import SarvamTTS


# ============================================================
# PAGE
# ============================================================

st.set_page_config(
    page_title="IndicRAG",
    page_icon="◈",
    layout="wide",
    initial_sidebar_state="expanded",
)


# ============================================================
# PREMIUM DESIGN
# ============================================================

render_html(
    """
<style>

/* ============================================================
   BASE
   ============================================================ */

.stApp {
    position: relative;
    background:
        radial-gradient(
            circle at 50% -15%,
            rgba(91, 92, 246, 0.16),
            transparent 35%
        ),
        radial-gradient(
            circle at 100% 40%,
            rgba(24, 184, 211, 0.07),
            transparent 30%
        ),
        #080a0f;
    color: #f4f4f5;
}

.main .block-container {
    max-width: 1120px;
    padding-top: 1rem;
    padding-bottom: 5rem;
}

#MainMenu,
footer {
    visibility: hidden;
}

header {
    background: transparent !important;
}


/* ============================================================
   AMBIENT ANIMATION
   ============================================================ */

.ambient {
    position: fixed;
    pointer-events: none;
    z-index: 0;
    border-radius: 50%;
    filter: blur(70px);
    opacity: 0.18;
    animation: floatOrb 14s ease-in-out infinite;
}

.ambient.one {
    width: 190px;
    height: 190px;
    top: 12%;
    left: 18%;
    background: #6366f1;
}

.ambient.two {
    width: 150px;
    height: 150px;
    top: 45%;
    right: 10%;
    background: #06b6d4;
    animation-delay: -5s;
}

.ambient.three {
    width: 110px;
    height: 110px;
    bottom: 12%;
    left: 42%;
    background: #8b5cf6;
    animation-delay: -9s;
}

@keyframes floatOrb {
    0%, 100% {
        transform: translate3d(0, 0, 0) scale(1);
    }

    50% {
        transform: translate3d(22px, -28px, 0) scale(1.08);
    }
}


/* ============================================================
   TOP BAR
   ============================================================ */

.topbar {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px 0 14px;
    border-bottom: 1px solid rgba(255,255,255,0.055);
}

.logo-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
}

.logo {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
        135deg,
        #6366f1,
        #06b6d4
    );
    color: white;
    font-weight: 800;
    box-shadow:
        0 0 25px rgba(99,102,241,0.25);
}

.logo-text {
    font-size: 0.92rem;
    font-weight: 750;
    letter-spacing: -0.02em;
}

.online {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 9px;
    border-radius: 999px;
    border: 1px solid rgba(52,211,153,0.18);
    background: rgba(52,211,153,0.045);
    color: #6ee7b7;
    font-size: 0.63rem;
    font-weight: 650;
}

.online-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #34d399;
    box-shadow: 0 0 9px rgba(52,211,153,0.8);
}


/* ============================================================
   SIDEBAR
   ============================================================ */

section[data-testid="stSidebar"] {
    background: #07090e;
    border-right: 1px solid rgba(255,255,255,0.055);
}

.sidebar-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-bottom: 18px;
}

.sidebar-logo {
    width: 36px;
    height: 36px;
    border-radius: 11px;
    background: linear-gradient(
        135deg,
        #6366f1,
        #06b6d4
    );
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 800;
}

.sidebar-name {
    font-size: 1rem;
    font-weight: 750;
}

.sidebar-sub {
    color: #62636d;
    font-size: 0.63rem;
}

.sidebar-title {
    margin-top: 18px;
    margin-bottom: 7px;
    color: #5f6069;
    font-size: 0.61rem;
    text-transform: uppercase;
    letter-spacing: 0.13em;
    font-weight: 750;
}

.system-panel {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 13px;
    padding: 10px 12px;
}

.system-row {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    font-size: 0.72rem;
}

.system-label {
    color: #85858e;
}

.system-value {
    color: #d4d4d8;
    font-weight: 650;
}

.system-green {
    color: #6ee7b7;
    font-weight: 650;
}


/* ============================================================
   HERO
   ============================================================ */

.hero {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 5rem 1rem 2.3rem;
    animation: heroIn 0.75s ease-out both;
}

@keyframes heroIn {
    from {
        opacity: 0;
        transform: translateY(16px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.hero-pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 11px;
    border-radius: 999px;
    background: rgba(99,102,241,0.07);
    border: 1px solid rgba(129,140,248,0.20);
    color: #a5b4fc;
    font-size: 0.65rem;
    font-weight: 650;
}

.hero h1 {
    margin: 18px 0 0;
    color: #fafafa;
    font-size: clamp(2.8rem, 5vw, 4.2rem);
    line-height: 1.02;
    letter-spacing: -0.065em;
    font-weight: 800;
}

.hero-gradient {
    background: linear-gradient(
        90deg,
        #a5b4fc,
        #67e8f9
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.hero-text {
    max-width: 620px;
    margin: 16px auto 0;
    color: #777983;
    font-size: 0.9rem;
    line-height: 1.65;
}


/* ============================================================
   FEATURE PILLS
   ============================================================ */

.features {
    display: flex;
    justify-content: center;
    gap: 7px;
    flex-wrap: wrap;
    margin-top: 17px;
}

.feature {
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.022);
    padding: 6px 9px;
    border-radius: 999px;
    color: #7f8089;
    font-size: 0.61rem;
}

.feature b {
    color: #d4d4d8;
}


/* ============================================================
   COMPOSER
   ============================================================ */

.composer-shell {
    position: relative;
    z-index: 4;
    max-width: 820px;
    margin: 2rem auto 0;
    padding: 10px;
    border-radius: 21px;
    background:
        linear-gradient(
            145deg,
            rgba(255,255,255,0.065),
            rgba(255,255,255,0.022)
        );
    border: 1px solid rgba(255,255,255,0.095);
    box-shadow:
        0 30px 80px rgba(0,0,0,0.35),
        0 0 50px rgba(99,102,241,0.045),
        inset 0 1px 0 rgba(255,255,255,0.045);
}

.composer-caption {
    text-align: center;
    margin-top: 8px;
    color: #4e5059;
    font-size: 0.61rem;
}


/* ============================================================
   ATTACHMENT PREVIEW
   ============================================================ */

.attachment-card {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 8px 10px;
    margin-bottom: 8px;
    border-radius: 11px;
    background: rgba(99,102,241,0.07);
    border: 1px solid rgba(129,140,248,0.15);
    color: #c7d2fe;
    font-size: 0.7rem;
}

.image-preview {
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.08);
}


/* ============================================================
   CHAT
   ============================================================ */

.chat {
    position: relative;
    z-index: 2;
    max-width: 820px;
    margin: 2.3rem auto 0;
}

.user-label,
.ai-label {
    font-size: 0.65rem;
    font-weight: 700;
    margin-bottom: 6px;
}

.user-label {
    color: #818cf8;
}

.ai-label {
    color: #67e8f9;
}

.user-message {
    max-width: 72%;
    margin-left: auto;
    padding: 12px 15px;
    border-radius: 16px 16px 5px 16px;
    background: #202330;
    border: 1px solid rgba(255,255,255,0.06);
    color: #ededee;
    font-size: 0.86rem;
    line-height: 1.6;
    margin-bottom: 1.4rem;
}

.ai-message {
    padding: 16px 18px;
    border-radius: 16px;
    background: rgba(255,255,255,0.023);
    border: 1px solid rgba(255,255,255,0.065);
    color: #e4e4e7;
    font-size: 0.88rem;
    line-height: 1.72;
}


/* ============================================================
   METRICS
   ============================================================ */

.metrics {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 9px;
}

.metric {
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.025);
    padding: 5px 8px;
    border-radius: 999px;
    color: #74757e;
    font-size: 0.61rem;
}

.metric-good {
    color: #6ee7b7;
}


/* ============================================================
   SOURCES
   ============================================================ */

.sources-title {
    margin: 20px 0 7px;
    color: #5f6069;
    font-size: 0.61rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-weight: 750;
}

.source-card {
    padding: 10px 12px;
    border-radius: 11px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.055);
    margin-bottom: 5px;
    transition:
        transform 0.2s ease,
        border-color 0.2s ease,
        background 0.2s ease;
}

.source-card:hover {
    transform: translateY(-2px);
    border-color: rgba(129,140,248,0.25);
    background: rgba(99,102,241,0.035);
}

.source-name {
    color: #d4d4d8;
    font-size: 0.73rem;
    font-weight: 650;
}

.source-meta {
    color: #686a74;
    font-size: 0.6rem;
    margin-top: 3px;
}

.source-score {
    color: #818cf8;
}


/* ============================================================
   PROCESSING
   ============================================================ */

.processing {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 16px auto;
    color: #777983;
    font-size: 0.7rem;
}

.processing-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #818cf8;
    animation: processingPulse 1.1s ease-in-out infinite;
}

.processing-dot:nth-child(2) {
    animation-delay: 0.15s;
}

.processing-dot:nth-child(3) {
    animation-delay: 0.3s;
}

@keyframes processingPulse {
    0%, 100% {
        opacity: 0.25;
        transform: scale(0.75);
    }

    50% {
        opacity: 1;
        transform: scale(1.15);
    }
}


/* ============================================================
   STREAMLIT CONTROLS
   ============================================================ */

div[data-baseweb="input"] {
    background: rgba(255,255,255,0.025) !important;
    border-color: rgba(255,255,255,0.07) !important;
    border-radius: 13px !important;
}

div[data-baseweb="input"] input {
    color: #f4f4f5 !important;
}

div[data-baseweb="select"] > div {
    background: rgba(255,255,255,0.025) !important;
    border-color: rgba(255,255,255,0.07) !important;
    border-radius: 10px !important;
}

.stButton > button {
    border-radius: 11px !important;
    border: 1px solid rgba(255,255,255,0.075) !important;
    background: rgba(255,255,255,0.035) !important;
    color: #e4e4e7 !important;
    font-weight: 650 !important;
    transition: all 0.2s ease !important;
}

.stButton > button:hover {
    transform: translateY(-1px);
    border-color: rgba(129,140,248,0.4) !important;
    background: rgba(99,102,241,0.1) !important;
}

div[data-testid="stExpander"] {
    background: rgba(255,255,255,0.018) !important;
    border: 1px solid rgba(255,255,255,0.06) !important;
    border-radius: 12px !important;
}

</style>

<div class="ambient one"></div>
<div class="ambient two"></div>
<div class="ambient three"></div>
""",
    unsafe_allow_html=True,
)


# ============================================================
# RAG
# ============================================================

@st.cache_resource
def load_rag_system():

    with open(
        os.path.join(
            PROJECT_ROOT,
            "data",
            "dev_documents.json"
        ),
        "r",
        encoding="utf-8",
    ) as f:
        docs = json.load(f)

    vector_store = VectorStore()

    chunker = AdvancedChunker(
        embedding_model=vector_store.model
    )

    guardrails = Guardrails(
        min_retrieval_confidence=0.35
    )

    generator = GroundedGenerator(
        model="mock-grounded"
    )

    all_chunks = []

    for doc in docs:
        all_chunks.extend(
            chunker.adaptive_chunk(doc)
        )

    vector_store.add_chunks(all_chunks)

    harness = RAGHarness(
        vector_store,
        generator,
        guardrails
    )

    return (
        harness,
        SarvamSTT(),
        SarvamTTS(),
        all_chunks,
    )


harness, stt, tts, all_chunks = load_rag_system()


# ============================================================
# SESSION
# ============================================================

if "messages" not in st.session_state:
    st.session_state.messages = []

if "last_result" not in st.session_state:
    st.session_state.last_result = None


# ============================================================
# TOP BAR
# ============================================================

render_html(
    """
<div class="topbar">
    <div class="logo-wrap">
        <div class="logo">◈</div>
        <div class="logo-text">IndicRAG</div>
    </div>

    <div class="online">
        <span class="online-dot"></span>
        System online
    </div>
</div>
""",
    unsafe_allow_html=True,
)


# ============================================================
# SIDEBAR
# ============================================================

with st.sidebar:

    render_html(
        """
<div class="sidebar-brand">
    <div class="sidebar-logo">◈</div>
    <div>
        <div class="sidebar-name">IndicRAG</div>
        <div class="sidebar-sub">
            Multilingual AI Knowledge Engine
        </div>
    </div>
</div>
""",
        unsafe_allow_html=True,
    )

    if st.button(
        "＋  New conversation",
        use_container_width=True,
    ):
        st.session_state.messages = []
        st.session_state.last_result = None
        st.rerun()

    render_html(
        '<div class="sidebar-title">System</div>',
        unsafe_allow_html=True,
    )

    render_html(
        f"""
<div class="system-panel">

    <div class="system-row">
        <span class="system-label">Engine</span>
        <span class="system-green">● Online</span>
    </div>

    <div class="system-row">
        <span class="system-label">Retrieval</span>
        <span class="system-value">Hybrid</span>
    </div>

    <div class="system-row">
        <span class="system-label">Chunking</span>
        <span class="system-value">Adaptive</span>
    </div>

    <div class="system-row">
        <span class="system-label">Guardrails</span>
        <span class="system-green">● Active</span>
    </div>

    <div class="system-row">
        <span class="system-label">Indexed</span>
        <span class="system-value">{len(all_chunks)} chunks</span>
    </div>

</div>
""",
        unsafe_allow_html=True,
    )

    render_html(
        '<div class="sidebar-title">Language</div>',
        unsafe_allow_html=True,
    )

    language_map = {
        "Auto": None,
        "English": "en",
        "Hindi": "hi",
    }

    language_name = st.selectbox(
        "Language",
        list(language_map.keys()),
        label_visibility="collapsed",
    )

    lang_filter = language_map[language_name]

    render_html(
        '<div class="sidebar-title">Architecture</div>',
        unsafe_allow_html=True,
    )

    with st.expander(
        "How IndicRAG works",
        expanded=False,
    ):
        render_html(
            """
**Query**

↓

**Adaptive chunking**

↓

**Hybrid retrieval**

Dense + keyword

↓

**Grounded generation**

↓

**Guardrails**

↓

**Evidence-backed response**
"""
        )

    render_html(
        '<div class="sidebar-title">Knowledge base</div>',
        unsafe_allow_html=True,
    )

    st.caption(
        "Development knowledge base · "
        f"{len(all_chunks)} indexed chunks"
    )


# ============================================================
# HERO
# ============================================================

if not st.session_state.messages:

    render_html(
        """
<div class="hero">

    <div class="hero-pill">
        <span class="online-dot"></span>
        Multilingual grounded AI
    </div>

    <h1>
        Ask anything.<br>
        <span class="hero-gradient">
            Get grounded answers.
        </span>
    </h1>

    <div class="hero-text">
        Search your knowledge with hybrid retrieval,
        adaptive context selection and evidence-backed generation.
    </div>

    <div class="features">

        <div class="feature">
            <b>Multilingual</b>
        </div>

        <div class="feature">
            <b>Hybrid</b> retrieval
        </div>

        <div class="feature">
            <b>Voice</b> ready
        </div>

        <div class="feature">
            <b>Multimodal</b> ready
        </div>

        <div class="feature">
            <b>Grounded</b> answers
        </div>

    </div>

</div>
""",
        unsafe_allow_html=True,
    )


# ============================================================
# CHAT HISTORY
# ============================================================

if st.session_state.messages:

    render_html(
        '<div class="chat">',
        unsafe_allow_html=True,
    )

    for message in st.session_state.messages:

        role = message["role"]

        content = html.escape(
            str(message["content"])
        )

        content = content.replace(
            "\n",
            "<br>"
        )

        if role == "user":

            render_html(
                f"""
<div>
    <div class="user-label">You</div>

    <div class="user-message">
        {content}
    </div>
</div>
""",
                unsafe_allow_html=True,
            )

        else:

            render_html(
                f"""
<div>
    <div class="ai-label">◈ IndicRAG</div>

    <div class="ai-message">
        {content}
    </div>
</div>
""",
                unsafe_allow_html=True,
            )

    render_html(
        '</div>',
        unsafe_allow_html=True,
    )


# ============================================================
# UNIFIED COMPOSER
# ============================================================

render_html(
    '<div class="composer-shell">',
    unsafe_allow_html=True,
)

# Attachment handling
attachment = st.file_uploader(
    "Attach image or document",
    type=[
        "png",
        "jpg",
        "jpeg",
        "webp",
        "pdf",
        "txt",
        "csv",
    ],
    label_visibility="collapsed",
)

if attachment:

    if attachment.type.startswith("image"):

        st.image(
            attachment,
            width=170,
            caption=attachment.name,
        )

        render_html(
            f"""
<div class="attachment-card">
    🖼 <b>{html.escape(attachment.name)}</b>
    · Image attached
</div>
""",
            unsafe_allow_html=True,
        )

    else:

        render_html(
            f"""
<div class="attachment-card">
    📎 <b>{html.escape(attachment.name)}</b>
    · Attachment ready
</div>
""",
            unsafe_allow_html=True,
        )


query_text = st.text_input(
    "Message IndicRAG",
    placeholder="Ask anything about your knowledge...",
    label_visibility="collapsed",
)


# Composer controls
control_left, control_voice, control_lang, control_send = st.columns(
    [2.1, 1.0, 1.0, 1.0]
)

with control_left:

    st.caption(
        "＋ Attach  ·  image / document"
    )

with control_voice:

    voice_enabled = st.toggle(
        "🎙 Voice",
        value=False,
    )

with control_lang:

    composer_language = st.selectbox(
        "Language",
        ["Auto", "English", "Hindi"],
        label_visibility="collapsed",
    )

with control_send:

    send = st.button(
        "↑ Send",
        use_container_width=True,
        type="primary",
    )


# ============================================================
# REAL MICROPHONE INPUT
# ============================================================

recorded_audio = None

if voice_enabled:

    try:

        recorded_audio = st.audio_input(
            "Speak to IndicRAG"
        )

    except AttributeError:

        st.info(
            "Microphone input requires a newer Streamlit version."
        )


if recorded_audio:

    temp_audio = os.path.join(
        PROJECT_ROOT,
        "temp_voice.wav"
    )

    with open(
        temp_audio,
        "wb"
    ) as f:
        f.write(
            recorded_audio.getbuffer()
        )

    voice_language = (
        "hi-IN"
        if composer_language == "Hindi"
        else "en-IN"
    )

    with st.spinner("Transcribing voice..."):

        transcribed = stt.transcribe(
            temp_audio,
            language_code=voice_language,
        )

    if transcribed:

        query_text = transcribed

        st.success(
            f"Voice query: {transcribed}"
        )


render_html(
    """
<div class="composer-caption">
    Text · Voice · Image · Document
    &nbsp; • &nbsp;
    Evidence-first responses
</div>
""",
    unsafe_allow_html=True,
)

render_html(
    '</div>',
    unsafe_allow_html=True,
)


# ============================================================
# PROCESS
# ============================================================

if send and query_text.strip():

    start = time.perf_counter()

    with st.spinner(
        "Retrieving evidence and grounding response..."
    ):

        result = harness.process_query(
            query_text.strip(),
            language_filter=lang_filter,
        )

    elapsed = (
        time.perf_counter() - start
    ) * 1000

    st.session_state.messages.append(
        {
            "role": "user",
            "content": query_text.strip(),
        }
    )

    st.session_state.messages.append(
        {
            "role": "assistant",
            "content": result.get(
                "answer",
                "No answer generated.",
            ),
        }
    )

    st.session_state.last_result = result

    st.rerun()


# ============================================================
# RESULTS
# ============================================================

result = st.session_state.last_result

if result:

    latency = float(
        result.get(
            "latency_ms",
            0,
        )
    )

    status = str(
        result.get(
            "status",
            "unknown",
        )
    )

    chunks = result.get(
        "retrieved_chunks",
        [],
    )

    grounded = status.lower() in {
        "success",
        "grounded",
        "ok",
    }

    render_html(
        '<div class="chat">',
        unsafe_allow_html=True,
    )

    render_html(
        f"""
<div class="metrics">

    <div class="metric metric-good">
        ✓ {"Grounded" if grounded else "Guardrail"}
    </div>

    <div class="metric">
        ⚡ {latency:.2f} ms
    </div>

    <div class="metric">
        🔎 Hybrid retrieval
    </div>

    <div class="metric">
        📚 {len(chunks)} sources
    </div>

</div>
""",
        unsafe_allow_html=True,
    )


    if chunks:

        render_html(
            '<div class="sources-title">Evidence used</div>',
            unsafe_allow_html=True,
        )

        for index, chunk in enumerate(
            chunks[:5],
            1,
        ):

            title = html.escape(
                str(
                    chunk.get(
                        "title",
                        "Untitled",
                    )
                )
            )

            language = html.escape(
                str(
                    chunk.get(
                        "language",
                        "unknown",
                    )
                )
            )

            strategy = html.escape(
                str(
                    chunk.get(
                        "strategy",
                        "adaptive",
                    )
                )
            )

            score = float(
                chunk.get(
                    "score",
                    0,
                )
            )

            render_html(
                f"""
<div class="source-card">

    <div class="source-name">
        {index}. {title}
    </div>

    <div class="source-meta">
        {language.upper()}
        · {strategy}
        ·
        <span class="source-score">
            similarity {score:.3f}
        </span>
    </div>

</div>
""",
                unsafe_allow_html=True,
            )


        with st.expander(
            "Inspect retrieved context"
        ):

            for index, chunk in enumerate(
                chunks,
                1,
            ):

                render_html(
                    f"### Source {index}"
                )

                st.caption(
                    f"{chunk.get('title', 'Untitled')} · "
                    f"{chunk.get('language', 'unknown')} · "
                    f"{chunk.get('score', 0):.4f}"
                )

                st.write(
                    chunk.get(
                        "text",
                        "",
                    )
                )


    # Voice answer
    answer = result.get(
        "answer",
        "",
    )

    if answer and (
        voice_enabled
        or composer_language == "Hindi"
    ):

        audio = tts.synthesize(
            answer,
            target_language_code=(
                "hi-IN"
                if composer_language == "Hindi"
                else "en-IN"
            ),
        )

        if audio:

            render_html(
                '<div class="sources-title">Voice response</div>',
                unsafe_allow_html=True,
            )

            st.audio(
                audio,
                format="audio/wav",
            )

    render_html(
        '</div>',
        unsafe_allow_html=True,
    )


# ============================================================
# FOOTER
# ============================================================

render_html(
    """
<div style="
    text-align:center;
    color:#41424b;
    font-size:0.60rem;
    margin-top:3rem;
">
    IndicRAG · Multilingual · Multimodal · Grounded
</div>
""",
    unsafe_allow_html=True,
)