import { GroupmasterModule } from './groupmaster.module';

describe('GroupmasterModule', () => {
  let groupmasterModule: GroupmasterModule;

  beforeEach(() => {
    groupmasterModule = new GroupmasterModule();
  });

  it('should create an instance', () => {
    expect(groupmasterModule).toBeTruthy();
  });
});
