const PORT = process.env.PORT ?? 8000
const express = require('express')
const cors = require('cors')
const app = express();
const pool = require('./db');
const authRoutes = require("./routes/authRoutes");

app.use(cors());
app.use(express.json());

// middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use("/api/auth", authRoutes);

// get all todos
app.get('/todo/:userEmail', async (req, res) => {
    const { userEmail } = req.params
    try {
        const allTodos = await pool.query('SELECT * FROM todos WHERE user_email = $1', [userEmail]);
        res.json(allTodos.rows)
    } catch(err) {
        console.log('error', err)
    }
})

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));