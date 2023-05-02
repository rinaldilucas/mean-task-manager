import { ServerError } from '../errors/server.error';
import jwtService from './jwt.service';
import redisService from './redis.service';

class AuthService {
    login ({ email, password }) {
        if (email === 'agutierrezt@slabcode.com' && password === 'Pass1234$') {
            return jwtService.generate(email, 'Andres Gutierrez');
        }
        throw new ServerError(400, 'Invalid credentials');
    }

    async refresh ({ email, name, token }) {
        await redisService.set({
            key: token,
            value: '1',
            timeType: 'EX',
            time: parseInt(String(process.env.JWT_REFRESH_TIME), 10)
        });
        return jwtService.generate(email, name);
    }
}

export default new AuthService();
