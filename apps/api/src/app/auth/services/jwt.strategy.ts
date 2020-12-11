import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt')
{

    constructor(/*private readonly authService: AuthService*/) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'oSyq8zu9RKHYrkSCRVqOe2gbC6kx2NJFWQdrinB6V85NQt9YoV3IQRMcU2AYWwCMU38+JUU+YYlXRPKfouncmb6oKLawRFpff035DzYI6ua4D/Fr0JXoSf6CP2D+K4LhMzIE2cyXWxgEdh6NpvyyfDbH8y03bF9h+BKo7YKHP8nWVdmfSCK7gMmujVv39kTxyItK9d2wRfiIrPdoeIUVo3/kVMz/MIGRuJlpCf+oMRwvHinVqrUc4WXy9a5MiF2OJJWqB0d5ktNCDfQH2w7dHJiK66u8BDbAyFXxJ06gg5SxtyXJbPKPNIL/YBRIMwPkO4eTAqBuLuX7PXa+poLN0w=='
        });
    }

    public async validate(payload, done: Function) {
        try {

            console.log(payload);
            // You could add a function to the authService to verify the claims of the token:
            // i.e. does the user still have the roles that are claimed by the token
            //const validClaims = await this.authService.verifyTokenClaims(payload);

            //if (!validClaims)
            //    return done(new UnauthorizedException('invalid token claims'), false);

            done(null, payload);
        }
        catch (err) {
            throw new UnauthorizedException('unauthorized', err.message);
        }
    }

}