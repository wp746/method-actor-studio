import React, { useEffect, useState } from "react";

export default function AgentTerminal({ emotionText, isGenerating, onComplete, results }) {
  const [logs, setLogs] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      setLogs([]);
      setActiveStep(0);
      return;
    }

    setLogs([]);
    setActiveStep(1);

    const timer1 = setTimeout(() => {
      setLogs(prev => [
        ...prev,
        {
          agent: "老戏骨 · 心理剖析师",
          avatar: "🎭",
          color: "#e5a93c",
          message: `收到剧本命题：【${emotionText}】。正在分析灵魂核...`,
          details: `呼吸建议：${results.breathing}\n导演指导：${results.actorNotes}`
        }
      ]);
      setActiveStep(2);
    }, 800);

    const timer2 = setTimeout(() => {
      setLogs(prev => [
        ...prev,
        {
          agent: "解剖学家 · 微表情控制师",
          avatar: "🧠",
          color: "#4facfe",
          message: `正在将心理层级转换为面部医学级肌群指令与生理渗出细节...`,
          details: results.timeline.map(t => `【${t.time} ${t.stage}】\n- 触发肌肉：${t.muscles}\n- 生理变化：${t.details}`).join("\n\n")
        }
      ]);
      setActiveStep(3);
    }, 2000);

    const timer3 = setTimeout(() => {
      setLogs(prev => [
        ...prev,
        {
          agent: "Seedance 2.0 导演",
          avatar: "🎬",
          color: "#00f2fe",
          message: `正在进行影院级渲染格式包装（电影级特写、25fps、4K、无对话）并输出最终提示词...`,
          details: `已生成：时间轴分段格式 (Timeline) & 连续叙事流格式 (Continuous Stream)。提示词已就绪！`
        }
      ]);
      setActiveStep(4);
      onComplete();
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isGenerating, emotionText, results]);

  return (
    <div className="agent-terminal">
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot dot-red"></span>
          <span className="dot dot-yellow"></span>
          <span className="dot dot-green"></span>
        </div>
        <div className="terminal-title">🎬 方法派·多智能体协同终端.sh</div>
        <div className="terminal-status">
          {isGenerating ? (
            <span className="status-badge running">
              <span className="pulse-indicator"></span> 协同推理中...
            </span>
          ) : (
            <span className="status-badge idle">就绪</span>
          )}
        </div>
      </div>

      <div className="terminal-body">
        {logs.length === 0 && (
          <div className="terminal-welcome">
            <p className="terminal-prompt">$ method-actor-studio --init</p>
            <p className="welcome-text">🎭 欢迎来到好莱坞老戏骨多智能体表情工坊！</p>
            <p className="sub-welcome">在上方输入您想要生成的角色情绪（例如：“狂喜过后的凄凉”、“战战兢兢的狂妄”），或者点击下方的预设卡片。我们的三位奥斯卡级智能体将为您剖析灵魂并输出极致分层的 Seedance 2.0 提示词。</p>
          </div>
        )}

        {logs.map((log, index) => (
          <div key={index} className="terminal-log-entry animate-fade-in">
            <div className="log-meta">
              <span className="log-avatar" style={{ background: `${log.color}22`, border: `1px solid ${log.color}` }}>
                {log.avatar}
              </span>
              <span className="log-agent" style={{ color: log.color }}>
                {log.agent}
              </span>
              <span className="log-timestamp">Step {index + 1}</span>
            </div>
            <div className="log-message">{log.message}</div>
            {log.details && (
              <pre className="log-details animate-expand">
                <code>{log.details}</code>
              </pre>
            )}
          </div>
        ))}

        {isGenerating && activeStep > 0 && activeStep < 4 && (
          <div className="terminal-loader animate-pulse">
            <div className="spinner-mini"></div>
            <span>
              {activeStep === 1 && "老戏骨剖析角色中..."}
              {activeStep === 2 && "面部肌肉解剖中..."}
              {activeStep === 3 && "Seedance提示词包装中..."}
            </span>
          </div>
        )}
      </div>

      {/* 协同进度条 */}
      <div className="terminal-progress-bar">
        <div className={`progress-node ${activeStep >= 1 ? "active" : ""}`}>
          <div className="node-dot">1</div>
          <span className="node-label">心理研读</span>
        </div>
        <div className={`progress-line ${activeStep >= 2 ? "active" : ""}`}></div>
        <div className={`progress-node ${activeStep >= 2 ? "active" : ""}`}>
          <div className="node-dot">2</div>
          <span className="node-label">面部肌肉</span>
        </div>
        <div className={`progress-line ${activeStep >= 3 ? "active" : ""}`}></div>
        <div className={`progress-node ${activeStep >= 3 ? "active" : ""}`}>
          <div className="node-dot">3</div>
          <span className="node-label">提示词生成</span>
        </div>
      </div>
    </div>
  );
}
