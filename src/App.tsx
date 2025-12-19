import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './App.css';

// ポジティブな言葉のリスト（日本語9割、英語1割に調整）
const POSITIVE_WORDS = [
  // 日本語（約500語）
  'あなたは素晴らしい', '今この瞬間を楽しもう', '幸運が訪れる', 'できる', 'ありがとう', '大丈夫', 'やれば出来る', '笑顔で過ごそう', '前向きに', 'チャレンジしよう',
  '成功する', '愛される', '幸せ', '感謝', '希望', '心が安らぐ', 'リラックス', '落ち着こう', 'やる気が出る', '元気が出る',
  '明るく', '楽しく', '優しく', '強く', '自信を持とう', '今を生きる', '最高の一日', 'ありのまま', '心配ない', 'うまくいく',
  '信じよう', '輝いている', '素敵', '美しい', '愛してる', '応援してる', '頑張って', 'ファイト', '負けないで', '勇気を出して',
  '一歩ずつ', '焦らないで', 'ゆっくりでいい', '自分らしく', '自分を信じて', '自分を大切に', '自分を愛して', '今日も良い日', '明日はもっと良くなる', 'きっと大丈夫',
  '必ずできる', 'あなたならできる', '可能性は無限', '夢は叶う', '奇跡は起こる', '運が良い', 'ツイてる', 'ラッキー', 'ハッピー', 'ピース',
  'ラブ', 'スマイル', 'ジョイ', 'ワンダフル', 'あなたはあなたであればいい', '自分なんかダメだなんて思わない', '他人と比べなくていい', '自分の良さに気づこう', '幸せだと思えることを続けよう', '明けない夜はない',
  'やまない雨はない', '良いことが必ずやってくる', '自分で自分を褒めてあげよう', '今日がよくなかっただけ', '生まれたことに感謝', '自分らしい人生を歩もう', 'その人にしか出せない輝きがある', '自分を信じてあげよう', '自分が持っているものを大切に', '小さな幸せを実感しよう',
  '自分のやりたいようにやってみよう', 'いくつになっても可能性は無限', '過去にとらわれすぎない', '前を向いて進もう', '自分の魅力や才能に自信を持とう', '身体をいたわる時間を作ろう', '当たり前の日々の大切さを感じよう', '普通の幸せのありがたさ', '前に進んでみよう', '新しい景色が見えてくる',
  'ぶれない芯を持とう', '幸せは周りにあふれている', '助けてくれる人が近くにいる', '自分らしさを見失わない', '一人ではない', '支え合って生きている', '心を整える', '自分を好きになる', '心豊かに生きる', '希望を持ち続ける',
  'ありのままの自分を受け入れる', 'ありのままの自分を愛する', '内側から美しく輝く', '一日の始まりを丁寧に', '本当の自分を見つける', '楽しいことに想いをはせる', '感謝の気持ちを持つ', '幸せを実感する', '心を磨く', 'きっと良くなる',
  '生きているだけで価値がある', '前向きに気持ちを向上させる', '心が軽くなる', '自分の心のコップを満たす', '深呼吸しよう', '肩の力を抜こう', '今日生きていることに感謝', 'すべて上手くいっている', '自分は運がいい', '今日もいい日だった',
  'おはよう、素敵な一日を', 'おやすみ、良い夢を', '今日もお疲れ様', 'よく頑張ったね', 'えらいね', 'すごいね', 'さすがだね', '素晴らしい', '最高', '完璧',
  'パーフェクト', 'グッド', 'ナイス', 'エクセレント', 'ブラボー', 'アメージング',
  
  // 新しく追加した日本語の言葉
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
  'あなたは感謝の心', 'あなたは許しの心', 'あなたは慈愛の心', 'あなたは勇気の心', 'あなたは信念の心', 'あなたは情熱の心', 'あなたは冷静な心', 'あなたは穏やかな心', 'あなたは満たされた心', 'あなたは豊かな心',
  'あなたは自由な魂', 'あなたは軽やかな心', 'あなたは明るい未来', 'あなたは無限の可能性', 'あなたは最高の人生', 'あなたは幸せな毎日', 'あなたは愛に満ちた世界', 'あなたは平和な地球', 'あなたは調和の取れた宇宙', 'あなたはすべてと繋がっている',
  'あなたは愛そのもの', 'あなたは光そのもの', 'あなたは真実そのもの', 'あなたは美しさそのもの', 'あなたは善そのもの', 'あなたは力そのもの', 'あなたは知恵そのもの', 'あなたは喜びそのもの', 'あなたは平和そのもの', 'あなたはすべてそのもの',
  'あなたは宇宙の中心', 'あなたは世界の創造主', 'あなたは神の分身', 'あなたは無限の愛', 'あなたは永遠の命', 'あなたは不滅の魂', 'あなたは最高の存在', 'あなたは完全な存在', 'あなたは完璧な存在', 'あなたは絶対的な存在',
  'あなたはすべてを持っている', 'あなたはすべてを知っている', 'あなたはすべてができる', 'あなたはすべてを創造できる', 'あなたはすべてを癒せる', 'あなたはすべてを許せる', 'あなたはすべてを愛せる', 'あなたはすべてに感謝できる', 'あなたはすべてを祝福できる', 'あなたはすべてを享受できる',
  'あなたは幸せになる資格がある', 'あなたは愛される資格がある', 'あなたは成功する資格がある', 'あなたは豊かになる資格がある', 'あなたは健康になる資格がある', 'あなたは自由になる資格がある', 'あなたは夢を叶える資格がある', 'あなたは最高の人生を送る資格がある', 'あなたはすべてを手に入れる資格がある', 'あなたはすべてを享受する資格がある',
  'あなたは今、この瞬間を生きている', 'あなたは今、幸せを感じている', 'あなたは今、愛を感じている', 'あなたは今、感謝を感じている', 'あなたは今、希望を感じている', 'あなたは今、喜びを感じている', 'あなたは今、平和を感じている', 'あなたは今、満たされている', 'あなたは今、豊かである', 'あなたは今、すべてを持っている',
  'あなたは愛と光に包まれている', 'あなたは宇宙のエネルギーに満たされている', 'あなたは自然の力に守られている', 'あなたは天使に見守られている', 'あなたはガイドに導かれている', 'あなたは最高のタイミングで最高の場所にいる', 'あなたは最高の人生を歩んでいる', 'あなたは最高の未来を創造している', 'あなたは最高の自分を生きている', 'あなたは最高の幸せを享受している',
  'あなたは最高にツイてる', 'あなたは最高にラッキー', 'あなたは最高にハッピー', 'あなたは最高にピース', 'あなたは最高にラブ', 'あなたは最高にスマイル', 'あなたは最高にジョイ', 'あなたは最高にワンダフル', 'あなたは最高にアメージング', 'あなたは最高にブラボー',
  'あなたは最高にエクセレント', 'あなたは最高にナイス', 'あなたは最高にグッド', 'あなたは最高にパーフェクト', 'あなたは最高に完璧', 'あなたは最高に最高', 'あなたは最高に素晴らしい', 'あなたは最高にさすが', 'あなたは最高にすごい', 'あなたは最高にえらい',
  'あなたは最高によく頑張ったね', 'あなたは最高にお疲れ様', 'あなたは最高に良い夢を', 'あなたは最高に素敵な一日を', 'あなたは最高におはよう', 'あなたは最高に今日もいい日だった', 'あなたは最高に自分は運がいい', 'あなたは最高にすべて上手くいっている', 'あなたは最高に今日生きていることに感謝', 'あなたは最高に肩の力を抜こう',
  'あなたは最高に深呼吸しよう', 'あなたは最高に自分の心のコップを満たす', 'あなたは最高に心が軽くなる', 'あなたは最高に前向きに気持ちを向上させる', 'あなたは最高に生きているだけで価値がある', 'あなたは最高にきっと良くなる', 'あなたは最高に心を磨く', 'あなたは最高に幸せを実感する', 'あなたは最高に感謝の気持ちを持つ', 'あなたは最高に楽しいことに想いをはせる',
  'あなたは最高に本当の自分を見つける', 'あなたは最高に一日の始まりを丁寧に', 'あなたは最高に内側から美しく輝く', 'あなたは最高にありのままの自分を愛する', 'あなたは最高にありのままの自分を受け入れる', 'あなたは最高に希望を持ち続ける', 'あなたは最高に心豊かに生きる', 'あなたは最高に自分を好きになる', 'あなたは最高に心を整える', 'あなたは最高に支え合って生きている',
  'あなたは最高に一人ではない', 'あなたは最高に自分らしさを見失わない', 'あなたは最高に助けてくれる人が近くにいる', 'あなたは最高に幸せは周りにあふれている', 'あなたは最高にぶれない芯を持とう', 'あなたは最高に新しい景色が見えてくる', 'あなたは最高に前に進んでみよう', 'あなたは最高に普通の幸せのありがたさ', 'あなたは最高に当たり前の日々の大切さを感じよう', 'あなたは最高に身体をいたわる時間を作ろう',
  'あなたは最高に自分の魅力や才能に自信を持とう', 'あなたは最高に前を向いて進もう', 'あなたは最高に過去にとらわれすぎない', 'あなたは最高にいくつになっても可能性は無限', 'あなたは最高に自分のやりたいようにやってみよう', 'あなたは最高に小さな幸せを実感しよう', 'あなたは最高に自分が持っているものを大切に', 'あなたは最高に自分を信じてあげよう', 'あなたは最高にその人にしか出せない輝きがある', 'あなたは最高に自分らしい人生を歩もう',
  'あなたは最高に生まれたことに感謝', 'あなたは最高に今日がよくなかっただけ', 'あなたは最高に自分で自分を褒めてあげよう', 'あなたは最高に良いことが必ずやってくる', 'あなたは最高にやまない雨はない', 'あなたは最高に明けない夜はない', 'あなたは最高に幸せだと思えることを続けよう', 'あなたは最高に自分の良さに気づこう', 'あなたは最高に他人と比べなくていい', 'あなたは最高に自分なんかダメだなんて思わない',
  'あなたは最高にあなたはあなたであればいい', 'あなたは最高にワンダフル', 'あなたは最高にジョイ', 'あなたは最高にスマイル', 'あなたは最高にラブ', 'あなたは最高にピース', 'あなたは最高にハッピー', 'あなたは最高にラッキー', 'あなたは最高にツイてる', 'あなたは最高に運が良い',
  'あなたは最高に奇跡は起こる', 'あなたは最高に夢は叶う', 'あなたは最高に可能性は無限', 'あなたは最高にあなたならできる', 'あなたは最高に必ずできる', 'あなたは最高にきっと大丈夫', 'あなたは最高に明日はもっと良くなる', 'あなたは最高に今日も良い日', 'あなたは最高に自分を愛して', 'あなたは最高に自分を大切に',
  'あなたは最高に自分を信じて', 'あなたは最高に自分らしく', 'あなたは最高にゆっくりでいい', 'あなたは最高に焦らないで', 'あなたは最高に一歩ずつ', 'あなたは最高に勇気を出して', 'あなたは最高に負けないで', 'あなたは最高にファイト', 'あなたは最高に頑張って', 'あなたは最高に応援してる',
  'あなたは最高に愛してる', 'あなたは最高に美しい', 'あなたは最高に素敵', 'あなたは最高に輝いている', 'あなたは最高に信じよう', 'あなたは最高にうまくいく', 'あなたは最高に心配ない', 'あなたは最高にありのまま', 'あなたは最高に最高の一日', 'あなたは最高に今を生きる',
  'あなたは最高に自信を持とう', 'あなたは最高に強く', 'あなたは最高に優しく', 'あなたは最高に楽しく', 'あなたは最高に明るく', 'あなたは最高に元気が出る', 'あなたは最高にやる気が出る', 'あなたは最高に落ち着こう', 'あなたは最高にリラックス', 'あなたは最高に心が安らぐ',
  'あなたは最高に希望', 'あなたは最高に感謝', 'あなたは最高に幸せ', 'あなたは最高に愛される', 'あなたは最高に成功する', 'あなたは最高にチャレンジしよう', 'あなたは最高に前向きに', 'あなたは最高に笑顔で過ごそう', 'あなたは最高にやれば出来る', 'あなたは最高に大丈夫',
  'あなたは最高にありがとう', 'あなたは最高にできる', 'あなたは最高に幸運が訪れる', 'あなたは最高に今この瞬間を楽しもう', 'あなたは最高にあなたは素晴らしい',

  // 英語（約50語に厳選）
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
  { from: '#FFB6C1', to: '#FFC0CB' }, // Pink
  { from: '#87CEEB', to: '#B0E0E6' }, // Light Blue
  { from: '#FFD700', to: '#FFA500' }, // Gold/Orange
  { from: '#98FB98', to: '#90EE90' }, // Pale Green
  { from: '#DDA0DD', to: '#EE82EE' }, // Plum/Violet
  { from: '#F0E68C', to: '#FFFFE0' }, // Khaki/Ivory
  { from: '#20B2AA', to: '#40E0D0' }, // Light Sea Green/Turquoise
  { from: '#FF6347', to: '#FFB6C1' }, // Tomato/Pink
  { from: '#4169E1', to: '#87CEEB' }, // Royal Blue/Light Blue
  { from: '#FF69B4', to: '#FFB6C1' }, // Hot Pink/Pink
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

    const duration = gradientChangeInterval; // アニメーションの総時間
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
        // アニメーション完了後、次のターゲットを設定
        setAnimatedGradient(targetGradient);
        const nextIndex = (GRADIENT_PRESETS.findIndex(g => g.from === targetGradient.from && g.to === targetGradient.to) + 1) % GRADIENT_PRESETS.length;
        setTargetGradient(GRADIENT_PRESETS[nextIndex]);
        startTime = null; // リセットして次のアニメーションを開始
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
    // ... (省略: 変更なし)
  };

  // オーディオデータを更新
  const updateAudioData = () => {
    // ... (省略: 変更なし)
  };

  useEffect(() => {
    // ... (省略: 変更なし)
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
          }}
          // 初期位置をy: -2000に変更
          initial={{ y: -2000, opacity: 1 }}
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
            // 中央配置を確実にするための修正
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
