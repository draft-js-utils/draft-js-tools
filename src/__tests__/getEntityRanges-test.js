/* @flow */
const {describe, it, xit} = global;
import expect from 'expect';
import {INLINE_STYLE} from '../Constants';
import getEntityRanges, {EMPTY_SET} from '../getEntityRanges';
import {List, Repeat} from 'immutable';
import {CharacterMetadata} from 'draft-js';

import type {CharacterMetaList} from '../getEntityRanges';

const EMPTY_META = CharacterMetadata.EMPTY;
const {BOLD, ITALIC} = INLINE_STYLE;
const BOLD_CHAR = CharacterMetadata.applyStyle(EMPTY_META, BOLD);
const ITALIC_CHAR = CharacterMetadata.applyStyle(EMPTY_META, ITALIC);

describe('getEntityRanges', () => {
  it('should accept empty input', () => {
    let emptyCharMeta: CharacterMetaList = List();
    let emptyStyleRange = ['', EMPTY_SET];
    let emptyEntityRange = [null, [emptyStyleRange]];
    expect(getEntityRanges('', emptyCharMeta)).toEqual(
      [emptyEntityRange]
    );
  });

  // TODO: Fix this test.
  xit('should parse string of plain text', () => {
    let text = 'hello';
    let charMeta = List(Repeat(EMPTY_META, text.length));
    let styleRange = [text, EMPTY_SET];
    let entityRange = [null, [styleRange]];
    expect(getEntityRanges(text, charMeta)).toEqual(
      [entityRange]
    );
  });

  // TODO: Fix this test.
  xit('should parse a string with styled characters', () => {
    let text = 'hello';
    let charMeta: CharacterMetaList = List.of(
      EMPTY_META,
      BOLD_CHAR,
      EMPTY_META,
      EMPTY_META,
      ITALIC_CHAR,
    );
    let styleRanges = [
      ['h', EMPTY_SET],
      ['e', EMPTY_SET.add(BOLD)],
      ['ll', EMPTY_SET],
      ['o', EMPTY_SET.add(ITALIC)],
    ];
    let entityRange = [null, styleRanges];
    expect(getEntityRanges(text, charMeta)).toEqual(
      [entityRange]
    );
  });

  // TODO: Fix this test.
  xit('should parse a string with entity and styled characters', () => {
    let text = 'hello';
    let entKey = 'cv70al';
    // Here the first three chars are bold but the entity spans "ell".
    let charMeta: CharacterMetaList = List.of(
      BOLD_CHAR,
      CharacterMetadata.applyEntity(BOLD_CHAR, entKey),
      CharacterMetadata.applyEntity(BOLD_CHAR, entKey),
      CharacterMetadata.applyEntity(EMPTY_META, entKey),
      EMPTY_META,
    );
    let entityRange1 = [null, [
      ['h', EMPTY_SET.add(BOLD)],
    ]];
    let entityRange2 = [entKey, [
      ['el', EMPTY_SET.add(BOLD)],
      ['l', EMPTY_SET],
    ]];
    let entityRange3 = [null, [
      ['o', EMPTY_SET],
    ]];
    expect(getEntityRanges(text, charMeta)).toEqual(
      [entityRange1, entityRange2, entityRange3]
    );
  });
});
