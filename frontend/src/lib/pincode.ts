// Pincode → District lookup backed by the public India Post API
// (https://api.postalpincode.in/pincode/{pincode}).
//
// The report form calls this when a complete 6-digit pincode is typed and
// auto-fills the District select. The API is best-effort: it can be slow,
// rate-limited, or offline, so every failure degrades to "no district found"
// and the citizen can still pick the district manually.

import { TN_DISTRICTS } from "@/lib/data";

export type PincodeLookupResult =
  | { status: "found"; district: string; state: string; area: string }
  | { status: "not-found" }
  | { status: "out-of-state"; state: string }
  | { status: "error" };

// The API's district spellings differ from the app's canonical 38 names.
// Map the aliases we know about to the value used by the District <select>.
const DISTRICT_ALIASES: Record<string, string> = {
  tuticorin: "Thoothukudi",
  toothukudi: "Thoothukudi",
  thoothukkudi: "Thoothukudi",
  kanyakumari: "Kanniyakumari",
  "kanni kumari": "Kanniyakumari",
  nilgiris: "The Nilgiris",
  "the nilgiris": "The Nilgiris",
  trichy: "Tiruchirappalli",
  tiruchirappalli: "Tiruchirappalli",
  tiruchirapalli: "Tiruchirappalli",
  villupuram: "Viluppuram",
  vizhuppuram: "Viluppuram",
  pudukkottai: "Pudukkottai",
  pudukottai: "Pudukkottai",
  sivagangai: "Sivaganga",
  sivaganga: "Sivaganga",
  ramanathapuram: "Ramanathapuram",
  ramnad: "Ramanathapuram",
  kanniyakumari: "Kanniyakumari",
  chengalpattu: "Chengalpattu",
  chengalpet: "Chengalpattu",
  kanchipuram: "Kancheepuram",
  kancheepuram: "Kancheepuram",
  thiruvallur: "Tiruvallur",
  tiruvallur: "Tiruvallur",
  thiruvarur: "Tiruvarur",
  tiruvarur: "Tiruvarur",
  thiruvannamalai: "Tiruvannamalai",
  tiruvannamalai: "Tiruvannamalai",
  thirupathur: "Tirupathur",
  tirupathur: "Tirupathur",
  tiruppur: "Tiruppur",
  tirupur: "Tiruppur",
  kallakurichi: "Kallakurichi",
  mayiladuthurai: "Mayiladuthurai",
  nagapattinam: "Nagapattinam",
  namakkal: "Namakkal",
  perambalur: "Perambalur",
  virudhunagar: "Virudhunagar",
  dharmapuri: "Dharmapuri",
  krishnagiri: "Krishnagiri",
  coimbatore: "Coimbatore",
  cuddalore: "Cuddalore",
  dindigul: "Dindigul",
  erode: "Erode",
  karur: "Karur",
  madurai: "Madurai",
  ranipet: "Ranipet",
  salem: "Salem",
  tenkasi: "Tenkasi",
  thanjavur: "Thanjavur",
  theni: "Theni",
  tirunelveli: "Tirunelveli",
  vellore: "Vellore",
  ariyalur: "Ariyalur",
  chennai: "Chennai",
};

function normaliseDistrict(raw: string): string | null {
  if (!raw) return null;

  const alias = DISTRICT_ALIASES[raw.trim().toLowerCase()];
  if (alias) return alias;

  // Exact (case-insensitive) match against the app's canonical list.
  const exact = TN_DISTRICTS.find(
    (d) => d.name.toLowerCase() === raw.trim().toLowerCase()
  );
  return exact ? exact.name : null;
}

type PostOfficeRecord = {
  Name?: string;
  District?: string;
  State?: string;
  Country?: string;
};

type PostalPincodeResponse = {
  Status?: string;
  PostOffice?: PostOfficeRecord[] | null;
};

/**
 * Look up a 6-digit pincode and resolve it to one of the app's districts.
 * Never throws — network/HTTP/parse failures return `{ status: "error" }`.
 */
export async function lookupPincode(
  pincode: string,
  signal?: AbortSignal
): Promise<PincodeLookupResult> {
  if (!/^\d{6}$/.test(pincode)) return { status: "not-found" };

  try {
    const res = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`,
      { signal, headers: { Accept: "application/json" } }
    );
    if (!res.ok) return { status: "error" };

    const data: unknown = await res.json();
    if (!Array.isArray(data) || data.length === 0) return { status: "error" };

    const record = data[0] as PostalPincodeResponse;
    const offices = Array.isArray(record.PostOffice)
      ? record.PostOffice
      : [];

    // "No records found" comes back with Status "Error" and a null PostOffice.
    if (record.Status !== "Success" || offices.length === 0) {
      return { status: "not-found" };
    }

    // Prefer a deliverable office's district; fall back to the first record.
    const preferred =
      offices.find((o) => o.District || o.Name) ?? offices[0];
    const rawDistrict = preferred.District ?? offices[0].District ?? "";
    const state = preferred.State ?? offices[0].State ?? "";
    const area = preferred.Name ?? offices[0].Name ?? "";

    // Pincodes outside Tamil Nadu (e.g. Puducherry) exist in the API but are
    // not part of the register — surface that instead of silently filling.
    if (state && state.trim().toLowerCase() !== "tamil nadu") {
      return { status: "out-of-state", state };
    }

    const district = normaliseDistrict(rawDistrict);
    if (!district) return { status: "not-found" };

    return { status: "found", district, state, area };
  } catch {
    // Aborts land here too (superseded request) — treated as a soft failure.
    return { status: "error" };
  }
}
