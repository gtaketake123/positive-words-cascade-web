import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './App.css';

// ポジティブな言葉のリスト（大幅に拡張）
const POSITIVE_WORDS = [
  // 日本語
  'あなたは素晴らしい', '今この瞬間を楽しもう', '幸運が訪れる',
  'できる', 'ありがとう', '大丈夫', 'やれば出来る',
  '笑顔で過ごそう', '前向きに', 'チャレンジしよう',
  '成功する', '愛される', '幸せ', '感謝', '希望',
  '心が安らぐ', 'リラックス', '落ち着こう', 'やる気が出る',
  '元気が出る', '明るく', '楽しく', '優しく', '強く',
  '自信を持とう', '今を生きる', '最高の一日', 'ありのまま',
  '心配ない', 'うまくいく', '信じよう', '輝いている', '素敵',
  '美しい', '愛してる', '応援してる', '頑張って', 'ファイト',
  '負けないで', '勇気を出して', '一歩ずつ', '焦らないで',
  'ゆっくりでいい', '自分らしく', '自分を信じて', '自分を大切に',
  '自分を愛して', '今日も良い日', '明日はもっと良くなる',
  'きっと大丈夫', '必ずできる', 'あなたならできる',
  '可能性は無限', '夢は叶う', '奇跡は起こる', '運が良い',
  'ツイてる', 'ラッキー', 'ハッピー', 'ピース', 'ラブ',
  'スマイル', 'ジョイ', 'ワンダフル',
  'あなたはあなたであればいい', '自分なんかダメだなんて思わない',
  '他人と比べなくていい', '自分の良さに気づこう',
  '幸せだと思えることを続けよう', '明けない夜はない',
  'やまない雨はない', '良いことが必ずやってくる',
  '自分で自分を褒めてあげよう', '今日がよくなかっただけ',
  '生まれたことに感謝', '自分らしい人生を歩もう',
  'その人にしか出せない輝きがある', '自分を信じてあげよう',
  '自分が持っているものを大切に', '小さな幸せを実感しよう',
  '自分のやりたいようにやってみよう', 'いくつになっても可能性は無限',
  '過去にとらわれすぎない', '前を向いて進もう',
  '自分の魅力や才能に自信を持とう', '身体をいたわる時間を作ろう',
  '当たり前の日々の大切さを感じよう', '普通の幸せのありがたさ',
  '前に進んでみよう', '新しい景色が見えてくる',
  'ぶれない芯を持とう', '幸せは周りにあふれている',
  '助けてくれる人が近くにいる', '自分らしさを見失わない',
  '一人ではない', '支え合って生きている', '心を整える',
  '自分を好きになる', '心豊かに生きる', '希望を持ち続ける',
  'ありのままの自分を受け入れる', 'ありのままの自分を愛する',
  '内側から美しく輝く', '一日の始まりを丁寧に',
  '本当の自分を見つける', '楽しいことに想いをはせる',
  '感謝の気持ちを持つ', '幸せを実感する', '心を磨く',
  'きっと良くなる', '生きているだけで価値がある',
  '前向きに気持ちを向上させる', '心が軽くなる',
  '自分の心のコップを満たす', '深呼吸しよう', '肩の力を抜こう',
  '今日生きていることに感謝', 'すべて上手くいっている',
  '自分は運がいい', '今日もいい日だった',
  'おはよう、素敵な一日を', 'おやすみ、良い夢を',
  '今日もお疲れ様', 'よく頑張ったね', 'えらいね',
  'すごいね', 'さすがだね', '素晴らしい', '最高',
  '完璧', 'パーフェクト', 'グッド', 'ナイス',
  'エクセレント', 'ブラボー', 'アメージング',
  
  // 英語
  'Happy', 'Positive', 'Believe', 'Dream', 'Smile',
  'You can do it', 'Keep going', 'Be yourself', 'Love yourself',
  'Amazing', 'Wonderful', 'Beautiful', 'Brilliant', 'Fantastic',
  'Fabulous', 'Awesome', 'Great', 'Good', 'Nice',
  'Perfect', 'Excellent', 'Outstanding', 'Superb', 'Magnificent',
  'Marvelous', 'Splendid', 'Terrific', 'Incredible', 'Extraordinary',
  'Phenomenal', 'Spectacular', 'Stunning', 'Breathtaking', 'Gorgeous',
  'Lovely', 'Charming', 'Delightful', 'Pleasant', 'Cheerful',
  'Joyful', 'Blissful', 'Blessed', 'Grateful', 'Thankful',
  'Hopeful', 'Optimistic', 'Confident', 'Brave', 'Strong',
  'Powerful', 'Capable', 'Talented', 'Gifted', 'Creative',
  'Innovative', 'Inspiring', 'Motivated', 'Determined', 'Focused',
  'Dedicated', 'Passionate', 'Enthusiastic', 'Energetic', 'Vibrant',
  'Radiant', 'Glowing', 'Shining', 'Sparkling', 'Dazzling',
  'Bright', 'Luminous', 'Warm', 'Kind', 'Gentle',
  'Caring', 'Loving', 'Compassionate', 'Generous', 'Thoughtful',
  'Considerate', 'Understanding', 'Patient', 'Peaceful', 'Calm',
  'Serene', 'Tranquil', 'Relaxed', 'Comfortable', 'Cozy',
  'Safe', 'Secure', 'Protected', 'Supported', 'Encouraged',
  'Empowered', 'Uplifted', 'Elevated', 'Enhanced', 'Improved',
  'Better', 'Best', 'Superior', 'Premium', 'Quality',
  'Valuable', 'Precious', 'Treasured', 'Cherished', 'Beloved',
  'Adored', 'Admired', 'Respected', 'Honored', 'Celebrated',
  'Successful', 'Victorious', 'Triumphant', 'Winning', 'Champion',
  'Leader', 'Pioneer', 'Trailblazer', 'Visionary', 'Wise',
  'Smart', 'Intelligent', 'Clever', 'Genius', 'Skilled',
  'Expert', 'Master', 'Professional', 'Accomplished', 'Achieved',
  'Fulfilled', 'Satisfied', 'Content', 'Delighted', 'Pleased',
  'Thrilled', 'Excited', 'Eager', 'Ready', 'Prepared',
  'Equipped', 'Able', 'Competent', 'Qualified', 'Worthy',
  'Deserving', 'Enough', 'Sufficient', 'Abundant', 'Plentiful',
  'Rich', 'Wealthy', 'Prosperous', 'Fortunate', 'Lucky',
  'Favored', 'Chosen', 'Special', 'Unique', 'Original',
  'Authentic', 'Genuine', 'Real', 'True', 'Honest',
  'Sincere', 'Pure', 'Clean', 'Clear', 'Fresh',
  'New', 'Young', 'Alive', 'Vital', 'Healthy',
  'Fit', 'Well', 'Whole', 'Complete', 'Flawless',
  'Ideal', 'Ultimate', 'Supreme', 'Divine', 'Heavenly',
  'Angelic', 'Magical', 'Miraculous', 'Wondrous', 'Glorious',
  'Majestic', 'Royal', 'Noble', 'Elegant', 'Graceful',
  'Refined', 'Sophisticated', 'Classy', 'Stylish', 'Fashionable',
  'Trendy', 'Modern', 'Contemporary', 'Advanced', 'Progressive',
  'Forward', 'Onward', 'Upward', 'Rising', 'Growing',
  'Expanding', 'Developing', 'Evolving', 'Transforming', 'Changing',
  'Advancing', 'Progressing', 'Succeeding', 'Thriving', 'Flourishing',
  'Blooming', 'Blossoming', 'Flowering', 'Budding', 'Emerging',
  'Awakening', 'Enlightened', 'Aware', 'Conscious', 'Mindful',
  'Present', 'Here', 'Now', 'Today', 'Forever',
  'Always', 'Eternal', 'Infinite', 'Limitless', 'Boundless',
  'Endless', 'Timeless', 'Ageless', 'Immortal', 'Everlasting',
  'Permanent', 'Lasting', 'Enduring', 'Resilient', 'Tough',
  'Sturdy', 'Solid', 'Stable', 'Steady', 'Reliable',
  'Dependable', 'Trustworthy', 'Faithful', 'Loyal', 'Devoted',
  'Committed', 'Constant', 'Consistent', 'Persistent', 'Persevering',
  'Tenacious', 'Resolute', 'Firm', 'Fixed', 'Established',
  'Founded', 'Grounded', 'Rooted', 'Anchored', 'Centered',
  'Balanced', 'Harmonious', 'Unified', 'Connected', 'Linked',
  'Bonded', 'Joined', 'United', 'Together', 'One',
  "You've got this", "I'm here for you", 'You are not alone',
  'One step at a time', 'You are enough', 'Believe in yourself',
  'Trust the process', 'Everything happens for a reason',
  'This too shall pass', 'You are loved', 'You are worthy',
  'You are strong', 'You are brave', 'You are capable',
  'You are special', 'You are unique', 'You are important',
  'You matter', 'You are valued', 'You are appreciated',
  'You are a gift', 'You are a blessing', 'You are a miracle',
  'You are precious', 'You are irreplaceable', 'You are extraordinary',
  'You light up the room', 'You make a difference', 'You inspire others',
  'You bring joy', 'You spread love', 'You create beauty',
  'You make the world better', 'Your smile is contagious',
  'Your energy is amazing', 'Your spirit is beautiful',
  'Your heart is pure', 'Your soul is bright', 'Your mind is brilliant',
  'Your presence is a gift', 'Your life has purpose',
  'Your dreams are valid', 'Your goals are achievable',
  'Your future is bright', 'Your potential is limitless',
  'Your possibilities are endless', 'Your journey is beautiful',
  'Your time is now', 'Your moment has come',
  'Today is a new day', 'Tomorrow is full of possibilities',
  'The best is yet to come', 'Great things are coming',
  'Miracles happen every day', 'Dreams do come true',
  'Anything is possible', 'Everything is possible',
  'Nothing is impossible', 'The sky is the limit',
  'Reach for the stars', 'Shoot for the moon',
  'Aim high', 'Think big', 'Go far', 'Rise up',
  'Stand tall', 'Walk proud', 'Live fully', 'Love deeply',
  'Laugh often', 'Smile always', 'Shine bright', 'Glow radiantly',
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
  const [speed, setSpeed] = useState(8000);
  const [frequency, setFrequency] = useState(300);
  const [showSettings, setShowSettings] = useState(false);
  const [currentGradient, setCurrentGradient] = useState(GRADIENT_PRESETS[0]);
  const [breathingVisible, setBreathingVisible] = useState(false);
  const [breathingSpeed, setBreathingSpeed] = useState(10000);
  const [breathingOpacity, setBreathingOpacity] = useState(70);
  const [breathingSize, setBreathingSize] = useState(80);
  const [breathingColor, setBreathingColor] = useState('#FF69B4');
  const [breathingUseGradient, setBreathingUseGradient] = useState(false);
  const [breathingGradientColor2, setBreathingGradientColor2] = useState('#FF1493');
  const [showAudioSpectrum, setShowAudioSpectrum] = useState(false);
  const [audioData, setAudioData] = useState<number[]>(new Array(32).fill(0));
  const [randomSpeed, setRandomSpeed] = useState(false);
  const [backgroundMode, setBackgroundMode] = useState<'gradient-auto' | 'gradient-fixed' | 'white' | 'black' | 'image'>('gradient-auto');
  const [customBackgroundImage, setCustomBackgroundImage] = useState<string | null>(null);
  const [gradientChangeInterval, setGradientChangeInterval] = useState(60000);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const wordIdRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gradientIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 背景グラデーションを定期的に変更
  useEffect(() => {
    if (backgroundMode === 'gradient-auto') {
      gradientIntervalRef.current = setInterval(() => {
        const randomGradient = GRADIENT_PRESETS[Math.floor(Math.random() * GRADIENT_PRESETS.length)];
        setCurrentGradient(randomGradient);
      }, gradientChangeInterval);

      return () => {
        if (gradientIntervalRef.current) clearInterval(gradientIntervalRef.current);
      };
    } else {
      if (gradientIntervalRef.current) clearInterval(gradientIntervalRef.current);
    }
  }, [backgroundMode, gradientChangeInterval]);

  // 言葉を生成
  const generateWord = (): FallingWord => {
    const text = POSITIVE_WORDS[Math.floor(Math.random() * POSITIVE_WORDS.length)];
    const fontSize = Math.random() * 20 + 14; // 14-34px
    const colors = ['#FF1493', '#FF69B4', '#FFB6C1', '#FF6347', '#4169E1', '#20B2AA'];
    
    // ランダム速度が有効な場合、速度範囲内でランダムに設定
    const wordSpeed = randomSpeed 
      ? (Math.random() * (12000 - 5000) + 5000) 
      : speed;
    
    return {
      id: `word-${wordIdRef.current++}`,
      text,
      left: Math.random() * 80,
      duration: wordSpeed / 1000,
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
  }, [frequency, isPaused, speed, randomSpeed]);

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

  // 背景画像のアップロード処理
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomBackgroundImage(event.target?.result as string);
        setBackgroundMode('image');
      };
      reader.readAsDataURL(file);
    }
  };

  // 背景スタイルを取得
  const getBackgroundStyle = () => {
    switch (backgroundMode) {
      case 'white':
        return { background: '#FFFFFF' };
      case 'black':
        return { background: '#000000' };
      case 'image':
        return customBackgroundImage 
          ? { 
              backgroundImage: `url(${customBackgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }
          : { background: `linear-gradient(135deg, ${currentGradient.from}, ${currentGradient.to})` };
      case 'gradient-fixed':
        return { background: `linear-gradient(135deg, ${currentGradient.from}, ${currentGradient.to})` };
      case 'gradient-auto':
      default:
        return { background: `linear-gradient(135deg, ${currentGradient.from}, ${currentGradient.to})` };
    }
  };

  return (
    <div
      className="app"
      style={{
        ...getBackgroundStyle(),
        transition: 'background 0.5s ease',
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
          initial={{ y: -200, opacity: 1 }}
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
            opacity: breathingOpacity / 100,
            zIndex: 10,
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
                background: `hsl(${index * 11.25}, 100%, 50%)`,
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
                min="5000"
                max="12000"
                step="500"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              />
            </div>

            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={randomSpeed}
                  onChange={(e) => setRandomSpeed(e.target.checked)}
                />
                ランダム速度（5秒〜12秒）
              </label>
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
              <label>背景設定</label>
              <select 
                value={backgroundMode} 
                onChange={(e) => setBackgroundMode(e.target.value as any)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              >
                <option value="gradient-auto">グラデーション（自動変化）</option>
                <option value="gradient-fixed">グラデーション（固定）</option>
                <option value="white">白単色</option>
                <option value="black">黒単色</option>
                <option value="image">カスタム画像</option>
              </select>
            </div>

            {backgroundMode === 'gradient-auto' && (
              <div className="setting-item">
                <label>グラデーション変化間隔 ({gradientChangeInterval / 1000}秒)</label>
                <input
                  type="range"
                  min="10000"
                  max="300000"
                  step="10000"
                  value={gradientChangeInterval}
                  onChange={(e) => setGradientChangeInterval(Number(e.target.value))}
                />
              </div>
            )}

            {backgroundMode === 'image' && (
              <div className="setting-item">
                <label>背景画像をアップロード</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
            )}

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
                  <label>深呼吸速度 ({(breathingSpeed / 1000).toFixed(1)}秒)</label>
                  <input
                    type="range"
                    min="10000"
                    max="30000"
                    step="1000"
                    value={breathingSpeed}
                    onChange={(e) => setBreathingSpeed(Number(e.target.value))}
                  />
                </div>

                <div className="setting-item">
                  <label>深呼吸透明度 ({breathingOpacity}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={breathingOpacity}
                    onChange={(e) => setBreathingOpacity(Number(e.target.value))}
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
