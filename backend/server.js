const path = require("path");
const express = require("express");
const cors = require("cors");
const db = require("./db");
const multer = require("multer");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname,"../uploads")));

app.use(express.static(path.join(__dirname, "../")));

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, path.join(__dirname, "../uploads"));

    },

    filename: (req, file, cb) => {

        const filename =
            Date.now() +
            "-" +
            file.originalname;

        cb(null, filename);

    }

});

const upload = multer({
    storage
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
});

app.get("/test", (req, res) => {
    res.send("TEST OK");
});

// ===========================
// REGISTER
// ===========================
app.post("/auth/register", (req, res) => {

    const {
        first_name,
        last_name,
        username,
        email,
        password
    } = req.body;

    if (!first_name || !last_name || !username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "กรุณากรอกข้อมูลให้ครบ"
        });
    }

    db.query(
        "SELECT * FROM users WHERE username=? OR email=?",
        [username, email],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.sqlMessage
                });
            }

            if (rows.length > 0) {
                return res.json({
                    success: false,
                    message: "Username หรือ Email มีอยู่แล้ว"
                });
            }

            db.query(
                `INSERT INTO users
                (first_name,last_name,username,email,password)
                VALUES(?,?,?,?,?)`,
                [
                    first_name,
                    last_name,
                    username,
                    email,
                    password
                ],
                (err2, result) => {

                    if (err2) {
                        return res.status(500).json({
                            success:false,
                            message:err2.sqlMessage
                        });
                    }

                    res.json({
                        success:true,
                        data:{
                            id:result.insertId,
                            token:"demo-token"
                        }
                    });

                }
            );

        }
    );

});

// ===========================
// LOGIN
// ===========================

app.post("/auth/login",(req,res)=>{

    const {identifier,password}=req.body;

    db.query(
        `SELECT * FROM users
        WHERE (email=? OR username=?)
        AND password=?`,
        [
            identifier,
            identifier,
            password
        ],
        (err,rows)=>{

            if(err){

                return res.status(500).json({
                    success:false,
                    message:err.sqlMessage
                });

            }

            if(rows.length==0){

                return res.json({
                    success:false,
                    message:"อีเมลหรือรหัสผ่านไม่ถูกต้อง"
                });

            }

            res.json({

                success:true,

                data:{
                    id:rows[0].id,
                    token:"demo-token",
                    first_name:rows[0].first_name,
                    last_name:rows[0].last_name
                }

            });

        }
    );

});

// ===========================
// GET PROFILE
// ===========================

app.get("/users/:id",(req,res)=>{

    db.query(

        "SELECT * FROM users WHERE id=?",

        [req.params.id],

        (err,rows)=>{

            if(err){

                return res.status(500).json({
                    success:false,
                    message:err.sqlMessage
                });

            }

            if(rows.length==0){

                return res.json({
                    success:false
                });

            }

            res.json({
                success:true,
                data:rows[0]
            });

        }

    );

});

// ===========================
// UPDATE PROFILE
// ===========================

app.put("/users/:id",(req,res)=>{

    const{

        first_name,
        last_name,
        email,
        phone,
        province,
        region_zone,
        address_detail

    }=req.body;

    db.query(

`UPDATE users SET

first_name=?,
last_name=?,
email=?,
phone=?,
province=?,
region_zone=?,
address_detail=?

WHERE id=?`,

[
first_name,
last_name,
email,
phone,
province,
region_zone,
address_detail,
req.params.id
],

(err)=>{

if(err){

return res.status(500).json({

success:false,
message:err.sqlMessage

});

}

res.json({

success:true

});

}

);

});

// ===========================
// GET POSTS
// ===========================
app.get("/posts", (req, res) => {

    db.query(`
        SELECT
            posts.*,
            users.first_name,
            users.last_name
        FROM posts
        LEFT JOIN users
        ON posts.user_id = users.id
        ORDER BY posts.id DESC
    `, (err, rows) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.sqlMessage
            });
        }

        res.json({
            success: true,
            data: rows
        });

    });

});

