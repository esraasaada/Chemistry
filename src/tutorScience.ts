export type Lang = 'ar' | 'en';
export type Copy = [string, string];
export const tr = (copy: Copy, lang: Lang) => copy[lang === 'ar' ? 0 : 1];

export const topics: { title: Copy; simple: Copy; detail: Copy; example: Copy; keys: RegExp }[] = [
  { title: ['الحموض والقواعد', 'Acids and bases'], keys: /حمض|حموض|قاعد|acid|base/i,
    simple: ['في الماء يزيد حمض أرهينيوس تركيز أيونات الهيدرونيوم، وتزيد قاعدة أرهينيوس تركيز أيونات الهيدروكسيد.', 'In water an Arrhenius acid increases hydronium concentration and an Arrhenius base increases hydroxide concentration.'],
    detail: ['يتفاعل HCl مع الماء مكوّناً H₃O⁺ وCl⁻، بينما يتفكك NaOH إلى Na⁺ وOH⁻.', 'HCl reacts with water to form H₃O⁺ and Cl⁻, while NaOH dissociates into Na⁺ and OH⁻.'],
    example: ['عصير الليمون حمضي، ومحلول بيكربونات الصوديوم قاعدي عادةً.', 'Lemon juice is acidic. An aqueous sodium bicarbonate solution is typically basic.'] },
  { title: ['نظريات الحموض والقواعد', 'Acid–base theories'], keys: /برونستد|لويس|أرهينيوس|bronsted|brønsted|lewis|arrhenius|بروتون|proton/i,
    simple: ['حمض برونستد–لوري يمنح بروتوناً، وقاعدته تستقبل بروتوناً.', 'A Brønsted–Lowry acid donates a proton and a base accepts a proton.'],
    detail: ['حمض لويس يستقبل زوجاً إلكترونياً، وقاعدة لويس تمنحه. يصف نموذج أرهينيوس السلوك في الماء.', 'A Lewis acid accepts an electron pair and a Lewis base donates it. The Arrhenius model describes behavior in water.'],
    example: ['تستقبل الأمونيا NH₃ بروتوناً من الماء وتكوّن NH₄⁺.', 'Ammonia NH₃ accepts a proton from water to form NH₄⁺.'] },
  { title: ['pH وpOH', 'pH and pOH'], keys: /\bp(?:o)?h\b|الهيدروجيني|الهيدروكسيلي|حموضة/i,
    simple: ['في المحاليل المائية عند 25°م، pH + pOH ≈ 14. عند هذه الحرارة قيمة pH أقل من 7 تعني وسطاً حمضياً وأكبر من 7 تعني وسطاً قاعدياً.', 'In water at 25°C, pH + pOH ≈ 14. At this temperature pH below 7 is acidic and pH above 7 is basic.'],
    detail: ['يُعرّف pH بسالب لوغاريتم نشاط الهيدرونيوم. في المحاليل المخففة نقرّبه بالتركيز المولاري، ونقرّب pOH بسالب لوغاريتم تركيز الهيدروكسيد.', 'pH is the negative base-ten logarithm of hydronium activity. In dilute solutions we approximate it using molar concentration, and similarly use hydroxide concentration for pOH.'],
    example: ['إذا كان تركيز الهيدرونيوم 0.001 مول/لتر، فإن pH ≈ 3. ثم نحصل عند 25°م على pOH ≈ 14 − 3 = 11.', 'With 0.001 mol/L hydronium, pH ≈ 3. At 25°C, pOH ≈ 14 − 3 = 11.'] },
  { title: ['القوة والتركيز', 'Strength and concentration'], keys: /قوي|ضعيف|قوة|تأين|strong|weak|strength/i,
    simple: ['القوة تصف مدى التأين، والتركيز يصف كمية المذاب في حجم معين.', 'Strength describes extent of ionization, while concentration describes amount per volume.'],
    detail: ['تتأين الحموض القوية تقريباً بالكامل في الماء المخفف، وتبلغ الحموض الضعيفة اتزاناً يتضمن الحمض غير المتأين.', 'Strong acids ionize essentially completely in dilute water. Weak acids reach an equilibrium that includes un-ionized acid.'],
    example: ['حمض HCl المخفف يظل قوياً. حمض الأسيتيك ضعيف حتى عند رفع تركيزه.', 'Dilute HCl remains a strong acid. Acetic acid remains weak when its concentration increases.'] },
  { title: ['الكواشف اللونية', 'Indicators'], keys: /كاشف|كواشف|تباع|لون|فينول|indicator|litmus|color/i,
    simple: ['يغيّر تباع الشمس لونه مع تغير الوسط. يحمر في الحمضي ويزرق في القاعدي.', 'Litmus turns red in acid and blue in base.'],
    detail: ['يتغير لون الفينولفثالين عادةً من عديم اللون إلى الوردي عبر مجال pH يقارب 8.2 إلى 10.', 'Phenolphthalein typically changes from colorless to pink over approximately pH 8.2 to 10.'],
    example: ['ظهور اللون الوردي مع الفينولفثالين يعني أن الوسط بلغ مجال تغير لون الكاشف.', 'Pink phenolphthalein indicates the mixture has reached the indicator transition range.'] },
  { title: ['التعادل', 'Neutralization'], keys: /تعادل|خلط|neutral|mix/i,
    simple: ['عند خلط HCl وNaOH يتفاعل الهيدرونيوم مع الهيدروكسيد لتكوين الماء. حدّد أيهما متبقٍ لحساب حموضة المزيج.', 'When mixing HCl and NaOH, hydronium reacts with hydroxide to form water. Identify the excess to calculate mixture pH.'],
    detail: ['احسب مولات كل طرف بضرب التركيز في الحجم باللتر. اطرح الأصغر من الأكبر واقسم المولات الزائدة على الحجم الكلي باللتر.', 'Calculate each amount as concentration times liters. Subtract the smaller amount from the larger and divide the excess by total liters.'],
    example: ['يتعادل 25 مل من HCl بتركيز 0.1 مول/لتر مع 25 مل من NaOH بالتركيز نفسه. في النموذج المائي المثالي عند 25°م يكون pH = 7.', '25 mL of 0.1 M HCl neutralizes 25 mL of 0.1 M NaOH. In the ideal aqueous model at 25°C, pH = 7.'] },
  { title: ['المعايرة', 'Titration'], keys: /معاير|تكافؤ|سحاح|titra|equivalence|buret/i,
    simple: ['نضيف محلولاً معلوم التركيز تدريجياً لتحديد كمية محلول مجهول عند التكافؤ.', 'Add a solution of known concentration gradually to determine an unknown amount at equivalence.'],
    detail: ['عند التكافؤ تتوافق المولات مع نسب المعادلة الموزونة. في معايرة بنسبة 1 إلى 1 نستعمل CₐVₐ = CᵦVᵦ. نقطة نهاية الكاشف تُلاحظ من تغير اللون.', 'At equivalence the mole amounts follow the balanced equation. For a 1:1 titration use CₐVₐ = CᵦVᵦ. The indicator endpoint is observed by a color change.'],
    example: ['إذا عاير 20 مل من NaOH بتركيز 0.10 مول/لتر عينة HCl حجمها 25 مل عند التكافؤ، فتركيز الحمض = 0.10 × 20 ÷ 25 = 0.080 مول/لتر.', 'If 20 mL of 0.10 M NaOH reaches equivalence with 25 mL of HCl, the acid concentration is 0.10 × 20 ÷ 25 = 0.080 M.'] },
  { title: ['التطبيقات الحياتية', 'Everyday applications'], keys: /أمطار|ترب|بيئ|rain|soil|environment/i,
    simple: ['تساعد قياسات pH في مراقبة المياه والتربة.', 'pH measurements help monitor water and soil.'],
    detail: ['تعتمد استجابة النظام البيئي للأمطار الحمضية على عوامل تشمل قدرة التربة والمياه على مقاومة تغير pH.', 'An ecosystem’s response to acid rain depends in part on how well soil and water resist pH changes.'],
    example: ['قارن قياسات الماء عند درجات حرارة متقاربة وبجهاز معاير لتتمكن من تفسير الفروق.', 'Compare water measurements at similar temperatures with a calibrated meter to interpret differences.'] },
];

