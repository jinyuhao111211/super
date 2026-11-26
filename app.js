/* 北京周末去哪儿 · 数据与交互
   坐标均为 WGS84 近似值，仅用于相对距离估算 */

const GY = 'https://www.bjgy.com.cn/';
const AM = n => 'https://ditu.amap.com/search?query=' + encodeURIComponent(n) + '&city=110000';
const DP = n => 'https://www.dianping.com/search/keyword/2/0_' + encodeURIComponent(n);

/* ---------- 主题配色与图标 ---------- */
const TH = {
  palace:{a:'#A93226',b:'#D96A4A',p:'M2 10l10-6 10 6M4 10v10h16V10M9 20v-5h6v5'},
  wall:{a:'#6E5B3E',b:'#A98C5F',p:'M2 17l4-5 3 3 4-6 3 4 4-5M4 20h16'},
  leaf:{a:'#A93A28',b:'#E0A03F',p:'M12 3c5 3 7 7 7 10a7 7 0 01-14 0c0-3 2-7 7-10zM12 21V9'},
  hutong:{a:'#5A5A55',b:'#8E8B82',p:'M3 12h18M6 12V7h12v5M9 20v-5h6v5M3 20h18'},
  museum:{a:'#2E4A6B',b:'#5C82A8',p:'M3 9l9-5 9 5M5 9v9M10 9v9M14 9v9M19 9v9M3 20h18'},
  art:{a:'#4A3B6B',b:'#8A6FA8',p:'M3 5h18v14H3zM3 15l5-5 4 4 3-3 6 6'},
  park:{a:'#2E6F5E',b:'#6BA88E',p:'M12 4a5 5 0 015 5 4 4 0 01-2 7H9a4 4 0 01-2-7 5 5 0 015-5zM12 16v5M8 21h8'},
  night:{a:'#1F2A3D',b:'#455C7A',p:'M19 14a7 7 0 01-9-9 8 8 0 109 9zM4 20h16'},
  fun:{a:'#B35C1E',b:'#E0913F',p:'M12 4a7 7 0 017 7 7 7 0 01-14 0 7 7 0 017-7zM12 4v14M5 11h14M9 21h6'},
  water:{a:'#1E5F7A',b:'#4FA0B5',p:'M2 13c3-3 5-3 8 0s5 3 8 0M2 18c3-3 5-3 8 0s5 3 8 0M8 8h8'},
  market:{a:'#7A4B2E',b:'#B07C4E',p:'M3 9h18l-2-4H5L3 9zM5 9v11h14V9M10 20v-5h4v5'},
  temple:{a:'#7A2E2E',b:'#B35C4A',p:'M12 3l4 4H8l4-4zM6 8h12l-2 3H8L6 8zM8 11v9M16 11v9M4 20h16'}
};
function art(theme){
  const t = TH[theme] || TH.park;
  return '<svg viewBox="0 0 320 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
    '<defs><linearGradient id="g_' + theme + '" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="' + t.a + '"/><stop offset="1" stop-color="' + t.b + '"/></linearGradient></defs>' +
    '<rect width="320" height="140" fill="url(#g_' + theme + ')"/>' +
    '<circle cx="262" cy="26" r="46" fill="#fff" opacity="0.07"/>' +
    '<circle cx="52" cy="132" r="72" fill="#000" opacity="0.08"/>' +
    '<g transform="translate(122,42) scale(3.2)" fill="none" stroke="#fff" stroke-width="1.1" ' +
    'stroke-linecap="round" stroke-linejoin="round" opacity="0.88">' +
    '<path d="' + t.p + '"/></g></svg>';
}

/* ---------- 景点配图（来自携程图片 CDN，加载失败自动回退插画） ---------- */
const PHOTO = {
  moonriver: 'https://p4.itc.cn/q_70/images03/20220811/e528f67b5f6640a290c317e6b695fc5a.png',
  '798': 'https://dimg04.c-ctrip.com/images/0102d12000t383zc284D6.jpg',
  aolinpike: 'https://dimg04.c-ctrip.com/images/0106v12000ms5fxmk3815.jpg',
  badachu: 'https://dimg04.c-ctrip.com/images/100b1f000001gsltw7A06.jpg',
  badaling: 'https://dimg04.c-ctrip.com/images/0100112000ubrpoy6A13C.jpg',
  beihai: 'https://dimg04.c-ctrip.com/images/0100j12000j0xxuim3205.jpg',
  chaoyangpark: 'https://dimg04.c-ctrip.com/images/0106y12000f9tvgxz47CF.jpg',
  chocmuseum: 'https://dimg04.c-ctrip.com/images/1me2g12000qxmf42iAA40.jpg',
  daguanyuan: 'https://dimg04.c-ctrip.com/images/0100i12000t38p0ap4BAE.jpg',
  dajuyuan: 'https://dimg04.c-ctrip.com/images/1lo6a12000rph2ji3827E.jpg',
  ditan: 'https://dimg04.c-ctrip.com/images/100v1f000001h1dneB6E1.jpg',
  dizhibo: 'https://dimg04.c-ctrip.com/images/0104212000h91p88774CE.jpg',
  dongwuyuan: 'https://dimg04.c-ctrip.com/images/0102e12000jo9eeaa1097.jpg',
  filmmuseum: 'https://dimg04.c-ctrip.com/images/0104012000iuh9eaaDA33.jpg',
  gongwangfu: 'https://dimg04.c-ctrip.com/images/0103o12000jtaf06u56A4.jpg',
  gubei: 'https://dimg04.c-ctrip.com/images/0104r120008wxqnbrC251.jpg',
  gugong: 'https://dimg04.c-ctrip.com/images/010671200087d4o7zEA88.jpg',
  guobo: 'https://dimg04.c-ctrip.com/images/0102y12000hxkc5n61AF4.jpg',
  guozijian: 'https://dimg04.c-ctrip.com/images/0104c12000iixi6ehB8B8.jpg',
  haiyangguan: 'https://dimg04.c-ctrip.com/images/0106o12000t38a6fb9AF3.jpg',
  happyvalley: 'https://dimg04.c-ctrip.com/images/1lo5v12000rhit34qF892.jpg',
  hongluosi: 'https://dimg04.c-ctrip.com/images/0106g12000af747ml4C15.jpg',
  jingshan: 'https://dimg04.c-ctrip.com/images/10091f000001gsmf0CEC2.jpg',
  juyongguan: 'https://dimg04.c-ctrip.com/images/100u12000000rv3gbAFE2.jpg',
  kejiguan: 'https://dimg04.c-ctrip.com/images/0104612000t36jf6f99EA.jpg',
  longqingxia: 'https://dimg04.c-ctrip.com/images/0100212000t3jqwdaFFF9.jpg',
  lugouqiao: 'https://dimg04.c-ctrip.com/images/0100212000mti8gfv41E6.jpg',
  miaofengshan: 'https://dimg04.c-ctrip.com/images/0101z12000km5mqjv77EB.jpg',
  mingtombs: 'https://dimg04.c-ctrip.com/images/0105j12000u40wwmv4237.jpg',
  mutianyu: 'https://dimg04.c-ctrip.com/images/1lo0m12000bjgo0zjBC35.jpg',
  namoc: 'https://dimg04.c-ctrip.com/images/0103012000866a6b75181.jpg',
  nanluoguxiang: 'https://dimg04.c-ctrip.com/images/0105u12000krkf6rb1AE2.jpg',
  qianmen: 'https://dimg04.c-ctrip.com/images/0101t120007xzhog38999.jpg',
  sanlitun: 'https://dimg04.c-ctrip.com/images/10060d0000006xb5nABBF.jpg',
  shichahai: 'https://dimg04.c-ctrip.com/images/0100f12000t36p58c584D.jpg',
  shijie: 'https://dimg04.c-ctrip.com/images/1lo1f12000oyn4vcg4808.jpg',
  shoubo: 'https://dimg04.c-ctrip.com/images/100m1f000001gzoylC02F.jpg',
  tanzhe: 'https://dimg04.c-ctrip.com/images/0105312000h155dj32725.jpg',
  taoranting: 'https://dimg04.c-ctrip.com/images/0105312000u1zy4w6A3F0.jpg',
  tiananmen: 'https://dimg04.c-ctrip.com/images/0105s12000lgqyhu8A558.jpg',
  tiantan: 'https://dimg04.c-ctrip.com/images/10040h0000008s9n50143.jpg',
  tianwenguan: 'https://dimg04.c-ctrip.com/images/0106312000liv7t7j9533.jpg',
  universal: 'https://dimg04.c-ctrip.com/images/0106j120008y7o3hcC541.jpg',
  wangfujing: 'https://dimg04.c-ctrip.com/images/0102w12000rqsl8jvF29B.jpg',
  xiangshan: 'https://dimg04.c-ctrip.com/images/0105t12000jiij2nlA992.jpg',
  yanqihu: 'https://dimg04.c-ctrip.com/images/10021f000001gxcft163D.jpg',
  yiheyuan: 'https://dimg04.c-ctrip.com/images/0104912000t3618b892C1.jpg',
  yonghegong: 'https://dimg04.c-ctrip.com/images/0101u12000t32wmta67B6.jpg',
  yuanmingyuan: 'https://dimg04.c-ctrip.com/images/010131200046ybzogE113.jpg',
  yuyuantan: 'https://dimg04.c-ctrip.com/images/0100j12000j2k2wkz30C3.jpg',
  zhiwuyuan: 'https://dimg04.c-ctrip.com/images/0106y1200089a107c7A0F.jpg'
};

/* ---------- 视频（B 站）：先显示封面，点击才加载播放器，播放默认静音 ---------- */
const VIDEO = {
  yandai: {
    bv: 'BV12L4y177vN',
    pic: 'https://i0.hdslb.com/bfs/archive/fb81e42b4fcb81c745b5d63096da6c780c2dc3a8.jpg',
    len: '4:49'
  }
};
function biliFrame(bv, autoplay){
  return '<iframe src="https://player.bilibili.com/player.html?bvid=' + bv +
    '&page=1&high_quality=1&danmaku=0&autoplay=' + (autoplay ? 1 : 0) + '&muted=1" ' +
    'scrolling="no" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" ' +
    'allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>';
}
function videoPoster(v){
  return '<img class="vposter" src="' + v.pic + '" alt="" onerror="this.style.display=\'none\'">' +
    '<button class="vplay" aria-label="播放视频"><span></span></button>';
}

/* ---------- 景点数据 ----------
   n名称 d区 c类别 lat/lng dur分钟 p票价 o开门 cl关门 mo周几闭馆 in室内 hot推荐 th主题
   desc简介 tip交通/预约提示 book预约入口 */
