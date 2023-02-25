import { serve } from 'https://deno.land/std/http/server.ts'
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { bearerAuth } from 'https://deno.land/x/hono/middleware.ts'

const app = new Hono()
const token = 'honoiscool'

app.use('/', bearerAuth({ token }))
app.get('/', (c) => c.json({
    message: "Hello Hono!"
}))

serve(app.fetch)