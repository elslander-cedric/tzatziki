import { TzatzikiPage } from './app.po';

describe('tzatziki App', () => {
  let page: TzatzikiPage;

  beforeEach(() => {
    page = new TzatzikiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
