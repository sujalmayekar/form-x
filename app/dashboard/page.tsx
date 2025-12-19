import React from 'react';
import Navbar from '@/components/Navbar';
import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  const forms = [
    {
      title: "Student Feedback",
      description: "Collect course feedback and suggestions.",
      updated: "Today, 9:15 AM",
      responses: 24,
    },
    {
      title: "Weekly Quiz",
      description: "Auto-graded quiz with scoring enabled.",
      updated: "Yesterday, 5:40 PM",
      responses: 12,
    },
    {
      title: "Event RSVP",
      description: "Attendance and dietary preferences.",
      updated: "Mon, 2:10 PM",
      responses: 42,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-28 px-6 pb-16 space-y-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Your Forms
            </h1>
            <p className="text-muted-foreground">
              Create, organize, and analyse forms in one place.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg border border-white/10 text-sm font-medium text-foreground hover:bg-white/5 transition">
              Filter
            </button>
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/30 hover:opacity-90 transition">
              + Create New Form
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {forms.map((form, idx) => (
            <div
              key={idx}
              className="bg-card border border-white/5 rounded-2xl p-6 shadow-lg shadow-black/20 hover:-translate-y-1 hover:border-primary/40 transition-transform"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{form.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {form.description}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {form.updated}
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 text-sm text-muted-foreground">
                <span>{form.responses} responses</span>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg border border-white/10 text-foreground hover:bg-white/5 transition">
                    Open
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition">
                    Responses
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-dashed border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 bg-card/50">
          <p className="text-muted-foreground text-center">
            No more forms yet. Start a new one to see it here.
          </p>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/30 hover:opacity-90 transition">
            Create your first form
          </button>
        </div>
      </div>
    </div>
  );
}
