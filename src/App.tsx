import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './App.css';

// ポジティブな日本語の言葉のみ
const POSITIVE_WORDS = [
  'あなたは素晴らしい', '今この瞬間を楽しもう', '幸運が訪れる', 'できる', 'ありがとう', '大丈夫', 'やれば出来る', '笑顔で過ごそう', '前向きに', 'チャレンジしよう',
  '成功する', '愛される', '幸せ', '感謝', '希望', '心が安らぐ', 'リラックス', '落ち着こう', 'やる気が出る', '元気が出る',
  '明るく', '楽しく', '優しく', '強く', '自信を持とう', '今を生きる', '最高の一日', 'ありのまま', '心配ない', 'うまくいく',
  '信じよう', '輝いている', '素敵', '美しい', '愛してる', '応援してる', '頑張って', 'ファイト', '負けないで', '勇気を出して',
  '一歩ずつ', '焦らないで', 'ゆっくりでいい', '自分らしく', '自分を信じて', '自分を大切に', '自分を愛して', '今日も良い日', '明日はもっと良くなる', 'きっと大丈夫',
  '必ずできる', 'あなたならできる', '可能性は無限', '夢は叶う', '奇跡は起こる', '運が良い', 'ツイてる', 'ラッキー', 'ハッピー', 'ピース',
  'あなたはあなたであればいい', '自分なんかダメだなんて思わない', '他人と比べなくていい', '自分の良さに気づこう', '幸せだと思えることを続けよう', '明けない夜はない',
  'やまない雨はない', '良いことが必ずやってくる', '自分で自分を褒めてあげよう', '今日がよくなかっただけ', '生まれたことに感謝', '自分らしい人生を歩もう', 'その人にしか出せない輝きがある', '自分を信じてあげよう', '自分が持っているものを大切に', '小さな幸せを実感しよう',
  '自分のやりたいようにやってみよう', 'いくつになっても可能性は無限', '過去にとらわれすぎない', '前を向いて進もう', '自分の魅力や才能に自信を持とう', '身体をいたわる時間を作ろう', '当たり前の日々の大切さを感じよう', '普通の幸せのありがたさ', '前に進んでみよう', '新しい景色が見えてくる',
  'ぶれない芯を持とう', '幸せは周りにあふれている', '助けてくれる人が近くにいる', '自分らしさを見失わない', '一人ではない', '支え合って生きている', '心を整える', '自分を好きになる', '心豊かに生きる', '希望を持ち続ける',
  'ありのままの自分を受け入れる', 'ありのままの自分を愛する', '内側から美しく輝く', '一日の始まりを丁寧に', '本当の自分を見つける', '楽しいことに想いをはせる', '感謝の気持ちを持つ', '幸せを実感する', '心を磨く', 'きっと良くなる',
  '生きているだけで価値がある', '前向きに気持ちを向上させる', '心が軽くなる', '自分の心のコップを満たす', '深呼吸しよう', '肩の力を抜こう', '今日生きていることに感謝', 'すべて上手くいっている', '自分は運がいい', '今日もいい日だった',
  'おはよう、素敵な一日を', 'おやすみ、良い夢を', '今日もお疲れ様', 'よく頑張ったね', 'えらいね', 'すごいね', 'さすがだね', '素晴らしい', '最高', '完璧',
  'あなたがいると場が和む', '一緒にいるとポジティブになれる', '癒されるよ', '笑顔が素敵だね', '気が利くよね', '気配りが上手だね', 'キラキラしているね', '行動力があるね', '誰からも好かれるタイプだよね', 'ファッションセンスがいいよね', '勇気があるね',
  '前向きで励みになる', '意見が的確だよね', '集中力があるよね', '話し上手だよね', '聞き上手だよね', '信頼しているよ', '頼りになるよ', '器が大きいね', '存在感があるね', 'センスがあるね',
  '人間味があるね', '手際がいいね', '豪快だね', 'ひとりできたんだね', '今日も元気いっぱいだね', 'お友だちに優しいところが素敵だね', 'お手伝いしてくれて助かったよ、ありがとう', 'ママ（パパ）は◯◯ちゃんのことが正しいと思うよ', 'チャレンジしたことがすごいんだよ', 'よく気づくことができたね',
  'ママ（パパ）はどんなことがあっても◯◯ちゃんを応援するからね', '◯◯ちゃんがいるだけで幸せだよ', 'やればできるんだね', 'さすがだね', '最後までやり遂げたことがすごいことだよ', '諦めない姿が素敵だよ', 'みんなを元気にしてくれるね', '自分の意見を言えるのはすごいね', '努力しているのは知っているよ', 'すっかり大人になったね',
  '思い切ってやってごらん', 'がんばっているのは知っているからね', '本当に助かっているよ', 'よく気づいてくれるよね', 'がんばりすぎないことも大切だよ', '自分も◯◯さんみたいになりたいです', '本当になんでも知っていますよね',
  '人はしばしば不合理で、非論理的で、自己中心的です。それでも許しなさい。', '人にやさしくすると、人はあなたに何か隠された動機があるはずだ、と非難するかもしれません。それでも人にやさしくしなさい。', '成功をすると、不実な友と、本当の敵を得てしまうことでしょう。それでも成功しなさい。', '正直で誠実であれば、人はあなたをだますかもしれません。それでも正直に誠実でいなさい。', '歳月を費やして作り上げたものが、一晩で壊されてしまうことになるかもしれません。それでも作り続けなさい。', '心を穏やかにし幸福を見つけると、妬まれるかもしれません。それでも幸福でいなさい。', '今日善い行いをしても、次の日には忘れられるでしょう。それでも善を行いを続けなさい。', '持っている一番いいものを分け与えても、決して十分ではないでしょう。それでも一番いいものを分け与えなさい。',
  '束縛があるからこそ、私は飛べるのだ。悲しみがあるからこそ、私は高く舞い上がれるのだ。逆境があるからこそ、私は走れるのだ。涙があるからこそ、私は前に進めるのだ。',
  '自分を責めないで', '大丈夫、あなたは一人じゃない', 'ゆっくり休んでね', 'あなたのペースでいいよ', '無理しないでね', 'いつもありがとう', '感謝しています', 'あなたの存在が宝物', 'あなたは愛されている', 'あなたは大切な人',
  'あなたの笑顔が世界を救う', 'あなたは光だ', 'あなたは希望だ', 'あなたは奇跡だ', 'あなたは美しい', 'あなたは強い', 'あなたは優しい', 'あなたは賢い', 'あなたは正しい', 'あなたは自由だ',
  'あなたの未来は明るい', 'あなたの可能性は無限大', 'あなたの夢は叶う', 'あなたの願いは届く', 'あなたの心は清らか', 'あなたの魂は輝いている', 'あなたの人生は素晴らしい', 'あなたの選択は間違っていない', 'あなたの決断を信じる', 'あなたの直感を大切に',
  '自分を許すこと', '過去は変えられないが未来は変えられる', '失敗は成功のもと', 'ピンチはチャンス', '困難を乗り越えられる力がある', '試練は成長の機会', '雨のち晴れ', '明けない夜はない', '冬は必ず春となる', '塞翁が馬',
  '一期一会を大切に', '今を生きる', '感謝の気持ちを忘れずに', '愛と光に満たされている', 'すべてはうまくいっている', '宇宙はあなたを応援している', '神様はあなたを見守っている', 'ご先祖様に感謝', '生かされていることに感謝', 'ありがとうの魔法',
  '愛してるの力', '幸せはいつも自分の心が決める', '心が変われば行動が変わる', '行動が変われば習慣が変わる', '習慣が変われば人格が変わる', '人格が変われば運命が変わる', '運命が変われば人生が変わる', '人生は一度きり', '後悔のないように生きる', '自分らしく輝く',
  '自分を大切にする時間', '心と体を休める', '深呼吸でリフレッシュ', '自然の力に癒される', '音楽の力に癒される', 'アートの力に癒される', '読書の力に癒される', '映画の力に癒される', '旅の力に癒される', '食の力に癒される',
  '笑う門には福来る', '病は気から', '健康第一', '笑顔が一番', 'ポジティブ思考', 'ネガティブな感情も大切', '感情を解放する', '泣きたいときは泣けばいい', '怒りたいときは怒ればいい', 'ありのままの自分を表現',
  '他人の評価を気にしない', '自分軸で生きる', '自分の価値は自分で決める', '自分を愛する', '自分を尊重する', '自分を信頼する', '自分を信じる', '自分を許す', '自分を褒める', '自分を励ます',
  'あなたは唯一無二の存在', 'あなたはかけがえのない存在', 'あなたは特別な存在', 'あなたは愛されるために生まれてきた', 'あなたは幸せになるために生まれてきた', 'あなたは夢を叶えるために生まれてきた', 'あなたは使命を果たすために生まれてきた', 'あなたは光を放つ存在', 'あなたは愛の塊', 'あなたは無限の可能性',
  '今日も一日お疲れ様', 'ゆっくり休んでね', '明日も頑張ろう', '無理せず自分のペースで', 'いつも応援しているよ', 'あなたの味方だよ', '困ったらいつでも頼ってね', '一人で抱え込まないで', '一緒に乗り越えよう', '大丈夫、心配ないよ',
  'あなたは強いから大丈夫', 'あなたは乗り越えられる', 'あなたは成長している', 'あなたは進化している', 'あなたは変化している', 'あなたは輝いている', 'あなたは美しい', 'あなたは素敵だ', 'あなたは最高だ', 'あなたは完璧だ',
  'あなたは天才だ', 'あなたは才能に溢れている', 'あなたは創造性に富んでいる', 'あなたはインスピレーションの源', 'あなたは希望の星', 'あなたは未来の光', 'あなたは愛の使者', 'あなたは平和の象徴', 'あなたは幸せの配達人', 'あなたは喜びの種',
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
  { from: '#ee9ca7', to: '#ffdde1' },
  { from: '#fa709a', to: '#fee140' },
  { from: '#30cfd0', to: '#330867' },
  { from: '#a8edea', to: '#fed6e3' },
  { from: '#ff9a56', to: '#ff6a88' },
  { from: '#667eea', to: '#764ba2' },
  { from: '#f093fb', to: '#f5576c' },
  { from: '#4facfe', to: '#00f2fe' },
  { from: '#43e97b', to: '#38f9d7' },
  { from: '#fa709a', to: '#fee140' },
];

