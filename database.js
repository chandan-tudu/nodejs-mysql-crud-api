import mysql from "mysql2";

const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodejs_crud_api",
});

export default connection.promise();
