import { useEffect, useRef, useState } from 'react';
import { Bot, FlaskConical, GraduationCap, MessageCircle, Mic, Settings2, Sparkles, Volume2, X } from 'lucide-react';
import { bank, isCorrect, normalize, solutionFor, topics, tr } from './tutorScience';
import type { Copy, Question } from './tutorScience';
import { readPreferences, readProgress, record, savePreferences, saveProgress } from './tutorProgress';
import type { Preferences, Progress } from './tutorProgress';
import { useTutorVoice } from './tutorVoice';
import { labGuide, labObservation } from './tutorLab';
import type { LabSnapshot } from './tutorLab';
import './tutor.css';

type Mode = 'ask' | 'quiz' | 'lesson' | 'lab' | 'settings';
export interface TutorLink { mode: Mode; id: number }
interface Props {
  name: string;
  setName: (name: string) => void;
  lesson: number;
  page: string;
  lab: LabSnapshot | null;
  request: TutorLink | null;
  navigate: (page: string) => void;
  preferences: Preferences;
  setPreferences: (value: Preferences) => void;
  progress: Progress;
  setProgress: (value: Progress) => void;
}
interface Message { role: 'student' | 'tutor'; text: string }

export function useTutorProfile() {
  const [preferences, setPreferences] = useState(readPreferences);
  const [progress, setProgress] = useState(readProgress);
  useEffect(() => savePreferences(preferences), [preferences]);
  useEffect(() => saveProgress(progress), [progress]);
  return {preferences, setPreferences, progress, setProgress};
}

export function TutorProgress({progress}: {progress: Progress}) {
  const answered = Object.values(progress);
  const correct = answered.filter(q => q.correct).length;
  const mastered = topics.filter((_, topic) => {
    const questions = bank.filter(q => q.topic === topic);
    return questions.filter(q => progress[q.id]?.correct).length >= Math.min(2, questions.length);
  });
  const review = topics.filter((_, topic) => bank.some(q => q.topic === topic && progress[q.id]?.misses >= 2 && !progress[q.id]?.correct));
  return <section className="tutor-progress">
    <h2>تقدمي مع المساعد</h2>
    <div className="tutor-stats">
      <span><b>{answered.length}</b> أُجيب عنها</span><span><b>{correct}</b> صحيحة</span><span><b>{correct * 10}</b> نقطة</span>
    </div>
    <p>المفاهيم المتقنة · {mastered.map(t => t.title[0]).join('، ') || '—'}</p>
    <p>للمراجعة · {review.map(t => t.title[0]).join('، ') || '—'}</p>
    <p>الإنجازات · {correct >= 8 ? '🏅 مستكشف الكيمياء' : correct >= 3 ? '⭐ بداية موفقة' : '—'}</p>
  </section>;
}

const modes = [
  ['ask', MessageCircle, ['اسأل مساعدك الذكي', 'Ask your tutor']],
  ['quiz', GraduationCap, ['المساعد يسألني', 'Quiz me']],
  ['lesson', Volume2, ['اشرح لي الدرس', 'Explain the lesson']],
  ['lab', FlaskConical, ['ساعدني في التجربة', 'Guide my experiment']],
] as const;

const levels: Copy[] = [['سهل','Easy'], ['متوسط','Medium'], ['متقدم','Advanced']];

