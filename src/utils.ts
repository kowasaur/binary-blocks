import { Random } from "excalibur";
import { game } from "./index";

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

export function displayStat(stat: string, num: number | string) {
  const element = document.getElementById(stat);
  element!.innerText = `${capitaliseWord(stat)}: ${num}`;
}

const rand = new Random();

export function randInt(minValue: number, maxValue: number) {
  if (game.level === 1) {
    maxValue = 1;
  }
  return rand.integer(minValue, maxValue);
}

export function randNumArray(minValue: number, maxValue: number, size: number) {
  // TODO: Talk about why this exists in evaluation
  if (game.level === 1) {
    size = 2;
  }

  // Modified from https://stackoverflow.com/a/50652249/13837629
  // Sets are unordered arrays that can only have unique elements
  // so there's no need to check if the number already exists
  const randNums = new Set();

  while (randNums.size !== size) randNums.add(randInt(minValue, maxValue));
  return [...randNums] as number[];
}

export function arrayIndexToButtonId(index: number) {
  return `b${index + 1}`;
}
