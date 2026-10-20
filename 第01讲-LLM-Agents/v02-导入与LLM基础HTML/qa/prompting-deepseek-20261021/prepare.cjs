const fs=require('fs'),path=require('path'),vm=require('vm');
const here=__dirname,root=path.resolve(here,'../..'),w={};
vm.runInNewContext(fs.readFileSync(path.join(root,'src/prompting-r2-data.js'),'utf8'),{window:w});
const d=w.MBA_PROMPTING_R2,queue=[],objects=[];
const tpl=(i,values)=>{let n=0;const result=d.prompts[i].prompt.replace(/【[^】]*】/g,()=>values[n++]);if(n!==values.length)throw Error(`template ${i}: ${n}/${values.length}`);return result;};
function add(strategy,id,object,simple,strong,facts={}){
  objects.push({strategy,id,object,facts});
  queue.push({key:`${strategy}/${id}/simple`,strategy,object,variant:'simple',prompt:simple});
  queue.push({key:`${strategy}/${id}/strategy`,strategy,object,variant:'strategy',prompt:strong});
}
function four(id,object,goal,example){
  add('four-elements',id,object,`请解释一下${object}。`,
  `你是一名擅长给非金融专业人士讲清金融概念的教师。\n\n我是一名MBA课程教师，学生有工作经验，但没有系统学过金融，容易把术语记住却不会判断实际例子。\n\n${goal}\n\n${example}`);
}
four('compound','复利','请准备一段5分钟课堂讲解，让学生能区分单利与复利，理解收益率变化和亏损为什么影响最后金额。先给一句话解释，再用同一笔10000元的两年计算串起来，最后给两个判断时要问的问题。','参考这种表达：“先说明钱发生了什么变化，再列出计算，最后说明这个计算没有告诉我们什么。”不要将假设收益率写成现实承诺。');
four('etf','股票指数ETF','请准备一段5分钟课堂讲解，让学生理解一篮子股票、指数、基金份额之间的关系，以及为什么分散持仓仍会亏损。用同一位人物买入1000元基金份额的例子，依次说明买到了什么、价格为何变化、怎样比较两只跟踪同一指数的ETF。','参考这种表达：“先讲人物做了什么，再说明背后的机制，最后指出容易误解的地方。”结尾给出三个比较ETF时需要查明的问题。');
const earnings='课堂虚构财报：青禾饮品上半年营收12亿元，上年同期10亿元；净利润0.9亿元，上年同期1亿元；经营活动现金流净额0.4亿元，上年同期0.8亿元。公司称收入增长主要来自新店，利润受新店开业费用影响。材料未提供同店销售、单店利润或现金流明细。';
const example='参考示例：\n【变化】北山零售收入增长，但回款没有同步增加。\n【数字】收入从5亿元增至6亿元，增长20%；经营现金流从0.5亿元降至0.3亿元。\n【别急着下结论】收入增长不等于已收回现金，现有数字不能解释全部原因。\n【下一步看什么】继续核查应收账款、存货和结算条款。';
add('give-example','earnings','上市公司财报快讯',earnings+'\n请写一则面向普通读者的财报快讯。',earnings+'\n\n'+example+'\n\n参考这个示例的四段结构、简洁语气、数字表达和“已知变化—尚缺证据”的对应关系，写一则青禾饮品财报快讯。不要沿用示例中的公司和数字。');
const coffee='一家咖啡店将于下周一上线手机提前点单：到店前可选门店和取餐时间，付款后获得取餐码，到店在取餐架核对号码。暂不提供配送，原来的柜台点单继续保留。请写一则给老顾客的通知。';
add('give-example','pickup','咖啡店手机点单通知',coffee,coffee+'\n\n参考示例：\n标题：出门前点好，到店少等一会儿\n现在可以：在手机上选好饮品和取餐时间。\n开始前：确认门店和订单，付款后保存取餐码。\n开放时间：下周一开始，柜台点单照常。\n\n参考这个示例的标题、三段结构和具体动作表达，重新写通知；准确保留新功能的范围。');
const report='课堂虚构数据，单位均为亿元。两家餐饮上市公司属于同一细分行业：甲公司上年/本年营收100/120，净利润10/13，经营活动现金流净额12/5，购建长期资产支付现金8/15，有息负债30/55；乙公司上年/本年营收100/108，净利润10/10.5，经营活动现金流净额12/13，购建长期资产支付现金8/9，有息负债30/28。未提供股价、估值、现金余额、应收与存货明细、一次性损益和新店开业时间。';
const renovation='课堂假设：一家三口准备装修一套90平方米二手房，计划总支出不超过20万元，四个月后入住。需要厨房、卫生间和两个卧室，现有中央空调能用。收到的装修报价还不完整，不知道拆除、水电、主材、家电、家具和临时租房是否都包含。希望先形成可用于和装修公司讨论的预算方案，不虚构当地市场单价。';
function meta(id,object,draft,background){
 let n=0;const values=['DeepSeek',draft,background];
 const strong=d.metaprompt.replace(/【[^】]*】/g,()=>values[n++]);
 add('model-write-prompt',id,object,draft+'\n\n背景、目标和参考示例：'+background,strong,{reply:'尚未提供的信息都保留为待确认，不替我编造。请只依据已有材料给出完整可复制Prompt，并明确哪些是事实、哪些是建议。'});
}
meta('earnings','两家上市公司的财报比较','帮我分析这两家公司的财报，准备给MBA同学讲。',report+'讲解面向没有财务专业背景的同学，希望他们能看出增长、利润、现金之间的关系，并知道还需要哪些证据。不是给出买卖股票结论。参考表达：“看到的变化—可能解释—还缺什么证据”。');
meta('renovation','家庭装修预算','帮我做一份装修预算方案。',renovation+'希望用表格讨论钱的用途、报价缺项和需要决定的事；具体分项上限尚未确认。');
const tea='课堂设定：一家奶茶店最近四周营业额比前四周低15%。老板注意到客单价从18元涨到20元，因此认为是涨价吓跑顾客，准备把所有饮品降回原价。我想知道是不是应该马上降价。';
const fund='课堂设定：一位投资者看到自己的股票基金组合近三个月收益为-6%，认为自己选得差，准备全部换成同一期间收益最高的基金。他希望通过换基金尽快追回亏损，但还没认真比较市场基准和资金使用期限。我想判断这个决定是否合理。';
add('socratic','tea','奶茶店营收下降',tea+'\n请给我分析和建议。',tpl(0,[tea]),{answers:['这段时间门前道路施工，午间经过门店的人明显减少；外卖订单也有下降。','现有记录显示，进店人数下降约25%，进店后的购买比例差不多，客单价约从18元到20元。','没有按同一批顾客或相同产品比较，产品组合和优惠券也变了，所以平均客单价变化不等于所有产品都涨了同样幅度。','目标是未来一个月保住贡献利润，施工预计再持续六周；不能只靠降价增加杯数。','可以先调整路口指引和到店自提说明，预算1000元，两周观察；各产品成本和毛利可以从收银记录核算。']});
add('socratic','fund','基金亏损后是否追逐冠军',fund+'\n请给我分析和建议。',tpl(0,[fund]),{answers:['投资者原本想五年后用于教育支出，没有近期支出；这笔基金占家庭金融资产的20%，其他主要是现金和存款，没有借钱投资。','这三个月同类基金对应的宽基市场指数跌了10%，他没算过组合相对基准的收益。','最近一年的收益和风险也没对齐；他看到的冠军主要集中在一种热门行业，和当前宽基组合不同。','真正目标是为五年后的教育支出积累资金，不是必须在下个月回本。','目前没有预先规定的资产比例或复核规则，家人可承受的波动范围也没有认真讨论。']});
for(const [id,obj] of [['pe','市盈率（P/E）：股票价格和公司盈利之间是什么关系'],['bond','为什么市场利率上升时，已发行的固定利率债券价格往往下跌']])
 add('two-layer',id,obj,'请解释'+obj+'。',tpl(1,[obj]));
