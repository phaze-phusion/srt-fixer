import {RX, UNI} from "../_constants";

export function showNonAsciiCharacters(text, include_lyrics) {
  // https://stackoverflow.com/a/2124144
  let nonAscii = text.match(new RegExp(`[^\\x00-\\x7F${RX.N_DASH}${RX.M_DASH}${include_lyrics ? (RX.NOTE_1 + RX.NOTE_2) : ''}]`, 'g')) || [];
  const result = [];
  const sampleLength = 10;

   for (let monty = 0, python = 0; monty < nonAscii.length; monty++) {
     const character = nonAscii[monty];
     const indexInText = text.indexOf(character, python);
     const textBefore = text.substring(indexInText-sampleLength, indexInText)
       .replace(new RegExp(`${RX.BREAKS}`, 'g'), '\\n');
     const textAfter = text.substring(indexInText, indexInText+sampleLength)
       .replace(new RegExp(`${RX.BREAKS}`, 'g'), '\\n');

     result.push(
       `${character} | ${character.charCodeAt(0)} | ${textBefore}${textAfter}`
     );
     python = indexInText + 1;
   }


  // Different encoding used for english language files
  // https://www.thesitewizard.com/html-tutorial/pound-sign-not-showing-up-correctly.shtml
  if (result.length !== 0)
    result.push('', `Try 'ISO 8859-1' instead of UTF-8`);

  return result.length !== 0 ? result.join(UNI.BREAK) : '----- None -----';
}
