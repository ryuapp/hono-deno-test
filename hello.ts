import { serve } from 'https://deno.land/std/http/server.ts'
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { bearerAuth, serveStatic } from 'https://deno.land/x/hono/middleware.ts'
import testList from "./static/test.json" assert { type: "json" };

const app = new Hono()
const token = 'honoiscool'

app.use('/*', bearerAuth({ token }))
app.get('/', (c) => c.json({
    message: "Hello Hono!"
}))
app.get('/api/post', serveStatic({ path: './static/test.json' }))
app.get('/api/ggez', async () => {
    const res = await fetch("https://ggez.deno.dev/api")
    return res
})
app.get('/api/test', () => {
    const body = JSON.stringify(testList);
    return new Response(body,{
        headers:{"Content-Type": "application/json"}
      });
})
app.get('/api/test/1', () => {
    const body = JSON.stringify(testList[1]);
    return new Response(body,{
        headers:{"Content-Type": "application/json"}
      });
})

serve(app.fetch)