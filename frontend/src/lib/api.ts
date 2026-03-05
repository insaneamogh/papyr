export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function handleResponse(res: Response, fallbackMsg: string) {
  if (!res.ok) {
    let detail = fallbackMsg;
    try {
      const body = await res.json();
      detail = body.detail || fallbackMsg;
    } catch { }
    throw new Error(detail);
  }
  return res.json();
}

export async function fetchPapers(search?: string, tag?: string) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (tag) params.append("tag", tag);

  const res = await fetch(`${API_BASE_URL}/papers?${params.toString()}`, {
    cache: "no-store",
  });
  return handleResponse(res, "Failed to fetch papers");
}

export async function fetchPaperDetail(slug: string) {
  const res = await fetch(`${API_BASE_URL}/papers/${slug}`, {
    cache: "no-store",
  });
  return handleResponse(res, "Failed to fetch paper detail");
}

export async function fetchTaskDetail(slug: string, taskId: string) {
  const res = await fetch(`${API_BASE_URL}/papers/${slug}/tasks/${taskId}`, {
    cache: "no-store",
  });
  return handleResponse(res, "Failed to fetch task detail");
}

export async function runCode(code: string) {
  const res = await fetch(`${API_BASE_URL}/code/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  return handleResponse(res, "Failed to execute code");
}

export async function submitCode(code: string, paper_slug: string, task_id: string) {
  const res = await fetch(`${API_BASE_URL}/code/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, paper_slug, task_id }),
  });
  return handleResponse(res, "Failed to submit code");
}

export async function importPaper(query: string, tags: string = "AI, ML") {
  const res = await fetch(`${API_BASE_URL}/papers/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, tags }),
  });
  return handleResponse(res, "Failed to import paper. Check your ArXiv link or paper name.");
}

export async function askTutor(code: string, question: string, paper_slug: string, task_id: string) {
  const res = await fetch(`${API_BASE_URL}/code/help`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, question, paper_slug, task_id }),
  });
  return handleResponse(res, "AI Tutor failed to respond");
}
