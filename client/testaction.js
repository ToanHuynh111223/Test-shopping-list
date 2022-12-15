import { Selector, ClientFunction } from 'testcafe'
const onClickIncrease = Selector('#btn-increase');
const onClickDecrease = Selector('#btn-decrease');
const onClickAdd = Selector('#btn-add');
const inputAddItem = Selector('#add-item-input')
const getNumber = ClientFunction(() => document.querySelector('#number').textContent);
fixture`Getting Started`
    .page`http://localhost:3000/`;
//test add item
test('Enter item', async t => {
    await t
        //test input
        .typeText(inputAddItem, 'Coconut')
        .wait(3000)
        .expect(inputAddItem.value).eql('Coconut')
        .wait(3000)
        //test add btn
        .click(onClickAdd)
})

// test increase btn
test('Click a button increase', async t => {
    await t
        .click(onClickIncrease)
        .wait(3000)
        .expect(getNumber()).contains('2', 'increase complete')
})
// test decrease btn
test('Click a button decrease', async t => {
    await t
        .click(onClickDecrease)
        .wait(3000)
        .expect(getNumber()).contains('1', 'decrease complete')
})
