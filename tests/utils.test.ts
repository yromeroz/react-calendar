import { describe, it, expect } from "vitest";
import { cn, capitalizeFirstLetter, hexToRgb, srgbLuminance, contrastRatio, getContrastColor, adjustColor } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("resolves tailwind conflicts", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
  });
});

describe("capitalizeFirstLetter", () => {
  it("capitalizes first letter and lowercases rest", () => {
    expect(capitalizeFirstLetter("HELLO")).toBe("Hello");
  });

  it("handles empty string", () => {
    expect(capitalizeFirstLetter("")).toBe("");
  });

  it("handles single character", () => {
    expect(capitalizeFirstLetter("a")).toBe("A");
  });
});

describe("hexToRgb", () => {
  it("parses full hex with hash", () => {
    expect(hexToRgb("#FF0000")).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("parses full hex without hash", () => {
    expect(hexToRgb("00FF00")).toEqual({ r: 0, g: 255, b: 0 });
  });

  it("parses #000000 as black", () => {
    expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 });
  });

  it("parses #FFFFFF as white", () => {
    expect(hexToRgb("#FFFFFF")).toEqual({ r: 255, g: 255, b: 255 });
  });
});

describe("srgbLuminance", () => {
  it("returns 1.0 for white", () => {
    expect(srgbLuminance(255, 255, 255)).toBeCloseTo(1.0, 4);
  });

  it("returns 0.0 for black", () => {
    expect(srgbLuminance(0, 0, 0)).toBe(0);
  });

  it("returns correct value for pure red", () => {
    const r = srgbLuminance(255, 0, 0);
    expect(r).toBeCloseTo(0.2126, 4);
  });

  it("returns correct value for pure green", () => {
    const g = srgbLuminance(0, 255, 0);
    expect(g).toBeCloseTo(0.7152, 4);
  });

  it("returns correct value for pure blue", () => {
    const b = srgbLuminance(0, 0, 255);
    expect(b).toBeCloseTo(0.0722, 4);
  });
});

describe("contrastRatio", () => {
  it("returns 21:1 for black vs white", () => {
    expect(contrastRatio(0, 1)).toBeCloseTo(21, 0);
  });

  it("returns 1:1 for equal colors", () => {
    expect(contrastRatio(0.5, 0.5)).toBeCloseTo(1, 0);
  });

  it("is symmetric", () => {
    const a = contrastRatio(0.2, 0.8);
    const b = contrastRatio(0.8, 0.2);
    expect(a).toBeCloseTo(b, 6);
  });
});

describe("getContrastColor", () => {
  it("returns white for dark backgrounds", () => {
    expect(getContrastColor("#000000")).toBe("#ffffff");
    expect(getContrastColor("#000080")).toBe("#ffffff");
  });

  it("returns black for light or medium backgrounds", () => {
    expect(getContrastColor("#FFFFFF")).toBe("#000000");
    expect(getContrastColor("#FFFF00")).toBe("#000000");
    expect(getContrastColor("#FF0000")).toBe("#000000");
  });
});

describe("adjustColor", () => {
  it("lightens a color with positive amount", () => {
    const result = adjustColor("#0000FF", 100);
    expect(result).toBe("#6464ff");
  });

  it("darkens a color with negative amount", () => {
    const result = adjustColor("#FFFFFF", -100);
    expect(result).toBe("#9b9b9b");
  });

  it("clamps to valid RGB range", () => {
    expect(adjustColor("#000000", -999)).toBe("#000000");
    expect(adjustColor("#FFFFFF", 999)).toBe("#ffffff");
  });

  it("handles hex without hash", () => {
    const result = adjustColor("FF0000", 50);
    expect(result).toBe("ff3232");
  });
});
