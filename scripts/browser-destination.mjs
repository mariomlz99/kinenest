import {CORE_EXERCISES} from '../src/ui/curriculum.js';

export function matchesDestination(actualHref, expectedHref, lessonId, defaultLesson) {
  const actual = new URL(actualHref), expected = new URL(expectedHref);
  if (defaultLesson && !expected.searchParams.has('lesson')) {
    if (actual.searchParams.has('lesson')) {
      if (actual.searchParams.get('lesson') !== defaultLesson || lessonId !== defaultLesson) return false;
      actual.searchParams.delete('lesson');
    }
  }
  return actual.href === expected.href;
}

// Readiness is checked by callers; only the intentional default-lesson query
// may differ. Deep links and every other query/hash still have to match.
export function destinationExpression(href) {
  const session = new URL(href).pathname.match(/\/(session-0[2-6])\.html$/)?.[1];
  const defaultLesson = session && CORE_EXERCISES.find(id => id.startsWith(session + '-'));
  return '(' + matchesDestination.toString() + ')(location.href,' + JSON.stringify(href) + ',document.body?.dataset.lessonId,' + JSON.stringify(defaultLesson ?? null) + ')';
}
