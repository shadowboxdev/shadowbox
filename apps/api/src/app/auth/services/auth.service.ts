import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';

import { Providers } from '../models';

@Injectable()
export class AuthService {
    private readonly JWT_SECRET_KEY = 'oSyq8zu9RKHYrkSCRVqOe2gbC6kx2NJFWQdrinB6V85NQt9YoV3IQRMcU2AYWwCMU38+JUU+YYlXRPKfouncmb6oKLawRFpff035DzYI6ua4D/Fr0JXoSf6CP2D+K4LhMzIE2cyXWxgEdh6NpvyyfDbH8y03bF9h+BKo7YKHP8nWVdmfSCK7gMmujVv39kTxyItK9d2wRfiIrPdoeIUVo3/kVMz/MIGRuJlpCf+oMRwvHinVqrUc4WXy9a5MiF2OJJWqB0d5ktNCDfQH2w7dHJiK66u8BDbAyFXxJ06gg5SxtyXJbPKPNIL/YBRIMwPkO4eTAqBuLuX7PXa+poLN0w=='; // <- replace this with your secret key

    constructor(/*private readonly usersService: UsersService*/) {
    };

    async validateOAuthLogin(thirdPartyId: string, provider: Providers): Promise<string> {
        try {
            // @TODO add some registration logic here, 
            // to register the user using their thirdPartyId (in this case their googleId)
            // let user: IUser = await this.usersService.findOneByThirdPartyId(thirdPartyId, provider);

            // if (!user)
            // user = await this.usersService.registerOAuthUser(thirdPartyId, provider);

            const payload = {
                thirdPartyId,
                provider
            }

            const jwt: string = sign(payload, this.JWT_SECRET_KEY, { expiresIn: 3600 });
            return jwt;
        }
        catch (err) {
            throw new InternalServerErrorException('validateOAuthLogin', err.message);
        }
    }
}
