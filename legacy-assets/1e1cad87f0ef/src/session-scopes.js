export const sessionScope=index=>index===9?'tf':index===8?'free':index===7?'playground':'course';

// Read older two-workspace sessions and the current collection without nesting
// live workspaces inside one another or sharing mutable filesystem snapshots.
export function savedSlots(record){
 const slots=new Map(Object.entries(record?.slots??{}));
 if(record?.other)slots.set(sessionScope(record.other.ui.lessonIndex??record.other.ui.unitIndex),record.other);
 slots.delete(sessionScope(record?.ui.lessonIndex??record?.ui.unitIndex));
 return slots;
}

// Module links choose an existing workspace before restoration. Keep the old
// active snapshot alongside the other scopes, without nesting saved sessions.
export function selectModuleSession(record,{tf=false,course=false}={}){
 const index=record?.ui?.unitIndex??record?.ui?.lessonIndex??0,active=sessionScope(index);
 const target=tf?'tf':course||active==='tf'?'course':active;
 const standalone=record=>{const {slots,other,...snapshot}=record;return snapshot;};
 const slots=new Map([...savedSlots(record)].map(([scope,snapshot])=>[scope,standalone(snapshot)]));
 if(record)slots.set(active,standalone(record));
 const selected=slots.get(target);slots.delete(target);
 return {record:selected,slots,unitIndex:tf?9:selected?.ui?.unitIndex??selected?.ui?.lessonIndex??0};
}
