import {strongPH,neutralize} from "./labScience";
export type Solution = {name:string;kind:"acid"|"base"|"neutral"; concentration:number; ph?:number};
export const solutions:Solution[]=[{name:"حمض الهيدروكلوريك",kind:"acid",concentration:0.1},{name:"هيدروكسيد الصوديوم",kind:"base",concentration:0.1},{name:"ماء نقي",kind:"neutral",concentration:0,ph:7},{name:"حمض مخفف",kind:"acid",concentration:0.001},{name:"قاعدة مخففة",kind:"base",concentration:0.001}];
export const clamp=(n:number,a=0,b=14)=>Math.max(a,Math.min(b,n));
export function phStrong(kind:"acid"|"base"|"neutral",c:number):number {if(kind==="neutral")return 7;if(!Number.isFinite(c)||c<0)throw new RangeError("تركيز غير صالح");return strongPH(kind==="acid"?c:-c);}
export function mixStrong(ac:number,avMl:number,bc:number,bvMl:number):number {return neutralize(ac,avMl,bc,bvMl).ph;}
export function indicatorColor(ph:number,type:"universal"|"phenolphthalein"|"litmus"):string {if(type==="phenolphthalein")return ph>=8.3?"#ec4899":"#e5e7eb";if(type==="litmus")return ph<7?"#ef4444":ph>7?"#2563eb":"#a855f7";return ph<3?"#ef4444":ph<6?"#f59e0b":ph<8?"#22c55e":ph<11?"#2563eb":"#7c3aed";}
export function equivalenceMl(ac:number,av:number,bc:number){return bc>0?ac*av/bc:0;}
