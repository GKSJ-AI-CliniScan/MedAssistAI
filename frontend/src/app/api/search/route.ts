import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

export type SearchCategory = "symptoms" | "diseases" | "medicines" | "articles" | "doctors" | "hospitals" | "terms";

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: SearchCategory;
  tags: string[];
  href: string;
  metadata?: Record<string, string>;
}

// Global cache to avoid reading 2MB of CSVs on every keystroke
let CACHED_DB: SearchItem[] | null = null;
let isCaching = false;

async function loadDataIntoCache() {
  if (CACHED_DB) return CACHED_DB;
  if (isCaching) {
    // Basic spinlock if multiple requests hit simultaneously before cache is ready
    while (isCaching) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    return CACHED_DB || [];
  }

  isCaching = true;
  const items: SearchItem[] = [];
  try {
    const dataDir = path.join(process.cwd(), "public", "data");

    // 1. Load medical_universe.csv
    const universePath = path.join(dataDir, "medical_universe.csv");
    if (fs.existsSync(universePath)) {
      const universeCsv = await fs.promises.readFile(universePath, "utf-8");
      Papa.parse(universeCsv, {
        header: true,
        skipEmptyLines: true,
        step: function(row) {
          const d = row.data as any;
          items.push({
            id: d.id || `u_${Math.random().toString(36).substr(2,9)}`,
            title: d.name || "",
            description: d.description || "",
            category: (d.category || "terms") as SearchCategory,
            tags: d.tags ? d.tags.split(";") : [],
            href: `/${d.category || 'term'}/${encodeURIComponent(d.name || '')}`
          });
        }
      });
    }

    // 2. Load medical_diseases_symptoms_medications_dataset_1.csv
    const userDatasetPath = path.join(dataDir, "medical_diseases_symptoms_medications_dataset_1.csv");
    if (fs.existsSync(userDatasetPath)) {
      const userCsv = await fs.promises.readFile(userDatasetPath, "utf-8");
      Papa.parse(userCsv, {
        header: true,
        skipEmptyLines: true,
        step: function(row) {
          const d = row.data as any;
          // Disease,Category,Symptoms,Common_Medications,Severity,Contagious,Specialist,Precautions
          
          if (d.Disease) {
             const symptoms = d.Symptoms ? d.Symptoms.split(";").map((s:string) => s.trim()) : [];
             const meds = d.Common_Medications ? d.Common_Medications.split(";").map((m:string) => m.trim()) : [];
             
             items.push({
                id: `usr_d_${d.Disease.replace(/\s+/g, '_')}`,
                title: d.Disease,
                description: `Symptoms include: ${symptoms.join(', ')}. Precautions: ${d.Precautions || 'None'}.`,
                category: "diseases",
                tags: [...symptoms, ...(d.Category ? d.Category.split("/") : [])],
                href: `/disease/${encodeURIComponent(d.Disease)}`,
                metadata: {
                   Severity: d.Severity,
                   Contagious: d.Contagious,
                   Specialist: d.Specialist,
                   Medications: meds.join(', ')
                }
             });
          }
        }
      });
    }
    
    CACHED_DB = items;
    console.log(`Successfully cached ${items.length} medical records.`);
  } catch (err) {
    console.error("Error loading CSV databases:", err);
    CACHED_DB = []; // Prevent infinite retry loops on failure
  } finally {
    isCaching = false;
  }
  
  return CACHED_DB;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() || "";
  const categoryFilter = searchParams.get("category");
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 0;

  if (!query) {
    return NextResponse.json({ results: [], total: 0 });
  }

  const MOCK_DB = await loadDataIntoCache();

  // 1. Filter items based on category
  let itemsToSearch = MOCK_DB;
  if (categoryFilter && categoryFilter !== "all") {
    itemsToSearch = itemsToSearch.filter(i => i.category === categoryFilter);
  }

  // 2. Score items
  const tokens = query.split(/\s+/).filter(t => t.length > 0);
  
  const scoredItems = itemsToSearch.map(item => {
    let score = 0;
    const title = item.title.toLowerCase();
    const desc = item.description.toLowerCase();
    
    // Exact title match gets huge boost
    if (title === query) score += 100;
    
    // Title starts with query
    if (title.startsWith(query)) score += 75;

    // Title includes query
    if (title.includes(query)) score += 50;
    
    // Desc includes query
    if (desc.includes(query)) score += 20;

    // Token matching
    tokens.forEach(token => {
      if (title.includes(token)) score += 10;
      if (desc.includes(token)) score += 5;
      if (item.tags.some(tag => tag.toLowerCase().includes(token))) score += 15;
    });

    return { item, score };
  });

  // 3. Filter out zero-score items and sort
  let results = scoredItems
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.item);

  // If a limit is requested (e.g. for a dropdown), slice it.
  if (limit > 0) {
    results = results.slice(0, limit);
  }

  return NextResponse.json({
    results,
    total: results.length,
    query
  });
}
