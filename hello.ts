import { serve } from 'https://deno.land/std/http/server.ts'
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { serveStatic } from 'npm:hono/deno'
import { bearerAuth } from 'https://deno.land/x/hono/middleware.ts'

const app = new Hono()
const token = 'honoiscool'

app.use('/test.txt', bearerAuth({ token }), serveStatic({ root:"./static" }))
app.get('/', (c) => c.json({
    message: "Hello Hono!"
}))
app.get('/test.txt', (c) => c.json({
    message: "access ./test.txt!"
}))

serve(app.fetch)