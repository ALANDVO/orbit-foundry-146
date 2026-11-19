// Clip transition manager — orchestrates transitions between separate clips
// Issue #137: Support clip transitions/animations between separate clips
//
// Currently: transitions are fully baked with content and themes.
// Goal: Allow inserting transitions between clips that remain editable
// and are not fully baked with clip content/themes.
//
// Exported API:
// - `applyTransition(fromClip: Clip, toClip: Clip, params: TransitionParams): TransitionResult`
// - `TransitionParams` specifies transition type, duration, easing, etc.
// - `TransitionResult` contains the transitioned clip segment and any metadata

export interface TransitionParams {
  /** Transition type (e.g "dissolve", "wipe", "fade") */
  type: string;
  /** Duration in frames */
  durationFrames: number;
  /** Easing function name or curve */
  easing?: string;
  /** Optional theme overrides */
  themeOverrides?: Record<string, any>;
}

export interface TransitionResult {
  /** The resulting transition clip segment */
  transitionClip: any;
  /** Whether the transition was baked (should be false for editable) */
  isBaked: boolean;
  /** Metadata about the transition */
  metadata: Record<string, any>;
}

export class TransitionManager {
  /** Apply a transition between two clips */
  applyTransition(
    fromClip: any,
    toClip: any,
    params: TransitionParams
  ): TransitionResult {
    const { type, durationFrames, easing } = params;

    // Build metadata
    const metadata: Record<string, any> = {
      type,
      durationFrames,
    };
    if (easing) {
      metadata.easing = easing;
    }

    // For supported transition types, create an editable (not baked) transition clip
    // that references the source clips rather than embedding their content
    let transitionClip: any;
    let isBaked = false;

    if (!this.isSupported(type)) {
      // Unsupported transition type - still return a result but mark as baked
      transitionClip = null;
      isBaked = true;
      metadata.status = "unsupported-transition-type";
    } else {
      // Supported transitions remain editable (not baked)
      // The transitionClip is a composable reference, not embedded content
      transitionClip = {
        fromClipId: fromClip.id,
        toClipId: toClip.id,
        transitionType: type,
        durationFrames,
        ...(easing && { easing }),
        status: "editable-transition",
      };
      isBaked = false;
    }

    return {
      transitionClip,
      isBaked,
      metadata,
    };
  }

  /** Check if a transition type is supported */
  isSupported(type: string): boolean {
    const supported = ["fade", "dissolve", "wipe", "slide"];
    return supported.includes(type);
  }
}
