import { getLookupKeywords, linkifyKeywords } from './keywordLinkifier';
import { cleanDisplaySummary } from './text';

describe('article text cleanup', () => {
  it('removes inline Save Share toolbar text', () => {
    expect(
      cleanDisplaySummary(
        "Millions lost power. Save Share Cuba's national power grid collapsed."
      )
    ).toBe("Millions lost power. Cuba's national power grid collapsed.");
  });

  it('does not expose or link contaminated entities', () => {
    const entities = ['Save Share Cuba', 'Cuba', 'US'];

    expect(getLookupKeywords(entities)).toEqual(['Cuba', 'US']);
    expect(linkifyKeywords('Save Share Cuba and the US responded.', entities)).not.toContain(
      'search=Save%20Share%20Cuba'
    );
  });

  it('removes BBC player errors and standalone Roman numerals', () => {
    expect(
      cleanDisplaySummary(
        'This video can not be played Spain reached the World Cup final.'
      )
    ).toBe('Spain reached the World Cup final.');
    expect(
      getLookupKeywords(['This video cannot be played', 'III', 'PWHL', 'Spain', 'CDC'])
    ).toEqual(['Spain', 'PWHL', 'CDC']);
  });

  it('removes merged entities when every component is already an entity', () => {
    expect(
      getLookupKeywords(['France Spain', 'France', 'Spain', 'World Cup'])
    ).toEqual(['World Cup', 'France', 'Spain']);
  });
});