const RAW = [
/* 东城 */
['gugong','故宫博物院','东城','古迹',39.9163,116.3972,210,60,510,1020,1,0,1,'palace',
 '世界最大的木结构宫殿群，中轴线走一遍至少三小时。秋天金瓦配蓝天最好看。',
 '地铁1号线天安门东站B口，从午门进、神武门出。周一闭馆，必须实名预约，提前7天放票，抢不到就退而求其次看武英殿书画馆。',
 {u:'https://www.dpm.org.cn/',l:'故宫官网预约',t:'提前7天 20:00 放票，实名制，周一闭馆'}],
['tiananmen','天安门广场','东城','街区',39.9055,116.3976,60,0,300,1320,0,0,1,'palace',
 '看升旗、拍城楼。升旗时间随日出变化，11月大约 6:50 前后。',
 '需提前在天安门广场预约小程序实名预约，地铁天安门东/西站。',
 {u:'https://ditu.amap.com/search?query=%E5%A4%A9%E5%AE%89%E9%97%A8%E5%B9%BF%E5%9C%BA&city=110000',l:'地图查看',t:'微信「天安门广场预约参观」小程序'}],
['jingshan','景山公园','东城','公园',39.9236,116.3967,60,2,390,1260,0,0,1,'park',
 '万春亭是俯瞰故宫全景的唯一免费机位，秋日午后逆光拍琉璃瓦最出片。',
 '故宫神武门出来正对面，门票2元，扫码进。',
 {u:GY,l:'畅游公园购票',t:'「畅游公园」公众号，2元，当天可买'}],
['tiantan','天坛公园','东城','古迹',39.8822,116.4066,120,34,360,1320,0,0,1,'temple',
 '祈年殿的蓝琉璃顶配银杏大道，11月上旬是银杏最好的时候。',
 '地铁5号线天坛东门站。联票34元含祈年殿、回音壁；只逛公园门票15元。',
 {u:GY,l:'畅游公园购票',t:'联票34元，建议买联票'}],
['yonghegong','雍和宫','东城','古迹',39.9475,116.4172,90,25,540,990,0,1,1,'temple',
 '北京香火最旺的藏传佛教寺院，秋天两株古银杏满树金黄。',
 '地铁2/5号线雍和宫站C口。门口可免费领香，不要买外面的高价香。',
 {u:'https://www.yonghegong.cn/',l:'雍和宫官网',t:'现场购票25元，也可公众号预约'}],
['guozijian','孔庙和国子监','东城','古迹',39.9469,116.4144,60,30,510,1020,1,0,0,'temple',
 '元明清三代最高学府，进门那条银杏大道人少又安静，秋天比雍和宫还好拍。',
 '雍和宫马路对面，两处挨着可以连着逛。',
 {u:AM('孔庙和国子监博物馆'),l:'地图查看',t:'现场购票30元，周一闭馆'}],
['nanluoguxiang','南锣鼓巷','东城','街区',39.9369,116.4033,90,0,0,0,0,0,1,'hutong',
 '最商业也最方便的一条胡同，主街人多，往两侧帽儿胡同、雨儿胡同钻才是精华。',
 '地铁6号线南锣鼓巷站E口。主街小吃偏贵，往北走到鼓楼一带更实在。',
 {u:AM('南锣鼓巷'),l:'地图查看',t:'免费开放，无需预约'}],
['wudaoying','五道营胡同','东城','街区',39.9470,116.4100,60,0,0,0,0,0,0,'hutong',
 '雍和宫北侧的小胡同，咖啡馆、手作店、旧物铺，比南锣安静得多。',
 '地铁雍和宫站G口出，走 5 分钟。傍晚灯亮起来最好看。',
 {u:AM('五道营胡同'),l:'地图查看',t:'免费开放'}],
['ditan','地坛公园','东城','公园',39.9522,116.4102,90,2,360,1260,0,0,1,'leaf',
 '明清皇帝祭地的场所，主体是方泽坛。秋天那条银杏大道是北京最出名的一条，11月初满树金黄；平时人很少，春秋还有地坛书市。',
 '地铁2号线雍和宫站或5号线和平里北街站，步行约10分钟。公园门票2元，进方泽坛另收5元。银杏季周末人多，建议早上来。',
 {u:GY,l:'畅游公园购票',t:'2元，方泽坛另收5元'}],
['guobo','中国国家博物馆','东城','博物馆',39.9050,116.4013,180,0,540,1020,1,1,1,'museum',
 '古代中国基本陈列是顶配，一件后母戊鼎就值回票价（何况免费）。',
 '天安门东站C口。必须提前在官网/小程序实名预约，周末票很难抢，建议提前3-5天。',
 {u:'https://www.chnmuseum.cn/',l:'国博官网预约',t:'免费，需实名预约，周一闭馆'}],
['namoc','中国美术馆','东城','艺术',39.9250,116.4090,90,0,540,1020,1,1,0,'art',
 '近现代美术最高殿堂，常有重磅特展，免费但需要预约。',
 '地铁5号线东四站A口向西 500 米。',
 {u:'https://www.namoc.org/',l:'美术馆官网',t:'免费，需预约，周一闭馆'}],
['qianmen','前门大街·大栅栏','东城','街区',39.8950,116.3986,90,0,0,0,0,0,1,'hutong',
 '有轨电车、老字号一条街。大栅栏的胡同肌理比前门主街有意思。',
 '地铁2号线前门站。往西的杨梅竹斜街是隐藏款。',
 {u:AM('前门大街'),l:'地图查看',t:'免费开放'}],
['wangfujing','王府井步行街','东城','街区',39.9145,116.4108,60,0,0,0,0,0,1,'market',
 '商业街，顺路逛就行，别专门来。旁边首都剧场、商务印书馆倒值得进。',
 '地铁1号线王府井站。',
 {u:AM('王府井步行街'),l:'地图查看',t:'免费开放'}],
['longfusi','隆福寺','东城','艺术',39.9280,116.4100,60,0,600,1320,0,1,0,'art',
 '老街区改造的新文艺据点，木木艺术社区常有展，屋顶露台能看故宫角楼。',
 '地铁5号线东四站E口。',
 {u:AM('隆福寺'),l:'地图查看',t:'免费，部分展览单独购票'}],
['zhihuasi','智化寺','东城','古迹',39.9250,116.4230,60,20,540,1020,1,0,0,'temple',
 '明代木构，藏有京音乐（活化石级古乐），每天 10:00 和 15:00 有现场演奏，人极少。',
 '禄米仓胡同内。想避开人流又想听点真东西，来这儿。',
 {u:AM('智化寺'),l:'地图查看',t:'20元，微信「智化寺」预约'}],
['mingchengqiang','明城墙遗址公园','东城','公园',39.9020,116.4300,45,10,360,1260,0,0,0,'park',
 '北京仅存的一段明城墙，秋天爬满爬山虎，东南角楼可以上去。',
 '地铁2号线崇文门站C口。',
 {u:AM('明城墙遗址公园'),l:'地图查看',t:'公园免费，登角楼10元'}],
/* 西城 */
['gongwangfu','恭王府','西城','古迹',39.9339,116.3833,120,40,480,1020,1,0,1,'palace',
 '和珅旧宅，花园比房子精彩，「福」字碑要排队看。',
 '地铁6号线北海北站B口。周末人非常多，建议一开门就进。',
 {u:'https://www.pgm.org.cn/',l:'恭王府官网',t:'40元，需预约，周一闭馆'}],
['shichahai','什刹海','西城','街区',39.9403,116.3867,120,0,0,0,0,0,1,'water',
 '前海后海西海连成一片，秋天柳树黄了沿岸走一圈，晚上酒吧街热闹。',
 '地铁8号线什刹海站。银锭桥上看西山是经典机位。',
 {u:AM('什刹海'),l:'地图查看',t:'免费开放'}],
['yandai','烟袋斜街','西城','街区',39.9408,116.3906,45,0,0,0,0,0,1,'hutong',
 '什刹海到鼓楼之间的斜街，短但密度高，小店小吃都在这。',
 '和什刹海连着逛，10 分钟走完。',
 {u:AM('烟袋斜街'),l:'地图查看',t:'免费开放'}],
['beihai','北海公园','西城','公园',39.9254,116.3891,120,10,390,1200,0,0,1,'water',
 '白塔、九龙壁、荷花池。秋天琼华岛上的树全变色，划船也还行。',
 '地铁6号线北海北站。联票20元含白塔。',
 {u:GY,l:'畅游公园购票',t:'门票10元，联票20元'}],
['shoubo','首都博物馆','西城','博物馆',39.9075,116.3406,150,0,540,1020,1,1,0,'museum',
 '北京城自己的历史，老北京民俗展厅很值得看，免费且比国博好约。',
 '地铁1号线木樨地站C口。',
 {u:'https://www.capitalmuseum.org.cn/',l:'首博官网预约',t:'免费，需预约，周一闭馆'}],
['fayuansi','法源寺','西城','古迹',39.8870,116.3700,45,5,480,960,0,0,0,'temple',
 '北京最老的寺院之一，丁香有名，但秋天更安静，几乎没游客。',
 '菜市口地铁站步行 10 分钟，牛街顺路。',
 {u:AM('法源寺'),l:'地图查看',t:'5元，现场购票'}],
['niujie','牛街','西城','街区',39.8880,116.3550,60,0,0,0,0,0,1,'market',
 '清真小吃一条街，聚宝源、白记年糕、洪记，排队是常态但值。',
 '地铁19号线牛街站。周末中午排队一小时起。',
 {u:AM('牛街'),l:'地图查看',t:'免费开放'}],
['yangmeizhu','杨梅竹斜街','西城','街区',39.8950,116.3900,45,0,0,0,0,0,0,'hutong',
 '大栅栏西侧的老胡同，独立书店、咖啡馆、老住户混在一起，最有北京味的一段。',
 '前门站步行 8 分钟。',
 {u:AM('杨梅竹斜街'),l:'地图查看',t:'免费开放'}],
['beijingfang','北京坊','西城','街区',39.8990,116.3950,60,0,600,1320,0,1,0,'market',
 '前门西侧的改造街区，PageOne 书店二楼正对正阳门，是拍前门的机位。',
 '地铁2号线前门站C口。',
 {u:AM('北京坊'),l:'地图查看',t:'免费开放'}],
['chocmuseum','巧克巧蔻·巧克力博物馆','西城','博物馆',39.8978,116.3956,90,29.9,600,1260,0,1,1,'museum',
 '2026年1月开馆的巧克力主题馆。一层是巧克力做的中国龙、长城、北京中轴线，还有「黄金屋」打卡位；二层能看制作过程、买伴手礼。',
 '西城区北京坊廊房头条2号院5号楼，地铁2号线前门站C口步行约5分钟。馆不大，一小时够逛，适合带娃或拍照，周末人多建议早去。',
 {u:AM('巧克力博物馆'),l:'地图查看',t:'29.9元，现场或抖音购票'}],
['baiyunguan','白云观','西城','古迹',39.8970,116.3400,60,10,510,990,0,0,0,'temple',
 '全真第一丛林，正月摸石猴排队，平时清静，冬天有庙会。',
 '地铁1号线木樨地站。',
 {u:AM('白云观'),l:'地图查看',t:'10元，现场购票'}],
['taoranting','陶然亭公园','西城','公园',39.8780,116.3760,60,2,360,1260,0,0,0,'park',
 '市区里被低估的公园，秋天芦苇和银杏都不错，人比地坛少。',
 '地铁4号线陶然亭站。',
 {u:GY,l:'畅游公园购票',t:'2元'}],
['daguanyuan','大观园','西城','公园',39.8786,116.3528,120,40,510,1020,0,0,1,'water',
 '87版《红楼梦》的拍摄地，按书里的布局造的仿古园林。怡红院、潇湘馆、稻香村都能和小说对上号，春天海棠、秋天银杏都好看。',
 '西城区南菜园街12号，地铁4号线陶然亭站步行约15分钟。和陶然亭公园挨着，可以连着逛；园子不大，两小时够。',
 {u:AM('北京大观园'),l:'地图查看',t:'40元，携程可订'}],
['dajuyuan','国家大剧院','西城','艺术',39.9042,116.3833,60,30,540,1020,0,1,0,'art',
 '蛋壳建筑本身值得看，水下长廊免费，看演出另算。',
 '地铁1号线天安门西站C口。参观票30元，需预约。',
 {u:'https://www.chncpa.org/',l:'国家大剧院官网',t:'参观30元，演出票另购'}],
['tianwenguan','北京天文馆','西城','博物馆',39.9370,116.3300,120,10,540,990,1,1,1,'museum',
 '带娃首选，天象厅球幕电影很值，周末有手工活动。',
 '地铁4号线动物园站D口。展厅票10元，球幕另买。',
 {u:'https://www.bjp.org.cn/',l:'天文馆官网',t:'展厅10元，球幕30-45元，需预约'}],
['dizhibo','中国地质博物馆','西城','博物馆',39.9230,116.3560,90,30,540,990,1,1,0,'museum',
 '恐龙化石和矿物晶体，小孩看得懂，一小时半够。',
 '地铁4号线西四站D口。',
 {u:AM('中国地质博物馆'),l:'地图查看',t:'30元，周一闭馆'}],
/* 朝阳 */
['798','798艺术区','朝阳','艺术',39.9843,116.4950,150,0,600,1080,0,0,1,'art',
 '老厂房改造的画廊群，展览换得勤，逛完顺手喝咖啡。周末下午人最多。',
 '地铁14号线望京南站，或10号线三元桥打车。',
 {u:'https://www.798art.org/',l:'798官网',t:'园区免费，单个展览另购票'}],
['sanlitun','三里屯太古里','朝阳','街区',39.9366,116.4552,90,0,600,1320,0,0,1,'market',
 '北京夜生活中心，逛街吃饭喝酒一站式，旁边工人体育场有演出。',
 '地铁10号线团结湖站A口，或2号线东四十条。',
 {u:AM('三里屯太古里'),l:'地图查看',t:'免费开放'}],
['liangmahe','亮马河风情水岸','朝阳','夜景',39.9490,116.4680,60,0,0,0,0,0,1,'night',
 '近年最舒服的城市水岸，晚上灯光打在河面上，沿岸酒吧餐厅密集。',
 '地铁10号线亮马桥站。11月晚上冷，穿厚点。',
 {u:AM('亮马河'),l:'地图查看',t:'免费开放'}],
['guomao','国贸CBD·中国尊','朝阳','夜景',39.9087,116.4600,45,0,0,0,0,0,1,'night',
 '北京最高楼群，国贸桥上看车流长曝光很出片。',
 '地铁1/10号线国贸站。',
 {u:AM('中国尊'),l:'地图查看',t:'免费开放'}],
['chaoyangpark','朝阳公园','朝阳','公园',39.9420,116.4800,90,5,360,1260,0,0,0,'park',
 '城区最大公园之一，秋天银杏大道和大草坪，适合遛娃野餐。',
 '地铁14号线朝阳公园站。',
 {u:GY,l:'畅游公园购票',t:'5元'}],
['todayart','今日美术馆','朝阳','艺术',39.9000,116.4700,60,60,600,1080,1,1,0,'art',
 '当代艺术老牌场馆，展览偏实验性，票随展变动。',
 '地铁10号线双井站。',
 {u:'https://www.todayartmuseum.com/',l:'今日美术馆官网',t:'60元上下，周一闭馆'}],
['redbrick','红砖美术馆','朝阳','艺术',40.0300,116.5600,90,130,600,1050,1,1,0,'art',
 '建筑师董豫赣设计的园林式美术馆，红砖和光影是主角，拍照极好，票价也贵。',
 '地铁15号线马泉营站，转公交或打车 10 分钟。',
 {u:'https://www.redbrickartmuseum.org/',l:'红砖美术馆官网',t:'130元，周一闭馆'}],
['filmmuseum','中国电影博物馆','朝阳','博物馆',39.9950,116.5300,90,0,540,1020,1,1,0,'museum',
 '亚洲最大电影博物馆，IMAX 巨幕便宜，带孩子看科普展也好。',
 '地铁14号线将台站转公交。',
 {u:'https://www.cnfm.org.cn/',l:'电影博物馆官网',t:'免费，需预约，周一闭馆'}],
['langyuan','郎园Station','朝阳','艺术',39.9700,116.4900,60,0,600,1320,0,0,0,'art',
 '老仓库改的园区，书店、买手店、展览，周末常有市集。',
 '地铁14号线将台站步行 15 分钟。',
 {u:AM('郎园Station'),l:'地图查看',t:'免费开放'}],
['kejiguan','中国科技馆','朝阳','亲子',40.0075,116.3906,180,30,570,1020,1,1,1,'museum',
 '带娃半天打不住，儿童科学乐园和球幕影院都要单独约。',
 '地铁8号线森林公园南门站。周末票紧，提前在公众号约。',
 {u:'https://cstm.cdstm.cn/',l:'科技馆官网预约',t:'主展厅30元，需预约，周一闭馆'}],
['aolinpike','奥林匹克公园·鸟巢','朝阳','夜景',39.9930,116.3900,90,0,0,0,0,0,1,'night',
 '鸟巢水立方夜景，中轴线北端，广场大适合散步。',
 '地铁8号线奥体中心站。',
 {u:AM('国家体育场鸟巢'),l:'地图查看',t:'广场免费，场馆参观另购票'}],
['aosen','奥林匹克森林公园','朝阳','公园',40.0200,116.3900,120,0,360,1260,0,0,0,'park',
 '北京城区最像野外的地方，秋天彩叶成片，跑步骑车都合适。',
 '地铁8号线森林公园南门站。',
 {u:AM('奥林匹克森林公园'),l:'地图查看',t:'免费开放'}],
['fangcaodi','侨福芳草地','朝阳','艺术',39.9250,116.4600,45,0,600,1320,0,1,0,'art',
 '商场里塞满达利雕塑，逛吃看展一体，下雨天最实用。',
 '地铁10号线劲松站。',
 {u:AM('侨福芳草地'),l:'地图查看',t:'免费开放'}],
['panjiayuan','潘家园旧货市场','朝阳','市集',39.8760,116.4600,60,0,510,1050,0,0,0,'market',
 '淘旧书旧货老物件，周末地摊最全，砍价是乐趣。',
 '地铁10号线潘家园站。周六日最热闹。',
 {u:AM('潘家园旧货市场'),l:'地图查看',t:'免费进入'}],
['happyvalley','北京欢乐谷','朝阳','乐园',39.8650,116.5000,300,299,570,1320,0,0,0,'fun',
 '过山车集群，周末排队久，适合体力好的年轻人。',
 '地铁7号线欢乐谷景区站。',
 {u:'https://www.bjhappyvalley.com/',l:'欢乐谷官网购票',t:'299元起，官网常有折扣'}],
['nongbo','中国农业博物馆','朝阳','博物馆',39.9420,116.4600,90,0,540,960,1,1,0,'museum',
 '农展馆院内，秋天银杏和农事展厅都值得，11月中旬有银杏手工活动。',
 '地铁10号线农业展览馆站。',
 {u:AM('中国农业博物馆'),l:'地图查看',t:'免费，周一闭馆'}],
/* 海淀 */
['yiheyuan','颐和园','海淀','古迹',39.9999,116.2755,180,30,390,1080,0,0,1,'water',
 '皇家园林天花板，昆明湖+长廊+佛香阁，秋天后山彩叶最好。',
 '地铁4号线北宫门站，从北宫门进人少。联票60元含园中园。',
 {u:GY,l:'畅游公园购票',t:'门票30元，联票60元'}],
['yuanmingyuan','圆明园','海淀','古迹',40.0089,116.2977,150,10,420,1140,0,0,1,'water',
 '西洋楼遗址+大片水域，秋天芦苇荡很出片，园子极大建议租电瓶车。',
 '地铁4号线圆明园站。',
 {u:GY,l:'畅游公园购票',t:'10元，西洋楼另收15元'}],
['xiangshan','香山公园','海淀','公园',39.9928,116.1907,180,10,360,1140,0,0,1,'leaf',
 '红叶代名词，11月中旬已是尾声但人也少了一半。勤政殿前元宝枫是「消息树」。',
 '地铁西郊线香山站。周末 8 点前进山，10 点后索道排 1 小时起。',
 {u:GY,l:'畅游公园购票',t:'10元，红叶季需提前预约'}],
['zhiwuyuan','国家植物园','海淀','公园',40.0054,116.2077,150,10,360,1140,0,0,0,'leaf',
 '香山脚下的植物园，银杏和彩叶比香山好走，人少很多，卧佛寺也在里面。',
 '地铁西郊线植物园站。',
 {u:GY,l:'畅游公园购票',t:'10元，卧佛寺另收5元'}],
['dazhongsi','大钟寺古钟博物馆','海淀','博物馆',39.9600,116.3400,60,0,540,990,1,1,0,'museum',
 '藏有永乐大钟，小而精。11月15日（周日）限时免费开放，还有公益讲解。',
 '地铁13号线大钟寺站。11/15 当天 9:00-17:00 免费，10:00 和 14:00 有讲解。',
 {u:AM('大钟寺古钟博物馆'),l:'地图查看',t:'平时周三前200名免费，11/15 全天免费'}],
['dongwuyuan','北京动物园','海淀','亲子',39.9390,116.3320,180,15,450,1080,0,0,0,'park',
 '老牌动物园，熊猫馆是刚需，带娃一天刚好。',
 '地铁4号线动物园站。',
 {u:GY,l:'畅游公园购票',t:'15元，熊猫馆另收4元'}],
['haiyangguan','北京海洋馆','海淀','亲子',39.9400,116.3300,120,175,540,1050,1,1,0,'water',
 '在动物园里面，海底隧道和表演是主打，票价不便宜。',
 '动物园北门进最近。',
 {u:AM('北京海洋馆'),l:'地图查看',t:'175元，建议线上购票'}],
['yuyuantan','玉渊潭公园','海淀','公园',39.9190,116.3200,90,2,360,1260,0,0,0,'water',
 '樱花季人挤人，秋天反而清静，湖面倒影好看。',
 '地铁1号线军事博物馆站。',
 {u:GY,l:'畅游公园购票',t:'2元'}],
['tsinghua_art','清华大学艺术博物馆','海淀','艺术',40.0030,116.3260,90,20,540,1020,1,1,0,'art',
 '高校博物馆里的顶配，特展质量高，进校需预约。',
 '地铁15号线清华东路西口站。校外人员需提前预约入校。',
 {u:AM('清华大学艺术博物馆'),l:'地图查看',t:'20元，需预约入校，周一闭馆'}],
/* 石景山 丰台 */
['shougang','首钢园','石景山','艺术',39.9100,116.1800,120,0,0,0,0,0,0,'art',
 '高炉改的工业风园区，滑雪大跳台、三高炉，拍照很硬核，园区大建议骑车。',
 '地铁11号线新首钢站。',
 {u:AM('首钢园'),l:'地图查看',t:'免费开放'}],
['badachu','八大处公园','石景山','公园',39.9550,116.1900,150,10,360,1080,0,0,0,'leaf',
 '八座古寺散在山里，秋天红叶不输香山，人少一半，还能坐滑道下山。',
 '地铁6号线苹果园站转公交。',
 {u:GY,l:'畅游公园购票',t:'10元'}],
['lugouqiao','卢沟桥·宛平城','丰台','古迹',39.8500,116.2200,90,20,480,1020,0,0,0,'wall',
 '501 只石狮子，抗战纪念馆在旁边，历史感很重的一站。',
 '地铁14号线张郭庄站转公交。',
 {u:AM('卢沟桥'),l:'地图查看',t:'20元'}],
['yuanlinbo','中国园林博物馆','丰台','博物馆',39.8700,116.1800,120,0,540,1020,1,1,0,'museum',
 '室内复原了苏州园林和岭南园林，冬天也能逛「园林」，免费好约。',
 '地铁14号线园博园站。',
 {u:AM('中国园林博物馆'),l:'地图查看',t:'免费，周一闭馆'}],
['shijie','世界公园','丰台','乐园',39.8100,116.2900,180,100,480,1020,0,0,0,'fun',
 '微缩世界地标，带小孩或拍照玩玩，别期待太高。',
 '地铁房山线大葆台站。',
 {u:AM('世界公园'),l:'地图查看',t:'100元'}],
['wildlife','北京野生动物园','大兴','亲子',39.5180,116.2870,240,150,510,1020,0,0,1,'park',
 '大兴榆垡，分自驾区和步行区。自驾区能开自己的车进去，长颈鹿、斑马、白虎会走到车边上；步行区有小火车和猛兽区。带娃能玩一整天。',
 '大兴区榆垡镇，自驾走京开高速榆垡出口约1小时；公交可乘地铁4号线天宫院站转兴49路。门票150元，自驾进园车辆另收费。',
 {u:AM('北京野生动物园'),l:'地图查看',t:'150元，携程可订'}],
/* 通州 */
['universal','北京环球影城','通州','乐园',39.8550,116.6800,480,528,540,1200,0,0,1,'fun',
 '一整天起步，哈利波特区是核心。周末人多，建议买优速通或挑工作日。',
 '地铁1号线八通线终点环球度假区站。开园前 30 分钟到门口。',
 {u:'https://www.universalbeijingresort.com/',l:'环球影城官网购票',t:'528元起，需指定日期实名购票'}],
['moonriver','月亮河小镇','通州','街区',39.9145,116.6590,120,0,0,0,0,0,1,'night',
 '北运河五河交汇处的免费休闲小镇，前身是1998年开业的月亮河度假村。上百件艺术雕塑散在草坪上，夜市常年开，餐饮和亲子项目密集，晚上灯亮起来最好逛。',
 '通州区新华街道月亮河滨路，地铁6号线北关站步行约15分钟。免费进入，夜市傍晚才热闹；旁边就是运河文化广场，可以顺路。',
 {u:AM('月亮河小镇'),l:'地图查看',t:'免费开放，无需预约'}],
['yunhe','大运河文化旅游景区','通州','公园',39.9100,116.6600,120,0,0,0,0,0,0,'water',
 '燃灯塔、运河奥体公园连成片，秋天沿河骑行很舒服。',
 '地铁6号线北运河西站。',
 {u:AM('大运河文化旅游景区'),l:'地图查看',t:'免费开放'}],
/* 昌平 延庆 */
['mingtombs','明十三陵','昌平','古迹',40.2519,116.2233,180,60,480,1050,0,0,1,'palace',
 '定陵地宫+长陵大殿，神路两侧石像生秋色极好。',
 '地铁昌平线转公交，或自驾。三处相距远，建议自驾。',
 {u:'https://www.mingtombs.com.cn/',l:'十三陵官网',t:'联票130元，单点定陵60元'}],
['juyongguan','居庸关长城','昌平','古迹',40.2900,116.0700,150,40,480,1020,0,0,1,'wall',
 '离城最近的长城，关城呈环形，秋天两侧山色好看，人比八达岭少。',
 '市郊铁路S2线居庸关站，或自驾。',
 {u:AM('居庸关长城'),l:'地图查看',t:'40元'}],
['badaling','八达岭长城','延庆','古迹',40.3592,116.0200,210,40,390,1140,0,0,1,'wall',
 '最经典也最挤。北八楼是最高点，缆车另收费。',
 '市郊铁路S2线八达岭站，或德胜门乘877路。必须提前实名预约。',
 {u:'https://www.badaling.cn/',l:'八达岭官网预约',t:'40元，实名预约，旺季限流'}],
['longqingxia','龙庆峡','延庆','郊区',40.5300,115.9800,180,40,480,1020,0,0,0,'water',
 '「小三峡」，坐船游峡谷，冬天有冰灯节。',
 '自驾约 2 小时，或延庆城区转公交。',
 {u:AM('龙庆峡'),l:'地图查看',t:'40元，船票另收'}],
['shiyuan','北京世园公园','延庆','公园',40.4500,115.9700,180,40,540,1020,0,0,0,'park',
 '世园会留下的园区，地大空旷，秋天花海和草甸适合遛娃。',
 '市郊铁路S2线延庆站转公交。',
 {u:AM('北京世园公园'),l:'地图查看',t:'40元'}],
/* 怀柔 密云 */
['mutianyu','慕田峪长城','怀柔','古迹',40.4319,116.5700,210,45,480,1020,0,0,1,'wall',
 '比八达岭好走也好看，植被覆盖率高，秋天层林尽染，老外最爱。',
 '东直门乘 916 快到怀柔转公交，或自驾 1.5 小时。缆车/滑道另收费。',
 {u:'https://www.mutianyugreatwall.com/',l:'慕田峪官网',t:'45元，摆渡车15元'}],
['yanqihu','雁栖湖','怀柔','郊区',40.4000,116.6600,150,45,480,1050,0,0,0,'water',
 'APEC 会址所在地，环湖骑行+西山步道，秋天颜色最好。',
 '自驾 1.5 小时，或怀柔城区转公交。',
 {u:AM('雁栖湖'),l:'地图查看',t:'45元'}],
['hongluosi','红螺寺','怀柔','古迹',40.3800,116.6300,120,54,480,1020,0,0,0,'temple',
 '「南有普陀，北有红螺」，千年银杏夫妻树，11月上旬满树金黄。',
 '自驾 1.5 小时，或怀柔转公交。',
 {u:AM('红螺寺'),l:'地图查看',t:'54元'}],
['gubei','古北水镇','密云','郊区',40.6500,117.1500,300,140,540,1320,0,0,0,'water',
 '长城脚下的水乡，夜景+司马台长城，适合住一晚。门票贵但体验完整。',
 '东直门有直达班车，自驾 2 小时。建议住景区内客栈。',
 {u:'https://www.wtown.com/',l:'古北水镇官网',t:'140元，住宿套餐更划算'}],
/* 房山 门头沟 */
['shidu','十渡','房山','郊区',39.6000,115.6000,240,0,480,1020,0,0,0,'water',
 '拒马河峡谷，漂流、蹦极、爬山，秋天山水颜色最好。',
 '自驾 2 小时，或房山转公交。',
 {u:AM('十渡'),l:'地图查看',t:'景区免费，项目单独收费'}],
['zhoukoudian','周口店遗址','房山','博物馆',39.6800,115.9300,90,30,540,990,1,1,0,'museum',
 '北京人头盖骨发现地，博物馆+遗址洞，科普性强。',
 '自驾 1 小时，或房山转公交。',
 {u:AM('周口店遗址'),l:'地图查看',t:'30元，周一闭馆'}],
['yunju','云居寺','房山','古迹',39.6100,115.7700,120,40,480,1020,0,0,0,'temple',
 '藏有石经和舍利，山门前的银杏和古塔组合非常上相。',
 '自驾 1.5 小时。',
 {u:AM('云居寺'),l:'地图查看',t:'40元'}],
['tanzhe','潭柘寺','门头沟','古迹',39.9000,116.0300,120,55,480,1020,0,0,0,'temple',
 '「先有潭柘寺，后有北京城」，帝王树千年银杏，秋天必看。',
 '自驾 1 小时，或地铁S1线转公交。',
 {u:AM('潭柘寺'),l:'地图查看',t:'55元'}],
['jietai','戒台寺','门头沟','古迹',39.8700,116.0300,90,45,480,1020,0,0,0,'temple',
 '以戒坛和古松闻名，和潭柘寺同一天顺路逛完。',
 '和潭柘寺相距 8 公里，建议连着安排。',
 {u:AM('戒台寺'),l:'地图查看',t:'45元'}],
['cuandixia','爨底下村','门头沟','古迹',39.9417,115.6333,180,35,480,1020,0,0,1,'hutong',
 '明清古村落，五百多间四合院顺着山势层层叠起，电影《手机》在这儿取景。秋天柿子挂满树、屋顶晒秋，是京郊最好拍的古村。',
 '自驾走 109 国道约 2 小时（90 公里），村口停车后步行进村；苹果园乘 892 路到斋堂再转车。村里有农家院可住。',
 {u:AM('爨底下村'),l:'地图查看',t:'35元，现场购票'}],
['miaofengshan','妙峰山','门头沟','郊区',40.0500,116.0500,180,40,520,960,0,0,0,'leaf',
 '主峰 1291 米，山顶碧霞元君祠，农历四月的庙会是华北最盛的香会。秋天红叶比香山早半个月，人少一大截。',
 '自驾约 1.5 小时，后半段山路弯多；苹果园乘 929 路到妙峰山镇转车。冬季 8:40–16:00 开放。',
 {u:AM('妙峰山'),l:'地图查看',t:'40元，现场购票'}],
['dingdufeng','定都峰·定都阁','门头沟','古迹',39.9167,116.0333,90,40,480,1020,0,0,0,'temple',
 '传说朱棣在此定都，定都阁立在峰顶，能一眼望到北京城和西山。傍晚日落时最值得爬。',
 '自驾 1 小时，和潭柘寺、戒台寺在同一条线上，适合串成一日。',
 {u:AM('定都峰'),l:'地图查看',t:'40元'}],
['jingxigudao','京西古道·牛角岭','门头沟','古迹',39.9333,116.0167,150,0,0,0,0,0,0,'wall',
 '元明清运煤运货的老道，青石板上被马蹄磨出的深坑还清清楚楚。爬升很小，走两小时刚好。',
 '免费。王平镇韭园村一侧上山，和韭园村连着走最顺。',
 {u:AM('京西古道'),l:'地图查看',t:'免费开放'}],
['jiuyuan','韭园村·马致远故居','门头沟','街区',39.9333,116.0000,90,0,0,0,0,0,0,'hutong',
 '「小桥流水人家」写的就是这一带，京西古道边的古村，秋天柿子树挂满枝头，几乎没游客。',
 '免费。自驾 1 小时，村口即古道入口。',
 {u:AM('韭园村'),l:'地图查看',t:'免费开放'}],
['baipusi','白瀑寺','门头沟','古迹',40.0167,115.9500,90,0,480,1020,0,0,0,'temple',
 '辽代古寺藏在山坳里，殿宇沿山势层叠，远看像悬在半空，近两年成了小众打卡点。',
 '自驾 1.5 小时，最后一段山路窄，会车小心。雁翅镇淤白村。',
 {u:AM('白瀑寺'),l:'地图查看',t:'免费，以现场为准'}],
['shuanglongxia','双龙峡','门头沟','郊区',39.9000,115.7500,180,30,480,1020,0,0,0,'water',
 '坐森林小火车进谷，一路瀑布水潭，秋天满山红叶。带小孩最省力的一条。',
 '门票 30 元，小火车另收。892 路到火村口；自驾约 80 公里。',
 {u:AM('双龙峡'),l:'地图查看',t:'30元，小火车另计'}],
['baihuashan','百花山','门头沟','郊区',39.8333,115.5833,240,60,480,1020,0,0,0,'leaf',
 '海拔近 2000 米的高山草甸，夏天漫山野花，秋天草甸转金黄，山顶视野极开阔。',
 '8:00–17:00，旺季 60 元、淡季 40 元。海拔高，一般 4 月底到 10 月中开放，11 月已封山。',
 {u:AM('百花山'),l:'地图查看',t:'旺季60元，携程/美团可购'}],
['lingshan','灵山','门头沟','郊区',39.9833,115.4833,240,30,480,1020,0,0,0,'wall',
 '北京最高峰 2303 米，山顶是连绵草甸，夏天比城里低十度，是北京最像高原的地方。',
 '距市区约 120 公里，自驾 2.5 小时。冬季封山，一般 5–10 月才上得去。',
 {u:AM('灵山'),l:'地图查看',t:'30元，5–10月开放'}],
['zhenzhuhu','珍珠湖','门头沟','郊区',39.9833,115.7000,120,20,480,1020,0,0,0,'water',
 '永定河截出来的峡谷湖，两岸峭壁夹着一线水，秋天层林尽染，坐船看最舒服。',
 '自驾 2 小时，雁翅镇珠窝村。冬天湖面结冰会封。',
 {u:AM('珍珠湖'),l:'地图查看',t:'20元'}],
['longmenjian','龙门涧','门头沟','郊区',39.9833,115.5500,180,30,480,1020,0,0,0,'water',
 '京西大峡谷，全程沿溪走，树荫浓、爬升小，夏天最凉快，秋天几乎没人。',
 '清水镇，自驾 2 小时。一般 4–10 月开放。',
 {u:AM('龙门涧'),l:'地图查看',t:'30元'}],
['shibatan','京西十八潭','门头沟','郊区',39.9500,115.8000,150,30,480,1020,0,0,0,'water',
 '十八个水潭串在一条峡谷里，走完全程不到三小时，秋天红叶倒映在水面上。',
 '雁翅镇，自驾 2 小时。一般 4–10 月开放。',
 {u:AM('京西十八潭'),l:'地图查看',t:'30元'}]
];

