export function analyzeCode(code: string): string | null {
    if (code.includes('var ')) {
        return "Try using 'let' or 'const' instead of 'var'.";
    } else if (code.includes('==')) {
        return "Consider using '===' for strict comparison.";
    }
    return null; // No issues found
}
