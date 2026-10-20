import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Trophy, TrendingUp, Flame, Award, FileText, BarChart3, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SportsCV } from "@/components/SportsCV";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { mockAthleteStats, mockLeaderboard } from "@/data/analytics";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/my-stats")({
  head: () =>
    buildSeoHead({
      title: "Athlete Sports CV & Career Stats · KhelGrid",
      description:
        "Review your personal athletic Sports CV, match history, verified performance statistics, and trial scouting analytics on KhelGrid.",
      canonicalPath: "/my-stats",
      noindex: true,
      type: "website",
    }),
  component: MyStatsPage,
});

function MyStatsPage() {
  const [activeTab, setActiveTab] = useState<"sports-cv" | "analytics">("sports-cv");
  const stats = mockAthleteStats;

  const chartData = [
    { month: "Jan", trials: 2, selected: 1 },
    { month: "Feb", trials: 3, selected: 2 },
    { month: "Mar", trials: 2, selected: 1 },
    { month: "Apr", trials: 1, selected: 1 },
  ];

  return (
    <ProtectedRoute message="Sign in to view your athlete performance metrics and leaderboard ranking.">
      <div className="min-h-screen bg-background py-6 sm:py-10">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Verified Athletic Passport</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-0.5">
                Sports CV &amp; Athletic Portfolio
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Showcase your athletic honours, position timeline, match stats, and scout
                credentials.
              </p>
            </div>

            {/* Tab switcher */}
            <div className="flex items-center rounded-xl border border-border bg-muted/40 p-1 self-start sm:self-center">
              <button
                type="button"
                onClick={() => setActiveTab("sports-cv")}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === "sports-cv"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="h-3.5 w-3.5 text-primary" />
                Sports CV &amp; Passport
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("analytics")}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === "analytics"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5 text-primary" />
                Trial Analytics
              </button>
            </div>
          </div>

          {activeTab === "sports-cv" ? (
            <SportsCV initialViewMode="card" />
          ) : (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Trophy className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
                      <div className="text-3xl font-bold text-slate-900">{stats.successRate}%</div>
                      <p className="text-sm text-slate-600">Success Rate</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                      <div className="text-3xl font-bold text-slate-900">
                        {stats.totalTrialsApplied}
                      </div>
                      <p className="text-sm text-slate-600">Trials Applied</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Award className="h-8 w-8 mx-auto text-green-600 mb-2" />
                      <div className="text-3xl font-bold text-slate-900">{stats.averageRating}</div>
                      <p className="text-sm text-slate-600">Average Rating</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Flame className="h-8 w-8 mx-auto text-red-600 mb-2" />
                      <div className="text-3xl font-bold text-slate-900">{stats.streakDays}</div>
                      <p className="text-sm text-slate-600">Day Streak</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Applications Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="trials" stroke="#3b82f6" name="Applied" />
                        <Line type="monotone" dataKey="selected" stroke="#10b981" name="Selected" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance by Sport</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={stats.performanceMetrics}
                        layout="vertical"
                        margin={{ left: 80 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="sport" type="category" />
                        <Tooltip />
                        <Bar dataKey="wins" fill="#10b981" name="Wins" />
                        <Bar dataKey="losses" fill="#ef4444" name="Losses" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Achievements */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Achievements Unlocked</CardTitle>
                  <CardDescription>{stats.achievements.length} achievements earned</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {stats.achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="text-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
                      >
                        <div className="text-4xl mb-2">{achievement.icon}</div>
                        <h4 className="font-semibold text-slate-900">{achievement.name}</h4>
                        <p className="text-xs text-slate-600 mt-1">{achievement.description}</p>
                        <Badge
                          className={`mt-2 text-xs ${
                            achievement.rarity === "legendary"
                              ? "bg-purple-100 text-purple-900"
                              : achievement.rarity === "epic"
                                ? "bg-orange-100 text-orange-900"
                                : achievement.rarity === "rare"
                                  ? "bg-blue-100 text-blue-900"
                                  : "bg-slate-100 text-slate-900"
                          }`}
                        >
                          {achievement.rarity.toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Leaderboard */}
              <Card>
                <CardHeader>
                  <CardTitle>Leaderboard</CardTitle>
                  <CardDescription>Cricket trials in your region</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockLeaderboard.map((entry) => (
                      <div
                        key={entry.userId}
                        className={`flex items-center justify-between p-4 rounded-lg transition ${
                          entry.userId === "user-current"
                            ? "bg-blue-50 border border-blue-200"
                            : "bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-2xl font-bold text-slate-600 w-8">{entry.rank}</div>
                          <div>
                            <h4 className="font-semibold text-slate-900">{entry.userName}</h4>
                            <p className="text-xs text-slate-600">
                              {entry.city} • {entry.trials} trials
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-slate-900">{entry.score}</div>
                          <div className="flex items-center justify-end gap-1 text-xs">
                            <span className="text-yellow-600">⭐ {entry.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View Full Leaderboard
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