const P = {}, LIST = [];
RAW.forEach(r => {
  const o = {
    id:r[0], n:r[1], d:r[2], c:r[3], lat:r[4], lng:r[5],
    dur:r[6], p:r[7], o:r[8], cl:r[9], mo:r[10], in:r[11], hot:r[12], th:r[13],
    desc:r[14], tip:r[15], book:r[16]
  };
  P[o.id] = o; LIST.push(o);
});

/* ---------- 预约购票：统一走携程 ----------
   有 POI 编号的直接进详情页（页内即可订票），没有的走携程站内搜索 */
const CTRIP_POI = {
  gugong:229, tiananmen:228, jingshan:5170, tiantan:233, yonghegong:5153,
  guozijian:1485193, nanluoguxiang:64955, guobo:62722, namoc:62735, qianmen:107634,
  wangfujing:54198, gongwangfu:5174, shichahai:140172, beihai:232, shoubo:5159,
  taoranting:5228, dajuyuan:54179, tianwenguan:52676, dizhibo:62726, '798':64948,
  sanlitun:140217, chaoyangpark:107621, filmmuseum:66163, kejiguan:107625,
  aolinpike:140224, happyvalley:57491, yiheyuan:231, yuanmingyuan:5208,
  xiangshan:235, zhiwuyuan:5217, dongwuyuan:5173, haiyangguan:52674,
  yuyuantan:54223, badachu:5305, lugouqiao:236, shijie:5265,
  universal:2045497, mingtombs:234, juyongguan:5316, badaling:230,
  longqingxia:242, mutianyu:243, yanqihu:5315, hongluosi:5162,
  gubei:1411592, tanzhe:5161, miaofengshan:38332464, chocmuseum:153483524, daguanyuan:238, ditan:5215, wildlife:107469
};
const CTRIP_SIGHT = n => 'https://you.ctrip.com/sight/beijing1/' + n + '.html';
const CTRIP_SEARCH = n => 'https://you.ctrip.com/searchsite/sight?query=' + encodeURIComponent(n);
const BAIKE = n => 'https://baike.baidu.com/item/' + encodeURIComponent(n);
LIST.forEach(p => {
  const note = p.book.t;
  const poi = CTRIP_POI[p.id];
  const short = p.n.split('·')[0];
  // 免费的不需要购票，按钮直接指向百度百科看介绍
  if (p.p === 0){
    p.book = { u: BAIKE(short), l: '百度百科', t: note };
  } else {
    p.book = poi
      ? { u: CTRIP_SIGHT(poi), l: '携程订票', t: note }
      : { u: CTRIP_SEARCH(short), l: '携程搜索', t: note };
  }
  p.ctripDirect = !!poi;   // 排序用的热度信号保持不变
});

