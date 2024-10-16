import express from 'express'
import { engine } from 'express-handlebars'
import cookieParser from 'cookie-parser'
import { authRouter } from './routes/auth.js'
import { profileRouter } from './routes/profile.js'

// --- Constants ---
const PORT = 3000

// --- Server initialization ---
const app = express()

// --- Handlebars config ---
app.engine(
    'handlebars',
    engine({
        defaultLayout: 'main',
    })
);
app.set('view engine', 'handlebars');
app.set('views', './views');

// --- Server related config ---
app.use(cookieParser());
app.use(express.static('static'));
app.use(express.urlencoded());
app.use(express.json());

// --- Routes ---

app.get('/', (req, res) => {
    return res.json({
        ok: true,
        message: '🎉'
    })
})

app.use(authRouter)
app.use(profileRouter)


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})