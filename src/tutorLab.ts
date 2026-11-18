import type { Copy } from './tutorScience';
export interface LabSnapshot {
  mode: 'measure' | 'neutral' | 'titrate';
  valid: boolean;
  reachable: boolean;
  probe: boolean;
  run: boolean;
  measured: boolean;
  crossed: boolean;
  ready: boolean;
  ph: number;
  added: number;
  eq: number;
  classification: string;
  excessMol: number;
  equation: string;
  sample: string;
  ac: number;
  bc: number;
  av: number;
  bv: number;
}
export function labGuide(state: LabSnapshot | null): Copy {
  if (!state) return ['افتح تبويب قياس الحموضة أو التعادل أو المعايرة للحصول على إرشاد مرتبط بالمحاكاة.', 'Open the pH, neutralization or titration tab for guidance linked to the simulation.'];
  if (!state.valid) return ['راجع الحقول الرقمية وفق الحدود المعروضة في التجربة.', 'Check the numeric fields against the limits shown in the experiment.'];
  if (!state.reachable) return ['اضبط التراكيز والأحجام ليقع حجم التكافؤ ضمن نطاق السحاحة.', 'Adjust the concentrations and volumes so equivalence falls within the burette range.'];
  if (state.mode === 'neutral' && !state.run) return ['قارن حاصل التركيز × الحجم لكل محلول، سجّل توقعك، ثم اضغط زر الخلط.', 'Compare concentration × volume for each solution, record your prediction, and press Mix.'];
  if (!state.probe) return ['اختر مسبار الرقم الهيدروجيني واغمره في المحلول لتسجيل القراءة.', 'Select the pH probe and immerse it to record a reading.'];
  if (state.mode === 'titrate' && !state.crossed) return ['أضف القاعدة من السحاحة تدريجياً. سجّل نقاطاً قبل التكافؤ وبعده، واستخدم زيادات صغيرة قربه.', 'Add base gradually from the burette. Record points before and after equivalence, using small increments near it.'];
  return ['قارن القراءة بتوقعك، ثم أكمل الملاحظات والاستنتاج وسؤال التحقق في المختبر.', 'Compare the reading with your prediction, then complete the observations, conclusion and check question in the lab.'];
}
export function labObservation(s: LabSnapshot): Copy {
  const ph = s.ph.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
  const en = s.classification === 'حمضي' ? 'acidic' : s.classification === 'قاعدي' ? 'basic' : 'neutral';
  const excess: Copy = s.excessMol > 0 ? ['بقي حمض زائد.','Acid remains in excess.'] : s.excessMol < 0 ? ['بقيت قاعدة زائدة.','Base remains in excess.'] : ['تساوت كميتا الحمض والقاعدة بحسب نسبة التفاعل.','The acid and base amounts match the reaction ratio.'];
  return [
    `القراءة الحالية pH ≈ ${ph}، والوسط ${s.classification} في النموذج عند 25°م. ${s.mode === 'measure' ? '' : excess[0]} ${s.mode === 'titrate' ? `الحجم المضاف ${s.added} مل.` : ''}`.trim(),
    `Current reading: pH ≈ ${ph}. The solution is ${en} in the model at 25°C. ${s.mode === 'measure' ? '' : excess[1]} ${s.mode === 'titrate' ? `Added volume: ${s.added} mL.` : ''}`.trim()
  ];
}
