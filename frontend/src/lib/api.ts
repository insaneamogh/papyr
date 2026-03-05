export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function fetchPapers(search?: string, tag?: string) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (tag) params.append("tag", tag);

  const res = await fetch(`${API_BASE_URL}/papers?${params.toString()}`, {
    cache: "no-store", // For realtime updates
  });
  if (!res.ok) throw new Error("Failed to fetch papers");
  return res.json();
}

export async function fetchPaperDetail(slug: string) {
  const res = await fetch(`${API_BASE_URL}/papers/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch paper detail");
  return res.json();
}

export async function fetchTaskDetail(slug: string, taskId: string) {
  const res = await fetch(`${API_BASE_URL}/papers/${slug}/tasks/${taskId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch task detail");
  return res.json();
}

export async function runCode(code: string) {
  const res = await fetch(`${API_BASE_URL}/code/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) throw new Error("Failed to execute code");
  return res.json();
}

export async function submitCode(code: string, paper_slug: string, task_id: string) {
  const res = await fetch(`${API_BASE_URL}/code/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, paper_slug, task_id }),
  });
  if (!res.ok) throw new Error("Failed to submit code");
  return res.json();
}
export async function importPaper(query: string, tags: string = "AI, ML") {
  const res = await fetch(`${API_BASE_URL}/papers/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, tags }),
  });
  if (!res.ok) throw new Error("Failed to import paper via ArXiv Pipeline");
  return res.json();
}

export async function askTutor(code: string, question: string, paper_slug: string, task_id: string) {
  const res = await fetch(`${API_BASE_URL}/code/help`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, question, paper_slug, task_id }),
  });
  if (!res.ok) throw new Error("AI Tutor failed to respond");
  return res.json();
}