type SettingTab = 'words' | 'background' | 'breathing';

export default function App() {
  const [words, setWords] = useState<FallingWord[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(15000); // 15秒がデフォルト
  const [frequency, setFrequency] = useState(300);
  const [showSettings, setShowSettings] = useState(false);
  const [currentGradient, setCurrentGradient] = useState(GRADIENT_PRESETS[0]);
  const [breathingVisible, setBreathingVisible] = useState(false);
  const [breathingSpeed, setBreathingSpeed] = useState(10000);
  const [breathingOpacity, setBreathingOpacity] = useState(70);
  const [breathingMinSize, setBreathingMinSize] = useState(50);
  const [breathingMaxSize, setBreathingMaxSize] = useState(400);
  const [breathingColor, setBreathingColor] = useState('#FF69B4');
  const [breathingUseGradient, setBreathingUseGradient] = useState(false);
  const [breathingGradientColor2, setBreathingGradientColor2] = useState('#FF1493');
  const [randomSpeed, setRandomSpeed] = useState(false);
  const [backgroundMode, setBackgroundMode] = useState<'gradient-auto' | 'gradient-fixed' | 'white' | 'black' | 'image'>('gradient-auto');
  const [customBackgroundImage, setCustomBackgroundImage] = useState<string | null>(null);
  const [gradientChangeInterval, setGradientChangeInterval] = useState(60000);
  const [wordDirection, setWordDirection] = useState<'down' | 'up'>('down'); // 降下方向
  const [wordOpacity, setWordOpacity] = useState(100); // 文字の透明度
  const [settingTab, setSettingTab] = useState<SettingTab>('words'); // 設定タブ
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const wordIdRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gradientIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 背景グラデーションを滑らかにアニメーションさせるための状態
  const [animatedGradient, setAnimatedGradient] = useState(GRADIENT_PRESETS[0]);
  const [targetGradient, setTargetGradient] = useState(GRADIENT_PRESETS[1]);
  const [gradientProgress, setGradientProgress] = useState(0);

  // 色の補間関数
  const interpolateColor = (color1: string, color2: string, factor: number): string => {
    const hexToRgb = (hex: string) => {
      const bigint = parseInt(hex.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return [r, g, b];
    };

    const rgbToHex = (r: number, g: number, b: number) => {
      return '#' + [r, g, b].map(x => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');
    };

    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    const r = rgb1[0] + (rgb2[0] - rgb1[0]) * factor;
    const g = rgb1[1] + (rgb2[1] - rgb1[1]) * factor;
    const b = rgb1[2] + (rgb2[2] - rgb1[2]) * factor;

    return rgbToHex(r, g, b);
  };

  // 背景グラデーションを滑らかにアニメーション
  useEffect(() => {
    if (backgroundMode !== 'gradient-auto') return;

    const duration = gradientChangeInterval;
    let startTime: number | null = null;

    const animateGradient = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / duration);
      setGradientProgress(progress);

      const newFrom = interpolateColor(animatedGradient.from, targetGradient.from, progress);
      const newTo = interpolateColor(animatedGradient.to, targetGradient.to, progress);
      setCurrentGradient({ from: newFrom, to: newTo });

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateGradient);
      } else {
        setAnimatedGradient(targetGradient);
        const nextIndex = (GRADIENT_PRESETS.findIndex(g => g.from === targetGradient.from && g.to === targetGradient.to) + 1) % GRADIENT_PRESETS.length;
        setTargetGradient(GRADIENT_PRESETS[nextIndex]);
        startTime = null;
        animationFrameRef.current = requestAnimationFrame(animateGradient);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animateGradient);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [backgroundMode, animatedGradient, targetGradient, gradientChangeInterval]);

  // 言葉を生成
  const generateWord = (): FallingWord => {
    const text = POSITIVE_WORDS[Math.floor(Math.random() * POSITIVE_WORDS.length)];
    const fontSize = Math.random() * 20 + 14;
    const colors = ['#FF1493', '#FF69B4', '#FFB6C1', '#FF6347', '#4169E1', '#20B2AA'];
    
    const wordSpeed = randomSpeed 
      ? (Math.random() * (30000 - 10000) + 10000) 
      : speed;
    
    return {
      id: `word-${wordIdRef.current++}`,
      text,
      left: Math.random() * 100,
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
      case 'gradient-auto':
      default:
        return { background: `linear-gradient(180deg, ${currentGradient.from}, ${currentGradient.to})` };
    }
  };

  return (
    <div
      className="app"
      style={{
        ...getBackgroundStyle(),
        transition: backgroundMode === 'gradient-auto' ? 'none' : 'background 0.5s ease',
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
            opacity: wordOpacity / 100,
          }}
          initial={wordDirection === 'down' ? { y: -4000, opacity: 1 } : { y: window.innerHeight + 4000, opacity: 1 }}
          animate={wordDirection === 'down' ? { y: window.innerHeight + 100, opacity: 0 } : { y: -100, opacity: 0 }}
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
            width: `${breathingMinSize}px`,
            height: `${breathingMinSize}px`,
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
          animate={{ 
            width: `${breathingMaxSize}px`,
            height: `${breathingMaxSize}px`,
          }}
          transition={{ duration: breathingSpeed / 1000, repeat: Infinity }}
        />
      )}

      {/* コントロールボタン */}
      <button
        className="control-button pause-button"
        onClick={() => setIsPaused(!isPaused)}
        title={isPaused ? '再生' : '一時停止'}
      >
        {isPaused ? '▶' : '⏸'}
      </button>

      <button
        className="control-button settings-button"
        onClick={() => setShowSettings(!showSettings)}
        title="設定"
      >
        ⚙️
      </button>

      {/* 設定パネル */}
      {showSettings && (
        <div className="settings-panel">
          <div className="settings-header">
            <h2>設定</h2>
            <button onClick={() => setShowSettings(false)} className="close-button">✕</button>
          </div>

          {/* タブナビゲーション */}
          <div className="settings-tabs">
            <button
              className={`tab-button ${settingTab === 'words' ? 'active' : ''}`}
              onClick={() => setSettingTab('words')}
            >
              文字
            </button>
            <button
              className={`tab-button ${settingTab === 'background' ? 'active' : ''}`}
              onClick={() => setSettingTab('background')}
            >
              背景
            </button>
            <button
              className={`tab-button ${settingTab === 'breathing' ? 'active' : ''}`}
              onClick={() => setSettingTab('breathing')}
            >
              深呼吸
            </button>
          </div>

          <div className="settings-content">
            {/* 文字タブ */}
            {settingTab === 'words' && (
              <>
                <div className="setting-item">
                  <label>速度 ({(speed / 1000).toFixed(1)}秒)</label>
                  <input
                    type="range"
                    min="10000"
                    max="30000"
                    step="1000"
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
                    ランダム速度（10秒〜30秒）
                  </label>
                </div>

                <div className="setting-item">
                  <label>降下方向</label>
                  <div className="direction-buttons">
                    <button
                      className={`direction-btn ${wordDirection === 'down' ? 'active' : ''}`}
                      onClick={() => setWordDirection('down')}
                    >
                      ↓ 上から下
                    </button>
                    <button
                      className={`direction-btn ${wordDirection === 'up' ? 'active' : ''}`}
                      onClick={() => setWordDirection('up')}
                    >
                      ↑ 下から上
                    </button>
                  </div>
                </div>

                <div className="setting-item">
                  <label>文字の透明度 ({wordOpacity}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={wordOpacity}
                    onChange={(e) => setWordOpacity(Number(e.target.value))}
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
              </>
            )}

            {/* 背景タブ */}
            {settingTab === 'background' && (
              <>
                <div className="setting-item">
                  <label>背景設定</label>
                  <select 
                    value={backgroundMode} 
                    onChange={(e) => setBackgroundMode(e.target.value as any)}
                    className="select-input"
                  >
                    <option value="gradient-auto">グラデーション（滑らかに変化）</option>
                    <option value="gradient-fixed">グラデーション（固定）</option>
                    <option value="white">白単色</option>
                    <option value="black">黒単色</option>
                    <option value="image">カスタム画像</option>
                  </select>
                </div>

                {backgroundMode === 'gradient-auto' && (
                  <div className="setting-item">
                    <label>グラデーション変化間隔 ({(gradientChangeInterval / 1000).toFixed(1)}秒)</label>
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
                      className="file-input"
                    />
                  </div>
                )}
              </>
            )}

            {/* 深呼吸タブ */}
            {settingTab === 'breathing' && (
              <>
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
                      <label>収縮サイズ ({breathingMinSize}px)</label>
                      <input
                        type="range"
                        min="0"
                        max="500"
                        step="50"
                        value={breathingMinSize}
                        onChange={(e) => setBreathingMinSize(Number(e.target.value))}
                      />
                    </div>

                    <div className="setting-item">
                      <label>膨張サイズ ({breathingMaxSize}px)</label>
                      <input
                        type="range"
                        min="0"
                        max="500"
                        step="50"
                        value={breathingMaxSize}
                        onChange={(e) => setBreathingMaxSize(Number(e.target.value))}
                      />
                    </div>

                    <div className="setting-item">
                      <label>深呼吸色</label>
                      <input
                        type="color"
                        value={breathingColor}
                        onChange={(e) => setBreathingColor(e.target.value)}
                        className="color-input"
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
                          className="color-input"
                        />
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
