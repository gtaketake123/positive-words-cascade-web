import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './App.css';

// ポジティブな言葉のリスト
const POSITIVE_WORDS = [
  'あなたは素晴らしい', '今この瞬間を楽しもう', '幸運が訪れる',
  'できる', 'ありがとう', '大丈夫', 'やれば出来る',
  '笑顔で過ごそう', '前向きに', 'チャレンジしよう',
  '成功する', '愛される', '幸せ', '感謝', '希望',
  'Happy', 'Positive', 'Believe', 'Dream', 'Smile',
  'You can do it', 'Keep going', 'Be yourself', 'Love yourself',
  '心が安らぐ', 'リラックス', '落ち着こう', 'やる気が出る',
  '元気が出る', '明るく', '楽しく', '優しく', '強く',
  '自信を持とう', '今を生きる', '最高の一日', 'ありのまま',
];

interface FallingWord {
  id: string;
  text: string;
  left: number;
  duration: number;
  fontSize: number;
  color: string;
  delay: number;
}

const GRADIENT_PRESETS = [
  { from: '#FFB6C1', to: '#FFC0CB' },
  { from: '#87CEEB', to: '#B0E0E6' },
  { from: '#FFD700', to: '#FFA500' },
  { from: '#98FB98', to: '#90EE90' },
  { from: '#DDA0DD', to: '#EE82EE' },
  { from: '#F0E68C', to: '#FFFFE0' },
  { from: '#20B2AA', to: '#40E0D0' },
  { from: '#FF6347', to: '#FFB6C1' },
  { from: '#4169E1', to: '#87CEEB' },
  { from: '#FF69B4', to: '#FFB6C1' },
];