/* ---------- 季节限定（高海拔/峡谷类，冬天封山） ---------- */
const SEASON = {
  baihuashan: '4月底–10月中',
  lingshan: '5–10月',
  longmenjian: '4–10月',
  shibatan: '4–10月'
};

/* ---------- 美食 ---------- */
const FOOD = [
  {n:'四季民福烤鸭（故宫店）',a:'东城',t:'烤鸭',p:150,d:'故宫东华门外，等位时能看角楼。挂炉烤鸭皮脆，人均150左右，最好11点前拿号。'},
  {n:'便宜坊（鲜鱼口店）',a:'东城',t:'焖炉烤鸭',p:120,d:'六百年焖炉烤鸭，比挂炉少一分脆多一分嫩，前门一带逛完正好。'},
  {n:'姚记炒肝（鼓楼店）',a:'东城',t:'小吃',p:30,d:'炒肝配包子，老北京早点，鼓楼一拐就到，早上人多。'},
  {n:'护国寺小吃（总店）',a:'东城',t:'小吃',p:25,d:'豆汁、焦圈、驴打滚、面茶一次吃全，第一次喝豆汁做好心理准备。'},
  {n:'增盛魁小吃',a:'东城',t:'小吃',p:20,d:'隆福寺附近的老店，糖油饼和豆腐脑是招牌，本地人排队。'},
  {n:'烤肉季（什刹海店）',a:'西城',t:'京味烤肉',p:120,d:'银锭桥边，百年老号，烤肉配烧饼，二楼靠窗能看后海。'},
  {n:'砂锅居（西四店）',a:'西城',t:'京菜',p:90,d:'砂锅白肉是招牌，冬天吃最舒服，老北京家常味。'},
  {n:'小肠陈（南横街店）',a:'西城',t:'卤煮',p:40,d:'卤煮火烧祖师爷，重口但要试一次，配二锅头是本地吃法。'},
  {n:'聚宝源（牛街店）',a:'西城',t:'涮肉',p:110,d:'手切鲜羊肉天花板，周末中午排队一小时起，建议错峰。'},
  {n:'白记年糕（牛街）',a:'西城',t:'小吃',p:20,d:'驴打滚、艾窝窝、糖耳朵，买完边走边吃。'},
  {n:'胡大饭馆（簋街总店）',a:'朝阳',t:'小龙虾',p:130,d:'簋街地标，麻辣小龙虾+馋嘴蛙，凌晨还在排队。'},
  {n:'大董（团结湖店）',a:'朝阳',t:'烤鸭',p:300,d:'酥不腻烤鸭，环境好适合请客，人均三百往上。'},
  {n:'京A Taproom（1949店）',a:'朝阳',t:'精酿西餐',p:120,d:'北京本土精酿，工人体育场附近，露台舒服。'},
  {n:'局气（三里屯店）',a:'朝阳',t:'京菜',p:100,d:'兔爷土豆泥、炸酱面，装修是老北京胡同风，适合带外地朋友。'},
  {n:'三源里菜市场',a:'朝阳',t:'市集小吃',p:50,d:'不是餐厅但值得逛，进口食材和熟食摊，顺便解决一顿。'},
  {n:'紫光园（中关村店）',a:'海淀',t:'清真',p:60,d:'清真家常菜，手抓羊肉和炸松肉实惠，中关村一带最好用的一顿。'},
  {n:'老诚一锅（羊蝎子）',a:'海淀',t:'羊蝎子',p:90,d:'冬天标配，羊蝎子锅配烧饼，吃完浑身热。'},
  {n:'五道口枣糕王',a:'海淀',t:'小吃',p:15,d:'排队名店，枣糕刚出炉最好吃，五道口学生记忆。'},
  {n:'南门涮肉（通州店）',a:'通州',t:'涮肉',p:100,d:'铜锅涮肉连锁里口碑稳的，环球影城回来顺路。'},
  {n:'首钢园六工汇',a:'石景山',t:'咖啡简餐',p:60,d:'园区里的餐饮集合，逛完高炉就近吃，选择多。'},
  {n:'柳沟火盆锅豆腐宴',a:'延庆',t:'农家',p:60,d:'延庆柳沟村，豆腐宴一桌十几道，爬完长城来这吃最实在。'},
  {n:'虹鳟鱼一条沟',a:'怀柔',t:'农家',p:80,d:'怀柔雁栖湖一带，烤虹鳟鱼+柴鸡，慕田峪下来顺路。'},
  {n:'十渡农家院',a:'房山',t:'农家',p:60,d:'拒马河边，烧烤和河鱼，玩水之后就地解决。'},
  {n:'潭柘寺素斋',a:'门头沟',t:'素斋',p:50,d:'寺内素斋，简单但环境清净，逛完古寺吃一顿刚好。'},
  {n:'爨底下村农家院',a:'门头沟',t:'农家',p:60,d:'村里几乎家家做农家菜，贴饼子、柴鸡、山野菜，坐在院里吃最有味道。'},
  {n:'韭园村农家菜',a:'门头沟',t:'农家',p:50,d:'王平镇韭园一带的农家饭，卤水豆腐和炸花椒芽是特色，走完古道正好补一顿。'}
];

/* ---------- 商场推荐 ---------- */
const MALLS = [
  {n:'三里屯太古里',a:'朝阳',t:'潮流',d:'北京潮流地标，南区买衣服、北区吃饭，往西一走就是酒吧街，晚上最有气氛。'},
  {n:'国贸商城',a:'朝阳',t:'高端',d:'CBD 核心，奢侈品和餐饮都全，和国贸三期连通，下雨天能一直逛不淋雨。'},
  {n:'北京SKP',a:'朝阳',t:'奢侈品',d:'常年全国销售第一的百货，大牌旗舰店最集中；负一层的超市和餐饮也很好逛。'},
  {n:'侨福芳草地',a:'朝阳',t:'艺术',d:'商场里塞满达利雕塑，逛展、吃饭、看电影一体，天气不好时的首选。'},
  {n:'合生汇',a:'朝阳',t:'年轻',d:'B2 小吃街选择极多，营业到很晚，年轻人多，逛完还能接朝阳大悦城。'},
  {n:'朝阳大悦城',a:'朝阳',t:'家庭',d:'亲子业态最全，有室内乐园和影院，带娃能耗一整天。'},
  {n:'西单大悦城',a:'西城',t:'年轻',d:'学生党聚集地，潮牌和快时尚集中，地铁1号线西单站出来就是。'},
  {n:'老佛爷百货',a:'西城',t:'设计感',d:'西单，中庭穹顶很好拍，人比大悦城少，适合慢慢逛。'},
  {n:'北京坊',a:'西城',t:'文化商业',d:'前门旁边，PageOne 书店二层正对正阳门，傍晚灯亮起来最好看。'},
  {n:'王府中环',a:'东城',t:'精致',d:'王府井，品牌调性偏精致，人不算多，餐饮质量不错。'},
  {n:'华熙LIVE·五棵松',a:'海淀',t:'夜生活',d:'餐饮、演出、篮球公园聚在一起，晚上比白天热闹。'},
  {n:'北京环球城市大道',a:'通州',t:'主题街区',d:'环球影城外不用门票的商业街，餐厅和影院都有，玩完顺路吃。'}
];

/* ---------- 出发地 ---------- */
const STARTS = {
  tiananmen:{n:'天安门/王府井',lat:39.9087,lng:116.3975},
  guomao:{n:'国贸/CBD',lat:39.9087,lng:116.4600},
  sanlitun:{n:'三里屯/工体',lat:39.9366,lng:116.4552},
  xidan:{n:'西单/金融街',lat:39.9130,lng:116.3740},
  zhongguancun:{n:'中关村/五道口',lat:39.9880,lng:116.3260},
  wangjing:{n:'望京',lat:40.0000,lng:116.4700},
  nanzhan:{n:'北京南站',lat:39.8650,lng:116.3780},
  xizhan:{n:'北京西站',lat:39.8950,lng:116.3220},
  airport:{n:'首都机场',lat:40.0800,lng:116.5900},
  mentougou:{n:'门头沟/门城',lat:39.9403,lng:116.1014},
  tongzhou:{n:'通州副中心',lat:39.9100,lng:116.6600}
};

