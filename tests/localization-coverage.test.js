import test from 'node:test';
import assert from 'node:assert/strict';
import {translations} from '../src/translations.js';
import {tfTranslations} from '../src/tf/translations.js';
import {odometryTranslations} from '../src/playground/odometry-translations.js';
import {playgroundExercises} from '../src/playground/lessons.js';
test('registered UI translations have all six non-English columns and preserve placeholders',()=>{
 for(const [key,values]of Object.entries({...translations,...tfTranslations,...odometryTranslations})){
  assert.equal(values.length,6,key);
  for(const value of values){assert(typeof value==='string'&&value.trim(),key);for(const token of key.match(/\{\w+\}/g)??[])assert(value.includes(token),key+' '+token);}
 }
});
test('every current playground exercise title has translations in all seven UI languages',()=>{
 for(const language of ['python','cpp'])for(const exercise of playgroundExercises(language))assert.equal(translations[exercise.title]?.length,6,exercise.title);
});
