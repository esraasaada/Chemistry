/** Ideal aqueous, fully dissociated monovalent strong electrolytes, 25 °C. */
export const KW = 1e-14;
function nonnegative(...values: number[]) {
  if (values.some(v => !Number.isFinite(v) || v < 0)) throw new RangeError('القيم يجب أن تكون أعداداً غير سالبة ومحدودة');
}
// Solve h - Kw/h = signed excess. The conjugate form avoids cancellation.
export function strongPH(excessM: number): number {
  if (!Number.isFinite(excessM)) throw new RangeError('تركيز غير صالح');
  const root = Math.hypot(excessM, 2 * Math.sqrt(KW));
  const h = excessM >= 0 ? (excessM + root) / 2 : 2 * KW / (root - excessM);
  return -Math.log10(h);
}
export function neutralize(ac: number, avMl: number, bc: number, bvMl: number) {
  nonnegative(ac, avMl, bc, bvMl);
  const volumeL = (avMl + bvMl) / 1000;
  if (volumeL <= 0) throw new RangeError('يجب أن يكون الحجم الكلي موجباً');
  const acidMol = ac * avMl / 1000, baseMol = bc * bvMl / 1000;
  const reactedMol = Math.min(acidMol, baseMol);
  // Remove only floating-point rounding at equivalence, not physical dilute concentrations.
  const raw = acidMol - baseMol;
  const excessMol = Math.abs(raw) <= Number.EPSILON * Math.max(acidMol, baseMol) * 4 ? 0 : raw;
  const ph = strongPH(excessMol / volumeL);
  return { acidMol, baseMol, reactedMol, excessMol, volumeL, ph, hydrogen: 10 ** -ph, hydroxide: KW / 10 ** -ph };
}
export function equivalenceVolume(ac: number, avMl: number, bc: number) {
  nonnegative(ac, avMl, bc);
  if (bc === 0) throw new RangeError('تركيز المعايِر يجب أن يكون موجباً');
  return ac * avMl / bc;
}
export function phClass(ph: number) { return Math.abs(ph - 7) < 1e-8 ? 'متعادل' : ph < 7 ? 'حمضي' : 'قاعدي'; }
export const acidMaterials = [{ id:'hcl', name:'حمض الهيدروكلوريك', formula:'HCl' }, { id:'hno3', name:'حمض النتريك', formula:'HNO₃' }];
export const baseMaterials = [{ id:'naoh', name:'هيدروكسيد الصوديوم', formula:'NaOH' }, { id:'koh', name:'هيدروكسيد البوتاسيوم', formula:'KOH' }];
export const saltEquation = (acid: string, base: string) => `${acid === 'hno3' ? 'HNO₃' : 'HCl'} + ${base === 'koh' ? 'KOH' : 'NaOH'} → ${base === 'koh' ? 'K' : 'Na'}${acid === 'hno3' ? 'NO₃' : 'Cl'} + H₂O`;
