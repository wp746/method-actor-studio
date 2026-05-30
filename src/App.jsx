import React, { useState, useEffect } from "react";
import { PRESETS, EMOTION_ATLAS, generateCustomPrompt, enhanceScriptEmotion } from "./data/emotions";
import AgentTerminal from "./components/AgentTerminal";
import PromptViewer from "./components/PromptViewer";
import "./App.css";

function App() {
  // 全局 Tab 导航: "studio" | "script"
  const [activeTab, setActiveTab] = useState("studio");

  // --- 表情剧场 (Studio) 状态 ---
  const [emotionInput, setEmotionInput] = useState("");
  const [duration, setDuration] = useState(10);
  const [camera, setCamera] = useState("电影级人物面部特写");
  const [lighting, setLighting] = useState("柔和自然光");
  const [background, setBackground] = useState("纯色背景");
  
  const [selectedPresetId, setSelectedPresetId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  // 情绪图谱模态框/展开折叠状态
  const [showAtlas, setShowAtlas] = useState(false);

  // --- 剧本情绪强化 (Script Copilot) 状态 ---
  const [scriptInput, setScriptInput] = useState("麦克白（恐慌地）：那只手，那只沾满鲜血的手，又在眼前晃动了……");
  const [enhancedResult, setEnhancedResult] = useState(null);

  // 初始化默认值
  useEffect(() => {
    const defaultPreset = PRESETS.breakdown;
    setSelectedPresetId(defaultPreset.id);
    setEmotionInput(defaultPreset.name);
    setResults(defaultPreset);
  }, []);

  // 预设选择
  const handlePresetSelect = (preset) => {
    setSelectedPresetId(preset.id);
    setEmotionInput(preset.name);
    setResults(preset);
    setShowResults(true);
    setIsGenerating(false);
  };

  // 表情图谱中选中情绪
  const handleAtlasSelect = (emotionName) => {
    setEmotionInput(emotionName);
    setSelectedPresetId("");
    setShowAtlas(false); // 关闭图谱
    // 滚动回输入框位置
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // 生成提示词
  const handleGenerate = (e) => {
    if (e) e.preventDefault();
    if (!emotionInput.trim()) return;

    setIsGenerating(true);
    setShowResults(false);

    const matchedPreset = Object.values(PRESETS).find(
      (p) => p.name === emotionInput.trim() || p.id === selectedPresetId
    );

    let outputData;
    if (matchedPreset && emotionInput.trim() === matchedPreset.name) {
      outputData = { ...matchedPreset };
    } else {
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

  // --- 剧本解析逻辑 ---
  const handleAnalyzeScript = () => {
    if (!scriptInput.trim()) return;

    // 正则提取角色、情绪和台词
    // 支持中文括号（）或英文括号 ()
    const regex = /([^（\(\n：]+)[（\(\s]*([^）\)]+)[）\)\s]*[：:](.+)/;
    const match = scriptInput.trim().match(regex);

    let charName = "角色";
    let roughEmo = "怅然";
    let dialogueText = scriptInput;

    if (match) {
      charName = match[1].trim();
      roughEmo = match[2].trim();
      dialogueText = match[3].trim();
    } else {
      // 模糊退守：找括号
      const bracketRegex = /[（\(]([^）\)]+)[）\)]/;
      const bracketMatch = scriptInput.match(bracketRegex);
      if (bracketMatch) {
        roughEmo = bracketMatch[1].trim();
      }
    }

    const enhanced = enhanceScriptEmotion(charName, dialogueText, roughEmo);
    setEnhancedResult(enhanced);
  };

  // 从剧本副驾驶采纳子情绪，并返回生成工作台
  const handleAdoptEmotion = (emotionName) => {
    setEmotionInput(emotionName);
    setSelectedPresetId(""); // 自定义计算
    setActiveTab("studio"); // 切换主 Tab
    setShowResults(false);
    
    // 延迟一秒钟自动点击生成，给用户以缓冲感知
    setTimeout(() => {
      setIsGenerating(true);
      const outputData = generateCustomPrompt(emotionName, {
        duration,
        camera,
        lighting,
        background
      });
      setResults(outputData);
    }, 100);
  };

  return (
    <div className="app-container">
      {/* 影院头部 */}
      <header className="app-header">
        <div className="brand-wrapper">
          <div className="brand-subtitle">MethodActor-Studio v1.1.0</div>
          <h1 className="brand-title">方法派 · 多智能体电影级表情工坊</h1>
        </div>
        <p className="brand-description">
          为 AI 视频创作者量身定制。基于 <span className="brand-highlight">Seedance 2.0</span> 语法规范，协同老戏骨与微表情专家，解构灵魂层面的细腻肌肉控制。
        </p>
      </header>

      {/* Tab 导航 */}
      <nav className="tab-navigation">
        <button
          onClick={() => setActiveTab("studio")}
          className={`tab-btn ${activeTab === "studio" ? "active" : ""}`}
          id="tab-studio-btn"
        >
          🎬 镜头表情工坊
        </button>
        <button
          onClick={() => setActiveTab("script")}
          className={`tab-btn ${activeTab === "script" ? "active" : ""}`}
          id="tab-script-btn"
        >
          ✍️ 剧本情绪强化 (AI 副驾驶)
        </button>
      </nav>

      {/* ==========================================
         工作区 A: 镜头表情工坊
         ========================================== */}
      {activeTab === "studio" && (
        <div className="tab-content animate-fade-in">
          {/* 控制工作台 */}
          <section className="control-board">
            <form onSubmit={handleGenerate} className="input-section">
              <div className="input-label">
                <span>输入您希望展现的深层微表情情绪</span>
                <div className="label-helpers">
                  <button
                    type="button"
                    onClick={() => setShowAtlas(!showAtlas)}
                    className="btn-link-atlas"
                  >
                    📖 戏骨情绪大图谱
                  </button>
                  <span className="input-count">{emotionInput.length}/50 字</span>
                </div>
              </div>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={emotionInput}
                  onChange={(e) => {
                    setEmotionInput(e.target.value);
                    setSelectedPresetId("");
                  }}
                  placeholder="请输入或点击大图谱获取参考，例如：皮笑肉不笑的阴狠、强颜欢笑的绝望崩溃..."
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

            {/* 戏骨情绪图谱折叠展开区域 */}
            {showAtlas && (
              <div className="emotion-atlas-container animate-expand">
                <div className="atlas-header">
                  <h5>📖 58年老戏骨戏剧微表情图谱（20+细分情感灵感参考）</h5>
                  <button onClick={() => setShowAtlas(false)} className="btn-atlas-close">✕ 关闭</button>
                </div>
                <div className="atlas-grid">
                  {EMOTION_ATLAS.map((categoryGroup, catIdx) => (
                    <div key={catIdx} className="atlas-category-card">
                      <div className="atlas-category-title">{categoryGroup.category}</div>
                      <div className="atlas-emotion-list">
                        {categoryGroup.emotions.map((emo, emoIdx) => (
                          <div
                            key={emoIdx}
                            onClick={() => handleAtlasSelect(emo.name)}
                            className="atlas-emotion-item"
                          >
                            <div className="atlas-emo-name">{emo.name}</div>
                            <div className="atlas-emo-desc">{emo.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                <span>💡 戏骨招牌微表情预设赏析</span>
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
      )}

      {/* ==========================================
         工作区 B: 剧本情绪强化 (AI 剧本副驾驶)
         ========================================== */}
      {activeTab === "script" && (
        <div className="tab-content animate-fade-in">
          <div className="script-copilot-container">
            {/* 左侧：输入面板 */}
            <div className="script-input-card">
              <div className="panel-header-gold">
                <span className="card-icon">✍️</span>
                <h3>剧本台词输入 (Script Input)</h3>
              </div>
              <div className="script-tutorial">
                <p>💡 **语法贴士**：输入标准格式 <code>【角色（粗糙情绪形容词）：台词】</code>，老戏骨剖析师将为您智能推演出 3 种深度体验派的子情绪路径，帮您补齐细腻的面部戏骨细节！</p>
              </div>
              <textarea
                value={scriptInput}
                onChange={(e) => setScriptInput(e.target.value)}
                placeholder="例如：林黛玉（伤心委屈地流泪）：你昨儿怎么不理我，害我等了你大半夜？"
                className="script-textarea"
              />
              <button
                onClick={handleAnalyzeScript}
                className="btn-analyze-script"
                disabled={!scriptInput.trim()}
              >
                🧠 老戏骨智能剖析并强化情绪
              </button>
            </div>

            {/* 右侧：推荐面板 */}
            <div className="script-output-card">
              <div className="panel-header-cyan">
                <span className="card-icon">🎭</span>
                <h3>好莱坞体验派情绪强化路径 (Nuanced Performance Paths)</h3>
              </div>

              {!enhancedResult ? (
                <div className="script-empty-state">
                  <p>🔍 在左侧贴入您的剧本段落并点击“智能剖析”，我们的戏骨多智能体系统将为您层层补齐灵魂细节...</p>
                </div>
              ) : (
                <div className="script-results-wrapper animate-fade-in">
                  <div className="extracted-meta">
                    <span className="meta-badge char">角色: {enhancedResult.character}</span>
                    <span className="meta-badge emotion">原始表象情绪: {enhancedResult.roughEmotion}</span>
                  </div>
                  <div className="dialogue-preview">
                    “ {enhancedResult.dialogue} ”
                  </div>

                  <h4 className="recommendation-header">🎭 老戏骨戏剧张力推荐（3种面部控制路径）：</h4>

                  <div className="enhanced-paths-list">
                    {enhancedResult.paths.map((path, idx) => (
                      <div key={idx} className="path-recommendation-card">
                        <div className="path-card-header">
                          <span className="path-idx">路径 {idx + 1}</span>
                          <h5>{path.name}</h5>
                        </div>
                        <p className="path-desc">{path.description}</p>
                        <div className="path-breathing">
                          <span className="breath-indicator">💨 呼吸控制：</span>
                          {path.breathing}
                        </div>
                        <button
                          onClick={() => handleAdoptEmotion(path.name)}
                          className="btn-adopt-emotion"
                        >
                          ⚡️ 采纳此情绪并在表情工坊生成提示词 ➔
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