const AREAS = ['东城','西城','朝阳','海淀','丰台','石景山','通州','大兴','昌平','延庆','怀柔','密云','房山','门头沟'];
const CATS = ['古迹','公园','博物馆','艺术','街区','夜景','乐园','亲子','郊区','市集'];

/* ---------- 状态 ---------- */
const state = { cat:'全部', area:'全部', q:'', free:false, indoor:false, sort:'rec',
  start:'tiananmen', startTime:'08:30', days:2, hours:8, picked:[], plan:null,
  autoOrder:true, dayOf:null, aiNote:'' };

/* 行程基准日 = 下一个周六（跟着当天日期走，不再写死） */
const BASE = (function(){
  const n = new Date(); n.setHours(0, 0, 0, 0);
  const toSat = (6 - n.getDay() + 7) % 7;
  return new Date(n.getTime() + toSat * 86400000);
})();
const WD = ['周日','周一','周二','周三','周四','周五','周六'];

/* ---------- 工具 ---------- */
function haversine(a, b){
  const R = 6371, toR = Math.PI / 180;
  const dLat = (b.lat - a.lat) * toR, dLng = (b.lng - a.lng) * toR;
  const x = Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * toR) * Math.cos(b.lat * toR) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}
/* 真实驾车路线缓存：key = 起点id>终点id */
const ROUTE_CACHE = {};
const ROUTE_FAIL = {};
const rkey = (a, b) => (a.id || 'S') + '>' + (b.id || 'E');

function travelInfo(a, b){
  const hit = ROUTE_CACHE[rkey(a, b)];
  if (hit) return { km: hit.km, min: hit.min, mode: '驾车', real: true };
  const km = haversine(a, b);
  let min, mode;
  if (km < 1.0) { min = Math.round(km * 14) + 4; mode = '步行'; }
  else if (km < 30) { min = Math.round(9 + km * 2.6); mode = '地铁/打车'; }
  else { min = Math.round(14 + km * 1.9); mode = '自驾/市郊铁路'; }
  return { km: Math.round(km * 10) / 10, min: Math.max(min, 5), mode };
}
const fmt = m => String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
const money = v => v === 0 ? '免费' : '¥' + v;

function optimizeRoute(list, st){
  const rest = list.slice(), out = [];
  let cur = { lat: st.lat, lng: st.lng };
  while (rest.length){
    let bi = 0, bd = Infinity;
    rest.forEach((p, i) => { const d = haversine(cur, p); if (d < bd){ bd = d; bi = i; } });
    const p = rest.splice(bi, 1)[0];
    out.push(p); cur = p;
  }
  const total = arr => {
    if (!arr.length) return 0;
    let s = haversine(st, arr[0]);
    for (let i = 0; i < arr.length - 1; i++) s += haversine(arr[i], arr[i + 1]);
    return s;
  };
  let best = out.slice(), bestD = total(best), guard = 0, improved = true;
  while (improved && guard++ < 40){
    improved = false;
    for (let i = 0; i < best.length - 1; i++){
      for (let j = i + 1; j < best.length; j++){
        const cand = best.slice(0, i).concat(best.slice(i, j + 1).reverse(), best.slice(j + 1));
        const d = total(cand);
        if (d < bestD - 1e-6){ best = cand; bestD = d; improved = true; }
      }
    }
  }
  return best;
}

function weekdayOf(dayIdx){
  const d = new Date(BASE.getTime() + dayIdx * 86400000);
  return d.getDay();
}
function dateLabel(dayIdx){
  const d = new Date(BASE.getTime() + dayIdx * 86400000);
  return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + WD[d.getDay()];
}

/* ---------- 排程 ---------- */
function buildPlan(ids){
  const list = ids.map(id => P[id]).filter(Boolean);
  if (!list.length) return null;
  const st = STARTS[state.start];
  const order = (state.autoOrder === false) ? list.slice() : optimizeRoute(list, st);
  const maxH = state.hours * 60;
  const [sh, sm] = state.startTime.split(':').map(Number);
  const dayStart = sh * 60 + sm;
  const dayCount = state.days;
  const out = [], warns = [];
  let d = 0, cursor = dayStart, lunch = false, mealSeq = 0;
  let prev = { id: 'S:' + state.start, lat: st.lat, lng: st.lng };
  let cur = { day: 0, items: [], km: 0, travel: 0, ticket: 0, visit: 0 };

  for (let i = 0; i < order.length; i++){
    const p = order[i];
    let info = travelInfo(prev, p);
    let arrive = cursor + info.min;

    // AI 指定了这一站属于第几天，到点就换天
    const wantDay = (state.dayOf && state.dayOf[p.id] != null) ? state.dayOf[p.id] : null;
    if (cur.items.length && wantDay != null && wantDay !== d && wantDay < dayCount){
      cur.end = cursor; out.push(cur);
      d = wantDay;
      cur = { day: d, items: [], km: 0, travel: 0, ticket: 0, visit: 0 };
      cursor = dayStart; lunch = false;
      prev = { id: 'S:' + state.start, lat: st.lat, lng: st.lng };
      info = travelInfo(prev, p);
      arrive = cursor + info.min;
    }

    if (cur.items.length && (arrive + p.dur - dayStart) > maxH){
      cur.end = cursor; out.push(cur);
      d++;
      if (d >= dayCount){
        warns.push('超出 ' + dayCount + ' 天容量，剩下 ' + (order.length - i) + ' 个地方未排入，可以加天数或减地点');
        cur = { day: d, items: [] };
        break;
      }
      cur = { day: d, items: [], km: 0, travel: 0, ticket: 0, visit: 0 };
      cursor = dayStart; lunch = false;
      prev = { id: 'S:' + state.start, lat: st.lat, lng: st.lng };
      info = travelInfo(prev, p);
      arrive = cursor + info.min;
    }

    if (p.mo && weekdayOf(d) === 1){ warns.push(p.n + ' 周一闭馆，已跳过'); continue; }
    if (SEASON[p.id]) warns.push(p.n + '：开放期 ' + SEASON[p.id] + '，11 月可能已封山，出发前先确认');

    let wait = 0;
    if (p.o && arrive < p.o){ wait = p.o - arrive; arrive = p.o; }

    // 午饭：到达时间在 11:00–14:00 之间，先吃再逛
    if (!lunch && arrive >= 660 && arrive <= 840){
      const f = pickFood(p.d, p.n, mealSeq++);
      cur.items.push({ meal: true, pre: true, info, at: arrive, end: arrive + 60, f, area: p.d });
      arrive += 60; cursor = arrive; lunch = true; wait = 0;
    }

    let dur = p.dur, cut = false;
    if (p.cl && arrive + dur > p.cl){ dur = Math.max(40, p.cl - arrive); cut = true; }

    const item = { p, arrive, end: arrive + dur, dur, info, wait, cut };
    if (!lunch && arrive < 690 && item.end > 810){ item.spanLunch = true; lunch = true; }
    cur.items.push(item);
    cur.km += info.km; cur.travel += info.min; cur.ticket += p.p; cur.visit += dur;
    cursor = arrive + dur;
    prev = p;

    if (!lunch && cursor >= 690 && cursor <= 840 && i < order.length - 1){
      const f = pickFood(p.d, p.n, mealSeq++);
      cur.items.push({ meal: true, at: cursor, end: cursor + 60, f, area: p.d });
      cursor += 60; lunch = true;
    }
  }
  if (cur.items && cur.items.length){ cur.end = cursor; out.push(cur); }

  const sum = {
    km: Math.round(out.reduce((s, x) => s + x.km, 0) * 10) / 10,
    travel: out.reduce((s, x) => s + x.travel, 0),
    ticket: out.reduce((s, x) => s + x.ticket, 0),
    visit: out.reduce((s, x) => s + x.visit, 0),
    count: out.reduce((s, x) => s + x.items.filter(i => !i.meal).length, 0)
  };
  return { days: out, sum, warns, order };
}
function pickFood(area, name, seq){
  const all = FOOD.filter(f => f.a === area);
  const meal = all.filter(f => f.t !== '小吃' && f.t !== '市集小吃');
  const pool = meal.length ? meal : all;
  const seed = area.charCodeAt(0) + (name ? name.length : 0) + (seq || 0) * 7;
  if (pool.length) return pool[seed % pool.length];
  return FOOD[seed % FOOD.length];
}

/* ---------- 渲染：卡片 ---------- */
const $ = s => document.querySelector(s);
const el = (t, c, h) => { const n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; };
const photoKey = id => 'bjphoto_' + id;
function photoOf(id){ try { return localStorage.getItem(photoKey(id)); } catch (e) { return null; } }

function filtered(){
  const st = STARTS[state.start];
  let arr = LIST.filter(p => {
    if (state.cat !== '全部' && p.c !== state.cat) return false;
    if (state.area !== '全部' && p.d !== state.area) return false;
    if (state.free && p.p !== 0) return false;
    if (state.indoor && !p.in) return false;
    if (state.q){
      const q = state.q.toLowerCase();
      const hay = (p.n + p.d + p.c + p.desc + p.tip).toLowerCase();
      if (hay.indexOf(q) < 0) return false;
    }
    return true;
  });
  if (state.sort === 'dur') arr.sort((a, b) => a.dur - b.dur);
  else if (state.sort === 'price') arr.sort((a, b) => a.p - b.p);
  else if (state.sort === 'near') arr.sort((a, b) => haversine(st, a) - haversine(st, b));
  else arr.sort((a, b) => {
    // 推荐 = 周末热门优先 → 携程有票(说明是真景点) → 离出发地近
    if (b.hot !== a.hot) return b.hot - a.hot;
    const ca = b.ctripDirect ? 1 : 0, cb = a.ctripDirect ? 1 : 0;
    if (ca !== cb) return ca - cb;
    return haversine(st, a) - haversine(st, b);
  });
  return arr;
}

function kmText(d){
  if (d < 1) return Math.round(d * 1000) + 'm';
  if (d < 10) return d.toFixed(1) + 'km';
  return Math.round(d) + 'km';
}

function renderChips(){
  const cats = ['全部'].concat(CATS);
  const box = $('#cats');
  box.innerHTML = '';
  cats.forEach(c => {
    const n = c === '全部' ? LIST.length : LIST.filter(p => p.c === c).length;
    const b = el('button', 'chip' + (state.cat === c ? ' on red' : ''), c + '<span class="n">' + n + '</span>');
    b.onclick = () => { state.cat = c; renderChips(); renderGrid(); };
    box.appendChild(b);
  });
  const sel = $('#area');
  if (!sel.options.length){
    sel.appendChild(new Option('全部区域', '全部'));
    AREAS.forEach(a => sel.appendChild(new Option(a, a)));
  }
  sel.value = state.area;
}

const SORTS = [
  { k: 'rec',   n: '推荐排序', t: '周末热门优先，再看离出发地多远' },
  { k: 'near',  n: '距离最近', t: '按离当前出发地的直线距离' },
  { k: 'dur',   n: '时长最短', t: '按建议停留时间' },
  { k: 'price', n: '票价最低', t: '免费和低价优先' }
];

function renderSorts(){
  const box = $('#sorts');
  if (!box) return;
  box.innerHTML = '<span class="chip-lab">排序</span>';
  SORTS.forEach(function(s2){
    const b = el('button', 'chip' + (state.sort === s2.k ? ' on' : ''), s2.n);
    b.title = s2.t || '';
    b.onclick = function(){ state.sort = s2.k; renderSorts(); renderGrid(); };
    box.appendChild(b);
  });
}

