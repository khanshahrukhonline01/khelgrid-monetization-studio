import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Flag,
  Heart,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Send,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community · KhelGrid" },
      {
        name: "description",
        content:
          "Connect with athletes, coaches, and academies through sport and city communities on KhelGrid.",
      },
      { property: "og:title", content: "KhelGrid Community" },
      {
        property: "og:description",
        content: "Share progress, find practice partners, and learn with athletes in your sport.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.khelgrid.com/community" }],
  }),
  component: CommunityPage,
});

type Post = {
  id: string;
  author: string;
  role: "Athlete" | "Coach" | "Academy";
  sport: string;
  city: string;
  body: string;
  createdAt: string;
  likes: number;
  comments: string[];
  verified: boolean;
};

const STORAGE_KEY = "khelgrid-community-v1";
const SPORTS = ["All sports", "Cricket", "Football", "Badminton", "Athletics", "Hockey", "Tennis"];
const CITIES = ["All cities", "Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Chandigarh", "Pune"];

const SEED_POSTS: Post[] = [
  {
    id: "post-1",
    author: "KhelGrid Editorial",
    role: "Academy",
    sport: "Football",
    city: "Bengaluru",
    body: "What should every athlete carry to a football trial? Share your practical checklist so first-time players can prepare with less stress.",
    createdAt: "Today",
    likes: 18,
    comments: ["Bring water, ID, and a spare pair of socks."],
    verified: true,
  },
  {
    id: "post-2",
    author: "Meera S.",
    role: "Athlete",
    sport: "Athletics",
    city: "Delhi",
    body: "Logged my first timed 100m practice this week. Looking for a training partner near a public track who is also preparing for trials.",
    createdAt: "Yesterday",
    likes: 12,
    comments: [],
    verified: false,
  },
  {
    id: "post-3",
    author: "Coach Rahul",
    role: "Coach",
    sport: "Cricket",
    city: "Mumbai",
    body: "A useful reminder for parents: ask an organizer for the official notice, fee receipt, age category, and selection process before paying any trial fee.",
    createdAt: "2 days ago",
    likes: 27,
    comments: ["This should be pinned in every sports group."],
    verified: false,
  },
];

