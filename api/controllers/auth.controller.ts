import authService from '../services/auth.service';

class AuthController {
    async login (req, res, next) {
        try {
            debugger;
            const { access, refresh } = authService.login(req.body);
            return res.status(200).send({
                access,
                refresh
            });
        } catch (err) {
            next(err);
        }
    }

    async refreshToken (req, res, next) {
        try {
            const { access, refresh } = await authService.refresh({
                email: req.email,
                name: req.name,
                token: req.body.refresh
            });
            return res.status(200).send({
                access,
                refresh
            });
        } catch (err) {
            next(err);
        }
    }
}

export default new AuthController();
