"use client";

import { useEffect, useState } from "react";
import { apiFetch, HelpRequest } from "@/lib/api";
import { HelpCircle, PlusCircle, CheckCircle, XCircle, AlertCircle, Clock, UserCheck } from "lucide-react";

export default function HelpBoardPage() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Form modal state
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reqCategory, setReqCategory] = useState("Circuit Design");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const categories = ["All", "Circuit Design", "Microcontroller", "Software Bug", "Mechanical/CAD", "General Mentorship"];

  useEffect(() => {
    fetchHelpRequests();
  }, [category]);

  async function fetchHelpRequests() {
    setLoading(true);
    try {
      const url = `/api/help-requests?category=${encodeURIComponent(category)}`;
      const data = await apiFetch(url);
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateRequest(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const newReq = await apiFetch("/api/help-requests", {
        method: "POST",
        body: JSON.stringify({ title, description, category: reqCategory }),
      });
      setRequests([newReq, ...requests]);
      setShowModal(false);
      setTitle("");
      setDescription("");
    } catch (err: any) {
      setError(err.message || "Failed to post help request. Please log in.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAccept(id: number) {
    try {
      const updated = await apiFetch(`/api/help-requests/${id}/accept`, { method: "POST" });
      setRequests(requests.map((r) => (r.id === id ? updated : r)));
    } catch (err: any) {
      alert(err.message || "Failed to accept request. Please sign in.");
    }
  }

  async function handleDecline(id: number) {
    try {
      const updated = await apiFetch(`/api/help-requests/${id}/decline`, { method: "POST" });
      setRequests(requests.map((r) => (r.id === id ? updated : r)));
    } catch (err: any) {
      alert(err.message || "Failed to decline request. Please sign in.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <HelpCircle className="w-7 h-7 text-indigo-400" />
            <span>Help Request & Mentorship Board</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Post troubleshooting questions or review and accept incoming requests from peers</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors flex items-center gap-1.5 w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Request Technical Help</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              category === cat
                ? "bg-indigo-600 text-white font-semibold"
                : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Loading help requests...</div>
      ) : requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800/40 rounded">
                    {req.category}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${
                    req.status === "Accepted"
                      ? "bg-emerald-950 text-emerald-300 border-emerald-800/40"
                      : req.status === "Declined"
                      ? "bg-rose-950 text-rose-300 border-rose-800/40"
                      : "bg-amber-950 text-amber-300 border-amber-800/40"
                  }`}>
                    Status: {req.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Posted by <span className="font-semibold text-slate-200">{req.author?.name}</span> ({req.author?.department})
                </div>
              </div>

              <h3 className="font-bold text-lg text-white">{req.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
                {req.description}
              </p>

              {/* Accept / Decline Action Controls */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                {req.helper ? (
                  <div className="text-emerald-400 font-medium flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" />
                    <span>Accepted by {req.helper.name} ({req.helper.department})</span>
                  </div>
                ) : (
                  <div className="text-slate-500">No mentor assigned yet</div>
                )}

                <div className="flex items-center gap-2">
                  {req.status !== "Accepted" && (
                    <button
                      onClick={() => handleAccept(req.id)}
                      className="px-3 py-1.5 rounded-lg font-bold bg-emerald-700 hover:bg-emerald-600 text-white flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Accept Request</span>
                    </button>
                  )}

                  {req.status !== "Declined" && (
                    <button
                      onClick={() => handleDecline(req.id)}
                      className="px-3 py-1.5 rounded-lg font-bold bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-800/50 flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Decline Request</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center text-xs text-slate-400">
          No help requests found in this category.
        </div>
      )}

      {/* Post Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 max-w-lg w-full p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                <span>Submit Technical Help Request</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {error && (
              <div className="p-3 bg-rose-950 border border-rose-800 text-rose-300 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Request Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. SPI clock line noise on STM32 board"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={reqCategory}
                  onChange={(e) => setReqCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                >
                  <option value="Circuit Design">Circuit Design</option>
                  <option value="Microcontroller">Microcontroller</option>
                  <option value="Software Bug">Software Bug</option>
                  <option value="Mechanical/CAD">Mechanical / CAD</option>
                  <option value="General Mentorship">General Mentorship</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Explanation</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide context, expected vs observed results, circuit schematic details or error log..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  {submitting ? "Submitting..." : "Submit Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
