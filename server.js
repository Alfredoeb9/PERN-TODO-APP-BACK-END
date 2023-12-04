const PORT = process.env.PORT ?? 8000
const express = require('express')
const cors = require('cors')
const app = express();
const pool = require('./db')

app.use(cors())

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