function renderGrid(){
  const arr = filtered();
  $('#count').innerHTML = '共 <b>' + arr.length + '</b> 个地方 · 已加入行程 <b>' + state.picked.length + '</b> 个';
  const g = $('#grid');
  g.innerHTML = '';
  arr.forEach(p => {
    const card = el('div', 'card');
    const ph = photoOf(p.id) || PHOTO[p.id] || '';
    const bv = VIDEO[p.id];
    const media = el('div', 'media' + (bv ? ' vid' : ''));
    media.innerHTML = (bv ? videoPoster(bv)
      : art(p.th) + (ph ? '<img src="' + ph + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">' : '')) +
      '<div class="badge">' +
      (p.hot ? '<span class="tag hot">周末热门</span>' : '') +
      (p.p === 0 ? '<span class="tag free">免费</span>' : '') +
      (p.in ? '<span class="tag">室内</span>' : '') +
      (SEASON[p.id] ? '<span class="tag">季节限定</span>' : '') +
      (bv ? '<span class="tag">视频 ' + bv.len + '</span>' : '') +
      '</div><button class="photo-btn">换图</button>';
    media.querySelector('.photo-btn').onclick = e => { e.stopPropagation(); askPhoto(p.id); };
    if (bv){
      const pb = media.querySelector('.vplay');
      if (pb) pb.onclick = e => { e.stopPropagation(); media.innerHTML = biliFrame(bv.bv, 1); };
    } else {
      media.onclick = () => openModal(p.id);
    }
    const inList = state.picked.indexOf(p.id) >= 0;
    const body = el('div', 'body',
      '<div class="name">' + p.n + '<span class="d">' + p.d + ' · ' + p.c + '</span></div>' +
      '<div class="meta"><span><i>建议</i> ' + Math.round(p.dur / 30) / 2 + ' 小时</span>' +
      '<span><i>门票</i> ' + money(p.p) + '</span>' +
      '<span><i>距</i> ' + kmText(haversine(STARTS[state.start], p)) + '</span></div>' +
      '<div class="desc">' + p.desc + '</div>' +
      '<div class="foot">' +
      '<button class="btn add' + (inList ? ' on' : '') + '">' + (inList ? '已在行程' : '加入行程') + '</button>' +
      '<a class="btn book" href="' + p.book.u + '" target="_blank" rel="noopener">' + p.book.l + '</a>' +
      '</div>');
    body.querySelector('.add').onclick = e => { e.stopPropagation(); togglePick(p.id); };
    const nm = body.querySelector('.name');
    if (nm) nm.onclick = () => openModal(p.id);
    card.appendChild(media); card.appendChild(body);
    g.appendChild(card);
  });
  if (!arr.length) g.innerHTML = '<div class="empty" style="grid-column:1/-1">没有符合条件的地方，换个筛选试试</div>';
  if (!state.plan) refreshMap();
}

function askPhoto(id){
  const cur = photoOf(id) || '';
  const url = prompt('粘贴一张图片的网络地址（http/https），留空则恢复默认插画：', cur);
  if (url === null) return;
  try {
    if (url.trim()) localStorage.setItem(photoKey(id), url.trim());
    else localStorage.removeItem(photoKey(id));
  } catch (e) {}
  renderGrid();
}

/* ---------- 交互 ---------- */
function togglePick(id){
  state.dayOf = null; state.autoOrder = true; state.aiNote = '';
  const i = state.picked.indexOf(id);
  if (i >= 0) state.picked.splice(i, 1); else state.picked.push(id);
  renderPicked(); renderGrid();
  if (state.picked.length) buildAndRender(); else { $('#result').innerHTML = emptyHtml(); }
  toast(i >= 0 ? '已移出行程' : '已加入行程');
}
function emptyHtml(){
  return '<div class="empty">左侧点「加入行程」选几个地方<br>再点「生成行程」自动排时间<br><span style="color:#B33A2B">不知道选什么？点下面「一键周末」</span></div>';
}
function renderPicked(){
  const box = $('#picked');
  box.innerHTML = '';
  $('#pickedN').textContent = state.picked.length ? '· ' + state.picked.length + ' 个' : '';
  $('#fabN').textContent = state.picked.length;
  if (!state.picked.length) return;
  state.picked.forEach(id => {
    const p = P[id];
    const d = el('div', 'pick', '<b>' + p.n + '</b>');
    const x = el('button', '', '×');
    x.onclick = () => togglePick(id);
    d.appendChild(x); box.appendChild(d);
  });
}

function buildAndRender(){
  const plan = buildPlan(state.picked);
  state.plan = plan;
  const box = $('#result');
  if (!plan){ box.innerHTML = emptyHtml(); return; }
  let h = '';
  if (plan.warns.length) h += '<div class="warnbar">' + plan.warns.join('<br>') + '</div>';
  if (state.aiNote) h += '<div class="ainote"><b>AI 规划思路</b>' + state.aiNote + '</div>';
  plan.days.forEach(day => {
    const visits = day.items.filter(i => !i.meal).length;
    const first = day.items.filter(i => !i.meal)[0];
    h += '<div class="day"><div class="day-h"><span class="n">第 ' + (day.day + 1) + ' 天 · ' + dateLabel(day.day) + '</span>' +
      '<span class="s">' + visits + ' 个地方 · ' + ((day.end - (first ? first.arrive : day.end)) / 60).toFixed(1) + ' 小时</span></div><div class="tl">';
    let prevEnd = null, skipLeg = false;
    day.items.forEach(it => {
      if (it.meal){
        if (prevEnd === null && it.info){
          h += '<div class="leg">从出发地 ' + it.info.mode + ' · ' + it.info.km + 'km · 约 ' + it.info.min + ' 分钟</div>';
        }
        h += '<div class="ti"><div class="tm">' + fmt(it.at) + '</div><div class="box meal">' +
          '<div class="t"><span class="no">餐</span>' + it.f.n + '</div>' +
          '<div class="s"><span>人均 ¥' + it.f.p + ' · ' + it.f.t + '</span></div>' +
          '<div class="s" style="color:#5C564D">' + it.f.d + '</div></div></div>';
        prevEnd = it.end;
        skipLeg = !!it.pre;
        return;
      }
      const p = it.p;
      if (prevEnd === null){
        h += '<div class="leg">从出发地 ' + it.info.mode + ' · ' + it.info.km + 'km · 约 ' + it.info.min + ' 分钟</div>';
      } else if (!skipLeg){
        h += '<div class="leg">' + it.info.mode + ' · ' + it.info.km + 'km · 约 ' + it.info.min + ' 分钟</div>';
      }
      skipLeg = false;
      const no = day.items.filter(x => !x.meal).indexOf(it) + 1;
      h += '<div class="ti"><div class="tm">' + fmt(it.arrive) + '</div>' +
        '<div class="box' + (it.cut ? ' warn' : '') + '">' +
        '<div class="t"><span class="no">' + no + '</span>' + p.n + '</div>' +
        '<div class="s"><span>' + fmt(it.arrive) + '–' + fmt(it.end) + '（' + Math.round(it.dur / 6) / 10 + 'h）</span>' +
        '<span>' + money(p.p) + '</span>' + (it.wait ? '<span>等开门 ' + it.wait + ' 分钟</span>' : '') +
        (it.cut ? '<span style="color:#8A5B1E">已压缩至闭馆前</span>' : '') +
        (it.spanLunch ? '<span style="color:#8A5B1E">跨午饭点，就近解决</span>' : '') + '</div></div></div>';
      prevEnd = it.end;
    });
    h += '</div></div>';
  });
  const s = plan.sum;
  h += '<div class="sum"><div><b>' + s.km + '</b><span>公里</span></div>' +
    '<div><b>' + (s.travel / 60).toFixed(1) + 'h</b><span>路上</span></div>' +
    '<div><b>¥' + s.ticket + '</b><span>门票合计</span></div></div>';
  h += '<div style="display:flex;gap:8px;margin-top:10px">' +
    '<button class="btn ghost" id="copyPlan" style="height:34px">复制行程文字</button>' +
    '<button class="btn ghost" id="printPlan" style="height:34px">打印</button></div>';
  box.innerHTML = h;
  $('#copyPlan').onclick = () => copyPlan(plan);
  $('#printPlan').onclick = () => window.print();
  refreshMap();
  enrichRoutes(plan);
}

function copyPlan(plan){
  let t = '北京周末行程（' + STARTS[state.start].n + '出发）\n';
  plan.days.forEach(day => {
    t += '\n第' + (day.day + 1) + '天 ' + dateLabel(day.day) + '\n';
    day.items.forEach(it => {
      if (it.meal) t += '  ' + fmt(it.at) + ' 吃饭：' + it.f.n + '（人均¥' + it.f.p + '）\n';
      else t += '  ' + fmt(it.arrive) + '-' + fmt(it.end) + ' ' + it.p.n + '（' + money(it.p.p) + '）\n';
    });
  });
  const s = plan.sum;
  t += '\n合计 ' + s.km + ' 公里 / 门票 ¥' + s.ticket;
  if (navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(t).then(function(){ toast('已复制到剪贴板'); },
      function(){ toast('复制失败，请手动选择'); });
  } else {
    toast('当前环境不支持自动复制，请手动选择文字');
  }
}

function toast(msg){
  const t = $('#toast');
  t.textContent = msg; t.classList.add('on');
  clearTimeout(t._tm); t._tm = setTimeout(() => t.classList.remove('on'), 1800);
}

/* ---------- 弹窗 ---------- */
function openModal(id){
  const p = P[id];
  const ph = photoOf(id) || PHOTO[id] || '';
  const foods = FOOD.filter(f => f.a === p.d).slice(0, 3);
  const m = $('#modal');
  m.innerHTML =
    '<div class="m-hero">' + (VIDEO[id] ? videoPoster(VIDEO[id])
      : art(p.th) + (ph ? '<img src="' + ph + '" alt="" onerror="this.style.display=\'none\'">' : '')) +
    '<button class="x">×</button></div>' +
    '<div class="m-body">' +
    '<h3>' + p.n + '</h3>' +
    '<div class="sub">' + p.d + '区 · ' + p.c + ' · 建议停留 ' + Math.round(p.dur / 30) / 2 + ' 小时</div>' +
    '<dl class="kv">' +
    '<dt>门票</dt><dd>' + money(p.p) + '</dd>' +
    '<dt>开放时间</dt><dd>' + (p.o ? fmt(p.o) + '–' + fmt(p.cl) : '全天开放') + (p.mo ? '（周一闭馆）' : '') + '</dd>' +
    (SEASON[p.id] ? '<dt>开放季节</dt><dd style="color:#8A5B1E">' + SEASON[p.id] + '，冬季封山</dd>' : '') +
    '<dt>交通提示</dt><dd>' + p.tip + '</dd>' +
    '<dt>预约说明</dt><dd>' + p.book.t + '</dd>' +
    '</dl>' +
    '<div class="m-note">' + p.desc + '</div>' +
    (foods.length ? '<div style="font-size:12px;color:#8E877C;margin-bottom:6px">附近吃（' + p.d + '）</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px">' +
      foods.map(f => '<a class="tag" style="background:#F4F1EA;color:#5C564D;padding:5px 9px" href="' + DP(f.n) + '" target="_blank" rel="noopener">' + f.n + '</a>').join('') +
      '</div>' : '') +
    '<div class="m-foot">' +
    '<button class="btn add" id="mAdd">' + (state.picked.indexOf(id) >= 0 ? '从行程移除' : '加入行程') + '</button>' +
    '<a class="btn book" href="' + p.book.u + '" target="_blank" rel="noopener">' + p.book.l + '</a>' +
    '</div></div>';
  $('#mask').classList.add('on');
  m.querySelector('.x').onclick = closeModal;
  const vp = m.querySelector('.vplay');
  if (vp && VIDEO[id]) vp.onclick = e => {
    e.stopPropagation();
    m.querySelector('.m-hero').innerHTML = biliFrame(VIDEO[id].bv, 1) + '<button class="x">×</button>';
    m.querySelector('.x').onclick = closeModal;
  };
  m.querySelector('#mAdd').onclick = () => { togglePick(id); closeModal(); };
}
function closeModal(){ $('#mask').classList.remove('on'); }

/* ---------- 美食 ---------- */
function renderFood(){
  const g = $('#foodGrid');
  g.innerHTML = FOOD.map(f =>
    '<div class="food"><div class="h"><b>' + f.n + '</b><em>¥' + f.p + '</em></div>' +
    '<div class="m"><span>' + f.a + '区</span><span>' + f.t + '</span></div>' +
    '<div class="d">' + f.d + '</div>' +
    '<a class="go" href="' + DP(f.n) + '" target="_blank" rel="noopener">大众点评 · 看评价 →</a></div>'
  ).join('');
}

/* ---------- 地图：天地图 / 高德 双通道 ----------
   天地图：TD_TK 为浏览器端 key；TD_SK 为安全密钥（仅服务端接口签名用，前端不需要）
   高德：AMAP_KEY 为 Web端(JS API) key；若控制台有安全密钥填 AMAP_SECURITY
   两套 SDK 可共存，顶部「地图底图」按钮切换，选择记在 localStorage */
const TD_TK = '675d012cf295b469f5528b3768d1dd40';
const TD_SK = 'f4a763c667e07ea2ccfcd67be96e2820';
const AMAP_KEY = '48f912f55043f42ddb1e902fac6b6e59';
const AMAP_SECURITY = '';

let provider = 'tianditu';
const sdkLoaded = { tianditu: false, amap: false };
let tmap = null, amap = null, mapReady = false;

/* WGS84 → GCJ-02，仅高德需要（天地图用 CGCS2000，与 WGS84 基本一致） */
const PI = Math.PI, AA = 6378245.0, EE = 0.00669342162296594323;
function outOfChina(lng, lat){ return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55); }
function tLat(x, y){
  let r = -100 + 2 * x + 3 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  r += (20 * Math.sin(6 * x * PI) + 20 * Math.sin(2 * x * PI)) * 2 / 3;
  r += (20 * Math.sin(y * PI) + 40 * Math.sin(y / 3 * PI)) * 2 / 3;
  r += (160 * Math.sin(y / 12 * PI) + 320 * Math.sin(y * PI / 30)) * 2 / 3;
  return r;
}
function tLng(x, y){
  let r = 300 + x + 2 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  r += (20 * Math.sin(6 * x * PI) + 20 * Math.sin(2 * x * PI)) * 2 / 3;
  r += (20 * Math.sin(x * PI) + 40 * Math.sin(x / 3 * PI)) * 2 / 3;
  r += (150 * Math.sin(x / 12 * PI) + 300 * Math.sin(x / 30 * PI)) * 2 / 3;
  return r;
}
function wgs2gcj(lng, lat){
  if (outOfChina(lng, lat)) return [lng, lat];
  let dLat = tLat(lng - 105, lat - 35), dLng = tLng(lng - 105, lat - 35);
  const radLat = lat / 180 * PI;
  let magic = Math.sin(radLat); magic = 1 - EE * magic * magic;
  const sq = Math.sqrt(magic);
  dLat = (dLat * 180) / ((AA * (1 - EE)) / (magic * sq) * PI);
  dLng = (dLng * 180) / (AA / sq * Math.cos(radLat) * PI);
  return [lng + dLng, lat + dLat];
}
function xy(p){
  return provider === 'amap' ? wgs2gcj(p.lng, p.lat) : [p.lng, p.lat];
}

/* ---------- 加载与切换 ---------- */
function mapStat(msg, bad){
  const el = $('#mapStat');
  if (!el) return;
  if (!msg){ el.style.display = 'none'; return; }
  el.style.display = 'block';
  el.textContent = msg;
  el.style.background = bad ? '#B33A2B' : 'rgba(35,32,28,.82)';
}

const autoTried = {};
const labelOf = n => n === 'amap' ? '高德' : '天地图';

function loadProvider(name){
  provider = name;
  const btnBox = $('#mapSwitch');
  if (btnBox){
    [].forEach.call(btnBox.children, b => b.className = b.dataset.p === name ? 'on' : '');
  }
  const label = labelOf(name);
  if (sdkLoaded[name]){ initProvider(name); return; }

  mapStat('正在加载' + label + ' SDK…');
  const s = document.createElement('script');
  if (name === 'tianditu'){
    s.src = 'https://api.tianditu.gov.cn/api?v=4.0&tk=' + TD_TK;
  } else {
    if (AMAP_SECURITY) window._AMapSecurityConfig = { securityJsCode: AMAP_SECURITY };
    s.src = 'https://webapi.amap.com/maps?v=2.0&key=' + AMAP_KEY;
  }
  s.onload = function(){
    sdkLoaded[name] = true;
    mapStat(label + ' SDK 已加载，正在初始化…');
    setTimeout(function(){
      try { initProvider(name); }
      catch (e) { mapStat(label + '初始化异常：' + e.message, true); mapFail(e.message); }
    }, 60);
  };
  s.onerror = function(){
    mapStat(label + ' SDK 被阻止加载（预览环境 CSP 或断网）', true);
    const other = name === 'amap' ? 'tianditu' : 'amap';
    if (!autoTried[other]){
      autoTried[other] = true;
      setTimeout(function(){ toast('自动切换到' + labelOf(other) + '底图'); loadProvider(other); }, 600);
    } else {
      mapFail(label + '脚本没能加载');
    }
  };
  document.head.appendChild(s);
  setTimeout(function(){
    if (!mapReady && provider === name) mapStat(label + '初始化超时，可点上方「地图底图」换一家', true);
  }, 12000);
}

function destroyMap(){
  try { if (tmap){ tmap.clearOverLays(); if (tmap.destroy) tmap.destroy(); } } catch (e) {}
  try { if (amap){ amap.clearMap(); if (amap.destroy) amap.destroy(); } } catch (e) {}
  tmap = null; amap = null; mapReady = false;
  const box = $('#map');
  if (box) box.innerHTML = '';
}

function initProvider(name){
  destroyMap();
  if (name === 'tianditu'){
    if (!window.T || !window.T.Map){ mapStat('天地图 SDK 里没有 T.Map', true); mapFail('天地图 SDK 未就绪'); return; }
    mapStat('正在创建地图实例…');
    tmap = new T.Map('map');
    tmap.centerAndZoom(new T.LngLat(116.397, 39.909), 10);
    mapReady = true;
    refreshMap();
    mapStat('等待底图瓦片…');
    setTimeout(checkTiles, 3000);
    setTimeout(checkTiles, 7000);
  } else {
    if (!window.AMap || !window.AMap.Map){ mapStat('高德 SDK 里没有 AMap.Map', true); mapFail('高德 SDK 未就绪'); return; }
    mapStat('正在创建地图实例…');
    amap = new AMap.Map('map', { zoom: 10, center: [116.397, 39.909], viewMode: '2D', resizeEnable: true });
    mapReady = true;
    refreshMap();
    mapStat('等待底图瓦片…');
    setTimeout(checkTiles, 3000);
    setTimeout(checkTiles, 7000);
  }
}

/* 看容器里有没有真的画出瓦片（天地图是 img，高德 2.0 是 canvas） */
function checkTiles(){
  if (!mapReady) return;
  const box = $('#map');
  if (!box) return;
  if (box.querySelectorAll('img,canvas').length > 0){ mapStat(''); return; }
  mapStat(labelOf(provider) + '底图瓦片没渲染出来 · 可点上方「地图底图」换一家', true);
}

function mapFail(msg){
  const box = $('#map');
  if (!box) return;
  const isAmap = provider === 'amap';
  box.innerHTML = '<div class="mapfail"><b>' + (isAmap ? '高德' : '天地图') + '地图没加载出来</b>' +
    (msg ? '（' + msg + '）' : '') +
    '<div style="text-align:left;max-width:520px;margin:14px auto 0">' +
    (isAmap
      ? '<div style="margin-bottom:10px">常见原因：这个高德 key 的「服务平台」里没有勾选 <b>Web端(JS API)</b>，只开了 Web服务；或者新版 key 需要「安全密钥」。</div>' +
        '<div style="margin-bottom:10px">去高德控制台 → 应用管理 → 这个 key → 编辑，把服务平台加上「Web端(JS API)」；如有安全密钥，填到 app.js 的 <b>AMAP_SECURITY</b>。</div>'
      : '<div style="margin-bottom:10px">常见原因：这个 tk 开了「安全密钥 / 安全核验」。开启后连底图瓦片都要带 sk 签名，而签名必须放在服务端做，静态页面里用不了。</div>' +
        '<div style="margin-bottom:10px">控制台 → 应用管理 → 应用设置 → 把「安全密钥」开关关掉；或新建一个「浏览器端」key 不开安全密钥，填到 <b>TD_TK</b>。</div>') +
    '<div style="color:#A69C8D">也可以点页面右上角「地图底图」按钮，换另一家试试。</div>' +
    '<div style="margin-top:10px;padding-top:10px;border-top:1px dashed #D6CBB8;color:#5C564D">' +
    '如果是在应用内预览窗口打开的，试着用浏览器<b>直接打开这个 html 文件</b>（双击 index.html）——预览窗口可能限制了外部脚本，直开通常就正常了。</div>' +
    '</div>' +
    '<button onclick="location.reload()" style="margin-top:14px;padding:7px 16px;border:1px solid #D6CBB8;' +
    'border-radius:8px;background:#fff;font-size:12.5px;cursor:pointer">重新加载</button>' +
    '<div style="margin-top:12px;color:#A69C8D">下方的行程规划、时间计算不受影响。</div></div>';
}

/* ---------- 天地图渲染 ---------- */
function tPin(text, color, small){
  const w = small ? 16 : 26, h = small ? 16 : 34;
  const svg = small
    ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">' +
      '<circle cx="8" cy="8" r="6" fill="' + color + '" stroke="#fff" stroke-width="2"/></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="34" viewBox="0 0 26 34">' +
      '<path d="M13 1C6.4 1 1 6.4 1 13c0 8.6 12 20 12 20s12-11.4 12-20C25 6.4 19.6 1 13 1z" ' +
      'fill="' + color + '" stroke="#fff" stroke-width="2"/>' +
      '<text x="13" y="17.5" font-size="11" font-family="Arial,Helvetica,sans-serif" ' +
      'font-weight="700" text-anchor="middle" fill="#fff">' + text + '</text></svg>';
  try {
    return new T.Icon({
      iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg),
      iconSize: new T.Point(w, h),
      iconAnchor: new T.Point(w / 2, small ? h / 2 : h)
    });
  } catch (e) { return null; }
}
function tMarker(p, icon, place){
  const pos = new T.LngLat(p[0], p[1]);
  let m;
  try { m = new T.Marker(pos, icon ? { icon: icon } : {}); }
  catch (e) { m = new T.Marker(pos); }
  tmap.addOverLay(m);
  if (place) m.addEventListener('click', function(){ openModal(place.id); });
}