export interface Question {
  id: string;
  topic: number;
  level: number;
  type: Copy;
  prompt: Copy;
  answers: string[];
  choices?: Copy[];
  number?: number;
  unit?: string;
  hint: Copy;
  explanation?: Copy;
}

const acidChoice: Copy[] = [['حمضي', 'Acidic'], ['متعادل', 'Neutral'], ['قاعدي', 'Basic']];
const truth: Copy[] = [['صح', 'True'], ['خطأ', 'False']];
const numeric: Copy = ['حساب', 'Calculation'];
const short: Copy = ['إجابة قصيرة', 'Short answer'];
export const bank: Question[] = [
  {id:'acid',topic:0,level:1,type:['اختيار متعدد','Multiple choice'],prompt:['كيف تصنّف عصير الليمون؟','How would you classify lemon juice?'],choices:acidChoice,answers:['حمضي','acidic'],hint:['فكر في حمض الستريك الموجود في الليمون.','Think of the citric acid in lemons.']},
  {id:'donor',topic:1,level:1,type:short,prompt:['هل حمض برونستد–لوري مانح للبروتون أم مستقبل له؟','Does a Brønsted–Lowry acid donate or accept a proton?'],answers:['مانح','مانح بروتون','مانح للبروتون','يمنح بروتون','donate','donates a proton','donor'],hint:['تتبع البروتون عندما ينتقل من HCl إلى الماء.','Follow the proton as it moves from HCl to water.']},
  {id:'ph-class',topic:2,level:1,type:['تنبؤ','Prediction'],prompt:['عند 25°م، تتوقع أن يكون محلول pH له 3 حمضياً أم قاعدياً أم متعادلاً؟','At 25°C, predict whether a solution at pH 3 is acidic, basic, or neutral.'],choices:acidChoice,answers:['حمضي','acidic'],hint:['قارن 3 بالعدد 7.','Compare 3 with 7.']},
  {id:'poh',topic:2,level:2,type:numeric,prompt:['عند 25°م، إذا كان pH = 4 فما قيمة pOH؟','At 25°C, what is pOH if pH = 4?'],answers:[],number:10,hint:['اطرح الرقم الهيدروجيني من مجموع الرقمين.','Subtract pH from the sum of the two values.']},
  {id:'ph-log',topic:2,level:2,type:numeric,prompt:['قدّر pH لمحلول مخفف فيه تركيز الهيدرونيوم 0.0001 مول/لتر.','Estimate pH of a dilute solution with 0.0001 M hydronium.'],answers:[],number:4,hint:['اكتب 0.0001 كقوة للعدد 10 ثم خذ سالب اللوغاريتم.','Express 0.0001 as a power of 10 and take the negative logarithm.']},
  {id:'ph-ratio',topic:2,level:3,type:['تحليل','Analysis'],prompt:['محلولان مخففان لهما pH يساوي 2 و5. كم ضعفاً يبلغ نشاط الهيدرونيوم في الأول مقارنة بالثاني؟','Two dilute solutions have pH 2 and 5. How many times larger is hydronium activity in the first?'],answers:[],number:1000,hint:['كل وحدة على مقياس pH تقابل عاملاً مقداره عشرة.','Each unit of pH represents a factor of ten.']},
  {id:'strength',topic:3,level:1,type:['صح أو خطأ','True or false'],prompt:['كل حمض مخفف حمض ضعيف.','Every dilute acid is a weak acid.'],choices:truth,answers:['خطأ','false'],hint:['فكر في الفرق بين عدد المولات ومدى التأين.','Consider the difference between the amount present and extent of ionization.']},
  {id:'indicator',topic:4,level:1,type:['إكمال الفراغ','Fill in the blank'],prompt:['أكمل بلون واحد. يتحول تباع الشمس الأزرق في الوسط الحمضي إلى اللون ___.','Fill in one color. In acid, blue litmus turns ___.'],answers:['احمر','الاحمر','red'],hint:['أي لون يرتبط بالوسط الحمضي في اختبار تباع الشمس؟','Which litmus color is associated with acid?']},
  {id:'neutral',topic:5,level:2,type:['تفسير النتائج','Interpret results'],prompt:['في خليط HCl وNaOH بقيت مولات زائدة من HCl. ما تصنيف المزيج عند 25°م؟','After mixing HCl and NaOH, HCl is in excess. Classify the mixture at 25°C.'],choices:acidChoice,answers:['حمضي','acidic'],hint:['صنّف المادة المتبقية بعد استهلاك القاعدة.','Classify the excess after the base is consumed.']},
  {id:'neutral-why',topic:5,level:3,type:['تحليل','Analysis'],prompt:['خُلط حجمان متساويان من HCl وNaOH، وتركيز HCl ضعف تركيز NaOH. اختر تفسير النتيجة.','Equal volumes of HCl and NaOH are mixed. HCl is twice as concentrated. Choose the explanation.'],choices:[['يبقى حمض لأن مولاته الابتدائية أكبر','Acid remains because its initial moles are greater'],['يحدث التعادل لأن الحجمين متساويان','Equal volumes guarantee neutrality'],['تبقى قاعدة لأن حجم الحمض لم يتغير','Base remains because acid volume did not change']],answers:['يبقى حمض لأن مولاته الابتدائية أكبر','Acid remains because its initial moles are greater'],hint:['احسب المولات النسبية باستخدام التركيز × الحجم.','Compare moles using concentration × volume.']},
  {id:'titrate',topic:6,level:2,type:numeric,prompt:['كم مل من NaOH بتركيز 0.20 مول/لتر يلزم لمعادلة 20 مل من HCl بتركيز 0.10 مول/لتر؟','How many mL of 0.20 M NaOH neutralize 20 mL of 0.10 M HCl?'],answers:[],number:10,unit:'ml',hint:['استخدم نسبة 1 إلى 1 واحسب الحجم من حاصل ضرب تركيز الحمض في حجمه.','Use the 1:1 ratio. Divide acid concentration times its volume by base concentration.']},
  {id:'titrate-end',topic:6,level:3,type:['تحليل','Analysis'],prompt:['اختر العبارة الأدق حول نقطة النهاية والتكافؤ.','Choose the most accurate statement about the endpoint and equivalence point.'],choices:[['نقطة النهاية ملاحظة لونية، والتكافؤ يُحدد بنسبة المولات','Endpoint is an observed color change, equivalence follows the mole ratio'],['كل تغير في اللون يعني pH يساوي 7','Every color change means pH is 7'],['نقطة التكافؤ تعني دائماً تساوي الحجمين','Equivalence always requires equal volumes']],answers:['نقطة النهاية ملاحظة لونية، والتكافؤ يُحدد بنسبة المولات','Endpoint is an observed color change, equivalence follows the mole ratio'],hint:['ميّز بين ما يُرى وما يُحسب من المعادلة.','Distinguish what you see from what you calculate from the equation.']},
  {id:'rain',topic:7,level:2,type:['تنبؤ','Prediction'],prompt:['هل تستجيب جميع أنواع التربة للأمطار الحمضية بالطريقة نفسها؟','Do all soils respond to acid rain in the same way?'],choices:[['نعم','Yes'],['لا','No']],answers:['لا','no'],hint:['تختلف قدرة أنواع التربة على مقاومة تغير الحموضة.','Soils differ in their ability to resist pH changes.']},
];

