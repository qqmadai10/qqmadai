
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer c6be26a198a44ac88cc3336ffd230344.UAN4faq8ureEWbik'
      },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: messages,
        stream: true
      })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    res.setHeader('Content-Type', 'text/event-stream');
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value));
    }
    
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
