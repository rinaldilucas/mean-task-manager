import jwt from 'jsonwebtoken';
import redisService from '@api/services/redis.service';

class JwtService {
    generate (email, userId, role): { access: string, refresh: string} {
        const access = jwt.sign(
            {
                email,
                userId,
                role,
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
                userId,
                role,
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

    async refreshJwt ({ email, userId, role, token }): Promise<{ access: string, refresh: string}> {
        await redisService.set({
            key: token,
            value: '1',
            timeType: 'EX',
            time: parseInt(String(process.env.JWT_REFRESH_TIME), 10)
        });

        return this.generate(email, userId, role);
    }
}

export default new JwtService();
