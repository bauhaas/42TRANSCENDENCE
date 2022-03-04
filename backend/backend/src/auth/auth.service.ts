import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import RegisterDto from './register.dto';
//import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import TokenPayload from './tokenPayload.interface';
import PostgresErrorCode from './postgresErrorCodes.enum';
//import * as argon2 from "argon2";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    public async register(registrationData: RegisterDto) {
        console.log('went by register in auth service');
        //const hashedPassword = await bcrypt.hash(registrationData.password, 10);
        //const hashedPassword = await argon2.hash(registrationData.password);
        const hashedPassword = registrationData.password;

        //console.log('argon2 hash suceess  in auth service');
        try {
            const createdUser = await this.usersService.create({
                ...registrationData,
                password: hashedPassword
            });
            createdUser.password = undefined;
            console.log('SUCESS: new user registered');
            return createdUser;
        } catch (error) {
            if (error?.code === PostgresErrorCode.UniqueViolation) {
                console.log('FAIL: new user isn\'t registered');
                throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
            }
            console.log('FAIL: new user isn\'t registered');
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public getCookieWithJwtToken(userId: number) {
        console.log('went by getcookiewithjwttoken in auth service');
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_EXPIRATION_TIME}`;
    }

    public getCookieForLogOut() {
        console.log('went by getcookieforlogout in auth service');
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }

    public async getAuthenticatedUser(email: string, plainTextPassword: string) {
        console.log('went by getcauthenticateduser in auth service');
        try {
            const user = await this.usersService.getByEmail(email);
            await this.verifyPassword(plainTextPassword, user.password);
            return user;
        } catch (error) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
    }

    private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
        console.log('went by verifypassword in auth service');
        //const isPasswordMatching = await bcrypt.compare(
        /*
        const isPasswordMatching = await argon2.verify(
            plainTextPassword,
            hashedPassword
        );
        */
        //if (!isPasswordMatching) {
        if (plainTextPassword != hashedPassword) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
    }
}