const HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Text Translator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        .container {
            max-width: 600px;
            margin: auto;
        }
        textarea, select, button {
            width: 100%;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Text Translator</h1>
        <textarea id="text" rows="4" placeholder="Enter text to translate..."></textarea>
        <select id="source_lang">
            <option value="en">English</option>
            <option value="ja">Japanese</option>
            <option value="zh">Chinese</option>
        </select>
        <select id="target_lang">
            <option value="en">English</option>
            <option value="ja">Japanese</option>
            <option value="zh">Chinese</option>
        </select>
        <button id="translate">Translate</button>
        <h2>Translation Result:</h2>
        <p id="result"></p>
    </div>

    <script>
        document.getElementById('translate').addEventListener('click', async () => {
            const text = document.getElementById('text').value;
            const source_lang = document.getElementById('source_lang').value;
            const target_lang = document.getElementById('target_lang').value;

            const response = await fetch('/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text, source_lang, target_lang })
            });

            if (response.ok) {
                const data = await response.json();
                document.getElementById('result').textContent = data.response.translated_text;
            } else {
                document.getElementById('result').textContent = 'Translation failed';
            }
        });
    </script>
</body>
</html>
`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/translate' && request.method === 'POST') {
      try {
        const { text, source_lang, target_lang } = await request.json();
        
        const inputs = {
          text: text || 'Tell me a joke about Cloudflare',
          source_lang: source_lang || 'en',
          target_lang: target_lang || 'fr',
        };
        
        const response = await env.AI.run('@cf/meta/m2m100-1.2b', inputs);

        return new Response(JSON.stringify({ inputs, response }), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        return new Response('Invalid input', { status: 400 });
      }
    }

    return new Response(HTML, {
      headers: { 'Content-Type': 'text/html' },
    });
  },
};
