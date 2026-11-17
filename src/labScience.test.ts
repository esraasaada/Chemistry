import {describe,it,expect} from 'vitest';
import {strongPH,neutralize,equivalenceVolume,KW,phClass} from './labScience';
describe('اتزان الماء وحفظ المولات عند 25°م',()=>{
 it('حمض وقاعدة قويان',()=>{expect(strongPH(.01)).toBeCloseTo(2,8);expect(strongPH(-.01)).toBeCloseTo(12,8)});
 it('ماء نقي والتخفيف الشديد لا يقلبان التصنيف',()=>{expect(strongPH(0)).toBe(7);expect(strongPH(1e-9)).toBeLessThan(7);expect(strongPH(1e-9)).toBeGreaterThan(6.99);expect(strongPH(-1e-9)).toBeGreaterThan(7)});
 it('حفظ المولات والحجم مع فائض حمض معلوم',()=>{const r=neutralize(.1,50,.1,25);expect(r.acidMol).toBeCloseTo(.005);expect(r.baseMol).toBeCloseTo(.0025);expect(r.reactedMol).toBeCloseTo(.0025);expect(r.excessMol).toBeCloseTo(.0025);expect(r.volumeL).toBeCloseTo(.075);expect(r.ph).toBeCloseTo(1.4771212547,8)});
 it('فائض القاعدة وتماثل المنحنى',()=>{expect(neutralize(.1,25,.1,50).ph).toBeCloseTo(12.5228787453,8)});
 it('تكافؤ تراكيز وأحجام مختلفة',()=>{expect(equivalenceVolume(.2,30,.15)).toBeCloseTo(40);expect(neutralize(.2,30,.15,40).ph).toBe(7)});
 it('حاصل التأين وشحنة المحلول',()=>{for(const v of [0,24.95,25,25.05,50]){const r=neutralize(.1,25,.1,v);expect(r.hydrogen*r.hydroxide).toBeCloseTo(KW,20);expect(r.hydrogen-r.hydroxide).toBeCloseTo(r.excessMol/r.volumeL,12)}});
 it('التعادل قرب التخفيف الشديد مستمر',()=>{const r=neutralize(1e-8,25,1e-8,24);expect(r.ph).toBeLessThan(7);expect(r.ph).toBeGreaterThan(6.99)});
 it('منحنى المعايرة تنازلي في H ومتصاعد في pH',()=>{let last=0;for(let v=0;v<=50;v+=.5){const p=neutralize(.1,25,.1,v).ph;expect(p).toBeGreaterThanOrEqual(last);last=p}});
 it('رفض المدخلات غير الفيزيائية',()=>{for(const bad of [-1,NaN,Infinity]){expect(()=>neutralize(bad,25,.1,25)).toThrow();expect(()=>strongPH(bad===-1?NaN:bad)).toThrow()}expect(()=>neutralize(.1,0,.1,0)).toThrow();expect(()=>equivalenceVolume(.1,25,0)).toThrow()});
 it('تصنيف لا يعتمد على تقريب شاشة العرض',()=>{expect(phClass(7)).toBe('متعادل');expect(phClass(6.9999)).toBe('حمضي');expect(phClass(7.0001)).toBe('قاعدي')});
});
