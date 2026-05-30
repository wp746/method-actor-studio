import React, { useState } from "react";

export default function PromptViewer({ results }) {
  const [copiedType, setCopiedType] = useState(null);

  if (!results) return null;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="prompt-viewer animate-fade-in">
      {/* 戏骨讲堂表演指导卡片 */}
      <div className="actor-masterclass-card">
        <div className="card-header-gold">
          <span className="card-icon">🎭</span>
          <h3>58年戏骨·表演艺术讲堂 (Character Subtext)</h3>
        </div>
        <div className="card-body-gold">
          <div className="actor-quote">
            <span className="quote-mark">“</span>
            <p>{results.actorNotes}</p>
            <span className="quote-mark text-right">”</span>
          </div>
          <div className="breathing-guide">
            <span className="breathing-badge">💨 呼吸控制</span>
            <p>{results.breathing}</p>
          </div>
        </div>
      </div>

      <div className="prompts-grid">
        {/* 格式一：时间轴分段控制 */}
        <div className="prompt-card">
          <div className="prompt-card-header">
            <div className="header-left">
              <span className="format-badge timeline">分段时间轴</span>
              <h4>时间轴分动格式 (Seedance 2.0 最佳实践)</h4>
            </div>
            <button
              onClick={() => handleCopy(results.timelinePrompt, "timeline")}
              className={`btn-copy ${copiedType === "timeline" ? "copied" : ""}`}
            >
              {copiedType === "timeline" ? "✓ 已复制" : "📋 复制提示词"}
            </button>
          </div>
          <div className="prompt-card-body">
            <pre className="prompt-text">
              <code>{results.timelinePrompt}</code>
            </pre>
          </div>
          <div className="prompt-card-footer">
            💡 适用于精确控制微表情转换节点的 AI 视频生成，能够带来极其自然生动的过渡。
          </div>
        </div>

        {/* 格式二：连续叙事流控制 */}
        <div className="prompt-card">
          <div className="prompt-card-header">
            <div className="header-left">
              <span className="format-badge continuous">叙事流</span>
              <h4>连续叙事流格式 (自然微表情流动)</h4>
            </div>
            <button
              onClick={() => handleCopy(results.continuousPrompt, "continuous")}
              className={`btn-copy ${copiedType === "continuous" ? "copied" : ""}`}
            >
              {copiedType === "continuous" ? "✓ 已复制" : "📋 复制提示词"}
            </button>
          </div>
          <div className="prompt-card-body">
            <pre className="prompt-text">
              <code>{results.continuousPrompt}</code>
            </pre>
          </div>
          <div className="prompt-card-footer">
            💡 适用于偏好流式段落叙述的生成模型，融合了微动作间的协调过渡。
          </div>
        </div>
      </div>
    </div>
  );
}