type ChoiceQuestion = {
  id: string; topic: number; level: number; prompt: Copy; correct: Copy; alternatives: Copy[]; hint: Copy; explanation: Copy;
};
const moreQuestions: ChoiceQuestion[] = [
  {id:'acid-ion',topic:0,level:2,prompt:['لماذا يعد محلول NaOH قاعدياً وفق أرهينيوس؟','Why is aqueous NaOH basic according to Arrhenius?'],correct:['لأنه يزيد تركيز OH⁻','It increases OH⁻ concentration'],alternatives:[['لأنه يزيد تركيز H₃O⁺','It increases H₃O⁺ concentration'],['لأنه يقلل الحجم فقط','It only decreases volume']],hint:['تتبّع الأيونات الناتجة عند تفكك NaOH.','Track the ions released by NaOH.'],explanation:['يتفكك NaOH إلى Na⁺ وOH⁻ في الماء.','NaOH dissociates into Na⁺ and OH⁻ in water.']},
  {id:'acid-evidence',topic:0,level:3,prompt:['عند 25°م، محلول شفاف يغيّر تباع الشمس الأزرق إلى الأحمر. أي استنتاج تدعمه الملاحظة؟','At 25°C, a clear liquid turns blue litmus red. Which conclusion is supported?'],correct:['المحلول حمضي ولا تكفي الملاحظة لتحديد نوع الحمض','The sample is acidic and its acid identity requires further evidence'],alternatives:[['المحلول حمض هيدروكلوريك بالتحديد','The sample must be hydrochloric acid'],['المحلول حمض قوي بالضرورة','The sample must be a strong acid']],hint:['فكّر في الخاصية التي يقيسها الكاشف.','Consider which property the indicator measures.'],explanation:['تحوّل تباع الشمس إلى الأحمر يدل على وسط حمضي ويمكن لأحماض مختلفة إنتاج هذه الملاحظة.','Red litmus indicates an acidic medium. Different acids can produce this observation.']},
  {id:'theory-ammonia',topic:1,level:2,prompt:['في التفاعل NH₃ + H₂O ⇌ NH₄⁺ + OH⁻، ما دور NH₃؟','In NH₃ + H₂O ⇌ NH₄⁺ + OH⁻, what is the role of NH₃?'],correct:['قاعدة تستقبل بروتوناً','Base accepting a proton'],alternatives:[['حمض يمنح بروتوناً','Acid donating a proton'],['أيون متفرج','Spectator ion']],hint:['قارن عدد ذرات الهيدروجين قبل التفاعل وبعده.','Compare the number of hydrogen atoms before and after.'],explanation:['يكتسب NH₃ بروتوناً ليصبح NH₄⁺.','NH₃ gains a proton to become NH₄⁺.']},
  {id:'theory-lewis',topic:1,level:3,prompt:['في اتحاد BF₃ مع NH₃ ينتقل زوج إلكتروني من النيتروجين إلى البورون. أي نموذج يفسر الدور الحمضي هنا مباشرةً؟','In a BF₃–NH₃ adduct, nitrogen supplies an electron pair to boron. Which model directly explains the acidic role?'],correct:['لويس، لأن BF₃ يستقبل زوجاً إلكترونياً','Lewis, because BF₃ accepts an electron pair'],alternatives:[['برونستد–لوري، لأن BF₃ يمنح بروتوناً','Brønsted–Lowry, because BF₃ donates a proton'],['أرهينيوس، لأن NH₃ يطلق H₃O⁺','Arrhenius, because NH₃ releases H₃O⁺']],hint:['حدّد ما ينتقل في التفاعل.','Identify what is transferred in the reaction.'],explanation:['يعرف لويس الحموض بقبول زوج إلكتروني، وهو ما يحدث عند البورون.','A Lewis acid accepts an electron pair, as boron does here.']},
  {id:'strength-dilution',topic:3,level:2,prompt:['ماذا يحدث لتصنيف HCl عند تخفيفه بالماء؟','How is the classification of HCl affected by dilution?'],correct:['يبقى حمضاً قوياً وينخفض تركيزه','It remains strong and its concentration decreases'],alternatives:[['يتحول إلى حمض ضعيف','It becomes weak'],['يبقى تركيزه ثابتاً','Its concentration stays fixed']],hint:['التخفيف يغير كمية المذاب لكل وحدة حجم.','Dilution changes the amount of solute per volume.'],explanation:['إضافة الماء تقلل التركيز ويظل HCl قوي التأين.','Adding water lowers concentration. HCl still ionizes essentially completely.']},
  {id:'strength-data',topic:3,level:3,prompt:['محلولان مخففان لحمضين أحاديي البروتون لهما التركيز نفسه. أحدهما أقل pH بوضوح عند الدرجة نفسها. أي تفسير ترجحه؟','Two dilute monoprotic acids have the same concentration and temperature. One has a clearly lower pH. What does that suggest?'],correct:['الحمض الأقل pH أعلى تأيناً','The lower-pH acid ionizes to a greater extent'],alternatives:[['الحمض الأقل pH تركيزه الابتدائي أعلى','The lower-pH acid has a higher initial concentration'],['كلا الحمضين لهما نسبة التأين نفسها بالضرورة','The acids necessarily have the same extent of ionization']],hint:['قارن نشاط الهيدرونيوم مع تساوي التركيز الابتدائي.','Compare hydronium activity at fixed initial concentration.'],explanation:['عند تساوي التركيز في هذا النموذج المخفف، يرتبط النشاط الأعلى للهيدرونيوم بنسبة تأين أكبر.','At equal concentration in this dilute model, greater hydronium activity corresponds to greater ionization.']},
  {id:'indicator-pink',topic:4,level:2,prompt:['أصبح الفينولفثالين وردياً عند إضافة قاعدة. ماذا يدل ذلك؟','Phenolphthalein turned pink after adding base. What does this show?'],correct:['وصل الوسط إلى مجال تغير لون الكاشف','The solution reached the indicator transition range'],alternatives:[['وصل pH بالضبط إلى 7','The pH reached exactly 7'],['إنها علامة على تكوّن غاز','A gas was produced']],hint:['للكاشف مجال تغيّر لوني خاص.','Each indicator has its own transition range.'],explanation:['يبدأ الفينولفثالين في إظهار اللون قرب pH 8.2 في الظروف المعتادة.','Phenolphthalein begins changing color near pH 8.2 under typical conditions.']},
  {id:'indicator-select',topic:4,level:3,prompt:['حول التكافؤ يقفز pH سريعاً من 6 إلى 10. أي مجال تغير أنسب لرصد النهاية قرب التكافؤ؟','Near equivalence, pH rises steeply from 6 to 10. Which transition range best tracks the endpoint near equivalence?'],correct:['من 7 إلى 8','7 to 8'],alternatives:[['من 2 إلى 3','2 to 3'],['من 11 إلى 12','11 to 12']],hint:['اختر المجال الواقع ضمن الجزء الحاد من المنحنى.','Look for the range inside the steep part of the curve.'],explanation:['التغير ضمن القفزة يقابل فرقاً صغيراً في حجم المعايِر.','A transition inside the steep rise spans a small volume of titrant.']},
  {id:'neutral-water',topic:5,level:1,prompt:['ما ناتج اتحاد H₃O⁺ وOH⁻؟','What is formed when H₃O⁺ combines with OH⁻?'],correct:['الماء','Water'],alternatives:[['الأكسجين','Oxygen'],['الهيدروجين','Hydrogen']],hint:['وازن الذرات والشحنة عند اتحاد الأيونين.','Balance atoms and charge when the two ions combine.'],explanation:['H₃O⁺ + OH⁻ → 2H₂O.','H₃O⁺ + OH⁻ → 2H₂O.']},
  {id:'titrate-tool',topic:6,level:1,prompt:['ما الأداة المستخدمة لإضافة حجم مضبوط من المعايِر؟','What instrument delivers a measured volume of titrant?'],correct:['السحاحة','Burette'],alternatives:[['الترمومتر','Thermometer'],['الميزان','Balance']],hint:['ابحث عن أداة مدرجة لها صمام.','Look for a graduated instrument with a valve.'],explanation:['تسمح السحاحة بضبط الإضافة وقراءة الحجم المضاف.','A burette controls delivery and lets you read the added volume.']},
  {id:'rain-water',topic:7,level:1,prompt:['أي قياس يناسب تتبع حموضة البحيرة؟','Which measurement tracks lake acidity?'],correct:['الرقم الهيدروجيني','pH'],alternatives:[['الكتلة الكلية فقط','Total mass alone'],['سرعة الرياح فقط','Wind speed alone']],hint:['أي مقياس يرتبط بنشاط الهيدرونيوم؟','Which scale relates to hydronium activity?'],explanation:['يصف pH نشاط أيونات الهيدرونيوم في الماء.','pH describes hydronium activity in water.']},
  {id:'rain-design',topic:7,level:3,prompt:['لدراسة مقاومة تربتين للأمطار الحمضية، ما المقارنة الأفضل؟','To compare two soils’ resistance to acid rain, which comparison best controls variables?'],correct:['أضف الكمية نفسها من محلول واحد لكتلتين متساويتين وقارن تغير pH','Add equal amounts of the same liquid to equal soil masses and compare pH changes'],alternatives:[['أضف تركيزين مختلفين ثم قارن اللون فقط','Use different concentrations and compare only color'],['قارن حجم الإناءين دون أي قياس','Compare container size alone']],hint:['ثبّت حجم الإضافة وتركيزها وكتلة التربة.','Keep added volume, concentration and soil mass constant.'],explanation:['ضبط هذه المتغيرات يساعد على عزل اختلاف استجابة التربتين.','Controlling these variables helps isolate soil response.']},
];
for (const { correct, alternatives, ...item } of moreQuestions) {
  const choices = [...alternatives];
  choices.splice((item.topic + item.level) % 3, 0, correct);
  bank.push({...item, choices, answers:correct, type:item.level === 3 ? ['تحليل','Analysis'] : ['اختيار متعدد','Multiple choice']});
}