/* ---------- 高德渲染 ---------- */
function aPin(text, color, small){
  if (small){
    return '<div style="width:14px;height:14px;border-radius:50%;background:' + color +
      ';border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>';
  }
  return '<div style="width:26px;height:26px;border-radius:50%;background:' + color +
    ';color:#fff;font:600 12px/26px Arial,sans-serif;text-align:center;border:2px solid #fff;' +
    'box-shadow:0 2px 6px rgba(0,0,0,.28)">' + text + '</div>';
}
function aMarker(p, html, place, small){
  const off = small ? -7 : -13;
  const m = new AMap.Marker({
    position: p, content: html, offset: new AMap.Pixel(off, off),
    zIndex: place ? 110 : 120, map: amap
  });
  if (place) m.on('click', function(){ openModal(place.id); });
  return m;
}

/* ---------- 统一刷新 ---------- */
function refreshMap(){
  if (provider === 'amap'){ if (amap) refreshAmap(); }
  else { if (tmap) refreshTmap(); }
}

function routeData(){
  const st = STARTS[state.start];
  const pts = [xy(st)];
  const seq = [];
  const plan = state.plan;
  if (plan && plan.days && plan.days.length){
    plan.days.forEach(function(day){
      day.items.filter(function(i){ return !i.meal; }).forEach(function(it){
        pts.push(xy(it.p));
        seq.push(it.p);
      });
    });
    return { pts: pts, seq: seq, total: plan.sum.km, path: buildRealPath(plan) };
  }
  filtered().slice(0, 80).forEach(function(p){ pts.push(xy(p)); seq.push(p); });
  return { pts: pts, seq: seq, total: null, path: null };
}

function refreshTmap(){
  try { tmap.clearOverLays(); } catch (e) {}
  const d = routeData();
  tMarker(d.pts[0], tPin('起', '#23201C'), null);
  d.seq.forEach(function(p, i){ tMarker(xy(p), tPin(String(i + 1), '#B33A2B'), p); });
  if (d.total !== null && d.pts.length > 1){
    const line = (d.path && d.path.length > 1) ? d.path : d.pts;
    try { tmap.addOverLay(new T.Polyline(line.map(function(c){ return new T.LngLat(c[0], c[1]); }),
      { color: '#B33A2B', weight: 5, opacity: 0.85 })); } catch (e) {}
  }
  try {
    const latlngs = d.pts.map(function(c){ return new T.LngLat(c[0], c[1]); });
    if (latlngs.length > 1) tmap.setViewport(latlngs);
    else tmap.centerAndZoom(latlngs[0], 12);
  } catch (e) { tmap.centerAndZoom(new T.LngLat(116.397, 39.909), 10); }
  setMapHint(d);
}

function refreshAmap(){
  try { amap.clearMap(); } catch (e) {}
  const d = routeData();
  aMarker(d.pts[0], aPin('起', '#23201C'), null);
  d.seq.forEach(function(p, i){ aMarker(xy(p), aPin(String(i + 1), '#B33A2B'), p); });
  if (d.total !== null && d.pts.length > 1){
    const src = (d.path && d.path.length > 1) ? d.path : null;
    const line = src ? src.map(function(c){ return wgs2gcj(c[0], c[1]); }) : d.pts;
    new AMap.Polyline({
      path: line, strokeColor: '#B33A2B', strokeWeight: 5, strokeOpacity: 0.85,
      lineJoin: 'round', showDir: true, map: amap
    });
  }
  try {
    if (d.pts.length > 1) amap.setFitView(null, false, [50, 50, 50, 50], 14);
    else amap.setZoomAndCenter(12, d.pts[0]);
  } catch (e) {}
  setMapHint(d);
}

function setMapHint(d){
  const hint = $('#mapHint');
  if (!hint) return;
  const name = provider === 'amap' ? '高德' : '天地图';
  if (d.total !== null) hint.textContent = name + ' · 共 ' + d.seq.length + ' 站 · ' + d.total + ' 公里';
  else hint.textContent = name + ' · 当前筛选的 ' + d.seq.length + ' 个地方';
}

/* 初始化入口：读上次选择 */
function initMapLayer(){
  try {
    const saved = localStorage.getItem('bjmap');
    if (saved === 'amap' || saved === 'tianditu') provider = saved;
  } catch (e) {}
  loadProvider(provider);
}

/* ---------- 天地图驾车规划：把行程变成真实路线 ---------- */
const TD_DRIVE = 'https://api.tianditu.gov.cn/drive?type=search&tk=' + TD_TK + '&postStr=';

function parseDriveXml(txt){
  try {
    if (!txt || txt.indexOf('<result') < 0) return null;
    const doc = new DOMParser().parseFromString(txt, 'text/xml');
    const line = doc.querySelector('routelatlon');
    if (!line || !line.textContent) return null;
    const pts = line.textContent.split(';').map(function(x){
      const a = x.split(',');
      return [parseFloat(a[0]), parseFloat(a[1])];
    }).filter(function(q){ return isFinite(q[0]) && isFinite(q[1]); });
    if (pts.length < 2) return null;
    const dEl = doc.querySelector('distance');
    const tEl = doc.querySelector('duration');
    const km = dEl ? parseFloat(dEl.textContent) : null;
    const sec = tEl ? parseFloat(tEl.textContent) : null;
    return {
      points: pts,
      km: (km != null && isFinite(km)) ? Math.round(km * 10) / 10 : null,
      min: (sec != null && isFinite(sec)) ? Math.max(1, Math.round(sec / 60)) : null
    };
  } catch (e) { return null; }
}

