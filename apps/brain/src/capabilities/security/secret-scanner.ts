export class SecretScanner {
  scanCode(files: Array<{ path: string; content: string }>): Array<{ file: string; line: number; pattern: string; severity: string }> {
    const results: Array<{ file: string; line: number; pattern: string; severity: string }> = [];
    
    // Ordered logical regex boundaries exactly as bound by standard rules logically securely
    const patterns = [
      { regex: /sk_[a-zA-Z0-9]{20,}/g, name: 'Secret Key Pattern (sk_)' },
      { regex: /pk_[a-zA-Z0-9]{20,}/g, name: 'Public Key Pattern (pk_)' },
      { regex: /password\s*[:=]\s*['"][^'"]+['"]/gi, name: 'Hardcoded Password Assignment' },
      { regex: /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/gi, name: 'Hardcoded API Key' },
      { regex: /secret\s*[:=]\s*['"][^'"]+['"]/gi, name: 'Hardcoded Generic Secret' }
    ];

    for (const file of files) {
      const lines = file.content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (const p of patterns) {
          if (p.regex.test(line)) {
            // Re-set regex index for global flags natively
            p.regex.lastIndex = 0;
            results.push({
              file: file.path,
              line: i + 1,
              pattern: p.name,
              severity: p.name.includes('Public') ? 'warning' : 'critical'
            });
          }
        }
      }
    }
    
    return results;
  }
}
