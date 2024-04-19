import express from "express";
import dbConnection from "./database.js";
import routes from "./routes.js";

const app = express();

app.use(express.json());
app.use("/api/v1/", routes);

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    res.status(err.statusCode).json({
        status: err.statusCode,
        message: err.message,
    });
});

const PORT = 3000;

dbConnection
    .getConnection()
    .then(() => {
        app.listen(PORT, async () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err.message);
    });
