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
//
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
    // TODO: implement transition logic that stays editable
    // Currently placeholder to avoid breaking type consumers
    return {
      transitionClip: null,
      isBaked: true,
      metadata: {
        type: params.type,
        durationFrames: params.durationFrames,
        status: "placeholder-not-implemented",
      },
    };
  }

  /** Check if a transition type is supported */
  isSupported(type: string): boolean {
    const supported = ["fade", "dissolve", "wipe", "slide"];
    return supported.includes(type);
  }
}
