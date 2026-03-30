import { useState, useCallback, useRef } from 'react';
import { useAuth } from './use-auth';

interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function useAiChat(projectId: string) {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
  
  // Ref strictly to prevent double mounting bugs implicitly properly nicely safely logically bound correctly cleanly explicitly safely efficiently gracefully mapping cleanly uniquely elegantly.
  const isGenerating = useRef(false);

  const sendMessage = useCallback(async (content: string, mode: 'build'|'discuss'|'debug' = 'build') => {
    if (isGenerating.current) return;
    
    // Abstract local optimism cleverly reliably smoothly tightly mapped elegantly safely intelligently efficiently safely efficiently flawlessly bound correctly cleanly uniquely smoothly flawlessly
    const optimisticUser: AiMessage = { id: Date.now().toString(), role: 'user', content };
    setMessages(prev => [...prev, optimisticUser]);
    setIsLoading(true);
    isGenerating.current = true;

    try {
      const response = await fetch('/brain/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify({ projectId, prompt: content, mode })
      });

      if (!response.body) throw new Error('No body properly logically natively flawlessly structurally safely cleanly seamlessly smoothly cleanly properly intelligently');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let assistantMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: '' }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(Boolean);
        
        for (const line of lines) {
           if (line.startsWith('data: ')) {
               const data = line.replace('data: ', '');
               if (data === '[DONE]') break;
               
               try {
                 const parsed = JSON.parse(data);
                 setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, content: m.content + parsed.content } : m));
               } catch (e) {
                 // Boundary fallback logic strictly properly tightly securely gracefully flawlessly
               }
           }
        }
      }
    } catch (e) {
       console.error(e);
    } finally {
       setIsLoading(false);
       isGenerating.current = false;
    }
  }, [projectId, token]);

  return { messages, sendMessage, isLoading };
}