export default function App() {
  const [words, setWords] = useState<FallingWord[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(4000);
  const [frequency, setFrequency] = useState(300);
  const [showSettings, setShowSettings] = useState(false);
  const [currentGradient, setCurrentGradient] = useState(GRADIENT_PRESETS[0]);
  const [breathingVisible, setBreathingVisible] = useState(false);
  const [breathingSpeed, setBreathingSpeed] = useState(4000);
  const [breathingSize, setBreathingSize] = useState(80);
  const [breathingColor, setBreathingColor] = useState('#FF69B4');
  const [breathingUseGradient, setBreathingUseGradient] = useState(false);
  const [breathingGradientColor2, setBreathingGradientColor2] = useState('#FF1493');
  const [showAudioSpectrum, setShowAudioSpectrum] = useState(false);
  const [spectrumColor, setSpectrumColor] = useState('#007AFF');
  const [spectrumUseGradient, setSpectrumUseGradient] = useState(false);
  const [spectrumGradientColor2, setSpectrumGradientColor2] = useState('#FF1493');
  const [audioData, setAudioData] = useState<number[]>(new Array(32).fill(0));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const wordIdRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gradientIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 背景グラデーションを定期的に変更
  useEffect(() => {
    gradientIntervalRef.current = setInterval(() => {
      const randomGradient = GRADIENT_PRESETS[Math.floor(Math.random() * GRADIENT_PRESETS.length)];
      setCurrentGradient(randomGradient);
    }, 60000); // 1分毎

    return () => {
      if (gradientIntervalRef.current) clearInterval(gradientIntervalRef.current);
    };
  }, []);

  // 言葉を生成
  const generateWord = (): FallingWord => {
    const text = POSITIVE_WORDS[Math.floor(Math.random() * POSITIVE_WORDS.length)];
    const fontSize = Math.random() * 20 + 14; // 14-34px
    const colors = ['#FF1493', '#FF69B4', '#FFB6C1', '#FF6347', '#4169E1', '#20B2AA'];
    
    return {
      id: `word-${wordIdRef.current++}`,
      text,
      left: Math.random() * 80,
      duration: speed / 1000,
      fontSize,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: 0,
    };
  };

  // 言葉を追加
  useEffect(() => {
    if (isPaused) return;

    intervalRef.current = setInterval(() => {
      setWords((prev) => {
        const newWords = [...prev, generateWord()];
        return newWords.length > 50 ? newWords.slice(-50) : newWords;
      });
    }, frequency);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [frequency, isPaused, speed]);

  // 言葉を削除
  const removeWord = (id: string) => {
    setWords((prev) => prev.filter((w) => w.id !== id));
  };

  // オーディオスペクトラムの初期化
  const initAudioContext = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      source.connect(analyser);
      analyser.fftSize = 256;
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      updateAudioData();
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  };

  // オーディオデータを更新
  const updateAudioData = () => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      setAudioData(Array.from(dataArray.slice(0, 32)));
      animationFrameRef.current = requestAnimationFrame(updateAudioData);
    }
  };

  useEffect(() => {
    if (showAudioSpectrum) {
      initAudioContext();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [showAudioSpectrum]);

  return (
    <div
      className="app"
      style={{
        background: `linear-gradient(135deg, ${currentGradient.from}, ${currentGradient.to})`,
      }}
    >
      {/* 降ってくる言葉 */}
      {words.map((word) => (
        <motion.div
          key={word.id}
          className="falling-word"
          style={{
            left: `${word.left}%`,
            fontSize: `${word.fontSize}px`,
            color: word.color,
          }}
          initial={{ y: -100, opacity: 1 }}
          animate={{ y: window.innerHeight + 100, opacity: 0 }}
          transition={{ duration: word.duration, ease: 'linear' }}
          onAnimationComplete={() => removeWord(word.id)}
          onClick={() => removeWord(word.id)}
        >
          {word.text}
        </motion.div>
      ))}

      {/* 深呼吸ガイド */}
      {breathingVisible && (
        <motion.div
          className="breathing-guide"
          style={{
            width: `${breathingSize}px`,
            height: `${breathingSize}px`,
            background: breathingUseGradient
              ? `linear-gradient(135deg, ${breathingColor}, ${breathingGradientColor2})`
              : breathingColor,
            borderRadius: '50%',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: breathingSpeed / 1000, repeat: Infinity }}
        />
      )}

      {/* オーディオスペクトラム */}
      {showAudioSpectrum && (
        <div className="audio-spectrum">
          {audioData.map((value, index) => (
            <div
              key={index}
              className="spectrum-bar"
              style={{
                height: `${(value / 255) * 100}%`,
                background: spectrumUseGradient
                  ? `linear-gradient(to top, ${spectrumColor}, ${spectrumGradientColor2})`
                  : `hsl(${index * 11.25}, 100%, 50%)`,
              }}
            />
          ))}
        </div>
      )}

      {/* コントロールボタン */}
      <button
        className="control-button pause-button"
        onClick={() => setIsPaused(!isPaused)}
      >
        {isPaused ? '▶' : '⏸'}
      </button>

      <button
        className="control-button settings-button"
        onClick={() => setShowSettings(!showSettings)}
      >
        ⚙️
      </button>

      {/* 設定パネル */}
      {showSettings && (
        <div className="settings-panel">
          <div className="settings-header">
            <h2>設定</h2>
            <button onClick={() => setShowSettings(false)}>✕</button>
          </div>

          <div className="settings-content">
            <div className="setting-item">
              <label>速度 ({speed}ms)</label>
              <input
                type="range"
                min="1000"
                max="8000"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              />
            </div>

            <div className="setting-item">
              <label>頻度 ({frequency}ms)</label>
              <input
                type="range"
                min="100"
                max="1000"
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
              />
            </div>

            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={breathingVisible}
                  onChange={(e) => setBreathingVisible(e.target.checked)}
                />
                深呼吸ガイドを表示
              </label>
            </div>

            {breathingVisible && (
              <>
                <div className="setting-item">
                  <label>深呼吸速度 ({breathingSpeed}ms)</label>
                  <input
                    type="range"
                    min="2000"
                    max="8000"
                    value={breathingSpeed}
                    onChange={(e) => setBreathingSpeed(Number(e.target.value))}
                  />
                </div>

                <div className="setting-item">
                  <label>深呼吸サイズ ({breathingSize}px)</label>
                  <input
                    type="range"
                    min="40"
                    max="300"
                    value={breathingSize}
                    onChange={(e) => setBreathingSize(Number(e.target.value))}
                  />
                </div>

                <div className="setting-item">
                  <label>深呼吸色</label>
                  <input
                    type="color"
                    value={breathingColor}
                    onChange={(e) => setBreathingColor(e.target.value)}
                    style={{ width: '100%', height: '40px', cursor: 'pointer' }}
                  />
                </div>

                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={breathingUseGradient}
                      onChange={(e) => setBreathingUseGradient(e.target.checked)}
                    />
                    グラデーションを使用
                  </label>
                </div>

                {breathingUseGradient && (
                  <div className="setting-item">
                    <label>グラデーション色2</label>
                    <input
                      type="color"
                      value={breathingGradientColor2}
                      onChange={(e) => setBreathingGradientColor2(e.target.value)}
                      style={{ width: '100%', height: '40px', cursor: 'pointer' }}
                    />
                  </div>
                )}
              </>
            )}

            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={showAudioSpectrum}
                  onChange={(e) => setShowAudioSpectrum(e.target.checked)}
                />
                オーディオスペクトラムを表示
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
