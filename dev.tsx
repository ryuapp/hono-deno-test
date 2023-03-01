import { serve } from "$http/server.ts";
import { Hono } from "$hono/mod.ts";
import { bearerAuth } from "$hono/middleware.ts";
import { TopPage } from "./pages/index.tsx";

const app = new Hono();
const token = "honoiscool";
async function existFile(filepath: string): Promise<boolean> {
  try {
    await Deno.stat(filepath);
    return true;
  } catch (e) {
    return false;
  }
}

app.get("/", (c) => {
  return c.html(<TopPage />)
});

app.use("/api/*", bearerAuth({ token }));
app.get("/api/armor/get/:name", async (c) => {
  const name: string = c.req.param("name");
  const fileName: string = name + ".json";
  const filePath: string = "./database/" + fileName;

  if (!(await existFile(filePath))) {
    return c.json({
      message: fileName + " doesn't exist.",
    });
  }
  const file = await Deno.open(filePath, { read: true });
  const fileContent = Deno.readAllSync(file);
  Deno.close(file.rid);

  return new Response(fileContent, {
    headers: { "Content-Type": "application/json" },
  });
});
app.post("/api/armor/create/:name", async (c) => {
  const name: string = c.req.param("name");
  const encoder = new TextEncoder();
  const contentBytes = encoder.encode("[\n{\n}\n]");
  const fileName: string = name + ".json";
  const filePath: string = "./database/" + fileName;

  if (await existFile(filePath)) {
    return c.json({
      message: fileName + " already exists.",
    });
  }
  const file = await Deno.open(filePath, { write: true, create: true });

  Deno.writeAllSync(file, contentBytes);
  Deno.close(file.rid);

  return c.json({
    message: fileName + " is created.",
  });
});

serve(app.fetch);
