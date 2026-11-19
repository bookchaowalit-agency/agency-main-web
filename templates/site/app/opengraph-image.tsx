import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// Generated at build time so social cards never point at a missing file.
// Text stays ASCII: the built-in ImageResponse font has no Thai glyphs.
export const alt = `${site.name} — ${site.design.world}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

const colors = site.design.colors;
const KICKER = "BOOKCHAOWALIT AGENCY";
const TITLE = site.name;
const SUBTITLE = site.design.world;
const CHIPS: readonly string[] = site.scope;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: colors.bg,
          color: colors.ink,
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 8, color: colors.accent }}>{KICKER}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, lineHeight: 1.05 }}>{TITLE}</div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 34, color: colors.muted }}>{SUBTITLE}</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {CHIPS.map((chip) => (
            <div
              key={chip}
              style={{ display: "flex", padding: "10px 18px", borderRadius: 8, border: `2px solid ${colors.accent}`, fontSize: 22 }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
