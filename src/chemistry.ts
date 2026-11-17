export type Solution = {name:string;kind:"acid"|"base"|"neutral"; concentration:number; ph?:number};
export const solutions:Solution[]=[{name:"حمض الهيدروكلوريك",kind:"acid",concentration:0.1},{name:"هيدروكسيد الصوديوم",kind:"base",concentration:0.1},{name:"ماء نقي",kind:"neutral",concentration:0,ph:7},{name:"حمض مخفف",kind:"acid",concentration:0.001},{name:"قاعدة مخففة",kind:"base",concentration:0.001}];
export const clamp=(n:number,a=0,b=14)=>Math.max(a,Math.min(b,n));
export function phStrong(kind:"acid"|"base"|"neutral",c:number):number {if(kind==="neutral")return 7;if(c<=0)return 7;return kind==="acid"?-Math.log10(c):14+Math.log10(c);}
export function mixStrong(ac:number,avMl:number,bc:number,bvMl:number):number {const volume=(avMl+bvMl)/1000;if(volume<=0)return 7;const excess=(ac*avMl-bc*bvMl)/1000;const c=Math.abs(excess)/volume;if(c<1e-12)return 7;return excess>0?-Math.log10(c):14+Math.log10(c);}
export function indicatorColor(ph:number,type:"universal"|"phenolphthalein"|"litmus"):string {if(type==="phenolphthalein")return ph>=8.3?"#ec4899":"#e5e7eb";if(type==="litmus")return ph<7?"#ef4444":ph>7?"#2563eb":"#a855f7";return ph<3?"#ef4444":ph<6?"#f59e0b":ph<8?"#22c55e":ph<11?"#2563eb":"#7c3aed";}
export function equivalenceMl(ac:number,av:number,bc:number){return bc>0?ac*av/bc:0;}
