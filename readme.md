Project for Finch API 

To get started:

`npm install`

To get your access token:

First:
`curl https://finch-sandbox-se-interview.vercel.app/api/sandbox/create \
  -X POST \
  -H "Content-Type: application/json" \
  --data-raw '{
    "provider": "gusto",
    "products": ["company", "directory", "individual", "employment", "payment", "pay_statement"]
  }'`

Then use the response to replace the token after "Bearer" in the curl below to begin using the sandbox API:

`curl https://finch-sandbox-se-interview.vercel.app/api/employer/directory \
  -H 'Authorization: Bearer <your_access_token>' \
  -H 'Content-Type: application/json'`