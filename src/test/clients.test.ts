import { describe, it, expect } from "vitest";
import { clientLogos } from "@/content/clients";

describe("About page client logos", () => {
  it("shows the 9 client logos from the client's file", () => expect(clientLogos).toHaveLength(9));
  it("starts with Asian University and ends with Green Life Hospital", () => {
    expect(clientLogos[0]?.name).toBe("Asian University of Bangladesh");
    expect(clientLogos[8]?.name).toBe("Green Life Hospital");
  });
});
