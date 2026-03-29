export class UserCodeScanner {
  scanGeneratedCode(files: Array<{ path: string; content: string }>): Array<{ file: string; issue: string; severity: string; suggestion: string }> {
    const results: Array<{ file: string; issue: string; severity: string; suggestion: string }> = [];

    for (const file of files) {
      const content = file.content;
      
      if (/eval\s*\(/.test(content)) {
        results.push({ file: file.path, issue: 'eval() used', severity: 'critical', suggestion: 'Remove eval completely. It enables arbitrary code execution natively.' });
      }
      if (/new\s+Function\s*\(/.test(content)) {
        results.push({ file: file.path, issue: 'Function() constructor used', severity: 'critical', suggestion: 'Refactor dynamic string executions.' });
      }
      if (/dangerouslySetInnerHTML/.test(content) && !/DOMPurify/.test(content)) {
        results.push({ file: file.path, issue: 'dangerouslySetInnerHTML without DOMPurify', severity: 'high', suggestion: 'Wrap inner HTML injection via DOMPurify explicitly.' });
      }
      if (/\.innerHTML\s*=/.test(content)) {
        results.push({ file: file.path, issue: 'innerHTML assignment', severity: 'medium', suggestion: 'Use innerText or textContent instead natively.' });
      }
      if (/document\.cookie/.test(content) && !/httpOnly/i.test(content)) {
        results.push({ file: file.path, issue: 'Cookie without httpOnly', severity: 'medium', suggestion: 'Use HTTP-only headers from the server to assign cookies securely.' });
      }
      if (/(sk_|pk_|password=)/.test(content)) {
        results.push({ file: file.path, issue: 'Hardcoded credentials', severity: 'high', suggestion: 'Load secrets exclusively via env interfaces.' });
      }
    }

    return results;
  }
}
