import { clampPage, pageOffset } from './pagination';


describe('pagination helpers', () => {
  it('clamps direct page navigation to the available range', () => {
    expect(clampPage(0, 115)).toBe(1);
    expect(clampPage(42, 115)).toBe(42);
    expect(clampPage(999, 115)).toBe(115);
  });

  it('converts a page to an API offset', () => {
    expect(pageOffset(1, 15, 115)).toBe(0);
    expect(pageOffset(42, 15, 115)).toBe(615);
    expect(pageOffset(999, 15, 115)).toBe(1710);
  });
});
