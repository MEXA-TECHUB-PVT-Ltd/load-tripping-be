const Emailtemplate = require("../../EmailUtils");
const { pool } = require("../../config/db.config");
const { v4: uuidv4 } = require('uuid');

exports.registerCustomer = async (req, res, next) => {

    const client = await pool.connect();
    try {
        const {

            image,
            user_name,
            email,
            password

        } = req.body;
        // const company_user = false;
        if (email === null || email === "" || email === undefined) {
            res.json({ error: true, message: "Please Provide User Email" });

        } else {
            const userDataCheck = await pool.query("SELECT * FROM users WHERE email=$1",
                [email]);

            if (userDataCheck.rows.length === 0) {
                const userData = await pool.query("INSERT INTO users(uniq_id,image,user_name,email,password) VALUES($1,$2,$3,$4,$5) returning *",
                    [
                        uuidv4(),
                        image || null,
                        user_name,
                        email,
                        password
                    ])
                const data = userData.rows[0]
                if (userData.rows.length === 0) {
                    res.json({ error: true, data, message: "Can't Create User" });


                } else {
                    res.json({ error: false, data, message: "User Created Successfully" });

                }



            } else {
                const data = userDataCheck.rows[0]
                res.json({ error: true, data, message: "Email Already Exist" });

            }
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
            email,

        } = req.body;
        // const company_user = false;
        if (email === null || email === "" || email === undefined) {
            res.json({ error: true, message: "Please Provide Email" });

        } else {
            const userDataCheck = await pool.query("SELECT * FROM users WHERE email=$1",
                [email]);

            if (userDataCheck.rows.length === 0) {


                const userData = await pool.query("INSERT INTO users(uniq_id,email) VALUES($1,$2) returning *",
                    [
                        uuidv4(),
                        email,
                    ])
                const data = userData.rows[0]
                if (userData.rows.length === 0) {
                    res.json({ error: true, data, message: "Can't Create User" });


                } else {
                    res.json({ error: false, data, message: "User Created Successfully" });

                }

            } else {
                // login 
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
exports.verifyEmail = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            email,

        } = req.body;
        // const company_user = false;
        if (email === null || email === "" || email === undefined) {
            res.json({ error: true, message: "Please Provide Email" });

        } else {
            const userDataCheck = await pool.query("SELECT * FROM users WHERE email=$1",
                [email]);

            if (userDataCheck.rows.length === 0) {
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

                const verificationStatus = false
                const userData = await pool.query("INSERT INTO users(uniq_id,email,otp,verifyStatus,otpExpires) VALUES($1,$2,$3,$4,$5) returning *",
                    [
                        uuidv4(),
                        email,
                        otp,
                        verificationStatus,
                        otpExpires

                    ])
              
                if (userData.rows.length === 0) {
                    res.json({ error: true, data, message: "Can't Create User" });


                } else {
                    const data = userData.rows[0]
                    // send email 
                 
                    const subject = "Verification Email "
                    const message = "Here is your Otp code for verification ."

                    res.json({ error: false, data, message: "User Created Successfully" });
                    Emailtemplate(email, otp, subject, message)
                }

            } else {
                // // login 
             const UserId=userDataCheck.rows[0].user_id
                // // res.json({ error: false, data, message: "Login Successfully" });
                let query = 'UPDATE users SET ';
                let index = 2;
                let values = [UserId];
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
                if (otp) {
                    query += `otp = $${index} , `;
                    values.push(otp)
                    index++
                }
                if (otpExpires) {
                    query += `otpExpires = $${index} , `;
                    values.push(otpExpires)
                    index++
                }
                query += 'WHERE user_id = $1 RETURNING*'
                query = query.replace(/,\s+WHERE/g, " WHERE");


                const result = await pool.query(query, values)


                if (result.rows.length === 0) {
                    res.json({ error: true, data, message: "Can't Update User" });
                } else {
                      
                    const subject = "Verification Email "
                    const message = "Here is your Otp code for verification ."
                    res.json({ error: false, data: result.rows[0], message: "User Created Successfully" });
                    Emailtemplate(email, otp, subject, message)

                }



            }
        }

    }
    catch (err) {
        res.json({ error: true, data:err, message: "Catch eror" });

    } finally {
        client.release();
    }
}
exports.updateUsername = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            user_name,
            user_id

        } = req.body;
        // const company_user = false;
        if (user_id === null || user_id === "" || user_id === undefined) {
            res.json({ error: true, message: "Please Provide User Id" });

        } else {
            let query = 'UPDATE users SET ';
            let index = 2;
            let values = [user_id];

            if (user_name) {
                query += `user_name = $${index} , `;
                values.push(user_name)
                index++
            }
            query += 'WHERE user_id = $1 RETURNING*'
            query = query.replace(/,\s+WHERE/g, " WHERE");


            const result = await pool.query(query, values)

            if (result.rows.length === 0) {
                res.json({ error: true, data: [], message: "Something went wrong" });

            } else {
                res.json({ error: false, data: result.rows, message: "User Updated Successfully" });

            }

        }

    }
    catch (err) {
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
}

