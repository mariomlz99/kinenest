import test from 'node:test';
import assert from 'node:assert/strict';
import {readField, numberField, stringField, boolField, associateReport} from '../src/cpp/protocol.js';

test('C++ field access preserves nested values, arrays, UTF-8 text and sensor Infinity', () => {
  const payload = {
    transforms: [{header: {frame_id: 'laser_link'}, transform: {translation: {x: 0.2}}}],
    ranges: new Float32Array([Infinity, 1.5, -Infinity]),
    data: 'caffè 🤖',
    empty: '',
    zero: 0, success: true, rejected: false,
  };
  assert.equal(numberField(payload, 'transforms.0.transform.translation.x'), 0.2);
  assert.equal(stringField(payload, 'transforms.0.header.frame_id'), 'laser_link');
  assert.equal(numberField(payload, 'ranges.0'), Infinity);
  assert.equal(numberField(payload, 'ranges.2'), -Infinity);
  assert.equal(numberField(payload, 'zero'), 0);
  assert.equal(boolField(payload, 'success'), true);
  assert.equal(boolField(payload, 'rejected'), false);
  assert.throws(() => boolField(payload, 'zero'), /must be a boolean/);
  assert.equal(stringField(payload, 'data'), 'caffè 🤖');
  assert.equal(stringField(payload, 'empty'), '');
  assert.deepEqual(readField(payload, 'transforms'), payload.transforms);
});

test('C++ field access rejects missing, inherited and malformed fields without coercion', () => {
  const inherited = Object.create({hidden: 5});
  inherited.array = [10];
  inherited.bad = NaN;
  inherited.text = '12';
  inherited.nil = null;
  for (const path of ['hidden', 'missing', 'array.1', 'array.-1', 'array.01', 'array.length', 'nil.x']) {
    assert.throws(() => readField(inherited, path), /Missing C\+\+ message field:/);
  }
  for (const path of ['', '.array', 'array.', 'array..0', '__proto__', 'array.constructor', null]) {
    assert.throws(() => readField(inherited, path), /Invalid C\+\+ message field path:/);
  }
  assert.throws(() => numberField(inherited, 'text'), /text must be a number/);
  assert.throws(() => numberField(inherited, 'bad'), /bad must be a number/);
  assert.throws(() => stringField(inherited, 'array.0'), /array.0 must be a string/);
  assert.throws(() => readField(null, 'x'), /Missing C\+\+ message field: x/);
});

test('C++ sample reports bind the active callback and cannot inject sample IDs', () => {
  for (const [report, values] of [['range', [1]], ['sectors', [1, 2, 3]], ['pose', [1, 2, 0]]]) {
    const original = {kind: 'course_report', report, values, sample: 999, frame: 999};
    const bound = associateReport(original, {sample: 42});
    assert.deepEqual(bound, {kind: 'course_report', report, values, sample: 42});
    assert.equal(original.sample, 999);
    assert.notEqual(bound.values, original.values);
    assert.throws(() => associateReport(original), /current sensor callback/);
  }
  for (const report of ['relative', 'transform']) {
    assert.deepEqual(
      associateReport({kind: 'course_report', report, values: [0.1, 0.2], sample: 999}, {sample: 42, frame: 5}),
      {kind: 'course_report', report, values: [0.1, 0.2], sample: null},
    );
  }
});

test('C++ image reports require a real active frame and preserve absence of a target', () => {
  assert.deepEqual(associateReport({kind: 'detection', frame: 999, visible: true, cx: 159.5}, {frame: 12}),
    {kind: 'detection', frame: 12, visible: true, cx: 159.5});
  assert.deepEqual(associateReport({kind: 'detection', visible: false}, {frame: 13}),
    {kind: 'detection', frame: 13, visible: false, cx: null});
  const original = {kind: 'image_stats', frame: 999, shape: [240, 320, 3], means: [10, 20, 30]};
  const bound = associateReport(original, {frame: 14});
  assert.equal(bound.frame, 14);
  assert.notEqual(bound.shape, original.shape);
  assert.notEqual(bound.means, original.means);
  assert.throws(() => associateReport(original), /current image callback/);
  assert.deepEqual(associateReport({kind: 'detection', visible: true}, {frame: 1}), {kind: 'detection', frame: 1, visible: true, cx: null});
  assert.throws(() => associateReport({kind: 'detection', visible: 1, cx: 20}, {frame: 1}), /visible must be a boolean/);
});

test('C++ reports reject non-finite values, malformed arrays and unsupported evidence', () => {
  for (const value of [NaN, Infinity, -Infinity, '2']) {
    assert.throws(() => associateReport({kind: 'course_report', report: 'range', values: [value]}, {sample: 1}), /must be a finite number/);
    assert.throws(() => associateReport({kind: 'detection', visible: false, cx: value}, {frame: 1}), /cx must be null or a finite number/);
  }
  assert.throws(() => associateReport({kind: 'course_report', report: 'sectors', values: [1]}, {sample: 1}), /requires 3 numeric values/);
  assert.throws(() => associateReport({kind: 'course_report', report: 'range', values: new Array(1)}, {sample: 1}), /must be a finite number/);
  assert.throws(() => associateReport({kind: 'course_report', report: 'constructor', values: []}, {sample: 1}), /Unknown C\+\+ course report/);
  assert.throws(() => associateReport({kind: 'image_stats', shape: [240.5, 320, 3], means: [1, 2, 3]}, {frame: 1}), /positive integer dimensions/);
  assert.throws(() => associateReport({kind: 'image_stats', shape: [240, 320, 3], means: [1, 2, Infinity]}, {frame: 1}), /must be a finite number/);
  for (const frame of [0, -1, NaN, 0.5, '1']) {
    assert.throws(() => associateReport({kind: 'detection', visible: false}, {frame}), /current image callback/);
  }
  assert.throws(() => associateReport({kind: 'message_processed'}, {sample: 1}), /Unknown C\+\+ report kind/);
  assert.throws(() => associateReport(null), /Invalid C\+\+ report/);
});
