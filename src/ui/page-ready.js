// Explicit course readiness; Python and C++ downloads remain lazy.
export async function pageReady(){await globalThis.KineNestBoot?.ready();}
export function pageFailed(error){globalThis.KineNestBoot?.fail(error?.message??String(error));}
