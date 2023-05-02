import jwt from 'jsonwebtoken';

class JwtService {
    generate (email) {
        const access = jwt.sign(
            {
                email,
                type: process.env.JWT_ACCESS
            },
            String(process.env.JWT_KEY),
            {
                subject: email,
                expiresIn: parseInt(String(process.env.JWT_ACCESS_TIME), 10),
                audience: process.env.JWT_AUDIENCE,
                issuer: process.env.JWT_ISSUER
            }
        );
        const refresh = jwt.sign(
            {
                email,
                type: process.env.JWT_REFRESH
            },
            String(process.env.JWT_KEY),
            {
                subject: email,
                expiresIn: parseInt(String(process.env.JWT_REFRESH_TIME), 10),
                audience: process.env.JWT_AUDIENCE,
                issuer: process.env.JWT_ISSUER
            }
        );
        return { access, refresh };
    }
}

export default new JwtService();
