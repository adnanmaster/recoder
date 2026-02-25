export interface TestCase {
    input: any[];
    expectedOutput: any;
}

export interface Challenge {
    id: string;
    title: string;
    description: string;
    buggyCode: string;
    testCases: TestCase[];
}

// A static list of challenges for the MVP
export const CHALLENGES: Challenge[] = [
    {
        id: "day-1",
        title: "Reverse a String",
        description: "The function is supposed to reverse a string, but it's returning undefined. Fix the bug!",
        buggyCode: `function reverseString(str) {
  let reversed = "";
  for (let i = str.length - 1; i >= 0; i--) {
    reversed + str[i]; // Bug is here!
  }
  return reversed;
}`,
        testCases: [
            { input: ["hello"], expectedOutput: "olleh" },
            { input: ["recoder"], expectedOutput: "redocer" },
            { input: [""], expectedOutput: "" },
        ],
    },
    {
        id: "day-2",
        title: "Find the Maximum",
        description: "The function should find the maximum number in an array. It fails on some inputs.",
        buggyCode: `function findMax(arr) {
  let max = 0; // What happens if all numbers are negative?
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}`,
        testCases: [
            { input: [[1, 5, 3]], expectedOutput: 5 },
            { input: [[-10, -5, -2]], expectedOutput: -2 },
            { input: [[0]], expectedOutput: 0 },
        ],
    },
    {
        id: "day-3",
        title: "Two Sum",
        description: "Find two numbers in the array that add up to the target. It's returning the wrong indices.",
        buggyCode: `function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < nums.length; j++) { // Wait, can we use the same element twice?
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}`,
        testCases: [
            { input: [[2, 7, 11, 15], 9], expectedOutput: [0, 1] },
            { input: [[3, 2, 4], 6], expectedOutput: [1, 2] },
            { input: [[3, 3], 6], expectedOutput: [0, 1] },
        ],
    }
];

// Get the daily challenge based on the current date (UTC)
export function getDailyChallenge(): Challenge {
    const today = new Date();
    // Simply use the day of the year to pick a challenge (looping if necessary)
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const index = dayOfYear % CHALLENGES.length;
    return CHALLENGES[index];
}
