
import jwt from 'jsonwebtoken'

export const auth = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
        if (decoded) {
            req.user = decoded
            console.log(req.user)
            return next()
        }
    } catch (error) {
        return res.redirect('/login')
    }
}