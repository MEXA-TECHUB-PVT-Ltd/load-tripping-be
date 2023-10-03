const express = require("express");
const app = express();
const http = require("http").Server(app)
const io = require("socket.io")(http);
const { pool } = require("../../config/db.config");

exports.createMessages = async (req, res, next) => {

    const client = await pool.connect();
    try {
        const {
            from_user,
            to_user,
            message,
            type,


        } = req.body;
        // const company_user = false;
        if (from_user === null || from_user === "" || from_user === undefined) {
            res.json({ error: true, message: "Please Provide from User" });

        } else if (to_user === null || to_user === "" || to_user === undefined) {
            res.json({ error: true, message: "Please Provide To User" });

        } else {
            const readStatus = false
            const userData = await pool.query("INSERT INTO messages(from_user,to_user,sender,message,type,readStatus) VALUES($1,$2,$3,$4,$5,$6) returning *",
                [
                    from_user,
                    to_user,
                    from_user,
                    message,
                    type,
                    readStatus
                ])
            const data = userData.rows[0]
            if (userData.rows.length === 0) {
                res.json({ error: true, data, message: "Can't Create Message" });


            } else {
                res.json({ error: false, data, message: "Message Created Successfully" });

            }

        }
    }
    catch (err) {
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }

}
exports.readMessages = async (req, res, next) => {

    const client = await pool.connect();
    try {
        const {
            from_user,
            to_user,
        } = req.body;
        // const company_user = false;
        if (from_user === null || from_user === "" || from_user === undefined) {
            res.json({ error: true, message: "Please Provide from User" });

        } else if (to_user === null || to_user === "" || to_user === undefined) {
            res.json({ error: true, message: "Please Provide To User" });

        } else {
            const updateQuery = `
            UPDATE messages
            SET readStatus = true
            WHERE from_user = $1 AND to_user = $2;
        `;

            // Execute the SQL query
            const userData = await client.query(updateQuery, [from_user, to_user]);


            // const userData = await pool.query("INSERT INTO messages(from_user,to_user,sender,message,type,readStatus) VALUES($1,$2,$3,$4,$5,$6) returning *",
            //     [
            //         from_user,
            //         to_user,
            //         from_user,
            //         message,
            //         type,
            //         readStatus
            //     ])
            console.log(userData.rows)
   
            const data = userData.rows

                res.json({ error: false, data, message: "Read Mesages Success" });


           

        }
    }
    catch (err) {
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }

}

exports.login = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            uniq_id,

        } = req.body;
        // const company_user = false;
        if (uniq_id === null || uniq_id === "" || uniq_id === undefined) {
            res.json({ error: true, message: "Please Provide User Uniq_Id" });

        } else {
            const userDataCheck = await pool.query("SELECT * FROM users WHERE uniq_id=$1",
                [uniq_id]);

            if (userDataCheck.rows.length === 0) {

                res.json({ error: true, data: [], message: "No User Exist" });



            } else {
                const data = userDataCheck.rows[0]
                res.json({ error: false, data, message: "Login Successfully" });

            }
        }




    }
    catch (err) {
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
}

exports.getmsg = async (req, res) => {
    const client = await pool.connect();
    try {
        const { from_user, to_user } = req.body;
        // Use a parameterized query to prevent SQL injection
        const queryText = `
    SELECT sender = $1 AS from_self, message AS message,type AS type,
    to_user AS user_id,
    readStatus AS readStatus,
    created_at AS created_at
    FROM messages
    WHERE (sender = $1 AND to_user = $2) OR (sender = $2 AND to_user = $1)
    ORDER BY created_at ASC 
  `;

        let result = await client.query(queryText, [from_user, to_user]);
        // Filter the array to get objects with readstatus false and from_self false
        // const filteredResults = result.rows.filter((row) => {
        //     return row.readstatus === "false" && row.from_self === false;
        //   });
        res.json({ error: false, data: result.rows, message: "Get Messages Success" });
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
    }
}

