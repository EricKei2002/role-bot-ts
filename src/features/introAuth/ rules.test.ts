import { describe, it, expect } from "vitest";
import { validateIntro } from "./rules";

describe("introAuth rules", () => {
  it("必須項目が揃っていればOK", () => {
    const text = `
【名前】
Eric

【目的】
交流したい

【一言】
よろしく！
`;
    const result = validateIntro(text, 10);
    expect(result.ok).toBe(true);
  });

  it("一言が無いと NOT_TEMPLATE", () => {
    const text = `
【名前】
Eric

【目的】
交流したい
`;
    const result = validateIntro(text, 10);
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("NOT_TEMPLATE");
    expect(result.missingFields).toContain("【一言】");
  });

  it("URLが含まれると NG", () => {
    const text = `
【名前】
Eric

【目的】
https://example.com

【一言】
よろしく
`;
    const result = validateIntro(text, 10);
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("NG");
  });
});
it("名前が空だと NOT_TEMPLATE", () => {
  const text = `
【名前】

【目的】
交流したい

【一言】
よろしく！
`;
  const result = validateIntro(text, 10);
  expect(result.ok).toBe(false);
  expect(result.reason).toBe("NOT_TEMPLATE");
  expect(result.missingFields).toContain("【名前】");
});
it("空白や改行だけの入力は NOT_TEMPLATE", () => {
  const text = `
【名前】
   
【目的】

【一言】
   
`;
  const result = validateIntro(text, 10);
  expect(result.ok).toBe(false);
  expect(result.reason).toBe("NOT_TEMPLATE");
});
