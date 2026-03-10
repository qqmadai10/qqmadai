

interface ChatHistoryItem {
  role: 'user' | 'model';
  text: string;
}

export const sendMessageToAIStream = async (
  userMessage: string, 
  history: ChatHistoryItem[],
  onChunk: (chunk: string) => void,
  thinkingEnabled: boolean = true,
  customSystemInstruction?: string,
  signal?: AbortSignal
): Promise<void> => {
  try {
    const response = await fetch('https://qqmadai10.github.io/qqmadai/api.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        history,
        thinkingEnabled,
        customSystemInstruction
      }),
      signal
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch response');
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('Response body is missing');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep the last incomplete line in the buffer
      
      for (const line of lines) {
        if (line.trim() === '') continue;
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;
          
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              onChunk(parsed.text);
            }
          } catch (e) {
            console.error('Error parsing chunk:', e);
          }
        }
      }
    }

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('Generation stopped by user');
      onChunk("\n\n*[已停止生成]*");
      return;
    }
    console.error("AI Service Error:", error);
    onChunk("\n\n思维连接中断了，请检查网络连接。");
  }
};
