import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const BOT_TOKEN = Deno.env.get("BOT_TOKEN")!;
const CHANNEL_ID = Deno.env.get("CHANNEL_ID")!;

serve(async (req) => {
  if (req.method === "GET") {
    return new Response(`
      <html><body style="text-align:center;margin-top:100px;font-family:sans-serif">
        <h2>Movie Uploader 2GB</h2>
        <form method="POST" enctype="multipart/form-data">
          <input type="file" name="file" required><br><br>
          <button type="submit" style="padding:10px 20px">Upload to Telegram</button>
        </form>
      </body></html>
    `, { headers: { "content-type": "text/html" } });
  }

  const form = await req.formData();
  const file = form.get("file") as File;

  const tgForm = new FormData();
  tgForm.append("chat_id", CHANNEL_ID);
  tgForm.append("document", file, file.name);
  tgForm.append("caption", file.name);

  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
    method: "POST",
    body: tgForm,
  });

  return new Response(await res.text(), { headers: { "content-type": "application/json" } });
});