exports.admingetAllCustomers = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            user_id,
            type
        } = req.body;
        if (type === null || type === undefined || type === "") {
            // when type null show only admin 
            const query = 'SELECT * FROM users WHERE type =$1'
            const result = await pool.query(query, ["admin"]);
            // get messages 
            const Data = result.rows
            let Array = [];
            for (let i = 0; i < Data.length; i++) {
                const customerId = Data[i].user_id
                const queryText = `
                SELECT sender = $1 AS from_self, message AS message,type AS type,
                readStatus AS readStatus,
                created_at AS created_at
                FROM messages
                WHERE (sender = $1 AND to_user = $2) OR (sender = $2 AND to_user = $1)
                ORDER BY created_at ASC 
              `;

                let resultMessages = await client.query(queryText, [user_id, customerId]);
                // Filter the array to get objects with readstatus false and from_self false
                const filteredResults = resultMessages.rows.filter((row) => {
                    return row.readstatus === "false" && row.from_self === false;
                });
                Array.push({
                    user_id: Data[i].user_id,
                    uniq_id: Data[i].uniq_id,
                    user_name: Data[i].user_name,
                    otp: Data[i].otp,
                    verifyStatus: Data[i].verifyStatus,
                    otpExpires: Data[i].otpExpires,
                    type:Data[i].type,
                    email:Data[i].email,
                    unreadMessages: filteredResults.length
                })
            }


            if (result.rows) {
                res.json({
                    message: "All Users Fetched",
                    status: true,
                    result: Array
                })
            }
            else {
                res.json({
                    message: "could not fetch",
                    status: false,
                })
            }
        } else {

            // type admin (show all users )
            const query = 'SELECT * FROM users WHERE user_id <> $1'
            const result = await pool.query(query, [user_id]);
            // get messages 
            const Data = result.rows
            let Array = [];
            for (let i = 0; i < Data.length; i++) {
                const customerId = Data[i].user_id
                const queryText = `
                SELECT sender = $1 AS from_self, message AS message,type AS type,
                readStatus AS readStatus,
                created_at AS created_at
                FROM messages
                WHERE (sender = $1 AND to_user = $2) OR (sender = $2 AND to_user = $1)
                ORDER BY created_at ASC 
              `;

                let resultMessages = await client.query(queryText, [user_id, customerId]);
                // Filter the array to get objects with readstatus false and from_self false
                const filteredResults = resultMessages.rows.filter((row) => {
                    return row.readstatus === "false" && row.from_self === false;
                });
                Array.push({
                    user_id: Data[i].user_id,
                    email: Data[i].email,
                    password: Data[i].password,
                    image: Data[i].image,
                    user_name: Data[i].user_name,
                    uniq_id: Data[i].uniq_id,
                    unreadMessages: filteredResults.length
                })
            }


            if (result.rows) {
                res.json({
                    message: "All Users Fetched",
                    status: true,
                    result: Array
                })
            }
            else {
                res.json({
                    message: "could not fetch",
                    status: false,
                })
            }
        }

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
exports.getAllCustomers = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            user_id,
        } = req.body;
        //    const type="admin"
        const query = 'SELECT * FROM users WHERE user_id <> $1 '
        const result = await pool.query(query, [user_id]);
        // get messages 
        // const Data= result.rows
        const Data = result.rows.filter(user => user.type !== 'admin');
        let Array = [];
        for (let i = 0; i < Data.length; i++) {
            const customerId = Data[i].user_id
            const queryText = `
            SELECT sender = $1 AS from_self, message AS message,type AS type,
            readStatus AS readStatus,
            created_at AS created_at
            FROM messages
            WHERE (sender = $1 AND to_user = $2) OR (sender = $2 AND to_user = $1)
            ORDER BY created_at ASC 
          `;

            let resultMessages = await client.query(queryText, [user_id, customerId]);
            // Filter the array to get objects with readstatus false and from_self false
            const filteredResults = resultMessages.rows.filter((row) => {
                return row.readstatus === "false" && row.from_self === false;
            });
            Array.push({
                user_id: Data[i].user_id,
                email: Data[i].email,
                password: Data[i].password,
                image: Data[i].image,
                user_name: Data[i].user_name,
                uniq_id: Data[i].uniq_id,
                unreadMessages: filteredResults.length
            })
        }


        if (result.rows) {
            res.json({
                message: "All Users Fetched",
                status: true,
                result: Array
            })
        }
        else {
            res.json({
                message: "could not fetch",
                status: false,
            })
        }
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
exports.getUserByUniqId= async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            uniq_id,
        } = req.body;
        //    const type="admin"
        const query = 'SELECT * FROM users WHERE uniq_id =$1 '
        const result = await pool.query(query, [uniq_id]);
        // get messages 
        // const Data= result.rows

        if (result.rows.length===0) { 
             res.json({
                message: "could not fetch",
                error: true,
            })
          
        }
        else {
            res.json({
                message: "All Users Fetched",
                status: true,
                result: result.rows[0]
            })
        }
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

exports.logout = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            user_id,

        } = req.body;
        // const company_user = false;
        if (!user_id) return res.json({ msg: "User id is required " });
        onlineUsers.delete(req.user_id);
        res.json({ error: false, message: "Logout Successfully" });

    }
    catch (err) {
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
}