const note='课堂样稿：青禾饮品收入增长20%，但净利润下降10%，经营现金流减少一半。先看收入：新店扩张可以推高总收入，不能据此认定老店卖得更好。再看利润：开店费用可能压低当期利润，但需要拆开经常性经营和一次性影响。最后看现金：利润还没有完全变成现金，具体原因要查应收、存货和付款节奏。我们暂不判断股票贵不贵，下一步先对照同店销售、新店成熟周期和现金流附注。';
const promo='课堂样稿：周三午后，给自己留十分钟。14:00—17:00，到店美式咖啡9.9元。适合下午想提神、又不想排长队的人。手机下单后按取餐码领取，每人限两杯，售完即止。今天不顺路也没关系，先收藏门店，下次路过再喝。';
add('reverse-deconstruction','financial-note','通俗财报解读短文','请分析这段财报解读写得怎么样：\n'+note,tpl(2,[note,'学会把陌生公司的财报写成普通读者看得懂、又不把推测当事实的短评']));
add('reverse-deconstruction','promo','咖啡店促销文案','请分析这段促销文案写得怎么样：\n'+promo,tpl(2,[promo,'学会为另一家门店写清消费场景、优惠条件和顾客下一步动作，而不是照抄词句']));
for(const [id,obj] of [['byd','比亚迪：新能源汽车业务与竞争位置'],['moutai','贵州茅台：白酒业务、品牌与渠道模式']])
 add('horizontal-vertical',id,obj,'请分析一下'+obj+'。',tpl(3,[obj]));
