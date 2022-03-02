import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authenticationService: AuthService) {
        super({
            usernameField: 'email'
        });
    }
    async validate(email: string, password: string): Promise<User> {
        console.log('went by validate in local strategy');
        return this.authenticationService.getAuthenticatedUser(email, password);
    }
}