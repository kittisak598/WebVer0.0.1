const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",      // ถ้า root ไม่มีรหัสผ่าน
    database: "loveanimal"
});

db.connect((err) => {
    if (err) {
        console.log("เชื่อมต่อฐานข้อมูลไม่สำเร็จ");
        console.log(err);
    } else {
        console.log("เชื่อมต่อฐานข้อมูลสำเร็จ");
    }
});

module.exports = db;