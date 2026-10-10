import { useState } from "react";
import { useNavigate } from "react-router-dom";

const QUESTIONS = [
  {
    question: "Design a URL shortening service like bit.ly.",
    answer:
      "Goal: map a long URL to a short unique code and redirect fast.\nRequirements: very high read traffic, low redirect latency, custom aliases, and click analytics.\nCore design: API service + URL metadata DB + cache (Redis) + analytics pipeline.\nShort code generation: use Base62 with a unique ID generator (or hash + collision check).\nRead path: short code -> cache lookup -> DB fallback -> 301 redirect.\nScale and reliability: cache hot links, DB sharding by short code prefix, async analytics events through a queue, and rate limiting to prevent abuse.",
  },
  {
    question: "Design a chat application like WhatsApp.",
    answer:
      "Goal: real-time 1:1 and group messaging with delivery guarantees.\nRequirements: low latency, ordered messages per conversation, online presence, and offline sync.\nCore design: gateway/WebSocket servers for live connections, chat service, message queue, and persistent store.\nMessage flow: sender -> chat service -> queue -> recipient delivery; if offline, store and deliver on reconnect.\nData model: conversation_id, message_id, sender_id, timestamp, delivery/read status.\nScale and reliability: partition by conversation_id, fan-out service for groups, retries with idempotent message IDs, and encryption support.",
  },
  {
    question: "Design a file storage system like Google Drive.",
    answer:
      "Goal: upload, download, share, and version files across devices.\nRequirements: durability, resumable uploads, access control, and file version history.\nCore design: metadata service (file tree, owners, permissions) + object storage for file chunks.\nUpload flow: client splits file into chunks -> upload chunks -> commit metadata record.\nDownload flow: metadata lookup -> signed URLs/chunk locations -> stream and reassemble.\nScale and reliability: chunk deduplication, multi-region replication, background virus scan, and ACL checks on every read/write.",
  },
  {
    question: "Design a search engine.",
    answer:
      "Goal: return relevant results quickly for web-scale documents.\nPipeline: crawler -> parser -> indexer -> ranking -> query serving.\nCrawler: discover URLs, respect robots.txt, schedule recrawls by page freshness.\nIndexer: tokenize content, build inverted index, store term positions and document metadata.\nRanking: combine BM25/text relevance with quality signals (freshness, authority, engagement).\nServing path: query parser -> retrieve top candidates from shards -> ranker -> return results with caching for hot queries.",
  },
  {
    question: "Design a scalable video streaming platform.",
    answer:
      "Goal: upload videos and stream smoothly on different networks/devices.\nRequirements: adaptive bitrate playback, fast startup, global availability, and secure content delivery.\nCore design: ingest service -> transcoding workers -> origin storage -> CDN edges.\nProcessing: convert each video into multiple bitrates/resolutions and segment into HLS/DASH chunks.\nPlayback path: client requests manifest, then fetches best segments based on current bandwidth.\nScale and reliability: pre-warm popular content on CDN, queue-based transcoding autoscale, signed URLs/DRM, and monitoring for buffering and failed segments.",
  },
];

export default function SystemDesignPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);

  return (
    <div className="qa-page">

      {/* HEADER */}
      <div className="qa-header">

        <div>
          <h1 className="qa-title">
            System Design
          </h1>
          <p className="qa-subtitle">
            Click a question to view answer
          </p>
        </div>

        <button
          onClick={() => navigate("/practice")}
          className="qa-back-btn"
        >
          Back to Practice
        </button>

      </div>

      {/* QUESTIONS LIST */}
      <div className="qa-list">

        {QUESTIONS.map((q, i) => (
          <div
            key={i}
            className="qa-card"
          >

            {/* QUESTION */}
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="qa-toggle"
            >

              <div className="qa-left">

                <div className="qa-index">
                  {i + 1}
                </div>

                <p className="qa-question">
                  {q.question}
                </p>

              </div>

              <span className="qa-icon">
                {open === i ? "−" : "+"}
              </span>

            </button>

            {/* ANSWER */}
            {open === i && (
              <div className="qa-answer">
                {q.answer}
              </div>
            )}

          </div>
        ))}

      </div>
    </div>
  );
}
