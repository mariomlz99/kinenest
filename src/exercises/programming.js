export function codeVariants(lesson){return lesson.programming??{python:{supported:true,starterCode:lesson.starterCode??''},cpp:{supported:false,starterCode:''}};}
export function cppVisible(lesson,experimental=false){const cpp=codeVariants(lesson).cpp;return !!cpp&&(cpp.supported&&!cpp.experimental||experimental&&cpp.experimental);}
export class DraftStore {
  constructor(){this.lessons=new Map();}
  get(lesson,language){return this.lessons.get(lesson.id)?.[language]??codeVariants(lesson)[language]?.starterCode??'';}
  set(id,language,code){const drafts=this.lessons.get(id)??{};drafts[language]=code;this.lessons.set(id,drafts);}
  restore(lesson,language){this.set(lesson.id,language,codeVariants(lesson)[language]?.starterCode??'');return this.get(lesson,language);}
}
