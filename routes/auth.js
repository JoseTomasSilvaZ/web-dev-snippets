import { Router } from 'express'
import { sql } from '../db/neon.js';

export const authRouter = new Router()

authRouter.get('/login', (req, res) => {
    const error = req.query.error;
    return res.render('login', { error })
})

authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    let user = await sql`select * from usuarios where email=${email} LIMIT 1`;
    user = user[0];
    if (!user) {
        return res.render('login', { error: 'Invalid credentials' });
    }

    if (!bcrypt.compareSync(password, user.password)) {
        return res.render('login', { error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    return res.redirect('/profile');
});

authRouter.get('/register', async (req, res) => {
    return res.render('register');
});
authRouter.post('/register', async (req, res) => {
    const { password, email } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        const result = await sql`
      INSERT INTO usuarios (email, password) 
      VALUES (${email}, ${hashedPassword})
      RETURNING *;`;
        return res.redirect(302, 'login');
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        return res
            .status(500)
            .json({ message: 'Error al registrar el usuario', error: error.message });
    }
});