export const normalize = (value: string) => value.toLowerCase().normalize('NFKC')
  .replace(/[٠-٩۰-۹]/g, c => String(c.charCodeAt(0) - (c <= '٩' ? 1632 : 1776)))
  .replace(/٫/g, '.').replace(/[−–]/g, '-').replace(/[أإآ]/g, 'ا')
  .replace(/[\u064b-\u065fـ]/g, '').replace(/[؟!?،。]+$/g, '').trim().replace(/\s+/g, ' ');

export function isCorrect(question: Question, answer: string) {
  const value = normalize(answer);
  if (question.number === undefined) return question.answers.some(item => normalize(item) === value);
  const numericValue = value.replace(question.unit === 'ml' ? /\s*(ml|مل|مليلتر|ملليلتر)$/i : /$^/, '');
  const spoken: Record<string, number> = {ten:10,'عشرة':10,four:4,'اربعة':4,'one thousand':1000,'الف':1000};
  const number = /^[+-]?\d+(\.\d+)?$/.test(numericValue) ? Number(numericValue) : spoken[numericValue];
  return number === question.number;
}

export function solutionFor(q: Question, lang: Lang) {
  const answers = q.choices?.find(choice => choice.some(value => isCorrect(q, value)));
  const answer = q.number === undefined ? (answers ? tr(answers, lang) : q.id === 'indicator' ? tr(['أحمر','Red'], lang) : tr(['مانح بروتون','Proton donor'], lang)) : String(q.number) + (q.unit ? tr([' مل',' mL'], lang) : '');
  const explanations: Record<string, Copy> = {
    acid: ['يحتوي الليمون على حمض الستريك.','Lemons contain citric acid.'],
    donor: ['الحمض يمنح بروتوناً في نموذج برونستد–لوري.','An acid donates a proton in the Brønsted–Lowry model.'],
    'ph-class': ['عند 25°م، 3 أقل من قيمة التعادل 7.','At 25°C, 3 is below the neutral value of 7.'],
    strength: ['التخفيف يخفض التركيز. وتصف قوة الحمض مدى تأينه.','Dilution lowers concentration. Acid strength describes extent of ionization.'],
    indicator: ['لون تباع الشمس في الوسط الحمضي أحمر.','Litmus is red in acidic solution.'],
    neutral: ['عند استهلاك القاعدة، تبقى أيونات هيدرونيوم فائضة.','After the base is consumed, excess hydronium remains.'],
    'neutral-why': ['حاصل التركيز × الحجم أكبر للحمض، ونسبة التفاعل 1 إلى 1.','Concentration × volume is greater for the acid, and the reaction ratio is 1:1.'],
    'titrate-end': ['يمكن أن يحدث تغير لون الكاشف قرب التكافؤ، بحسب مجال تغيره اللوني.','The indicator can change near equivalence, depending on its transition range.'],
    rain: ['تختلف قدرة أنواع التربة على مقاومة تغير pH.','Soils differ in their ability to resist pH changes.'],
    poh: ['14 − 4 = 10 عند 25°م.', '14 − 4 = 10 at 25°C.'],
    'ph-log': ['−log₁₀(10⁻⁴) = 4.', '−log₁₀(10⁻⁴) = 4.'],
    'ph-ratio': ['فرق القيم 5 − 2 = 3. نسبة النشاط 10³ = 1000.', 'The difference is 5 − 2 = 3. The activity ratio is 10³ = 1000.'],
    titrate: ['0.10 × 20 ÷ 0.20 = 10 مل لأن نسبة التفاعل 1 إلى 1.', '0.10 × 20 ÷ 0.20 = 10 mL because the reaction ratio is 1:1.'],
  };
  return answer + ' — ' + tr(explanations[q.id] || q.explanation || q.hint, lang);
}
