export function codeVariants(lesson){return lesson.programming??{python:{supported:true,starterCode:lesson.starterCode??''},cpp:{supported:false,starterCode:''}};}
export function languageVisible(lesson,language,experimental=false){const variant=codeVariants(lesson)[language];return !!variant?.supported&&(variant.visibility==='public'||!variant.experimental||experimental);}
export const cppVisible=(lesson,experimental=false)=>languageVisible(lesson,'cpp',experimental);
export class DraftStore {
  constructor(){this.lessons=new Map();}
  get(lesson,language){return this.lessons.get(lesson.id)?.[language]??codeVariants(lesson)[language]?.starterCode??'';}
  set(id,language,code){const drafts=this.lessons.get(id)??{};drafts[language]=code;this.lessons.set(id,drafts);}
  restore(lesson,language){this.set(lesson.id,language,codeVariants(lesson)[language]?.starterCode??'');return this.get(lesson,language);}
}
