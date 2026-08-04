import { describe, expect, it } from "bun:test";
import { isClipboardSupported } from "./is-clipboard-supported.js";

describe("isClipboardSupported", () => {
  it("darwinの場合はtrueを返す", () => {
    expect(isClipboardSupported("darwin")).toBe(true);
  });

  it("linuxの場合はfalseを返す", () => {
    expect(isClipboardSupported("linux")).toBe(false);
  });

  it("win32の場合はfalseを返す", () => {
    expect(isClipboardSupported("win32")).toBe(false);
  });
});
