import { Request, Response } from "express";

// GET /api/jobs?what=frontend&where=delhi&page=1
export async function handleJobs(req: Request, res: Response) {
    try {
        const what = encodeURIComponent((req.query.what as string) || "");
        const where = encodeURIComponent((req.query.where as string) || "");
        const page = Number(req.query.page ?? 1);

        const app_id = process.env.ADZUNA_APP_ID;
        const app_key = process.env.ADZUNA_APP_KEY;

        if (!app_id || !app_key) {
            return res.status(500).json({ error: "Adzuna credentials not configured on server" });
        }

        const resultsPerPage = 10;
        const url = `https://api.adzuna.com/v1/api/jobs/in/search/${page}?app_id=${app_id}&app_key=${app_key}&results_per_page=${resultsPerPage}&what=${what}&where=${where}`;

        const resp = await fetch(url);

        if (!resp.ok) {
            const text = await resp.text();
            return res.status(resp.status).json({ error: text });
        }

        const data = await resp.json();

        // return the raw data to the client (you can transform if needed)
        return res.json(data);
    } catch (err: any) {
        console.error("/api/jobs error:", err);
        return res.status(500).json({ error: err?.message ?? String(err) });
    }
}
