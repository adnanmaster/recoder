import { TestCase } from "./challenges";

export interface ValidationResult {
    success: boolean;
    passedCount: number;
    totalCount: number;
    error?: string;
    results: {
        passed: boolean;
        input: any[];
        expected: any;
        actual?: any;
        error?: string;
    }[];
}

export function validateCode(code: string, testCases: TestCase[]): ValidationResult {
    const results = [];
    let passedCount = 0;

    try {
        // Extract the function name from the code
        const functionMatch = code.match(/function\s+([a-zA-Z0-9_]+)\s*\(/);
        const functionName = functionMatch ? functionMatch[1] : null;

        if (!functionName) {
            throw new Error("Could not find a valid function declaration in the code.");
        }

        // Prepare the execution environment securely (as best as we can in the browser)
        // We wrap the user code and call the extracted function name, returning the result.
        // NOTE: In a real production app, this should be done in a Web Worker or secure sandbox iframe.
        // For this local-first MVP, a Function constructor is acceptable.
        const runCurrentTest = new Function(
            "args",
            `
      try {
        ${code}
        return ${functionName}(...args);
      } catch (err) {
        throw err;
      }
      `
        );

        for (const testCase of testCases) {
            try {
                // Deep clone input to prevent mutation issues affecting other tests
                const clonedInput = JSON.parse(JSON.stringify(testCase.input));
                const actualOutput = runCurrentTest(clonedInput);

                // Deep stringify for simple comparison (handles arrays/objects)
                const isMatch = JSON.stringify(actualOutput) === JSON.stringify(testCase.expectedOutput);

                if (isMatch) passedCount++;

                results.push({
                    passed: isMatch,
                    input: testCase.input,
                    expected: testCase.expectedOutput,
                    actual: actualOutput,
                });
            } catch (err: any) {
                results.push({
                    passed: false,
                    input: testCase.input,
                    expected: testCase.expectedOutput,
                    error: err.message || String(err),
                });
            }
        }

        return {
            success: passedCount === testCases.length,
            passedCount,
            totalCount: testCases.length,
            results,
        };
    } catch (err: any) {
        // Syntax error or parsing issue
        return {
            success: false,
            passedCount: 0,
            totalCount: testCases.length,
            error: err.message || String(err),
            results: [],
        };
    }
}
