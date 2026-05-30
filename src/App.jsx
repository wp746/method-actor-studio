import React, { useState, useEffect } from "react";
import { PRESETS, generateCustomPrompt } from "./data/emotions";
import AgentTerminal from "./components/AgentTerminal";
import PromptViewer from "./components/PromptViewer";
import "./App.css";

function App() {
  const [emotionInput, setEmotionInput] = useState("");
  const [duration, setDuration] = useState(10);
  const [camera, setCamera] = useState("电影级人物面部特写");
  const [lighting, setLighting] = useState("柔和自然光");
  const [background, setBackground] = useState("纯色背景");
  
  const [selectedPresetId, setSelectedPresetId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  // 初始化时，默认选中“崩溃失控”作为引导示例，并将输入框填上
  useEffect(() => {
    const defaultPreset = PRESETS.breakdown;
    setSelectedPresetId(defaultPreset.id);
    setEmotionInput(defaultPreset.name);
    setResults(defaultPreset);
  }, []);

  // 当选择预设时的处理器
  const handlePresetSelect = (preset) => {
    setSelectedPresetId(preset.id);
    setEmotionInput(preset.name);
    setResults(preset);
    setShowResults(true); // 预设可直接展示或重新生成
    setIsGenerating(false);
  };

  // 生成提示词
  const handleGenerate = (e) => {
    e.preventDefault();
    if (!emotionInput.trim()) return;

    setIsGenerating(true);
    setShowResults(false);

    // 检查输入是否完全匹配预设名字，如果是，用预设配置，否则动态生成
    const matchedPreset = Object.values(PRESETS).find(
      (p) => p.name === emotionInput.trim() || p.id === selectedPresetId
    );

    let outputData;
    if (matchedPreset && emotionInput.trim() === matchedPreset.name) {
      outputData = { ...matchedPreset };
      // 如果时长或配置有调整，使用计算的微调，不过预设已有精品文本
    } else {
      // 动态推导
      outputData = generateCustomPrompt(emotionInput, {
        duration,
        camera,
        lighting,
        background
      });
    }

    setResults(outputData);
  };

  const handleGenerationComplete = () => {
    setIsGenerating(false);
    setShowResults(true);
  };

  return (
    <div className="app-container">
      {/* 影院头部 */}
      <header className="app-header">
        <div className="brand-wrapper">
          <div className="brand-subtitle">MethodActor-Studio</div>
          <h1 className="brand-title">方法派 · 多智能体电影级表情工坊</h1>
        </div>
        <p className="brand-description">
          为 AI 视频创作者量身定制。基于 <span className="brand-highlight">Seedance 2.0</span> 语法规范，协同老戏骨与微表情专家，解构灵魂层面的细腻肌肉控制。
        </p>
      </header>

      {/* 控制工作台 */}
      <section className="control-board">
        <form onSubmit={handleGenerate} className="input-section">
          <div className="input-label">
            <span>输入您希望AI视频展现的深层情绪</span>
            <span className="input-count">{emotionInput.length}/50 字</span>
          </div>
          <div className="input-wrapper">
            <input
              type="text"
              value={emotionInput}
              onChange={(e) => {
                setEmotionInput(e.target.value);
                setSelectedPresetId(""); // 自定义输入时取消预设高亮
              }}
              placeholder="例如：强颜欢笑背后的凄凉崩溃、皮笑肉不笑的极度阴狠..."
              className="input-field"
              maxLength={50}
              disabled={isGenerating}
            />
            <button
              type="submit"
              className="btn-generate"
              disabled={isGenerating || !emotionInput.trim()}
            >
              {isGenerating ? "🎭 协同推理中..." : "🎬 生成表情提示词"}
            </button>
          </div>
        </form>

        {/* 细节设置 */}
        <div className="settings-grid">
          <div className="setting-item">
            <label className="setting-label">镜头焦段 (Camera)</label>
            <select
              value={camera}
              onChange={(e) => setCamera(e.target.value)}
              className="select-field"
              disabled={isGenerating}
            >
              <option value="电影级人物面部特写">电影级人物面部特写 (Close-up)</option>
              <option value="电影级人物面部极度特写">电影级人物极度特写 (Extreme Close-up)</option>
              <option value="电影级人物半侧面特写">电影级人物半侧面特写 (Profile)</option>
              <option value="眼部核心局部特写">眼部核心局部特写 (Eyes Close-up)</option>
            </select>
          </div>

          <div className="setting-item">
            <label className="setting-label">电影光影 (Lighting)</label>
            <select
              value={lighting}
              onChange={(e) => setLighting(e.target.value)}
              className="select-field"
              disabled={isGenerating}
            >
              <option value="柔和自然光">柔和自然光 (Soft Natural)</option>
              <option value="戏剧性明暗对比光 (卡拉瓦乔风格)">戏剧性明暗对比光 (Chiaroscuro)</option>
              <option value="边缘轮廓逆光">边缘轮廓逆光 (Rim Light)</option>
              <option value="低反差电影冷调光">低反差电影冷调光 (Cinematic Cool)</option>
            </select>
          </div>

          <div className="setting-item">
            <label className="setting-label">视频背景 (Background)</label>
            <select
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="select-field"
              disabled={isGenerating}
            >
              <option value="纯色背景">纯色背景 (Solid Color)</option>
              <option value="暗色微虚化背景">暗色微虚化背景 (Dark Blurred)</option>
              <option value="影院级颗粒黑胶背景">影院级颗粒黑胶背景 (Cinematic Grain)</option>
            </select>
          </div>

          <div className="setting-item">
            <label className="setting-label">预设时长 (Duration)</label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="select-field"
              disabled={isGenerating}
            >
              <option value={5}>5 秒过渡</option>
              <option value={8}>8 秒过渡</option>
              <option value={10}>10 秒过渡 (推荐)</option>
              <option value={12}>12 秒过渡</option>
            </select>
          </div>
        </div>

        {/* 预设推荐栏 */}
        <div className="preset-section">
          <div className="preset-title">
            <span>💡 戏骨经典微表情预设赏析</span>
          </div>
          <div className="preset-grid">
            {Object.values(PRESETS).map((preset) => (
              <div
                key={preset.id}
                onClick={() => !isGenerating && handlePresetSelect(preset)}
                className={`preset-card ${selectedPresetId === preset.id ? "active" : ""}`}
              >
                <div className="preset-header">
                  <span className="preset-name">{preset.name}</span>
                  <span className="preset-tag">{preset.tag}</span>
                </div>
                <p className="preset-desc">{preset.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 多智能体协同推理终端 */}
      <section className="terminal-section">
        <AgentTerminal
          emotionText={emotionInput}
          isGenerating={isGenerating}
          onComplete={handleGenerationComplete}
          results={results}
        />
      </section>

      {/* 提示词输出板 */}
      {showResults && results && (
        <section className="output-section">
          <PromptViewer results={results} />
        </section>
      )}
    </div>
  );
}

export default App;