/* 天地图 WAF 会拦全编码的 URL，这里只把引号转成 %22，花括号保留 */
function fetchRoute(a, b){
  const body = JSON.stringify({
    orig: a.lng + ',' + a.lat,
    dest: b.lng + ',' + b.lat,
    style: '0'
  }).replace(/"/g, '%22');
  return fetch(TD_DRIVE + body, { cache: 'no-store' })
    .then(function(r){ return r.text(); })
    .then(function(t){ return parseDriveXml(t); })
    .catch(function(){ return null; });
}

function planLegs(plan){
  const st = STARTS[state.start];
  const legs = [];
  let prev = { id: 'S:' + state.start, lat: st.lat, lng: st.lng };
  plan.days.forEach(function(day){
    day.items.filter(function(i){ return !i.meal; }).forEach(function(it){
      legs.push([prev, it.p]);
      prev = it.p;
    });
  });
  return legs;
}

function buildRealPath(plan){
  const st = STARTS[state.start];
  let prev = { id: 'S:' + state.start, lat: st.lat, lng: st.lng };
  const out = [[st.lng, st.lat]];
  let any = false;
  plan.days.forEach(function(day){
    day.items.filter(function(i){ return !i.meal; }).forEach(function(it){
      const c = ROUTE_CACHE[rkey(prev, it.p)];
      if (c && c.points && c.points.length){
        c.points.forEach(function(q){ out.push(q); });
        any = true;
      } else {
        out.push([it.p.lng, it.p.lat]);
      }
      prev = it.p;
    });
  });
  return any ? out : null;
}

function routeNote(msg, bad){
  const el = $('#routeNote');
  if (!el) return;
  if (!msg){ el.style.display = 'none'; return; }
  el.style.display = 'block';
  el.textContent = msg;
  el.className = 'routenote' + (bad ? ' bad' : '');
}

let enriching = false;
function enrichRoutes(plan){
  if (enriching || !plan) return;
  const todo = planLegs(plan).filter(function(l){
    const k = rkey(l[0], l[1]);
    return !ROUTE_CACHE[k] && !ROUTE_FAIL[k];
  });
  if (!todo.length) return;
  enriching = true;
  routeNote('正在规划真实驾车路线…（' + todo.length + ' 段）');
  let i = 0, ok = 0;
  const step = function(){
    if (i >= todo.length){
      enriching = false;
      if (ok){ buildAndRender(); routeNote('已按真实驾车路线更新 · ' + ok + ' 段'); }
      else { routeNote('路线规划没取到数据，已退回直线估算', true); }
      return;
    }
    const pair = todo[i++];
    fetchRoute(pair[0], pair[1]).then(function(r){
      const k = rkey(pair[0], pair[1]);
      if (r){ ROUTE_CACHE[k] = r; ok++; } else { ROUTE_FAIL[k] = 1; }
      setTimeout(step, 260);
    });
  };
  step();
}

/* ---------- 实时天气 ----------
   两条数据源依次尝试：UAPI → 高德天气（两个接口分别取实况和预报）
   任一条被跨域策略拦掉，自动换下一条；全失败则降级为静态文案 + 重试按钮 */
const WX_KEY = 'uapi-zkhgeipiZcodo3-VlOAPmVFq64Veb3i3YGrQvY1_';
const AMAP_WX = 'https://restapi.amap.com/v3/weather/weatherInfo?key=' + AMAP_KEY + '&city=110000&extensions=';

function ymd(d){
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') +
    '-' + String(d.getDate()).padStart(2, '0');
}

const WX_SOURCES = [
  {
    name: 'UAPI',
    load: function(){
      const url = 'https://uapis.cn/api/v1/misc/weather?city=' + encodeURIComponent('北京') +
        '&extended=true&forecast=true&key=' + encodeURIComponent(WX_KEY);
      return fetch(url, { cache: 'no-store' }).then(function(r){ return r.json(); })
        .then(function(d){
          if (!d || !d.weather) return null;
          return {
            city: d.city || '北京',
            weather: d.weather,
            temperature: d.temperature,
            aqi: d.aqi,
            aqi_category: d.aqi_category || '',
            alert: (d.alerts && d.alerts.length) ? d.alerts[0].title : '',
            forecast: (d.forecast || []).map(function(x){
              return { date: x.date, weather_day: x.weather_day, temp_min: x.temp_min, temp_max: x.temp_max };
            })
          };
        });
    }
  },
  {
    name: '高德',
    load: function(){
      const base = fetch(AMAP_WX + 'base', { cache: 'no-store' })
        .then(function(r){ return r.json(); }).catch(function(){ return null; });
      const all = fetch(AMAP_WX + 'all', { cache: 'no-store' })
        .then(function(r){ return r.json(); }).catch(function(){ return null; });
      return Promise.all([base, all]).then(function(res){
        const live = (res[0] && res[0].status === '1' && res[0].lives) ? res[0].lives[0] : null;
        const fc = (res[1] && res[1].status === '1' && res[1].forecasts) ? res[1].forecasts[0] : null;
        if (!live && !fc) return null;
        return {
          city: live ? live.city : '北京',
          weather: live ? live.weather : (fc && fc.casts[0] ? fc.casts[0].dayweather : ''),
          temperature: live ? Number(live.temperature) : null,
          aqi: null,
          aqi_category: '',
          alert: '',
          forecast: (fc ? fc.casts : []).map(function(c){
            return { date: c.date, weather_day: c.dayweather, temp_min: Number(c.nighttemp), temp_max: Number(c.daytemp) };
          })
        };
      });
    }
  }
];

function loadWeather(i){
  const idx = i || 0;
  if (idx >= WX_SOURCES.length){ wxFallback(); return; }
  WX_SOURCES[idx].load()
    .then(function(w){ if (w) renderWeather(w); else loadWeather(idx + 1); })
    .catch(function(){ loadWeather(idx + 1); });
}

function wxFallback(){
  const t = $('#wxText');
  if (!t) return;
  t.innerHTML = '<span class="wx-line" style="color:#8E877C">实时天气获取失败，' +
    '<a href="javascript:;" id="wxRetry" style="color:#B33A2B;text-decoration:underline">重试</a></span>' +
    '<span class="wx-line sub">周六晴 4–14℃ · 周日多云转小雨 3–11℃</span>';
  const b = $('#wxRetry');
  if (b) b.onclick = function(e){ e.preventDefault(); loadWeather(0); };
}

function renderWeather(w){
  const label = $('#wxLabel'), temp = $('#wxTemp'), txt = $('#wxText');
  if (label) label.textContent = String(w.city || '北京').replace(/市$/, '') + (w.weather ? ' · ' + w.weather : '');
  if (temp) temp.innerHTML = (w.temperature != null ? Math.round(w.temperature) : '--') + '<em>°</em>';

  const f = w.forecast || [];
  const satDate = ymd(BASE), sunDate = ymd(new Date(BASE.getTime() + 86400000));
  const find = function(date, i2){
    const hit = f.filter(function(x){ return x.date === date; })[0];
    return hit || f[i2] || null;
  };
  const fmt = function(x, name){
    if (!x) return '';
    const md = String(x.date || '').slice(5).replace('-', '/');
    return name + ' ' + md + ' ' + (x.weather_day || '') + ' ' + x.temp_min + '–' + x.temp_max + '℃';
  };
  const line1 = [fmt(find(satDate, 1), '周六'), fmt(find(sunDate, 2), '周日')].filter(Boolean).join('　');

  const bits = [];
  if (w.aqi != null) bits.push('AQI ' + w.aqi + (w.aqi_category ? ' ' + w.aqi_category : ''));
  if (w.alert) bits.push('<span class="wx-alert">⚠ ' + w.alert + '</span>');

  if (txt){
    txt.innerHTML = '<span class="wx-line">' + (line1 || '—') + '</span>' +
      (bits.length ? '<span class="wx-line sub">' + bits.join('<span class="wx-dot">·</span>') + '</span>' : '');
  }
}

/* ---------- AI 规划（Agnes 网关，OpenAI 兼容协议） ----------
   注意：key 在前端是明文，仅适合本机自用；对外发布请改走后端代理 */
const DS_KEY = 'sk-RviZSlPRc9mAo26oEApJET741PEGBY8Al8J3rVfgrpPLdrrX';
const DS_API = 'https://apihub.agnes-ai.com/v1/chat/completions';
/* 用 flash 而不是 pro：pro 是推理模型，会先输出一大段思考过程再给答案，
   token 消耗高、延迟也长；flash 不思考，直接吐 JSON，规划这种结构化任务够用 */
const DS_MODEL = 'agnes-3.0-flash';

const AI_SYS = [
  '你是北京本地行程规划师。给定出发地、日期、每天可用小时数，以及一组候选景点（含经纬度、建议停留时长、开放时间、是否周一闭馆），请把它们分配到各天，并在每天内部排出顺路顺序。',
  '硬性要求：',
  '1. 只能使用给定景点的 id，必须原样返回，不得新增、不得重复、不得遗漏。',
  '2. 每天总耗时（停留 + 路上）不超过给定小时数。路上时间按直线距离粗估：市区 3 分钟/公里，郊区 2 分钟/公里。',
  '3. 周一闭馆的景点不得排在周一。',
  '4. 同一天尽量安排地理位置相近的景点，避免穿城往返。',
  '5. 只输出 JSON，不要任何解释文字。格式：{"days":[{"stops":["id1","id2"],"note":"当天思路，20字内"}],"summary":"整体思路，40字内"}'
].join('\n');

function aiBrief(){
  const st = STARTS[state.start];
  const dates = [];
  for (let i = 0; i < state.days; i++) dates.push(dateLabel(i));
  return {
    出发地: st.n,
    出发地坐标: [+st.lat.toFixed(4), +st.lng.toFixed(4)],
    日期: dates,
    每天可用小时: state.hours,
    景点: state.picked.map(function(id){
      const p = P[id];
      return {
        id: p.id, 名称: p.n, 片区: p.d, 类型: p.c,
        坐标: [+p.lat.toFixed(4), +p.lng.toFixed(4)],
        建议停留小时: Math.round(p.dur / 6) / 10,
        门票: p.p,
        开放: p.o ? fmt(p.o) + '-' + fmt(p.cl) : '全天',
        周一闭馆: !!p.mo,
        室内: !!p.in
      };
    })
  };
}

function applyAiPlan(obj){
  if (!obj || !obj.days || !obj.days.length) throw new Error('返回格式不对');
  const valid = {};
  state.picked.forEach(function(id){ valid[id] = 1; });
  const flat = [], dayOf = {}, notes = [];
  obj.days.forEach(function(d, di){
    (d.stops || []).forEach(function(id){
      if (valid[id] && dayOf[id] === undefined){ dayOf[id] = di; flat.push(id); }
    });
    if (d.note) notes.push('第' + (di + 1) + '天 ' + d.note);
  });
  state.picked.forEach(function(id){
    if (dayOf[id] === undefined){ dayOf[id] = Math.max(0, obj.days.length - 1); flat.push(id); }
  });
  if (!flat.length) throw new Error('没有有效景点');
  state.picked = flat;
  state.dayOf = dayOf;
  state.autoOrder = false;
  state.days = Math.min(3, Math.max(1, obj.days.length));
  state.aiNote = (obj.summary || '') + (notes.length ? '｜' + notes.join('｜') : '');
  renderPicked();
  buildAndRender();
  toast('AI 已重排行程');
}

let aiBusy = false;
function aiPlan(){
  if (aiBusy) return;
  if (state.picked.length < 2){ toast('至少选两个地方'); return; }
  aiBusy = true;
  const btn = $('#aiPlan');
  if (btn){ btn.disabled = true; btn.textContent = 'AI 思考中…'; }
  const body = {
    model: DS_MODEL,
    messages: [
      { role: 'system', content: AI_SYS },
      { role: 'user', content: JSON.stringify(aiBrief()) }
    ],
    temperature: 0.3,
    max_tokens: 2000,
    response_format: { type: 'json_object' }
  };
  fetch(DS_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + DS_KEY },
    body: JSON.stringify(body)
  })
    .then(function(r){
      if (!r.ok) return r.text().then(function(t){ throw new Error('HTTP ' + r.status + ' ' + String(t).slice(0, 100)); });
      return r.json();
    })
    .then(function(d){
      let txt = d && d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content;
      if (!txt) throw new Error('返回内容为空');
      // 有的网关会把 JSON 包在 ```json 代码块里，剥掉再解析
      txt = String(txt).trim().replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();
      const s0 = txt.indexOf('{'), e0 = txt.lastIndexOf('}');
      if (s0 >= 0 && e0 > s0) txt = txt.slice(s0, e0 + 1);
      applyAiPlan(JSON.parse(txt));
    })
    .catch(function(e){
      toast('AI 规划失败：' + e.message);
      routeNote('AI 规划没成功，已保留本地顺路结果', true);
    })
    .then(function(){
      aiBusy = false;
      if (btn){ btn.disabled = false; btn.textContent = 'AI 规划'; }
    });
}

function renderMall(){
  const g = $('#mallGrid');
  if (!g) return;
  g.innerHTML = MALLS.map(function(m){
    return '<div class="food"><div class="h"><b>' + m.n + '</b><em class="tagm">' + m.t + '</em></div>' +
      '<div class="m"><span>' + m.a + '区</span></div>' +
      '<div class="d">' + m.d + '</div>' +
      '<a class="go" href="' + DP(m.n) + '" target="_blank" rel="noopener">大众点评 · 看评价 →</a></div>';
  }).join('');
}

/* ---------- 初始化 ---------- */
function init(){
  renderChips();
  renderSorts();
  const sel = $('#start');
  Object.keys(STARTS).forEach(k => sel.appendChild(new Option(STARTS[k].n, k)));
  sel.value = state.start;
  renderGrid(); renderPicked(); renderFood(); renderMall();
  loadWeather();
  setInterval(loadWeather, 600000);
  initMapLayer();
  const sw = $('#mapSwitch');
  if (sw) [].forEach.call(sw.children, function(b){
    b.onclick = function(){
      if (b.dataset.p === provider) return;
      try { localStorage.setItem('bjmap', b.dataset.p); } catch (e) {}
      loadProvider(b.dataset.p);
    };
  });
  $('#mapToggle').onclick = e => {
    const card = $('#mapCard');
    card.classList.toggle('fold');
    const folded = card.classList.contains('fold');
    e.target.textContent = folded ? '展开' : '收起';
    if (!folded) setTimeout(function(){ if (tmap && tmap.checkResize) tmap.checkResize(); if (amap && amap.resize) amap.resize(); }, 60);
  };

  $('#q').oninput = e => { state.q = e.target.value.trim(); renderGrid(); };
  $('#area').onchange = e => { state.area = e.target.value; renderGrid(); };
  $('#toggleFree').onclick = e => {
    state.free = !state.free; e.target.style.background = state.free ? '#23201C' : '#fff';
    e.target.style.color = state.free ? '#fff' : '#23201C';
    e.target.style.borderColor = state.free ? '#23201C' : '#D6CBB8';
    renderGrid();
  };
  $('#toggleIndoor').onclick = e => {
    state.indoor = !state.indoor; e.target.style.background = state.indoor ? '#23201C' : '#fff';
    e.target.style.color = state.indoor ? '#fff' : '#23201C';
    e.target.style.borderColor = state.indoor ? '#23201C' : '#D6CBB8';
    renderGrid();
  };
  $('#start').onchange = e => { state.start = e.target.value; renderGrid(); if (state.picked.length) buildAndRender(); };
  $('#startTime').onchange = e => { state.startTime = e.target.value; if (state.picked.length) buildAndRender(); };
  $('#days').onchange = e => { state.days = +e.target.value; if (state.picked.length) buildAndRender(); };
  $('#hours').onchange = e => { state.hours = +e.target.value; if (state.picked.length) buildAndRender(); };
  $('#plan').onclick = () => {
    if (!state.picked.length){ toast('先选几个地方'); return; }
    buildAndRender(); toast('已按顺路顺序排好');
  };
  $('#aiPlan').onclick = () => aiPlan();
  $('#optimize').onclick = () => {
    if (!state.picked.length){ toast('先选几个地方'); return; }
    const order = optimizeRoute(state.picked.map(id => P[id]), STARTS[state.start]);
    state.picked = order.map(p => p.id);
    state.dayOf = null; state.autoOrder = true; state.aiNote = '';
    renderPicked(); buildAndRender(); toast('已按顺路重排');
  };
  $('#clear').onclick = () => {
    state.picked = []; state.plan = null; renderPicked(); renderGrid();
    $('#result').innerHTML = emptyHtml();
    refreshMap();
  };
  $('#preset1').onclick = () => preset(['gugong','jingshan','nanluoguxiang','shichahai','tiantan']);
  $('#preset2').onclick = () => preset(['zhihuasi','mingchengqiang','fayuansi','yangmeizhu','dazhongsi','shoubo','wudaoying']);

  $('#mask').onclick = e => { if (e.target.id === 'mask') closeModal(); };
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  $('#fab').onclick = () => setSheet(!$('#planner').classList.contains('open'));
  $('#closePlanner').onclick = () => setSheet(false);
  const sm = $('#sheetMask');
  if (sm) sm.onclick = () => setSheet(false);
  if (window.innerWidth <= 1180) $('#closePlanner').style.display = 'block';
  window.addEventListener('resize', () => {
    $('#closePlanner').style.display = window.innerWidth <= 1180 ? 'block' : 'none';
  });
}
function setSheet(open){
  const p = $('#planner'), m = $('#sheetMask');
  if (!p) return;
  if (open){ p.classList.add('open'); if (m) m.classList.add('on'); }
  else { p.classList.remove('open'); if (m) m.classList.remove('on'); }
}

function preset(ids){
  state.dayOf = null; state.autoOrder = true; state.aiNote = '';
  state.picked = ids.slice();
  renderPicked(); renderGrid(); buildAndRender();
  toast('已生成推荐行程');
  if (window.innerWidth <= 1180) setSheet(true);
}
document.addEventListener('DOMContentLoaded', init);
