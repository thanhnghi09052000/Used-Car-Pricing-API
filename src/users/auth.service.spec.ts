import {
    Test
} from '@nestjs/testing'

import { AuthService } from './auth.service'
import { User } from './users.entity'
import { UsersService } from './users.service'


describe('AuthService', () => {

    let service: AuthService;
    beforeEach(async () => {
        // Create a fake copy of users service
        const fakeUsersService: Partial<UsersService> = {
            find: () => Promise.resolve([]),

            create: (email: string, password: string) =>
                Promise.resolve({id: 1,email,password}as User),
        };
        const module = await Test.createTestingModule({
            providers: [
                AuthService, {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();
        service = module.get(AuthService);
    })

    it('Can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    })

    it('Creates a new user with a salted and hashed password', async()=>{
        const user = await service.signup('nghi@gmail.com','asdasdasd');
        expect(user.password).not.toEqual('asdasdasd');
        const [salt,hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    })

})