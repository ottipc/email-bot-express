**starten des Backends :** 

npm start -> Server running on port 3000

**starten des Frontends:**

npm run serve


**ChatGPT API Billing:**

https://platform.openai.com/settings/organization/billing/overview


**Test Call ob die Api ueberhaupt funktioniert:**

```
curl https://api.openai.com/v1/chat/completions \
-H "Authorization: Bearer YOUR_API_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "gpt-3.5-turbo",
"messages": [{"role": "user", "content": "Hello, ChatGPT!"}],
"max_tokens": 50
}'
```


**API Schluessel testen:**

```
curl https://api.openai.com/v1/models \
-H "Authorization: Bearer YOUR_API_KEY"
```

**ChatGPT sollte zeigen:**
![img.png](img.png)