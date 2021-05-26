import { Random } from "excalibur";

export function binary(decimal: number, digits?: number) {
  const bin = decimal.toString(2);
  if (bin.length > (digits ?? 1000000)) {
    throw new Error("Length is longer than digits");
  }
  return digits ? "0".repeat(digits - bin.length) + bin : bin;
}

function capitaliseWord(word: string) {
  return word.charAt(0).toUpperCase() + word.toLowerCase().slice(1);
}

export function displayStat(stat: string, num: number | string, isCorrect: boolean) {
  const element = document.getElementById(stat)!;
  element.innerText = `${capitaliseWord(stat)}: ${num}`;

  // These two lines reset the animation https://stackoverflow.com/a/45036752/13837629
  element.style.animation = "none";
  element.offsetHeight;

  element.style.animation = `${isCorrect ? "correct" : "incorrect"} 0.5s`;
}

const rand = new Random();

export function randInt(minValue: number, maxValue: number) {
  return rand.integer(minValue, maxValue);
}

export function randNumArray(minValue: number, maxValue: number, size: number) {
  // TODO: Talk about why this exists in evaluation
  /* I could have just checked if the game level was 1 
  but I did it like this to make it usable in other projects */
  const range = maxValue - minValue + 1;
  if (range < size) size = range;

  // Modified from https://stackoverflow.com/a/50652249/13837629
  /* Sets are unordered arrays that can only have unique elements
  so there's no need to check if the number already exists */
  const randNums = new Set();

  while (randNums.size !== size) randNums.add(randInt(minValue, maxValue));
  return numericalSort([...randNums] as number[]);
}

export function arrayIndexToButtonId(index: number) {
  return `b${index + 1}`;
}

function numericalSort(numberArray: number[]) {
  // https://stackoverflow.com/a/1063027/13837629
  return numberArray.sort((a, b) => a - b);
}
