import { Selector } from "testcafe";

fixture('requese_password') // เริ่มการเขียนสคริปต์ TestCafe และตั้งชื่อของ fixture เป็น 'login_project'
.page('http://localhost:3000/v_request_password')
test('Requese Not Success Because Email Not True and emp_id Not True', async t => { // ทดสอบในชื่อ 'Login to RDMJ System Not Success Because emp_id and password Not True' โดยใช้ async function
    await t // ใช้ 't' เพื่อให้สามารถเข้าถึงคำสั่งที่ให้ TestCafe ทำงาน

    .click('input[id="emp_email"]') //คลิกที่ช่องกรอก Employee ID
    .typeText('input[id="emp_email"]', '@') //กรอก Employee ID

    .click('input[id="emp_id"]') //คลิกที่ช่อง Password
    .typeText('input[id="emp_id"]', '5678') //กรอก Password

    .click('button[id="button_sent"]') //คลิกปุ่ม Login

    const HomeRequese = Selector('#not_found'); //กำหนดว่าหลังจาก0คลิกเข้าสู่ระบบแล้วจะให้เจออะไร
    await t.expect(HomeRequese.exists).ok(); //ถ้าเจอแปลว่าสำเร็จ
});

test('Requese Not Success Because Email True But emp_id Not True', async t => {
    await t
    .click('input[id="emp_email"]') //คลิกที่ช่องกรอก Employee ID
    .typeText('input[id="emp_email"]', '64160164@go.buu.ac.th') //กรอก Employee ID

    .click('input[id="emp_id"]') //คลิกที่ช่อง Password
    .typeText('input[id="emp_id"]', '5678') //กรอก Password

    .click('button[id="button_sent"]') //คลิกปุ่ม Login

    const HomeRequese = Selector('#not_found'); //กำหนดว่าหลังจาก0คลิกเข้าสู่ระบบแล้วจะให้เจออะไร
    await t.expect(HomeRequese.exists).ok(); //ถ้าเจอแปลว่าสำเร็จ
})

test('Requese Not Success Because Email True But emp_id Not True', async t => {
    await t
    .click('input[id="emp_email"]') //คลิกที่ช่องกรอก Employee ID
    .typeText('input[id="emp_email"]', '@') //กรอก Employee ID

    .click('input[id="emp_id"]') //คลิกที่ช่อง Password
    .typeText('input[id="emp_id"]', '02002') //กรอก Password

    .click('button[id="button_sent"]') //คลิกปุ่ม Login

    const HomeRequese = Selector('#not_found'); //กำหนดว่าหลังจาก0คลิกเข้าสู่ระบบแล้วจะให้เจออะไร
    await t.expect(HomeRequese.exists).ok(); //ถ้าเจอแปลว่าสำเร็จ
})

test('Requese Not Success Because Email Blank and emp_id Blank', async t => {
    await t
    // .click('input[id="emp_email"]') //คลิกที่ช่องกรอก Employee ID
    // .typeText('input[id="emp_email"]', '@') //กรอก Employee ID

    // .click('input[id="emp_id"]') //คลิกที่ช่อง Password
    // .typeText('input["emp_id"]', '02002') //กรอก Password

    .click('button[id="button_sent"]') //คลิกปุ่ม Login

    const HomeRequese = Selector('#not_found'); //กำหนดว่าหลังจาก0คลิกเข้าสู่ระบบแล้วจะให้เจออะไร
    await t.expect(HomeRequese.exists).ok(); //ถ้าเจอแปลว่าสำเร็จ

})

test('Requese Not Success Because Email Blank But emp_id Not Blank', async t => {
    await t
    // .click('input[id="emp_email"]') //คลิกที่ช่องกรอก Employee ID
    // .typeText('input[id="emp_email"]', '@') //กรอก Employee ID

    .click('input[id="emp_id"]') //คลิกที่ช่อง Password
    .typeText('input[id="emp_id"]', '02002') //กรอก Password

    .click('button[id="button_sent"]') //คลิกปุ่ม Login

    const HomeRequese = Selector('#not_found'); //กำหนดว่าหลังจาก0คลิกเข้าสู่ระบบแล้วจะให้เจออะไร
    await t.expect(HomeRequese.exists).ok(); //ถ้าเจอแปลว่าสำเร็จ

})

test('Requese Not Success Because Email Not Blank But emp_id Blank', async t => {
    await t
    .click('input[id="emp_email"]') //คลิกที่ช่องกรอก Employee ID
    .typeText('input[id="emp_email"]', '@') //กรอก Employee ID

    // .click('input[id="emp_id"]') //คลิกที่ช่อง Password
    // .typeText('input["emp_id"]', '02002') //กรอก Password

    .click('button[id="button_sent"]') //คลิกปุ่ม Login

    const HomeRequese = Selector('#not_found'); //กำหนดว่าหลังจาก0คลิกเข้าสู่ระบบแล้วจะให้เจออะไร
    await t.expect(HomeRequese.exists).ok(); //ถ้าเจอแปลว่าสำเร็จ

})

test('Requese Success', async t => {
    await t
    .click('input[id="emp_email"]') //คลิกที่ช่องกรอก Employee ID
    .typeText('input[id="emp_email"]', '64160164@go.buu.com') //กรอก Employee ID

    .click('input[id="emp_id"]') //คลิกที่ช่อง Password
    .typeText('input[id="emp_id"]', '02002') //กรอก Password

    .click('button[id="button_sent"]') //คลิกปุ่ม Login
})