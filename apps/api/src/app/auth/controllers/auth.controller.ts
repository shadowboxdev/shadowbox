import { Controller, Get, UseGuards, Res, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { API_ROOT_PATH } from '@api/auth/constants';

@ApiTags(API_ROOT_PATH)
@Controller(API_ROOT_PATH)
export class AuthController {

    @Get('google')
    @UseGuards(AuthGuard('google'))
    public googleLogin() {
        // initiates the Google OAuth2 login flow
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    public googleLoginCallback(@Req() req, @Res() res) {
        // handles the Google OAuth2 callback
        const jwt: string = req.user.jwt;
        console.log(jwt);
        if (jwt)
            res.redirect('http://localhost:4200/login/succes/' + jwt);
        else
            res.redirect('http://localhost:4200/login/failure');
    }

    @Get('protected')
    @UseGuards(AuthGuard('jwt'))
    protectedResource()
    {
        return 'JWT is working!';
    }
}
