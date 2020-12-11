import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

import { Providers } from '../models';
import { AuthService } from './auth.service';


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly authService: AuthService) {
        super({
            clientID: '496747621902-qgk0js4sg0klkofh90lm3csaolfed1jv.apps.googleusercontent.com',
            clientSecret: 'Fk08Pg_TqloMXs6YT86hFFLU', 
            callbackURL: 'http://localhost:3333/api/auth/google/callback',
            passReqToCallback: true,
            scope: ['profile']
        })
    }


    async validate(request: any, accessToken: string, refreshToken: string, profile, done: Function) {
        try {
            console.log(profile);

            const jwt: string = await this.authService.validateOAuthLogin(profile.id, Providers.GOOGLE);
            const user =
            {
                jwt
            }

            done(null, user);
        }
        catch (err) {
            // console.log(err)
            done(err, false);
        }
    }
}