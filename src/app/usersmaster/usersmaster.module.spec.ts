import { UsersmasterModule } from './usersmaster.module';

describe('UsersmasterModule', () => {
  let usersmasterModule: UsersmasterModule;

  beforeEach(() => {
    usersmasterModule = new UsersmasterModule();
  });

  it('should create an instance', () => {
    expect(usersmasterModule).toBeTruthy();
  });
});
