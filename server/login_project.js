import { Selector } from "testcafe";

fixture('demo') // เริ่มการเขียนสคริปต์ TestCafe และตั้งชื่อของ fixture เป็น 'login_project'
.page('http://localhost:3000')
test('Login to RDMJ System Not Success Because emp_id and password Not True', async t => { // ทดสอบในชื่อ 'Login to RDMJ System Not Success Because emp_id and password Not True' โดยใช้ async function
    await t // ใช้ 't' เพื่อให้สามารถเข้าถึงคำสั่งที่ให้ TestCafe ทำงาน

    .click('input[id="emp_id"]') //คลิกที่ช่องกรอก Employee ID
    .typeText('input[id="emp_id"]', '1234') //กรอก Employee ID

    .click('input[id="password"]') //คลิกที่ช่อง Password
    .typeText('input[id="password"]', '5678') //กรอก Password

    .click('button[id="button_login"]') //คลิกปุ่ม Login

    const HomeLogin = Selector('#not_found'); //กำหนดว่าหลังจาก0คลิกเข้าสู่ระบบแล้วจะให้เจออะไร
    await t.expect(HomeLogin.exists).ok(); //ถ้าเจอแปลว่าสำเร็จ
});

test('Login to RDMJ System Not Success Because emp_id True But password Not True', async t => {
    await t
    .click('input[id="emp_id"]') 
    .typeText('input[id="emp_id"]', '02002') 

    .click('input[id="password"]') 
    .typeText('input[id="password"]', '02002') 

    .click('button[id="button_login"]') 
    const HomeLogin = Selector('#not_found');
    await t.expect(HomeLogin.exists).ok();
})

test('Login to RDMJ System Not Success Because emp_id Not True But password  True', async t => {
    await t
    .click('input[id="emp_id"]') 
    .typeText('input[id="emp_id"]', '02005')

    .click('input[id="password"]') 
    .typeText('input[id="password"]', '1234') 

    .click('button[id="button_login"]') 
    const HomeLogin = Selector('#not_found');
    await t.expect(HomeLogin.exists).ok();

})

test('Login to RDMJ System Not Success Because emp_id Blank and password Blank', async t => {
    await t
    // .click('input[id="emp_id"]') 
    // .typeText('input[id="emp_id"]', "") 

    // .click('input[id="password"]') 
    // .typeText('input[id="password"]', "") 

    .click('button[id="button_login"]') 
    const HomeLogin = Selector('#not_found');
    await t.expect(HomeLogin.exists).ok();

})

test('Login to RDMJ System Not Success Because emp_id blank But password True', async t => {
    await t
    // .click('input[id="emp_id"]') 
    // .typeText('input[id="emp_id"]', "") 

    .click('input[id="password"]') 
    .typeText('input[id="password"]', '1234') 

    .click('button[id="button_login"]') 
    const HomeLogin = Selector('#not_found');
    await t.expect(HomeLogin.exists).ok();

})

test('Login to RDMJ System Not Success Because emp_id True But password Blank', async t => {
    await t
    .click('input[id="emp_id"]') 
    .typeText('input[id="emp_id"]', '02002') 

    // .click('input[id="password"]') 
    // .typeText('input[id="password"]', "") 

    .click('button[id="button_login"]') 
    const HomeLogin = Selector('#not_found');
    await t.expect(HomeLogin.exists).ok();

})

test('Login to RDMJ System Success', async t => {
    await t
    .click('input[id="emp_id"]') 
    .typeText('input[id="emp_id"]', '02002') 

    .click('input[id="password"]') 
    .typeText('input[id="password"]', '1234') 

    .click('button[id="button_login"]') 

})