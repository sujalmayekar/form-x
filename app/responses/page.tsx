import React from "react";
import Navbar from "@/components/Navbar";

const ResponsesPage = () => {
  const stats = [
    { label: "Total responses", value: "128" },
    { label: "Completion rate", value: "86%" },
    { label: "Average score", value: "78%" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="max-w-6xl mx-auto pt-28 px-6 pb-16 space-y-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Responses Overview
            </h1>
            <p className="text-muted-foreground">
              Filter, export, and review recent submissions.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg border border-white/10 text-sm font-medium text-foreground hover:bg-white/5 transition">
              Date range
            </button>
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/30 hover:opacity-90 transition">
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="bg-card border border-white/5 rounded-2xl p-5 shadow-lg shadow-black/20"
            >
              <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                {item.label}
              </p>
              <p className="text-2xl font-semibold mt-2">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-card border border-white/5 rounded-2xl shadow-lg shadow-black/20 overflow-hidden">
          <div className="border-b border-white/5 px-4 py-3 flex items-center gap-4 text-sm text-muted-foreground">
            <button className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-foreground">
              Table
            </button>
            <button className="px-3 py-1 rounded-lg border border-white/5 hover:bg-white/5 transition">
              Summary
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-white/5 text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3">Respondent</th>
                  <th className="text-left px-4 py-3">Submitted</th>
                  <th className="text-left px-4 py-3">Score</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="px-4 py-3">User #{idx + 1}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Today, 10:{idx}0 AM
                    </td>
                    <td className="px-4 py-3">78%</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsesPage;

