
const express = require("express");
const mysql = require("mysql");
const app = express();

//#region Databaza konfiqurasiyası
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: "root",
    password: "31443205",
    database: "qrup",
    multipleStatements: true
});
//#endregion

//#region Databazaya qoşulmaq
connection.connect((err) => {
    if (!err) {
        console.log("Databazaya ugurla qosuldu")
    } else {
        console.log(err)
    }
});
//#endregion

//#region Express json dəstəkləməsi
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
//#endregion

//#region  Userlərin əldə olunması API START
app.get("/user", function (req, res) {
    connection.query("SELECT * FROM telebeler WHERE isRemoved = 0;", (err, data) => {
        if (err)
            return res.status(500).send("problem oldu");
        res.json(data);
    })
})
//#endregion Userlərin əldə olunması API END

//#region Userin yaradılması API START
app.post("/user", function (req, res) {
    const newUser = req.body;
    connection.query("INSERT INTO telebeler SET ?", [newUser], (err, data) => {
        if (err)
            return res.status(500).json({ errorMessage: "Server error" });
        return res.send("Deyisildi")
    })
})
//#endregion Userin yaradılması API END

//#region User məlumatlarının dəyişdirilməsi API START
app.put("/user/:id", function (req, res) {
    const { id } = req.params;
    const newData = req.body;
    if (!Object.keys(newData).length) {
        return res.send("Deyismek istediyiniz datani gondermemisiz")
    }
    connection.query("UPDATE telebeler SET ? WHERE id = ?", [newData, id], (err, data) => {
        if (!err) {
            connection.query("SELECT * FROM telebeler WHERE id = ?", [id], (err, data) => {
                if (!err)
                    res.json(data)
            })
        }
    })
})
//#endregion User məlumatlarının dəyişdirilməsi API END

//#region Userin silinməsi API START
app.delete("/user/:id", function (req, res) {
    const { id } = req.params;
    connection.query(`SELECT * FROM telebeler WHERE id = ?; DELETE FROM telebeler WHERE id = ?;`, [id, id], (err, data) => {
        if (err)
            return res.status(500).send(err);
        res.json(data)
    })
})
//#endregion Userin silinməsi API END

//#region Serverə qoşulmaq
app.listen(3000, function () { console.log("Sebekeye qosuldu") });
//#endregion