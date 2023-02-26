import { serve } from "$http/server.ts";
import { Hono } from '$hono/mod.ts'
import { bearerAuth, serveStatic } from '$hono/middleware.ts'
import testList from "./static/test.json" assert { type: "json" };

const app = new Hono()
const token = 'honoiscool'
async function existFile(filepath: string): Promise<boolean> {
    try {
        const file = await Deno.stat(filepath);
        return true;
    } catch (e) {
        return false
    }
}

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
    return new Response(body, {
        headers: { "Content-Type": "application/json" }
    });
})
app.get('/api/test/1', () => {
    const body = JSON.stringify(testList[1]);
    return new Response(body, {
        headers: { "Content-Type": "application/json" }
    });
})
app.get('/api/armor/get/:name', async (c) => {
    const name = c.req.param('name')
    const fileName = name + '.json'
    const filePath = './database/' + fileName

    if (!await existFile(filePath)) {
        return c.json({
            message: fileName + " doesn't exist."
        })
    }
    const file = await Deno.open(filePath, { read: true });
    const fileContent = Deno.readAllSync(file);
    Deno.close(file.rid);

    return new Response(fileContent, {
        headers: { "Content-Type": "application/json" }
    });
})
app.post('/api/armor/create/:name', async (c) => {
    const name = c.req.param("name")
    const encoder = new TextEncoder();
    const contentBytes = encoder.encode("[\n{\n}\n]");
    const fileName = name + '.json'
    const filePath = './database/' + fileName

    if (await existFile(filePath)) {
        return c.json({
            message: fileName + " already exists."
        })
    }
    const file = await Deno.open(filePath, { write: true, create: true })

    Deno.writeAllSync(file, contentBytes)
    Deno.close(file.rid)

    return c.json({
        message: fileName + " is created."
    })
})

serve(app.fetch)