function CommunityPage() {
  const { name } = useAuth();
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [sport, setSport] = useState("All sports");
  const [city, setCity] = useState("All cities");
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [draftSport, setDraftSport] = useState("Cricket");
  const [draftCity, setDraftCity] = useState("Delhi");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [following, setFollowing] = useState<string[]>([]);
  const [reported, setReported] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const value = JSON.parse(stored) as Partial<{
          posts: Post[];
          liked: Record<string, boolean>;
          following: string[];
          reported: string[];
        }>;
        if (value.posts) setPosts(value.posts);
        if (value.liked) setLiked(value.liked);
        if (value.following) setFollowing(value.following);
        if (value.reported) setReported(value.reported);
      }
    } catch {
      // Community remains usable when browser storage is unavailable.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ posts, liked, following, reported }));
  }, [hydrated, posts, liked, following, reported]);

  const filteredPosts = useMemo(
    () =>
      posts.filter(
        (post) =>
          (sport === "All sports" || post.sport === sport) &&
          (city === "All cities" || post.city === city),
      ),
    [posts, sport, city],
  );

  const publish = () => {
    const body = draft.trim();
    if (!body) return;
    setPosts((current) => [
      {
        id: `post-${Date.now()}`,
        author: name,
        role: "Athlete",
        sport: draftSport,
        city: draftCity,
        body,
        createdAt: "Just now",
        likes: 0,
        comments: [],
        verified: false,
      },
      ...current,
    ]);
    setDraft("");
    setComposerOpen(false);
    toast.success("Your post is live in the community.");
  };

  const toggleLike = (id: string) => {
    const nextLiked = !liked[id];
    setLiked((current) => ({ ...current, [id]: nextLiked }));
    setPosts((current) =>
      current.map((post) =>
        post.id === id ? { ...post, likes: Math.max(0, post.likes + (nextLiked ? 1 : -1)) } : post,
      ),
    );
  };

  const addComment = (postId: string) => {
    const text = commentDrafts[postId]?.trim();
    if (!text) return;
    setPosts((current) =>
      current.map((post) =>
        post.id === postId ? { ...post, comments: [...post.comments, `${name}: ${text}`] } : post,
      ),
    );
    setCommentDrafts((current) => ({ ...current, [postId]: "" }));
  };

  const toggleFollow = (author: string) => {
    setFollowing((current) =>
      current.includes(author) ? current.filter((item) => item !== author) : [...current, author],
    );
  };

  const reportPost = (id: string) => {
    setReported((current) => (current.includes(id) ? current : [...current, id]));
    toast.success("Thanks. We will review this post.");
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Badge variant="outline" className="border-primary/40 bg-primary/5 text-primary">
                Community beta
              </Badge>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Your sports circle
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Share progress, find practice partners, and learn from athletes and coaches in your
                sport and city.
              </p>
            </div>
            <Button onClick={() => setComposerOpen((open) => !open)} className="gap-2">
              <Plus className="h-4 w-4" /> Create post
            </Button>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-card/50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Filter
              </span>
              {SPORTS.map((item) => (
                <FilterButton key={item} active={sport === item} onClick={() => setSport(item)}>
                  {item}
                </FilterButton>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {CITIES.map((item) => (
                <FilterButton key={item} active={city === item} onClick={() => setCity(item)}>
                  {item}
                </FilterButton>
              ))}
            </div>
          </div>

          {composerOpen && (
            <Card className="mt-5 border-primary/30">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <div>
                  <h2 className="font-semibold">Share with your community</h2>
                  <p className="text-xs text-muted-foreground">
                    Be specific, helpful, and protect private information.
                  </p>
                </div>
                <Badge variant="secondary">{name}</Badge>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  maxLength={500}
                  placeholder="Share a training win, ask for advice, or find a practice partner…"
                  className="min-h-28 resize-none"
                />
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-2">
                    <select
                      value={draftSport}
                      onChange={(event) => setDraftSport(event.target.value)}
                      className="rounded-lg border border-border bg-background px-3 py-2 text-xs"
                    >
                      {SPORTS.slice(1).map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                    <select
                      value={draftCity}
                      onChange={(event) => setDraftCity(event.target.value)}
                      className="rounded-lg border border-border bg-background px-3 py-2 text-xs"
                    >
                      {CITIES.slice(1).map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                  <Button onClick={publish} disabled={!draft.trim()} className="gap-2">
                    <Send className="h-4 w-4" /> Publish
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-6 space-y-5">
            {filteredPosts.length === 0 ? (
              <Card className="p-10 text-center">
                <Users className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">
                  No posts match these filters yet.
                </p>
              </Card>
            ) : (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  liked={Boolean(liked[post.id])}
                  following={following.includes(post.author)}
                  reported={reported.includes(post.id)}
                  comment={commentDrafts[post.id] ?? ""}
                  onLike={() => toggleLike(post.id)}
                  onFollow={() => toggleFollow(post.author)}
                  onReport={() => reportPost(post.id)}
                  onCommentChange={(value) =>
                    setCommentDrafts((current) => ({ ...current, [post.id]: value }))
                  }
                  onComment={() => addComment(post.id)}
                />
              ))
            )}
          </div>
        </section>

        <aside className="space-y-5">
          <Card>
            <CardHeader>
              <h2 className="font-semibold">Find your circles</h2>
              <p className="text-sm text-muted-foreground">
                Join conversations that help you take the next step.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Athletes in Delhi",
                "Football trial prep",
                "Parents and young athletes",
                "Coaches and academies",
              ].map((circle) => (
                <button
                  key={circle}
                  className="flex w-full items-center justify-between rounded-xl border border-border p-3 text-left text-sm transition hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    {circle}
                  </span>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/25 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Community safety</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Never share Aadhaar numbers, passwords, payment PINs, or private contact details in
                a post.
              </p>
              <p>
                Report guaranteed-selection claims, harassment, scams, or suspicious payment
                requests.
              </p>
              <p className="flex items-center gap-2 pt-1 text-xs font-medium text-primary">
                <Bell className="h-3.5 w-3.5" /> Moderation tools are active in this beta.
              </p>
            </CardContent>
          </Card>

          <div className="rounded-2xl border border-dashed border-border p-4 text-xs leading-relaxed text-muted-foreground">
            Community posts are currently saved in your browser session. Cloud sync and real-time
            community updates will be enabled across devices.
          </div>
        </aside>
      </div>
    </main>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs transition ${active ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
    >
      {children}
    </button>
  );
}

function PostCard({
  post,
  liked,
  following,
  reported,
  comment,
  onLike,
  onFollow,
  onReport,
  onCommentChange,
  onComment,
}: {
  post: Post;
  liked: boolean;
  following: boolean;
  reported: boolean;
  comment: string;
  onLike: () => void;
  onFollow: () => void;
  onReport: () => void;
  onCommentChange: (value: string) => void;
  onComment: () => void;
}) {
  return (
    <Card className={reported ? "opacity-60" : ""}>
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-hero font-semibold text-primary-foreground">
              {post.author.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-sm font-semibold">
                {post.author}
                {post.verified && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <span>{post.role}</span>
                <span>·</span>
                <span>{post.createdAt}</span>
                <span>·</span>
                <span>{post.city}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onFollow}
              className="rounded-full px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10"
            >
              {following ? "Following" : "Follow"}
            </button>
            <button
              onClick={onReport}
              disabled={reported}
              aria-label="Report post"
              className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Badge variant="outline" className="border-primary/30 text-primary">
            {post.sport}
          </Badge>
          {reported && <span className="text-xs text-muted-foreground">Reported for review</span>}
        </div>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{post.body}</p>

        <div className="mt-5 flex items-center gap-1 border-t border-border pt-3">
          <button
            onClick={onLike}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${liked ? "bg-rose-500/10 text-rose-500" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} /> {post.likes}
          </button>
          <span className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-muted-foreground">
            <MessageCircle className="h-4 w-4" /> {post.comments.length}
          </span>
          <button
            onClick={onReport}
            disabled={reported}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <Flag className="h-3.5 w-3.5" /> {reported ? "Reported" : "Report"}
          </button>
        </div>

        {post.comments.length > 0 && (
          <div className="mt-3 space-y-2">
            {post.comments.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="rounded-lg bg-secondary/50 px-3 py-2 text-xs text-muted-foreground"
              >
                {item}
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 flex gap-2">
          <input
            value={comment}
            onChange={(event) => onCommentChange(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && onComment()}
            placeholder="Add a helpful comment…"
            className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary/50"
          />
          <Button
            onClick={onComment}
            disabled={!comment.trim()}
            size="sm"
            variant="outline"
            aria-label="Post comment"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