const old=JSON.parse(fs.readFileSync(path.join(root,'qa/prompting-demos-r22/browser-run-log.json'),'utf8'));
const oldSimple=(i)=>old[i].prompt;
const expertCoffee=oldSimple(32).replace(/\n请[\s\S]*$/,'');
const apparel='课堂设定：一家服装店有一批季节性外套，账面采购成本30万元，当前库存1000件。现价每件600元，近四周每周售出50件；两个月后进入换季。可以全店降价，也可以只对老顾客做定向组合优惠。店主希望八周内改善现金流，又担心公开打折损害老顾客信任和以后原价销售。没有分清款式、尺码和顾客的销量差异；不能追加采购预算。';
add('expert-consultation','coffee','咖啡店接入外卖',oldSimple(32),tpl(5,[expertCoffee]));
add('expert-consultation','apparel','服装店降价清库存',apparel+'\n请给我一个解决方案。',tpl(5,[apparel]));
const cash='课堂假设：一家小型食品批发企业今年前三季度净利润从60万元增加到90万元，但银行账户余额从100万元降到40万元。同期应收账款增加80万元、存货增加50万元、应付账款增加20万元；还购入设备30万元，偿还借款10万元。各数均为简化教学数据，未列折旧、税款等其他变化。老板认为“既然赚钱更多，就可以再铺一轮货”，却开始担心下个月付不出工资。';
add('first-principles','cash','企业利润上升却缺现金',cash+'\n请分析原因并提出办法。',tpl(6,[cash]));
add('first-principles','reports','员工周报负担',oldSimple(38),tpl(6,[oldSimple(38)]));
const pickup='一家写字楼附近餐厅每天午间12点前后有大量顾客来取外卖和自提餐，大家围在同一个柜台询问进度。餐已做好的顾客被尚未完成的订单挡住，店员不断回答“我的好了没”，打包速度也下降。已经贴过“请有序排队”，没有明显改善。不能扩大店面，也不能增加午间员工；可调整标识、取餐区和订单通知，先试一周。';
add('cross-domain','pickup','餐厅午间取餐拥堵',pickup+'\n请提出解决办法。',tpl(7,[pickup]));
add('cross-domain','interrupt','业务专家被频繁打断',oldSimple(40),tpl(7,[oldSimple(40)]));
const buyback='课堂设定：一家成熟上市公司有1亿元计划返还股东的闲置现金，未来一年没有已确定的大型投资项目。董事会在现金分红和股份回购之间二选一。管理层认为股价被低估，但没有展示估值依据；部分长期股东希望稳定现金分红，另一些支持回购减少股数。目标是提高全体股东的长期价值，不是短期拉升股价。当前材料没有公司市值、每股价值区间和债务约束。';
add('steelman','buyback','上市公司分红还是回购',buyback+'\n请比较并给出建议。',tpl(8,[buyback]),{answers:['不能确认股价被低估。董事会目前只拿到了管理层的判断，没有可靠的每股价值区间；公司债务安排允许现金返还，但仍需保留已核准的日常经营资金。','过去五年都有现金分红，部分股东依赖稳定分红；本轮不允许将短期股价目标作为依据。']});
add('steelman','coffee','咖啡店平台促销还是会员',oldSimple(62),tpl(8,[oldSimple(62)]),{answers:['目前不知道最近30天消费过且可直接触达的人数。有1200名同意接收消息的顾客联系方式，但还没与交易记录匹配。平台原每单贡献约8元，本次促销还要每单额外补贴6元；未来三个月固定房租与人员不变。']});
const newsletter='课堂设定：我想做一份面向普通上班族的付费财报阅读通讯，每周用通俗语言讲解一家熟悉的上市公司，定价49元/月。内容只做财报阅读教学，不提供买卖建议。我准备先花六周写好12篇文章、搭建网站再上线，目前只有免费文章的点赞，没有付费用户。我能直接联系12位愿意聊一聊的读者，不知道他们更需要基础概念、具体公司分析还是阅读方法。我想判断是否值得投入。';
const community=oldSimple(64).replace(/\n请[\s\S]*$/,'');
add('minimum-experiment','newsletter','财报阅读付费通讯',newsletter+'\n请分析想法并给我推进方案。',tpl(9,[newsletter,'7天']));
add('minimum-experiment','community','咖啡店主付费社群',community+'\n请分析想法并给我推进方案。',tpl(9,[community,'7天']));
fs.mkdirSync(here,{recursive:true});
fs.writeFileSync(path.join(here,'run-queue.json'),JSON.stringify(queue,null,2)+'\n');
fs.writeFileSync(path.join(here,'candidate-plan.json'),JSON.stringify({date:'2026-10-21',platform:'DeepSeek',source_template_sha256:require('crypto').createHash('sha256').update(fs.readFileSync(path.join(root,'src/prompting-r2-data.js'))).digest('hex'),retained_strategy:'fact-checking',objects},null,2)+'\n');
console.log({objects:objects.length,prompts:queue.length});
