// Unit tests for clip transition manager (Issue #137)
// Tests that transitions can be applied without being fully baked

import { TransitionManager, TransitionParams, TransitionResult } from "../src/transitions/transition-manager.ts";

describe("TransitionManager", () => {
  let manager: TransitionManager;

  beforeEach(() => {
    manager = new TransitionManager();
  });

  describe("isSupported", () => {
    it("should return true for fade transition", () => {
      expect(manager.isSupported("fade")).toBe(true);
    });

    it("should return true for dissolve transition", () => {
      expect(manager.isSupported("dissolve")).toBe(true);
    });

    it("should return true for wipe transition", () => {
      expect(manager.isSupported("wipe")).toBe(true);
    });

    it("should return true for slide transition", () => {
      expect(manager.isSupported("slide")).toBe(true);
    });

    it("should return false for unsupported transition type", () => {
      expect(manager.isSupported("unsupported")).toBe(false);
    });

    it("should return false for empty string", () => {
      expect(manager.isSupported("")).toBe(false);
    });
  });

  describe("applyTransition", () => {
    it("should return isBaked=false for fade transition", () => {
      const result = manager.applyTransition(
        { id: "clip1", frames: 100 } as any,
        { id: "clip2", frames: 100 } as any,
        { type: "fade", durationFrames: 10 }
      );
      expect(result.isBaked).toBe(false);
    });

    it("should return transitionClip when type is supported", () => {
      const result = manager.applyTransition(
        { id: "clip1", frames: 100 } as any,
        { id: "clip2", frames: 100 } as any,
        { type: "fade", durationFrames: 10 }
      );
      expect(result.transitionClip).not.toBeNull();
    });

    it("should populate metadata in result", () => {
      const result = manager.applyTransition(
        { id: "clip1", frames: 100 } as any,
        { id: "clip2", frames: 100 } as any,
        { type: "dissolve", durationFrames: 20, easing: "ease-in-out" }
      );
      expect(result.metadata.type).toBe("dissolve");
      expect(result.metadata.durationFrames).toBe(20);
      expect(result.metadata.easing).toBe("ease-in-out");
    });

    it("should set durationFrames correctly", () => {
      const result = manager.applyTransition(
        { id: "clip1", frames: 100 } as any,
        { id: "clip2", frames: 100 } as any,
        { type: "wipe", durationFrames: 15 }
      );
      expect(result.metadata.durationFrames).toBe(15);
    });
  });
});
