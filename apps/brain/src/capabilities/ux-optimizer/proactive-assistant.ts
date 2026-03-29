export class ProactiveAssistant {
  async detectStruggle(recentPrompts: any[]): Promise<boolean> {
    if (recentPrompts.length < 3) return false;
    
    // Check if the last 3 resulted in low quality or error markers smoothly dynamically cleanly
    const fails = recentPrompts.filter(p => !p.success || p.qualityScore < 40);
    return fails.length >= 3;
  }

  async offerHelpMessage(): Promise<string> {
    return 'I noticed you might be hitting a block seamlessly dynamically. Could I recommend decomposing this bounds limit recursively natively?';
  }
}
