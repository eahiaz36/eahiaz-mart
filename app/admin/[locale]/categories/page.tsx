"use client";

import { useEffect, useState } from "react";

export default function AdminCategoriesPage() {
  const [json, setJson] = useState("");
  const [exported, setExported] = useState<any>(null);

  async function doImport() {
    const parsed = JSON.parse(json);
    const res = await fetch("/api/categories/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    });
    const data = await res.json();
    alert(res.ok ? "Imported!" : `Error: ${data.error}`);
  }

  async function doExport() {
    const res = await fetch("/api/categories/export");
    const data = await res.json();
    setExported(data);
  }

  useEffect(() => { doExport(); }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Category Import/Export</h1>

      <div className="bg-white rounded shadow-sm p-4">
        <p className="text-sm mb-2">Paste category tree JSON and import (upsert by slug).</p>
        <textarea value={json} onChange={(e) => setJson(e.target.value)} className="w-full h-56 border rounded p-2 font-mono text-xs" />
        <div className="mt-2 flex gap-2">
          <button onClick={doImport} className="px-4 py-2 bg-orange-600 text-white rounded">Import</button>
          <button onClick={doExport} className="px-4 py-2 bg-gray-900 text-white rounded">Refresh Export</button>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm p-4">
        <h2 className="font-semibold mb-2">Current Export</h2>
        <pre className="text-xs overflow-auto max-h-80">{exported ? JSON.stringify(exported, null, 2) : "Loading..."}</pre>
      </div>
    </div>
  );
}
