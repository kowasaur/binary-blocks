// All of these functions are designed to be able to be used in other projects

import { Random } from "excalibur";

/* This function converts a number to binary
The ? next to digits means it is optional */
export function binary(decimal: number, digits?: number) {
  // This assigns bin the decimal equivalent of the inputted number
  const bin = decimal.toString(2);
  /* digits is how long the returned string should be. If the length of the bin variable
  is longer than digits, then it doesn't work. 
  digits ?? 1000000 means if digits is undefined (since its optional) then use 
  the value 1000000 in this if statement instead */
  if (bin.length > (digits ?? 1000000)) {
    throw new Error("Length is longer than digits");
  }
  /* If digits is undefined then just return the bin variable, otherwise add 0s to the
  start of the bin digit so it has the length of the variable digits and return that*/
  return digits ? "0".repeat(digits - bin.length) + bin : bin;
}

function capitaliseWord(word: string) {
  // Capitalise the first letter and add all the other letters
  return word.charAt(0).toUpperCase() + word.toLowerCase().slice(1);
}

export function displayStat(stat: string, num: number, isCorrect: boolean, isBinary: boolean) {
  // assign the variable element a reference to the element with the id of the stat variable
  const element = document.getElementById(stat)!;
  /* Set the text of the element to the capitalised stat followed by a colon and then
  if isBinary is true, it adds num in binary and if it's false it adds it normally */
  element.innerText = `${capitaliseWord(stat)}: ${isBinary ? binary(num) : num}`;

  // These two lines reset the animation https://stackoverflow.com/a/45036752/13837629
  element.style.animation = "none";
  element.offsetHeight;

  // Play the correct animation if it's correct and the incorrect animation if it's incorrect
  element.style.animation = `${isCorrect ? "correct" : "incorrect"} 0.5s`;
}

// Instantiate a new instance of the excalibur Random and assign it to rand
const rand = new Random();

export function randInt(minValue: number, maxValue: number) {
  return rand.integer(minValue, maxValue);
}

export function randNumArray(minValue: number, maxValue: number, size: number) {
  /* I could have just checked if the game level was 1 
  but I did it like this to make it usable in other projects */
  const range = maxValue - minValue + 1;
  /* If the range of values is smaller than the size then it sets the size to the range.
  I did this because if the range is smaller than the size the while loop will go forever. 
  For example, if the size is 4 but the range is minValue is 0 and the maxValue is 1, 
  the set will only get to {0, 1} but the loop will keep going since
  it will go until the set's size is equal to 4. This will cause the page to freeze */
  if (range < size) size = range;

  // Modified from https://stackoverflow.com/a/50652249/13837629
  /* Sets are unordered arrays that can only have unique elements
  An array wasn't chosen since I only want unique values
  and with a set there's no need to check if the number already exists */
  const randNums = new Set();

  /* Add random integers that are between the minValue and maxValue 
  to the randNums set until the size of the set equal to the variable size */
  while (randNums.size !== size) randNums.add(randInt(minValue, maxValue));
  // converts the set to an array and sorts it and then returns that value
  return numericalSort([...randNums] as number[]);
}

// Turns a number into a button id
export function arrayIndexToButtonId(index: number) {
  return `b${index + 1}`;
}

// Sorts an array of numbers from smallest to largest
function numericalSort(numberArray: number[]) {
  // https://stackoverflow.com/a/1063027/13837629
  return numberArray.sort((a, b) => a - b);
}