export default function Tutor({name, setName, lesson, page, lab, request, navigate, preferences, setPreferences, progress, setProgress}: Props) {
  const {language, voice, rate} = preferences;
  const t = (ar: string, en: string) => tr([ar,en], language);
  const copy = (value: Copy) => tr(value, language);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('ask');
  const [welcome, setWelcome] = useState(!preferences.started ? 1 : 0);
  const [draftName, setDraftName] = useState(name);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [topic, setTopic] = useState(lesson);
  const [conversationTopic, setConversationTopic] = useState(lesson);
  const [level, setLevel] = useState(1);
  const [question, setQuestion] = useState<Question | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [resolved, setResolved] = useState(false);
  const [seen, setSeen] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [reading, setReading] = useState(-1);
  const [advanced, setAdvanced] = useState(false);
  const [finished, setFinished] = useState(false);
  const [prediction, setPrediction] = useState<{key: string; value: string}>();
  const [report, setReport] = useState('');
  const [labHint, setLabHint] = useState(false);
  const [labCheck, setLabCheck] = useState('');
  const lastNamedAnswer = useRef(-3);
  const answerCount = useRef(0);
  const log = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const audio = useTutorVoice(language, voice, rate);
  const displayName = preferences.useName ? name : '';
  const named = displayName ? t(` يا ${displayName}`, `, ${displayName}`) : '';
  const activeTopic = topics[lesson];
  const explanation = [copy(activeTopic.simple), copy(advanced ? activeTopic.detail : activeTopic.example)];
  const labKey = lab ? JSON.stringify([lab.mode, lab.sample, lab.equation, lab.ac, lab.bc, lab.av, lab.bv]) : '';

  useEffect(() => {
    if (welcome && dialog.current && !dialog.current.open) dialog.current.showModal();
    if (!welcome && dialog.current?.open) dialog.current.close();
  }, [welcome]);
  useEffect(() => {
    setConversationTopic(lesson);
    setReading(-1);
    audio.stop();
  }, [lesson, page]);
  useEffect(() => {
    if (!request) return;
    selectMode(request.mode);
    if (request.mode === 'lesson') startLesson();
  }, [request]);
  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [messages, question]);
  useEffect(() => {
    if (!celebrate) return;
    const timer = window.setTimeout(() => setCelebrate(false), 1100);
    return () => window.clearTimeout(timer);
  }, [celebrate]);
  useEffect(() => {
    if (open) panel.current?.focus();
  }, [open]);
  useEffect(() => {
    if (!preferences.useName) {
      setMessages([]);
      audio.clear();
    }
  }, [preferences.useName]);
  useEffect(() => {
    setReport('');
  }, [lab?.measured, lab?.added, lab?.ready]);
  useEffect(() => {
    setPrediction(undefined);
    setReport('');
    setLabHint(false);
    setLabCheck('');
  }, [labKey]);

  function setting<K extends keyof Preferences>(key: K, value: Preferences[K]) {
    setPreferences({...preferences, [key]:value});
  }
  function reply(text: string, student?: string) {
    setMessages(old => [...old, ...(student ? [{role:'student' as const,text:student}] : []), {role:'tutor' as const,text}].slice(-24));
    audio.speak([text]);
  }
  function selectMode(next: Mode) {
    audio.stop();
    setReading(-1);
    setOpen(true);
    setMode(next);
    setInput('');
    setCelebrate(false);
  }
  function close() {
    audio.stop();
    setReading(-1);
    setOpen(false);
    requestAnimationFrame(() => launcher.current?.focus());
  }
  function dismissWelcome() {
    setting('started', true);
    setWelcome(0);
  }
  function greet() {
    const student = draftName.trim().slice(0, 40);
    setName(student);
    const greeting = t(`أهلاً${student && preferences.useName ? ' يا ' + student : ''}! أنا مساعدك العلمي، وسنكتشف اليوم عالم الحموض والقواعد معاً! هل أنت مستعد؟`,
      `Hello${student && preferences.useName ? ', ' + student : ''}! I’m your science tutor. Ready to explore acids and bases together?`);
    setMessages([{role:'tutor',text:greeting}]);
    setWelcome(2);
    audio.speak([greeting]);
  }
  function chooseStart(next: Mode, destination?: string) {
    dismissWelcome();
    if (destination) navigate(destination);
    selectMode(next);
    if (next === 'lesson' && !destination) startLesson();
  }
  function startLesson() {
    setFinished(false);
    audio.speak(explanation, () => setFinished(true), setReading);
    if (!voice || !audio.synthesis) setFinished(true);
  }
  function ask(raw: string) {
    const value = normalize(raw);
    const matches = topics.map((entry,index) => ({entry,index})).filter(item => item.entry.keys.test(value));
    const known = matches.find(item => item.index !== 0) || matches[0];
    const follow = /ابسط|اسهل|مرة|اشرح|وضح|مثال|تلميح|example|simpl|again|hint|explain|detail|steps|خطو/.test(value);
    if (page === 'المختبر' && /تجرب|مختبر|قراءة|نتيج|experiment|lab|reading|result/.test(value)) {
      reply(copy(lab?.measured ? labObservation(lab) : labGuide(lab)), raw);
      return;
    }
    const selected = known?.index ?? conversationTopic;
    if (!known && !follow) {
      reply(t('أستطيع شرح مفاهيم الدروس، وتقديم أمثلة وتلميحات. جرّب سؤالاً عن pH أو التعادل أو المعايرة.', 'I can explain lesson concepts and give examples or hints. Try asking about pH, neutralization, or titration.'), raw);
      return;
    }
    setConversationTopic(selected);
    const current = topics[selected];
    const inputNumber = value.match(/\b(poh|ph)\s*(?:=|يساوي|is)\s*(-?\d+(?:\.\d+)?)/);
    const hintOnly = /تلميح|hint/.test(value);
    if (hintOnly) {
      const hint = bank.find(q => q.topic === selected)?.hint;
      reply(copy(hint || current.simple), raw);
      return;
    }
    if (inputNumber && !/\b(?!25\b)\d+(?:\.\d+)?\s*°/.test(value) && /ph/.test(value) && /poh/.test(value)) {
      const given = Number(inputNumber[2]);
      if (given >= 0 && given <= 14) {
        const target = inputNumber[1] === 'ph' ? 'pOH' : 'pH';
        reply(t(`عند 25°م في الماء، نجمع pH وpOH فنحصل على نحو 14. إذن ${target} ≈ 14 − ${given} = ${+(14 - given).toFixed(8)}.`,
          `In water at 25°C, pH and pOH sum to approximately 14. So ${target} ≈ 14 − ${given} = ${+(14 - given).toFixed(8)}.`), raw);
        return;
      }
    }
    const response = /مثال|example/.test(value) ? current.example :
      /اسهل|ابسط|simpl/.test(value) ? current.simple :
      /احسب|حساب|calculate|steps|خطو/.test(value) ? [current.detail[0] + ' ' + current.example[0], current.detail[1] + ' ' + current.example[1]] as Copy : current.detail;
    reply(copy(response), raw);
  }
  function nextQuestion(nextLevel = level, nextTopic = topic, retryConcept = false) {
    const preferred = bank.filter(q => (nextTopic === -1 || q.topic === nextTopic) && q.level === nextLevel);
    const candidates = preferred.length ? preferred : bank.filter(q => nextTopic === -1 || q.topic === nextTopic);
    const same = retryConcept && question ? bank.filter(q => q.topic === question.topic && q.id !== question.id) : [];
    const pool = same.length ? same : candidates;
    const sorted = [...pool].sort((a,b) => Number(Boolean(progress[a.id]?.correct)) - Number(Boolean(progress[b.id]?.correct)));
    const next = sorted.find(q => !seen.includes(q.id)) || sorted.find(q => q.id !== question?.id) || sorted[0];
    setSeen(old => old.includes(next.id) ? [next.id] : [...old,next.id]);
    setLevel(nextLevel);
    setTopic(nextTopic);
    setQuestion(next);
    setAttempts(0);
    setResolved(false);
    setInput('');
    setMessages([]);
    setCelebrate(false);
    audio.speak([copy(next.prompt)]);
  }
  function grade(answer: string) {
    if (!question || resolved) return;
    if (attempts === 0) answerCount.current++;
    const canPersonalize = Boolean(named) && answerCount.current - lastNamedAnswer.current >= 3;
    if (canPersonalize && attempts === 0) lastNamedAnswer.current = answerCount.current;
    const personal = canPersonalize && attempts === 0 ? named : '';
    if (isCorrect(question, answer)) {
      setResolved(true);
      setProgress(record(progress, question, true, attempts));
      const nextStreak = streak + (attempts === 0 ? 1 : 0);
      setStreak(nextStreak);
      setCelebrate(true);
      const praise: Copy[] = [['ممتاز','Excellent'],['أحسنت','Well done'],['عمل رائع','Great work']];
      reply(copy(praise[Object.keys(progress).length % praise.length]) + personal + '! ' +
        solutionFor(question, language) + (nextStreak === 3 ? ' ' + t('ثلاث إجابات متتالية! هل ترغب في تحدٍ أصعب؟','Three in a row! Ready for a harder challenge?') : ''), answer);
      return;
    }
    const count = attempts + 1;
    setAttempts(count);
    setStreak(0);
    const concept = topics[question.topic];
    if (count >= 4) {
      setResolved(true);
      setProgress(record(progress, question, false, count));
      reply(t('لنراجع الحل معاً. ', 'Let’s review the solution together. ') + solutionFor(question, language), answer);
      return;
    }
    const feedback = count === 1 ? copy(question.hint) : count === 2 ? copy(concept.detail) : copy(concept.example);
    reply(t(`محاولة جيدة${count === 1 ? personal : ''}. «${answer}» لا يطابق المطلوب بعد. `, `Good effort${count === 1 ? personal : ''}. “${answer}” doesn’t match the question yet. `) + feedback, answer);
  }
  function submit() {
    const value = input.trim();
    if (!value) return;
    setInput('');
    if (mode === 'quiz') grade(value); else ask(value);
  }
  useEffect(() => {
    if (mode !== 'lab' || !open || !lab?.measured || prediction?.key !== labKey || (lab.mode === 'titrate' && lab.added !== 0)) return;
    audio.speak([prediction.value === lab.classification ?
      t(`أحسنت${named}! القراءة تؤيد توقعك.`, `Well done${named}! The reading supports your prediction.`) :
      t('قارن القراءة بالعدد 7، وفكّر في الأيون المتبقي.','Compare the reading to 7 and consider which ion remains in excess.')]);
  }, [lab?.measured, lab?.added]);
  const canType = mode === 'ask' || (mode === 'quiz' && question && !resolved);
  const measured = lab?.measured;
  const labInstruction = copy(labGuide(lab));
  function checkTitration(hydroxide: boolean) {
    const feedback = hydroxide ? t('أحسنت! بعد التكافؤ تبقى أيونات OH⁻ من القاعدة المضافة.', 'Well done! Beyond equivalence, OH⁻ from the added base remains in excess.') :
      t('تذكّر أن الحمض استُهلك عند التكافؤ. أي أيون تضيفه السحاحة؟', 'The acid was consumed at equivalence. Which ion does the burette add?');
    setLabCheck(feedback);
    audio.speak([feedback]);
  }

  return <>
    <dialog aria-label={t('ترحيب مساعد الكيمياء','Chemistry tutor welcome')} className="tutor-welcome" dir={language === 'ar' ? 'rtl' : 'ltr'} ref={dialog} onCancel={dismissWelcome}>
      <div className="tutor-welcome-body">
        <button type="button" className="tutor-skip" onClick={dismissWelcome}>{t('تخطّي','Skip')}</button>
        <Avatar mood="speaking" show={preferences.avatar} />
        {welcome === 1 ? <form onSubmit={e => {e.preventDefault(); greet();}}>
          <h2>{t('أهلاً بك في عالم الحموض والقواعد!','Welcome to the world of acids and bases!')}</h2>
          <label>{t('ما الاسم الذي تحب أن أناديك به؟','What would you like me to call you?')}
            <input autoComplete="off" maxLength={40} value={draftName} onChange={e => setDraftName(e.target.value)} placeholder={t('اسمك (اختياري)','Your name (optional)')} />
          </label>
          <label className="tutor-check"><input type="checkbox" checked={voice} onChange={e => setting('voice',e.target.checked)} />{t('فعّل صوت المساعد','Enable tutor voice')}</label>
          <button className="tutor-solid">{t('متابعة','Continue')}</button>
        </form> : <>
          <h2>{messages[0]?.text}</h2>
          <div className="tutor-actions">
            <button className="tutor-solid" onClick={() => {dismissWelcome(); navigate('الدروس');}}>{t('ابدأ التعلم','Start learning')}</button>
            <button onClick={() => chooseStart('ask')}>{t('تحدث مع المساعد','Talk to the tutor')}</button>
            <button onClick={() => chooseStart('quiz')}>{t('اختبر معلوماتك','Test your knowledge')}</button>
            <button onClick={() => chooseStart('lab','المختبر')}>{t('ادخل المختبر','Enter the lab')}</button>
          </div>
        </>}
      </div>
    </dialog>
    {!open && <button ref={launcher} type="button" className="tutor-launch" onClick={() => setOpen(true)}>
      <Bot size={23} aria-hidden="true" /> {t('مساعد الكيمياء','Chemistry tutor')}
    </button>}
    {open && <aside className={`tutor-panel ${mode === 'lab' && page === 'المختبر' ? 'tutor-lab-panel' : ''}`} tabIndex={-1} ref={panel} aria-label={t('مساعد الكيمياء','Chemistry tutor')} dir={language === 'ar' ? 'rtl' : 'ltr'} lang={language}
      onKeyDown={e => {if(e.key === 'Escape') close();}}>
      <div className="tutor-head">
        <Avatar show={preferences.avatar} mood={celebrate && preferences.effects ? 'happy' : audio.status} />
        <div><strong>{t('مساعد الكيمياء','Chemistry tutor')}</strong><small>{t('الوضع المحلي · محتوى تعليمي محدد','Local mode · curated content')}</small></div>
        <button aria-label={t('الإعدادات','Settings')} onClick={() => selectMode('settings')}><Settings2 size={19}/></button>
        <button aria-label={t('إغلاق المساعد','Close tutor')} onClick={close}><X size={20}/></button>
      </div>
      <div className="tutor-tabs">{modes.map(([key,Icon,label]) => <button key={key} aria-pressed={mode === key} onClick={() => selectMode(key)}><Icon size={16} aria-hidden="true"/>{tr([...label],language)}</button>)}</div>
      <div className="tutor-body">
        {mode === 'settings' && <div className="tutor-settings">
          <label>{t('الاسم','Name')}<input maxLength={40} value={name} onChange={e => setName(e.target.value)} /></label>
          <button onClick={() => {setName('');setDraftName('');setMessages([]);audio.clear();}}>{t('حذف الاسم','Delete name')}</button>
          <label>{t('لغة المساعد','Tutor language')}<select value={language} onChange={e => {setting('language',e.target.value as Preferences['language']);setMessages([]);setQuestion(null);setReport('');}}><option value="ar">العربية</option><option value="en">English</option></select></label>
          {([['useName','استخدم اسمي','Use my name'],['voice','فعّل الصوت','Enable voice'],['effects','المؤثرات الاحتفالية','Celebration effects'],['avatar','أظهر الشخصية','Show avatar']] as const).map(([key,ar,en]) =>
            <label className="tutor-check" key={key}><input type="checkbox" checked={preferences[key]} onChange={e => setting(key,e.target.checked)} />{t(ar,en)}</label>)}
        </div>}
        {mode === 'ask' && <div className="tutor-context">{t('سياق الدرس','Lesson context')} · {copy(activeTopic.title)}</div>}
        {mode === 'lesson' && <>
          <h3>{copy(activeTopic.title)}</h3>
          <label>{t('مستوى الشرح','Explanation level')}<select value={advanced ? 'advanced' : 'simple'} onChange={e => {audio.stop();setReading(-1);setFinished(false);setAdvanced(e.target.value === 'advanced');}}><option value="simple">{t('مبسّط','Simple')}</option><option value="advanced">{t('متقدم','Advanced')}</option></select></label>
          {explanation.map((part,i) => <p key={part} className={reading === i && (audio.status === 'speaking' || audio.status === 'paused') ? 'tutor-reading' : ''}>{part}</p>)}
          <button className="tutor-solid" onClick={startLesson}>{finished ? t('أعد الشرح','Explain again') : t('استمع إلى الشرح','Listen to the lesson')}</button>
          {finished && <button onClick={() => {selectMode('quiz');nextQuestion(1,lesson);}}>{t('تحقق من فهمك','Check your understanding')}</button>}
        </>}
        {mode === 'quiz' && <>
          <div className="tutor-controls">
            <label>{t('الموضوع','Topic')}<select value={topic} onChange={e => {audio.stop();setTopic(+e.target.value);setQuestion(null);setMessages([]);setSeen([]);setStreak(0);}}><option value={-1}>{t('كل الموضوعات','All topics')}</option>{topics.map((entry,i) => <option key={i} value={i}>{copy(entry.title)}</option>)}</select></label>
            <label>{t('الصعوبة','Difficulty')}<select value={level} onChange={e => {audio.stop();setLevel(+e.target.value);setQuestion(null);setMessages([]);setSeen([]);setStreak(0);}}>{levels.map((value,i) => <option key={i} value={i+1}>{copy(value)}</option>)}</select></label>
          </div>
          {!question ? <button className="tutor-solid" onClick={() => nextQuestion()}>{t('ابدأ السؤال','Start question')}</button> : <>
            <div className="tutor-context">{copy(question.type)} · DOK {question.level} · {copy(topics[question.topic].title)}</div>
            {question.level !== level && <small>{t('هذا أقرب مستوى متاح في بنك هذا الموضوع.','This is the closest available level for this topic.')}</small>}
            <h3>{copy(question.prompt)}</h3>
            {!resolved && <div className="tutor-actions">
              {question.choices?.map(choice => <button key={choice[0]} onClick={() => grade(copy(choice))}>{copy(choice)}</button>)}
              <button onClick={() => reply(copy(question.hint))}>{t('تلميح','Hint')}</button>
            </div>}
          </>}
        </>}
        {mode === 'lab' && <>
          <h3>{t('رفيق المختبر','Lab companion')}</h3>
          <p>{labInstruction}</p>
          {page !== 'المختبر' && <button onClick={() => navigate('المختبر')}>{t('ادخل المختبر','Enter the lab')}</button>}
          <button onClick={() => audio.speak([labInstruction])}>{t('اقرأ التعليمات','Read instructions')}</button>
          {lab?.valid && !measured && <>
            <p>{t('توقّع تصنيف المحلول عند أول قراءة.','Predict the solution classification at the first reading.')}</p>
            <div className="tutor-actions">{[['حمضي','Acidic'],['متعادل','Neutral'],['قاعدي','Basic']].map(([ar,en]) => <button key={ar} aria-pressed={prediction?.value === ar} onClick={() => {
              setPrediction({key:labKey,value:ar});
              audio.speak([t('سجّلت توقعك. شغّل القياس للمقارنة.','Prediction recorded. Take the measurement to compare.')]);
            }}>{t(ar,en)}</button>)}</div>
          </>}
          {lab && measured && <>
            <p>{copy(labObservation(lab))}</p>
            {prediction?.key === labKey && (lab.mode !== 'titrate' || lab.added === 0) && <p role="status">{prediction.value === lab.classification ?
              t(`أحسنت${named}! القراءة تؤيد توقعك.`,`Well done${named}! The reading supports your prediction.`) :
              t('قارن القراءة بالعدد 7، وراجع أي الأيونات بقيت في الوسط.','Compare the reading to 7 and consider which ions remain in excess.')}</p>}
            <button onClick={() => {setLabHint(true);audio.speak([copy(labObservation(lab)),copy(topics[lab.mode === 'measure' ? 2 : lab.mode === 'neutral' ? 5 : 6].detail)]);}}>{t('فسّر القراءة','Explain the reading')}</button>
            {labHint && <p>{copy(topics[lab.mode === 'measure' ? 2 : lab.mode === 'neutral' ? 5 : 6].detail)}</p>}
            {lab.mode === 'titrate' && <>
              <p>{t('لو أضفت مزيداً من القاعدة بعد التكافؤ، ما الأيون الزائد؟','If you add more base beyond equivalence, which ion will be in excess?')}</p>
              <div className="tutor-actions">
                <button onClick={() => checkTitration(true)}><bdi>OH⁻</bdi></button>
                <button onClick={() => checkTitration(false)}><bdi>H₃O⁺</bdi></button>
              </div>
              {labCheck && <p role="status">{labCheck}</p>}
            </>}
            {lab.ready && <button onClick={() => {
              const text = [t('تقرير التجربة','Experiment report'), copy(labObservation(lab)),
                lab.mode !== 'measure' ? lab.equation : '',
                lab.mode === 'titrate' ? t(`حجم التكافؤ النظري ${lab.eq.toFixed(2)} مل.`,`Theoretical equivalence volume: ${lab.eq.toFixed(2)} mL.`) : '',
                prediction ? t(`التوقع المسجل: ${prediction.value}.`,`Recorded prediction: ${prediction.value === 'حمضي' ? 'acidic' : prediction.value === 'قاعدي' ? 'basic' : 'neutral'}.`) : ''].filter(Boolean).join('\n');
              setReport(text);
              audio.speak([text]);
            }}>{t('أنشئ تقرير التجربة','Create experiment report')}</button>}
            {report && <pre className="tutor-report">{report}</pre>}
          </>}
        </>}
        {(mode === 'ask' || mode === 'quiz') && <div className="tutor-log" role="log" ref={log}>
          {mode === 'ask' && messages.length === 0 && <p className="tutor-bubble">{t('اسألني عن الدرس، أو اطلب مثالاً أو شرحاً أبسط.','Ask about the lesson, or request an example or a simpler explanation.')}</p>}
          {messages.map((message,i) => <div className={`tutor-bubble ${message.role}`} key={i}><span dir="auto">{message.text}</span>
            {message.role === 'tutor' && voice && audio.synthesis && <button aria-label={t('اقرأ الرسالة','Read message')} onClick={() => audio.speak([message.text])}><Volume2 size={15}/></button>}
          </div>)}
        </div>}
        {mode === 'quiz' && celebrate && preferences.effects && <div className="tutor-stars" aria-hidden="true">✦ ✧ ✦</div>}
        {mode === 'quiz' && resolved && <div className="tutor-actions">
          <button className="tutor-solid" onClick={() => nextQuestion(level,topic,attempts >= 4)}>{attempts >= 4 ? t('سؤال للتحقق من الفهم','Check understanding') : t('السؤال التالي','Next question')}</button>
          {streak >= 3 && level < 3 && <button onClick={() => {setStreak(0);nextQuestion(level+1,topic);}}>{t('جرّب مستوى أعلى','Try a harder level')}</button>}
        </div>}
      </div>
      {canType && <form className="tutor-form" onSubmit={e => {e.preventDefault();submit();}}>
        {audio.recognition && <button type="button" aria-label={t('ميكروفون','Microphone')} aria-pressed={audio.status === 'listening'} title={t('قد يعالج المتصفح الصوت عبر خدمته','Your browser may process audio through its service')} onClick={() => audio.listen(text => setInput(text.slice(0,500)))}><Mic size={19}/></button>}
        <input dir="auto" value={input} aria-label={t('رسالتك','Your message')} maxLength={500} placeholder={t('اكتب رسالتك…','Write your message…')} onChange={e => setInput(e.target.value)} />
        <button className="tutor-solid" disabled={!input.trim()}>{t('إرسال','Send')}</button>
      </form>}
      <div className="tutor-audio">
        <small role="status" className={`tutor-voice-status ${audio.status}`}>{audio.failed ? t('تعذّر استخدام الصوت. يمكنك المتابعة بالكتابة.','Audio unavailable. You can continue by typing.') :
          audio.status === 'listening' ? t('جاري الاستماع…','Listening…') : audio.status === 'speaking' ? t('جاري التحدث…','Speaking…') :
          audio.status === 'paused' ? t('الصوت متوقف مؤقتاً','Audio paused') : !audio.recognition && canType ? t('الكتابة متاحة · الميكروفون غير مدعوم','Typing available · microphone unsupported') : ''}</small>
        {voice && audio.synthesis && <>
          <button onClick={() => {audio.stop();setReading(-1);}}>{t('إيقاف','Stop')}</button>
          <button disabled={!['speaking','paused'].includes(audio.status)} onClick={audio.pause}>{audio.status === 'paused' ? t('استئناف','Resume') : t('إيقاف مؤقت','Pause')}</button>
          <button onClick={audio.replay}>{t('إعادة','Replay')}</button>
          <label>{t('السرعة','Rate')} <select value={rate} onChange={e => setting('rate',+e.target.value)}>{[0.75,1,1.25,1.5].map(n => <option key={n} value={n}>{n}×</option>)}</select></label>
        </>}
      </div>
    </aside>}
  </>;
}

function Avatar({show,mood}: {show:boolean;mood:string}) {
  if (!show) return null;
  return <div className={`tutor-avatar ${mood}`} aria-hidden="true">
    <Sparkles size={12} className="tutor-avatar-spark" />
    <div className="tutor-face"><i/><i/><b/></div>
  </div>;
}
