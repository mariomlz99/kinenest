import assert from 'node:assert/strict';

// Public UI only. Reproduced against ea7866e before editing application code.
export async function checkTFNavigation(page,base){
 await page.goto(base+'/basics.html?start=1&unit=tf');
 await page.locator('#language').selectOption('python');
 await page.getByRole('button',{name:'5. Odometry | motion detective',exact:true}).click();
 await page.locator('#language').selectOption('cpp');
 assert.equal(await page.locator('[data-exercise="odometry"]').getAttribute('aria-current'),'step','changing language must retain the selected exercise');
 assert.equal(await page.locator('#prepare-unit').textContent(),'Prepare odometry workspace');
 for(const language of ['python','cpp']){
  await page.locator('#language').selectOption(language);
  assert.equal(await page.locator('aside [data-exercise]').count(),5,'TF lessons belong in the shared left navigation');
  assert.equal(await page.locator('#unit [data-exercise]').count(),0);
  assert.equal(await page.locator('aside [aria-current="step"]').getAttribute('data-exercise'),'odometry');
 }
 await page.reload();
 assert.equal(await page.locator('aside [aria-current="step"]').getAttribute('data-exercise'),'odometry','reload retains the selected lesson');
}

export async function checkPresentation(page,base){
 await page.goto(base+'/');
 assert.equal(await page.locator('header .creator').count(),0);
 assert.equal(await page.locator('footer .creator').count(),1);
 assert.equal(await page.locator('footer .creator svg[role="img"]').count(),2);
 assert.equal(await page.locator('.module-grid article').count(),4);
 assert.equal(await page.locator('.module-grid article .module-icon').count(),4);
 assert.equal(await page.getByRole('heading',{name:'Perception',exact:true}).count(),1);
 assert.equal(await page.getByText('0/0 completed',{exact:true}).count(),0);
}
