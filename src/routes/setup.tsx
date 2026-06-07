import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SiteHeader } from "@/components/SiteHeader";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Upload, ExternalLink, Loader2, Crown, Image as ImageIcon, Music, Video } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/setup")({
  component: SetupPage,
});

const usernameSchema = z
  .string()
  .trim()
  .min(3, "At least 3 characters")
  .max(20, "20 characters max")
  .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, underscores only");

interface LinkRow {
  id?: string;
  label: string;
  url: string;
}

function SetupPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [musicTitle, setMusicTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [avatarDecoration, setAvatarDecoration] = useState(true);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingMusic, setUploadingMusic] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [links, setLinks] = useState<LinkRow[]>([{ label: "", url: "" }]);
  const [usernameError, setUsernameError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (profile) {
        setUsername(profile.username ?? "");
        setDisplayName(profile.display_name ?? "");
        setBio(profile.bio ?? "");
        setAvatarUrl(profile.avatar_url ?? null);
        setBannerUrl((profile as any).banner_url ?? null);
        setMusicUrl((profile as any).music_url ?? null);
        setMusicTitle((profile as any).music_title ?? "");
        setVideoUrl((profile as any).video_url ?? null);
        setIsPremium(Boolean((profile as any).is_premium));
        setAvatarDecoration((profile as any).avatar_decoration_enabled ?? true);
      }
      const { data: linkRows } = await supabase
        .from("links")
        .select("*")
        .eq("profile_id", user.id)
        .order("position");
      if (linkRows && linkRows.length > 0) {
        setLinks(linkRows.map((l) => ({ id: l.id, label: l.label, url: l.url })));
      }
      setLoading(false);
    })();
  }, [user]);

  const onAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const ALLOWED_TYPES: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
    };
    if (!ALLOWED_TYPES[file.type]) {
      toast.error("Only JPEG, PNG, WebP, or GIF images allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }
    setUploading(true);
    const ext = ALLOWED_TYPES[file.type];
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, {
      upsert: true,
      contentType: file.type,
    });
    if (error) {
      toast.error("Upload failed", { description: error.message });
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(data.publicUrl);
    setUploading(false);
    toast.success("Avatar updated");
  };

  const onBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) { toast.error("Banner must be an image"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Banner must be under 5MB"); return; }
    setUploadingBanner(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/banner-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("banners").upload(path, file, { upsert: true, contentType: file.type });
    if (error) { toast.error("Upload failed", { description: error.message }); setUploadingBanner(false); return; }
    const { data } = supabase.storage.from("banners").getPublicUrl(path);
    setBannerUrl(data.publicUrl);
    setUploadingBanner(false);
    toast.success("Banner uploaded");
  };

  const onMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith("audio/")) { toast.error("Must be an audio file"); return; }
    if (file.size > 8 * 1024 * 1024) { toast.error("Audio must be under 8MB"); return; }
    setUploadingMusic(true);
    const ext = file.name.split(".").pop() || "mp3";
    const path = `${user.id}/music-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("music").upload(path, file, { upsert: true, contentType: file.type });
    if (error) { toast.error("Upload failed", { description: error.message }); setUploadingMusic(false); return; }
    const { data } = supabase.storage.from("music").getPublicUrl(path);
    setMusicUrl(data.publicUrl);
    if (!musicTitle) setMusicTitle(file.name.replace(/\.[^.]+$/, ""));
    setUploadingMusic(false);
    toast.success("Music uploaded");
  };

  const onVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith("video/")) { toast.error("Must be a video file"); return; }
    if (file.size > 20 * 1024 * 1024) { toast.error("Video must be under 20MB"); return; }
    setUploadingVideo(true);
    const ext = file.name.split(".").pop() || "mp4";
    const path = `${user.id}/video-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("videos").upload(path, file, { upsert: true, contentType: file.type });
    if (error) { toast.error("Upload failed", { description: error.message }); setUploadingVideo(false); return; }
    const { data } = supabase.storage.from("videos").getPublicUrl(path);
    setVideoUrl(data.publicUrl);
    setUploadingVideo(false);
    toast.success("Video uploaded");
  };


    e.preventDefault();
    if (!user) return;

    const parsed = usernameSchema.safeParse(username);
    if (!parsed.success) {
      setUsernameError(parsed.error.issues[0].message);
      return;
    }
    setUsernameError("");

    setSaving(true);

    // Upsert profile (insert if missing, update if present)
    const { error: profileErr } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        username: parsed.data,
        display_name: displayName.trim() || null,
        bio: bio.trim() || null,
        avatar_url: avatarUrl,
        banner_url: isPremium ? bannerUrl : null,
        music_url: isPremium ? musicUrl : null,
        music_title: isPremium ? (musicTitle.trim() || null) : null,
        avatar_decoration_enabled: isPremium ? avatarDecoration : true,
      } as any, { onConflict: "id" });

    if (profileErr) {
      setSaving(false);
      if (profileErr.code === "23505") {
        setUsernameError("That username is taken.");
      } else if (
        profileErr.code === "23514" ||
        /once every 7 days/i.test(profileErr.message)
      ) {
        setUsernameError(
          profileErr.message.replace(/^.*?Username/i, "Username")
        );
      } else {
        toast.error("Couldn't save", { description: profileErr.message });
      }
      return;
    }

    // Replace links
    await supabase.from("links").delete().eq("profile_id", user.id);
    const cleanLinks = links
      .map((l, i) => ({ ...l, position: i }))
      .filter((l) => l.label.trim() && l.url.trim());

    if (cleanLinks.length > 0) {
      const { error: linkErr } = await supabase.from("links").insert(
        cleanLinks.map((l) => ({
          profile_id: user.id,
          label: l.label.trim(),
          url: l.url.trim().startsWith("http") ? l.url.trim() : `https://${l.url.trim()}`,
          position: l.position,
        }))
      );
      if (linkErr) {
        toast.error("Couldn't save links", { description: linkErr.message });
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    toast.success("Profile saved!", {
      description: `Live at nads.io/${parsed.data}`,
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hero">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-5 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Edit your page</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {username ? (
              <>
                Live at{" "}
                <Link
                  to="/$username"
                  params={{ username }}
                  className="text-primary hover:underline"
                >
                  nads.io/{username} <ExternalLink className="inline h-3 w-3" />
                </Link>
              </>
            ) : (
              "Pick a username to make your page live."
            )}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="rounded-2xl border border-border bg-card-glass p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-20 w-20 overflow-hidden rounded-full bg-gradient-primary">
                  {avatarUrl && (
                    <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border bg-background hover:bg-secondary">
                  {uploading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Upload className="h-3.5 w-3.5" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onAvatarUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
              <div>
                <div className="font-semibold">{displayName || "Your name"}</div>
                <div className="text-xs text-primary">
                  {username ? `@${username}` : "@yourname"}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card-glass p-6 shadow-card space-y-5">
            <div>
              <Label htmlFor="username">Username</Label>
              <div className="mt-2 flex overflow-hidden rounded-lg border border-border bg-input">
                <span className="flex items-center px-3 text-sm text-muted-foreground border-r border-border">
                  nads.io/
                </span>
                <input
                  id="username"
                  className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
                  placeholder="yourname"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  maxLength={20}
                />
              </div>
              {usernameError ? (
                <p className="mt-1.5 text-xs text-destructive">{usernameError}</p>
              ) : (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Username can only be changed once every 7 days.
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="displayName">Display name</Label>
              <Input
                id="displayName"
                className="mt-2"
                placeholder="Your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={50}
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                className="mt-2 min-h-[80px]"
                placeholder="Tell the world who you are…"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={160}
              />
              <div className="mt-1 text-right text-xs text-muted-foreground">{bio.length}/160</div>
            </div>
          </div>

          {/* Premium features */}
          <div className={`rounded-2xl border p-6 shadow-card space-y-5 ${isPremium ? "border-foreground/40 bg-card-glass" : "border-dashed border-border bg-card-glass/40"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className={`h-4 w-4 ${isPremium ? "text-foreground" : "text-muted-foreground"}`} />
                <Label className="font-display text-base">Premium features</Label>
              </div>
              {isPremium ? (
                <span className="rounded-full bg-foreground px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-background">PRO</span>
              ) : (
                <Link to="/premium" className="text-xs text-primary hover:underline">Upgrade →</Link>
              )}
            </div>

            {!isPremium && (
              <p className="text-xs text-muted-foreground">Unlock custom banners, profile music, and the animated glowing ring on your avatar.</p>
            )}

            <fieldset disabled={!isPremium} className={`space-y-5 ${!isPremium ? "opacity-50 pointer-events-none" : ""}`}>
              <div>
                <Label className="block text-sm text-center">Custom banner</Label>
                <div className="mt-2 overflow-hidden rounded-xl border border-border bg-input">
                  <div className="relative h-28 w-full bg-gradient-primary">
                    {bannerUrl && <img src={bannerUrl} alt="" className="h-full w-full object-cover" />}
                    <label className="absolute bottom-2 right-2 inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-background/90 px-2.5 py-1 text-xs font-medium shadow hover:bg-background">
                      {uploadingBanner ? <Loader2 className="h-3 w-3 animate-spin" /> : <ImageIcon className="h-3 w-3" />}
                      {bannerUrl ? "Replace" : "Upload"}
                      <input type="file" accept="image/*" className="hidden" onChange={onBannerUpload} disabled={uploadingBanner} />
                    </label>
                    {bannerUrl && (
                      <button type="button" onClick={() => setBannerUrl(null)} className="absolute top-2 right-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-background/90 text-destructive shadow hover:bg-background">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground text-center">JPG, PNG, or WebP · up to 5MB · 16:5 looks best</p>
              </div>

              <div>
                <Label className="block text-sm text-center">Profile music</Label>
                <div className="mt-2">
                  <label className="relative flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-input px-3 text-sm hover:bg-secondary">
                    {uploadingMusic ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Music className="h-3.5 w-3.5" />}
                    <span>{musicUrl ? "Replace track" : "Upload track"}</span>
                    <input type="file" accept="audio/*" className="hidden" onChange={onMusicUpload} disabled={uploadingMusic} />
                    {musicUrl && (
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMusicUrl(null); setMusicTitle(""); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-destructive shadow hover:bg-background"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </label>
                </div>
                {musicUrl && (
                  <Input
                    placeholder="Track title"
                    value={musicTitle}
                    onChange={(e) => setMusicTitle(e.target.value)}
                    className="mt-2"
                    maxLength={60}
                  />
                )}
                <p className="mt-1.5 text-xs text-muted-foreground text-center">MP3, WAV, or OGG · up to 8MB · plays on your public profile</p>
              </div>

              <div>
                <Label className="block text-sm text-center">Avatar decoration</Label>
                <div className="mt-2 flex items-center justify-between rounded-lg border border-border bg-background/40 px-4 py-3">
                  <span className="text-xs text-muted-foreground">
                    {avatarDecoration ? "Glowing ring is ON" : "Glowing ring is OFF"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAvatarDecoration((v) => !v)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${avatarDecoration ? "bg-foreground" : "bg-muted"}`}
                    aria-pressed={avatarDecoration}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-background transition-transform ${avatarDecoration ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              </div>
            </fieldset>
          </div>


          <div className="rounded-2xl border border-border bg-card-glass p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <Label>Links</Label>
              <span className="text-xs text-muted-foreground">{links.length} / 5</span>
            </div>
            {links.map((link, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder="Label"
                  value={link.label}
                  onChange={(e) => {
                    const next = [...links];
                    next[i].label = e.target.value;
                    setLinks(next);
                  }}
                  className="flex-[0_0_35%]"
                  maxLength={12}
                />
                <Input
                  placeholder="https://…"
                  value={link.url}
                  onChange={(e) => {
                    const next = [...links];
                    next[i].url = e.target.value;
                    setLinks(next);
                  }}
                  className="flex-1"
                />
                {links.length > 1 && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => setLinks(links.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
            {links.length < 5 && (
              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed"
                onClick={() => setLinks([...links, { label: "", url: "" }])}
              >
                <Plus className="mr-2 h-4 w-4" /> Add link
              </Button>
            )}
          </div>

          <Button
            type="submit"
            disabled={saving}
            size="lg"
            className="h-12 w-full bg-gradient-primary text-base shadow-glow"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save & publish"}
          </Button>
        </form>
      </main>
    </div>
  );
}
