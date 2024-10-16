import { Router } from 'express';
import { sql } from '../db/neon.js';
import { auth } from '../middlewares/auth.js';

export const profileRouter = new Router();

profileRouter.get('/profile', auth, async (req, res) => {
    try {
        const user = await sql`select * from usuarios where id=${req.user.id}`;
        return res.render('profile', { user: user[0] });
    } catch (error) {
        return res.redirect('/login');
    }
});