// ===========================
// CREATE POST
// ===========================
app.post("/posts", upload.single("image"), (req, res) => {

    const {
        user_id,
        pet_name,
        pet_type,
        breed,
        province,
        description,
        latitude,
        longitude
    } = req.body;

    const image = req.file
        ? "/uploads/" + req.file.filename
        : "";

    console.log(req.body);

    db.query(
        `INSERT INTO posts
        (
            user_id,
            pet_name,
            pet_type,
            breed,
            province,
            description,
            image,
            latitude,
            longitude
        )
        VALUES(?,?,?,?,?,?,?,?,?)`,
        [
            user_id,
            pet_name,
            pet_type,
            breed,
            province,
            description,
            image,
            latitude,
            longitude
        ],
        (err,result)=>{

            if(err){
                return res.status(500).json({
                    success:false,
                    message:err.sqlMessage
                });
            }

            res.json({
                success:true,
                id:result.insertId
            });

        }
    );

});

// ===========================
// DELETE POST
// ===========================
app.delete("/posts/:id", (req, res) => {

    db.query(
        "DELETE FROM posts WHERE id=?",
        [req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.sqlMessage
                });
            }

            res.json({
                success: true
            });

        }
    );

});

// ===========================
// NOTIFICATIONS
// ===========================

app.get("/notifications/:userId", (req, res) => {

    db.query(

        "SELECT * FROM notifications WHERE user_id=? ORDER BY id DESC",

        [req.params.userId],

        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.sqlMessage
                });
            }

            res.json({
                success: true,
                data: rows
            });

        }

    );

});

// ===========================
// CREATE NOTIFICATION
// ===========================

app.post("/notifications", (req, res) => {

    const {
        user_id,
        message
    } = req.body;

    db.query(

        `INSERT INTO notifications
        (user_id,message)
        VALUES(?,?)`,

        [
            user_id,
            message
        ],

        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.sqlMessage
                });
            }

            res.json({
                success: true,
                id: result.insertId
            });

        }

    );

});
// ===========================
// GET MESSAGES
// ===========================
app.get("/messages/:user1/:user2", (req, res) => {

    const { user1, user2 } = req.params;

    db.query(

        `SELECT *
        FROM messages
        WHERE
        (sender_id=? AND receiver_id=?)
        OR
        (sender_id=? AND receiver_id=?)
        ORDER BY created_at ASC`,

        [
            user1,
            user2,
            user2,
            user1
        ],

        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.sqlMessage
                });
            }

            res.json({
                success: true,
                data: rows
            });

        }

    );

});

// ===========================
// SEND MESSAGE
// ===========================

app.post("/messages", (req, res) => {

    const {
        sender_id,
        receiver_id,
        message
    } = req.body;

    db.query(

        `INSERT INTO messages
        (sender_id,receiver_id,message)
        VALUES(?,?,?)`,

        [
            sender_id,
            receiver_id,
            message
        ],

        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.sqlMessage
                });
            }

            res.json({
                success: true,
                id: result.insertId
            });

        }

    );

});

// ===========================
// VERIFY FACE
// ===========================

app.patch("/users/:id/verify-face", (req, res) => {

    db.query(

        `INSERT INTO face_data
        (user_id)
        VALUES(?)`,

        [
            req.params.id
        ],

        (err) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.sqlMessage
                });

            }

            res.json({
                success: true,
                message: "Face Verify Success"
            });

        }

    );

});

// Upload รูป
app.post("/upload", upload.single("image"), (req, res) => {

    if (!req.file) {

        return res.status(400).json({
            success: false,
            message: "ไม่ได้เลือกรูป"
        });

    }

    res.json({

        success: true,

        data: {

            image: "/uploads/" + req.file.filename

        }

    });

});

// ===========================
// 404 API
// ===========================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API Not Found"
    });

});


// ===========================
// START SERVER
// ===========================

const PORT = 3000;

app.listen(PORT, () => {

    console.log("=================================");
    console.log(" Love Animal Backend");
    console.log("=================================");
    console.log("Server : http://localhost:" + PORT);
    console.log("Test   : http://localhost:" + PORT + "/test");
    console.log("=================================");

});
