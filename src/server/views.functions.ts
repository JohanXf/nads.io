import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createHash } from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const recordView = createServerFn({ method: "POST" })
  .inputValidator((d: { username: string }) => d)
  .handler(async ({ data }) => {
    const req = getRequest();
    const fwd = req.headers.get("x-forwarded-for") || "";
    const ip =
      fwd.split(",")[0].trim() ||
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const ipHash = createHash("sha256")
      .update(`${ip}:${data.username.toLowerCase()}`)
      .digest("hex");

    const { data: count } = await supabaseAdmin.rpc("record_profile_view", {
      _username: data.username.toLowerCase(),
      _ip_hash: ipHash,
    });

    return { views: typeof count === "number" ? count : 0 };
  });
