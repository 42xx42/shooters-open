export const visualEventTypes = [
  'shot_fired',
  'player_hit',
  'kill',
  'headshot',
  'environment_hit',
  'near_miss',
  'damage_taken',
  'low_hp',
  'round_transition'
];

export const dangerSeverityOrder = ['pressure', 'warning', 'critical', 'swing'];

export const dangerLayerPriority = {
  background: ['calm', 'pressure', 'warning', 'critical'],
  foreground: ['calm', 'pressure', 'warning', 'critical', 'swing']
};

export const eventSeverityMap = {
  shot_fired: null,
  player_hit: null,
  kill: 'swing',
  headshot: 'swing',
  environment_hit: null,
  near_miss: 'warning',
  damage_taken: 'pressure',
  low_hp: 'critical',
  round_transition: 'swing'
};

export const visualTuning = {
  duel: {
    global: {
      hud: {
        density: 'focus',
        controlsOpacity: 0.18,
        controlsCombatOpacity: 0.12,
        timerScale: 1.0,
        playerPanelScale: 1.0,
        shotConfirmOffsetY: -10
      },
      menu: {
        eyebrow: 'Arena Ready',
        accent: '#ffc44d',
        support: '#4de7ff',
        badge: 'DUEL BENCHMARK',
        tempo: 'Crisp 1v1 gunfeel'
      },
      near_miss: {
        flash: 0.26,
        feedLabel: '擦弹压迫',
        feedMeta: '保持移动，不要贪枪',
        feedDuration: 0.62,
        shakeTime: 0.04,
        shakeIntensity: 0.024,
        pulse: 0.68,
        danger: 'warning'
      },
      damage_taken: {
        flash: 0.09,
        feedLabel: '受到压制',
        feedMeta: '立即换位或闪避',
        feedDuration: 0.48,
        shakeTime: 0.055,
        shakeIntensity: 0.036,
        pulse: 0.42,
        danger: 'pressure'
      },
      low_hp: {
        threshold: 34,
        feedLabel: '生命告急',
        feedMeta: '寻找掩体，避免正面换血',
        feedDuration: 0.9,
        vignetteMax: 0.88,
        pulse: 0.72,
        danger: 'critical'
      },
      round_transition: {
        feedLabel: '回合节奏切换',
        feedMeta: '重置站位，争夺中线',
        feedDuration: 0.96,
        pulse: 0.88,
        shakeTime: 0.028,
        shakeIntensity: 0.012
      }
    },
    pistol: {
      shot_fired: {
        pulse: 0.28,
        recoil: 0.26,
        tracerLife: 0.08,
        tracerOpacity: 0.88,
        tracerColor: 0xffd96d,
        muzzleLife: 0.085,
        muzzleScale: 1.06,
        feedLabel: '手枪点射',
        feedMeta: 'Crisp tap',
        feedDuration: 0.16
      },
      player_hit: {
        duration: 0.16,
        opacity: 0.98,
        pulse: 0.62,
        hitstop: 0.032,
        flash: 0.045,
        shakeTime: 0.055,
        shakeIntensity: 0.036,
        throttle: 0.06,
        glyph: '✦',
        label: 'HIT',
        impactCount: 7
      },
      kill: {
        duration: 0.24,
        opacity: 1.0,
        pulse: 1.02,
        hitstop: 0.078,
        flash: 0.08,
        shakeTime: 0.15,
        shakeIntensity: 0.11,
        throttle: 0,
        glyph: '✹',
        label: 'K.O.',
        impactCount: 12
      },
      headshot: {
        duration: 0.32,
        opacity: 1.0,
        pulse: 1.3,
        hitstop: 0.12,
        flash: 0.12,
        shakeTime: 0.22,
        shakeIntensity: 0.16,
        throttle: 0,
        glyph: '💀',
        label: '爆头击杀',
        impactCount: 18
      },
      environment_hit: {
        duration: 0.1,
        opacity: 0.78,
        pulse: 0.22,
        hitstop: 0.014,
        flash: 0.018,
        shakeTime: 0.022,
        shakeIntensity: 0.016,
        throttle: 0.08,
        glyph: '◌',
        label: 'CLANG',
        impactCount: 5
      }
    },
    smg: {
      shot_fired: {
        pulse: 0.18,
        recoil: 0.14,
        tracerLife: 0.062,
        tracerOpacity: 0.72,
        tracerColor: 0xe8f3ff,
        muzzleLife: 0.06,
        muzzleScale: 1.0,
        feedLabel: '冲锋扫射',
        feedMeta: 'Stay on target',
        feedDuration: 0.1
      },
      player_hit: {
        duration: 0.1,
        opacity: 0.82,
        pulse: 0.36,
        hitstop: 0.016,
        flash: 0.022,
        shakeTime: 0.028,
        shakeIntensity: 0.02,
        throttle: 0.08,
        glyph: '•',
        label: 'HIT',
        impactCount: 4
      },
      kill: {
        duration: 0.18,
        opacity: 0.96,
        pulse: 0.84,
        hitstop: 0.052,
        flash: 0.05,
        shakeTime: 0.085,
        shakeIntensity: 0.056,
        throttle: 0,
        glyph: '✦',
        label: 'K.O.',
        impactCount: 10
      },
      headshot: {
        duration: 0.26,
        opacity: 1.0,
        pulse: 1.1,
        hitstop: 0.09,
        flash: 0.09,
        shakeTime: 0.14,
        shakeIntensity: 0.1,
        throttle: 0,
        glyph: '💀',
        label: '爆头击杀',
        impactCount: 14
      },
      environment_hit: {
        duration: 0.08,
        opacity: 0.66,
        pulse: 0.12,
        hitstop: 0.008,
        flash: 0.01,
        shakeTime: 0.014,
        shakeIntensity: 0.01,
        throttle: 0.11,
        glyph: '·',
        label: 'CLANG',
        impactCount: 3
      }
    },
    shotgun: {
      shot_fired: {
        pulse: 0.42,
        recoil: 0.38,
        tracerLife: 0.11,
        tracerOpacity: 0.94,
        tracerColor: 0xffefce,
        muzzleLife: 0.11,
        muzzleScale: 1.14,
        feedLabel: '霰弹爆发',
        feedMeta: 'Heavy burst',
        feedDuration: 0.22
      },
      player_hit: {
        duration: 0.19,
        opacity: 1.0,
        pulse: 0.92,
        hitstop: 0.048,
        flash: 0.052,
        shakeTime: 0.092,
        shakeIntensity: 0.068,
        throttle: 0.08,
        glyph: '✶',
        label: 'HIT',
        impactCount: 10
      },
      kill: {
        duration: 0.28,
        opacity: 1.0,
        pulse: 1.18,
        hitstop: 0.094,
        flash: 0.09,
        shakeTime: 0.18,
        shakeIntensity: 0.135,
        throttle: 0,
        glyph: '✹',
        label: 'K.O.',
        impactCount: 16
      },
      headshot: {
        duration: 0.36,
        opacity: 1.0,
        pulse: 1.4,
        hitstop: 0.14,
        flash: 0.14,
        shakeTime: 0.26,
        shakeIntensity: 0.2,
        throttle: 0,
        glyph: '💀',
        label: '爆头击杀',
        impactCount: 22
      },
      environment_hit: {
        duration: 0.12,
        opacity: 0.84,
        pulse: 0.24,
        hitstop: 0.02,
        flash: 0.018,
        shakeTime: 0.03,
        shakeIntensity: 0.022,
        throttle: 0.1,
        glyph: '◌',
        label: 'CLANG',
        impactCount: 6
      }
    }
  },
  deathmatch: {
    global: {
      hud: {
        density: 'compact',
        controlsOpacity: 0.14,
        controlsCombatOpacity: 0.08,
        timerScale: 0.95,
        playerPanelScale: 0.92,
        shotConfirmOffsetY: -4
      },
      menu: {
        eyebrow: 'Crowd Control',
        accent: '#ff8a3d',
        support: '#7ac8ff',
        badge: 'DEATHMATCH FLOW',
        tempo: 'Readable multi-target chaos'
      },
      near_miss: {
        flash: 0.2,
        feedLabel: '危险擦弹',
        feedMeta: '多人火力已锁定',
        feedDuration: 0.48,
        shakeTime: 0.028,
        shakeIntensity: 0.018,
        pulse: 0.44,
        danger: 'warning'
      },
      damage_taken: {
        flash: 0.07,
        feedLabel: '火力来袭',
        feedMeta: '优先保命，保持信息简洁',
        feedDuration: 0.38,
        shakeTime: 0.038,
        shakeIntensity: 0.025,
        pulse: 0.28,
        danger: 'pressure'
      },
      low_hp: {
        threshold: 30,
        feedLabel: '濒危状态',
        feedMeta: '立刻脱离战线',
        feedDuration: 0.8,
        vignetteMax: 0.76,
        pulse: 0.56,
        danger: 'critical'
      },
      round_transition: {
        feedLabel: '混战重启',
        feedMeta: '观察剩余生命与站位',
        feedDuration: 0.82,
        pulse: 0.62,
        shakeTime: 0.018,
        shakeIntensity: 0.008
      }
    },
    pistol: {
      shot_fired: {
        pulse: 0.22,
        recoil: 0.2,
        tracerLife: 0.072,
        tracerOpacity: 0.82,
        tracerColor: 0xffcf66,
        muzzleLife: 0.075,
        muzzleScale: 1.0,
        feedLabel: '手枪压枪',
        feedMeta: 'Clean poke',
        feedDuration: 0.12
      },
      player_hit: {
        duration: 0.12,
        opacity: 0.9,
        pulse: 0.44,
        hitstop: 0.024,
        flash: 0.03,
        shakeTime: 0.034,
        shakeIntensity: 0.024,
        throttle: 0.07,
        glyph: '✦',
        label: 'HIT',
        impactCount: 5
      },
      kill: {
        duration: 0.18,
        opacity: 0.96,
        pulse: 0.84,
        hitstop: 0.06,
        flash: 0.055,
        shakeTime: 0.09,
        shakeIntensity: 0.066,
        throttle: 0,
        glyph: '✹',
        label: 'K.O.',
        impactCount: 10
      },
      headshot: {
        duration: 0.26,
        opacity: 1.0,
        pulse: 1.1,
        hitstop: 0.09,
        flash: 0.09,
        shakeTime: 0.14,
        shakeIntensity: 0.1,
        throttle: 0,
        glyph: '💀',
        label: '爆头击杀',
        impactCount: 14
      },
      environment_hit: {
        duration: 0.08,
        opacity: 0.68,
        pulse: 0.12,
        hitstop: 0.01,
        flash: 0.01,
        shakeTime: 0.015,
        shakeIntensity: 0.01,
        throttle: 0.1,
        glyph: '◌',
        label: 'CLANG',
        impactCount: 4
      }
    },
    smg: {
      shot_fired: {
        pulse: 0.12,
        recoil: 0.1,
        tracerLife: 0.055,
        tracerOpacity: 0.64,
        tracerColor: 0xf7fbff,
        muzzleLife: 0.05,
        muzzleScale: 0.96,
        feedLabel: '冲锋扫射',
        feedMeta: 'Controlled stream',
        feedDuration: 0.08
      },
      player_hit: {
        duration: 0.08,
        opacity: 0.6,
        pulse: 0.16,
        hitstop: 0.006,
        flash: 0.008,
        shakeTime: 0.012,
        shakeIntensity: 0.006,
        throttle: 0.13,
        glyph: '•',
        label: 'HIT',
        impactCount: 3
      },
      kill: {
        duration: 0.16,
        opacity: 0.9,
        pulse: 0.68,
        hitstop: 0.036,
        flash: 0.04,
        shakeTime: 0.05,
        shakeIntensity: 0.032,
        throttle: 0,
        glyph: '✦',
        label: 'K.O.',
        impactCount: 8
      },
      headshot: {
        duration: 0.22,
        opacity: 1.0,
        pulse: 0.98,
        hitstop: 0.07,
        flash: 0.07,
        shakeTime: 0.1,
        shakeIntensity: 0.072,
        throttle: 0,
        glyph: '💀',
        label: '爆头击杀',
        impactCount: 12
      },
      environment_hit: {
        duration: 0.06,
        opacity: 0.5,
        pulse: 0.08,
        hitstop: 0.004,
        flash: 0.006,
        shakeTime: 0.01,
        shakeIntensity: 0.004,
        throttle: 0.16,
        glyph: '·',
        label: 'CLANG',
        impactCount: 2
      }
    },
    shotgun: {
      shot_fired: {
        pulse: 0.32,
        recoil: 0.3,
        tracerLife: 0.1,
        tracerOpacity: 0.9,
        tracerColor: 0xffe6bf,
        muzzleLife: 0.1,
        muzzleScale: 1.08,
        feedLabel: '霰弹清场',
        feedMeta: 'Short-range swing',
        feedDuration: 0.18
      },
      player_hit: {
        duration: 0.15,
        opacity: 0.94,
        pulse: 0.7,
        hitstop: 0.032,
        flash: 0.036,
        shakeTime: 0.055,
        shakeIntensity: 0.04,
        throttle: 0.1,
        glyph: '✶',
        label: 'HIT',
        impactCount: 8
      },
      kill: {
        duration: 0.22,
        opacity: 1.0,
        pulse: 0.98,
        hitstop: 0.074,
        flash: 0.072,
        shakeTime: 0.13,
        shakeIntensity: 0.09,
        throttle: 0,
        glyph: '✹',
        label: 'K.O.',
        impactCount: 14
      },
      headshot: {
        duration: 0.3,
        opacity: 1.0,
        pulse: 1.3,
        hitstop: 0.12,
        flash: 0.12,
        shakeTime: 0.2,
        shakeIntensity: 0.14,
        throttle: 0,
        glyph: '💀',
        label: '爆头击杀',
        impactCount: 20
      },
      environment_hit: {
        duration: 0.1,
        opacity: 0.74,
        pulse: 0.16,
        hitstop: 0.014,
        flash: 0.012,
        shakeTime: 0.02,
        shakeIntensity: 0.014,
        throttle: 0.12,
        glyph: '◌',
        label: 'CLANG',
        impactCount: 5
      }
    }
  }
};

export const shotViewProfiles = {
  duel: {
    topdown: {
      lengthMul: 1.08,
      widthMul: 1.04,
      opacityMul: 1.0,
      travelHintMul: 1.0,
      fadeMul: 1.0
    },
    fps: {
      lengthMul: 0.46,
      widthMul: 0.82,
      opacityMul: 0.86,
      travelHintMul: 0.42,
      fadeMul: 0.88
    }
  },
  deathmatch: {
    topdown: {
      lengthMul: 0.96,
      widthMul: 0.94,
      opacityMul: 0.9,
      travelHintMul: 0.8,
      fadeMul: 0.94
    },
    fps: {
      lengthMul: 0.4,
      widthMul: 0.76,
      opacityMul: 0.78,
      travelHintMul: 0.34,
      fadeMul: 0.84
    }
  }
};

export const impactVisualProfiles = {
  duel: {
    player: {
      flashSize: 0.34,
      flashLife: 0.13,
      sparkCount: 8,
      sparkSpeed: 3.6
    },
    cover: {
      flashSize: 0.24,
      flashLife: 0.1,
      sparkCount: 5,
      sparkSpeed: 2.5
    },
    barrel: {
      flashSize: 0.3,
      flashLife: 0.12,
      sparkCount: 6,
      sparkSpeed: 3.0
    },
    near_miss: {
      flashSize: 0.28,
      flashLife: 0.18,
      sparkCount: 4,
      sparkSpeed: 2.2
    }
  },
  deathmatch: {
    player: {
      flashSize: 0.28,
      flashLife: 0.11,
      sparkCount: 6,
      sparkSpeed: 3.0
    },
    cover: {
      flashSize: 0.2,
      flashLife: 0.08,
      sparkCount: 4,
      sparkSpeed: 2.0
    },
    barrel: {
      flashSize: 0.26,
      flashLife: 0.1,
      sparkCount: 5,
      sparkSpeed: 2.6
    },
    near_miss: {
      flashSize: 0.22,
      flashLife: 0.14,
      sparkCount: 3,
      sparkSpeed: 1.8
    }
  }
};

const shotFiredProfiles = {
  duel: {
    pistol: {
      streakLength: 4.6,
      streakWidth: 0.064,
      travelHintLength: 1.35,
      travelHintOpacity: 0.18,
      sampleEvery: 1,
      maxStreaksPerShot: 1
    },
    smg: {
      streakLength: 3.2,
      streakWidth: 0.048,
      travelHintLength: 0.7,
      travelHintOpacity: 0.11,
      sampleEvery: 2,
      maxStreaksPerShot: 1
    },
    shotgun: {
      streakLength: 2.7,
      streakWidth: 0.086,
      travelHintLength: 1.05,
      travelHintOpacity: 0.14,
      sampleEvery: 1,
      maxStreaksPerShot: 2
    }
  },
  deathmatch: {
    pistol: {
      streakLength: 3.8,
      streakWidth: 0.056,
      travelHintLength: 1.1,
      travelHintOpacity: 0.14,
      sampleEvery: 1,
      maxStreaksPerShot: 1
    },
    smg: {
      streakLength: 2.6,
      streakWidth: 0.042,
      travelHintLength: 0.55,
      travelHintOpacity: 0.08,
      sampleEvery: 3,
      maxStreaksPerShot: 1
    },
    shotgun: {
      streakLength: 2.2,
      streakWidth: 0.078,
      travelHintLength: 0.9,
      travelHintOpacity: 0.12,
      sampleEvery: 1,
      maxStreaksPerShot: 2
    }
  }
};

export const dangerSeverityMatrix = {
  duel: {
    pressure: {
      priority: 1,
      label: '受压',
      badgeLabel: '受压',
      timerAccent: 'rgba(255, 166, 77, 0.42)',
      chipText: '#ffd7b0',
      chipGlow: 'rgba(255, 138, 61, 0.18)',
      badgePulseHz: 1.9,
      badgePulseAmp: 0.026,
      feedAccent: 'rgba(255, 166, 77, 0.32)',
      feedText: '#fff0dc',
      feedMeta: '#ffd8bd',
      feedLift: 10,
      feedScale: 1.0,
      feedDuration: 0.42,
      pulseOpacity: 0.24,
      pulseScale: 1.006,
      cameraFovBias: -0.24,
      cameraShakeMul: 0.68,
      persistent: false,
      vignetteOpacity: 0,
      vignettePulseHz: 0,
      vignettePulseAmp: 0
    },
    warning: {
      priority: 2,
      label: '预警',
      badgeLabel: '预警',
      timerAccent: 'rgba(77, 231, 255, 0.44)',
      chipText: '#c3f9ff',
      chipGlow: 'rgba(77, 231, 255, 0.16)',
      badgePulseHz: 2.2,
      badgePulseAmp: 0.032,
      feedAccent: 'rgba(77, 231, 255, 0.28)',
      feedText: '#dfffff',
      feedMeta: '#c2f6ff',
      feedLift: 12,
      feedScale: 1.01,
      feedDuration: 0.5,
      pulseOpacity: 0.3,
      pulseScale: 1.014,
      cameraFovBias: -0.38,
      cameraShakeMul: 0.78,
      persistent: false,
      vignetteOpacity: 0,
      vignettePulseHz: 0,
      vignettePulseAmp: 0
    },
    critical: {
      priority: 3,
      label: '危急',
      badgeLabel: '危急',
      timerAccent: 'rgba(255, 84, 84, 0.5)',
      chipText: '#ffe1e1',
      chipGlow: 'rgba(255, 84, 84, 0.24)',
      badgePulseHz: 1.35,
      badgePulseAmp: 0.048,
      feedAccent: 'rgba(255, 84, 84, 0.34)',
      feedText: '#fff0f0',
      feedMeta: '#ffd0d0',
      feedLift: 14,
      feedScale: 1.02,
      feedDuration: 0.72,
      pulseOpacity: 0.14,
      pulseScale: 1.012,
      cameraFovBias: -0.58,
      cameraShakeMul: 0.88,
      persistent: true,
      vignetteOpacity: 0.84,
      vignettePulseHz: 1.1,
      vignettePulseAmp: 0.08
    },
    swing: {
      priority: 4,
      label: '转折',
      badgeLabel: '转折',
      timerAccent: 'rgba(255, 196, 77, 0.44)',
      chipText: '#fff0c4',
      chipGlow: 'rgba(255, 196, 77, 0.18)',
      badgePulseHz: 1.7,
      badgePulseAmp: 0.034,
      feedAccent: 'rgba(255, 196, 77, 0.3)',
      feedText: '#fff0c4',
      feedMeta: '#ffe2a6',
      feedLift: 18,
      feedScale: 1.08,
      feedDuration: 0.74,
      feedEmphasis: 'hero',
      pulseOpacity: 0.34,
      pulseScale: 1.028,
      cameraFovBias: 0.82,
      cameraShakeMul: 0.82,
      persistent: false,
      vignetteOpacity: 0,
      vignettePulseHz: 0,
      vignettePulseAmp: 0
    }
  },
  deathmatch: {
    pressure: {
      priority: 1,
      label: '受压',
      badgeLabel: '受压',
      timerAccent: 'rgba(255, 166, 77, 0.32)',
      chipText: '#ffd4b5',
      chipGlow: 'rgba(255, 138, 61, 0.12)',
      badgePulseHz: 1.7,
      badgePulseAmp: 0.022,
      feedAccent: 'rgba(255, 166, 77, 0.22)',
      feedText: '#ffeede',
      feedMeta: '#f7d7bf',
      feedLift: 8,
      feedScale: 1.0,
      feedDuration: 0.34,
      pulseOpacity: 0.19,
      pulseScale: 1.0,
      cameraFovBias: -0.18,
      cameraShakeMul: 0.54,
      persistent: false,
      vignetteOpacity: 0,
      vignettePulseHz: 0,
      vignettePulseAmp: 0
    },
    warning: {
      priority: 2,
      label: '预警',
      badgeLabel: '预警',
      timerAccent: 'rgba(77, 231, 255, 0.34)',
      chipText: '#cff9ff',
      chipGlow: 'rgba(77, 231, 255, 0.12)',
      badgePulseHz: 2.0,
      badgePulseAmp: 0.026,
      feedAccent: 'rgba(77, 231, 255, 0.22)',
      feedText: '#e5ffff',
      feedMeta: '#caf7ff',
      feedLift: 9,
      feedScale: 1.0,
      feedDuration: 0.4,
      pulseOpacity: 0.22,
      pulseScale: 1.01,
      cameraFovBias: -0.3,
      cameraShakeMul: 0.62,
      persistent: false,
      vignetteOpacity: 0,
      vignettePulseHz: 0,
      vignettePulseAmp: 0
    },
    critical: {
      priority: 3,
      label: '危急',
      badgeLabel: '危急',
      timerAccent: 'rgba(255, 84, 84, 0.42)',
      chipText: '#ffe7e7',
      chipGlow: 'rgba(255, 84, 84, 0.18)',
      badgePulseHz: 1.28,
      badgePulseAmp: 0.04,
      feedAccent: 'rgba(255, 84, 84, 0.26)',
      feedText: '#fff2f2',
      feedMeta: '#ffd7d7',
      feedLift: 11,
      feedScale: 1.01,
      feedDuration: 0.56,
      pulseOpacity: 0.12,
      pulseScale: 1.008,
      cameraFovBias: -0.42,
      cameraShakeMul: 0.74,
      persistent: true,
      vignetteOpacity: 0.7,
      vignettePulseHz: 1.0,
      vignettePulseAmp: 0.06
    },
    swing: {
      priority: 4,
      label: '转折',
      badgeLabel: '转折',
      timerAccent: 'rgba(255, 196, 77, 0.34)',
      chipText: '#fff2d2',
      chipGlow: 'rgba(255, 196, 77, 0.14)',
      badgePulseHz: 1.55,
      badgePulseAmp: 0.028,
      feedAccent: 'rgba(255, 196, 77, 0.24)',
      feedText: '#fff2ca',
      feedMeta: '#ffe6b0',
      feedLift: 14,
      feedScale: 1.05,
      feedDuration: 0.58,
      feedEmphasis: 'hero',
      pulseOpacity: 0.26,
      pulseScale: 1.02,
      cameraFovBias: 0.58,
      cameraShakeMul: 0.64,
      persistent: false,
      vignetteOpacity: 0,
      vignettePulseHz: 0,
      vignettePulseAmp: 0
    }
  }
};

for (const modeConfig of Object.values(visualTuning)) {
  modeConfig.global.near_miss.severity = eventSeverityMap.near_miss;
  modeConfig.global.damage_taken.severity = eventSeverityMap.damage_taken;
  modeConfig.global.low_hp.severity = eventSeverityMap.low_hp;
  modeConfig.global.round_transition.severity = eventSeverityMap.round_transition;
}

for (const [modeId, modeConfig] of Object.entries(visualTuning)) {
  for (const weaponId of ['pistol', 'smg', 'shotgun']) {
    Object.assign(modeConfig[weaponId].shot_fired, shotFiredProfiles[modeId][weaponId]);
    modeConfig[weaponId].kill.severity = eventSeverityMap.kill;
    modeConfig[weaponId].headshot.severity = eventSeverityMap.headshot;
  }
}

export function getVisualModeKey(modeId) {
  return modeId === 'deathmatch' ? 'deathmatch' : 'duel';
}

export function getGlobalVisualProfile(modeId) {
  return visualTuning[getVisualModeKey(modeId)]?.global || visualTuning.duel.global;
}

export function getWeaponVisualProfile(modeId, weaponId) {
  const modeProfile = visualTuning[getVisualModeKey(modeId)] || visualTuning.duel;
  return modeProfile[weaponId] || modeProfile.pistol;
}

export function getShotViewProfile(modeId, viewMode) {
  const modeKey = getVisualModeKey(modeId);
  const nextViewMode = viewMode === 'fps' ? 'fps' : 'topdown';
  return shotViewProfiles[modeKey]?.[nextViewMode] || shotViewProfiles.duel.topdown;
}

export function getImpactVisualProfile(modeId, impactKind) {
  const modeKey = getVisualModeKey(modeId);
  const nextImpactKind = impactKind || 'player';
  return impactVisualProfiles[modeKey]?.[nextImpactKind] || impactVisualProfiles.duel.player;
}

export function resolveEventSeverity(eventType) {
  return eventSeverityMap[eventType] ?? null;
}

export function getDangerSeverityConfig(modeId, severity) {
  if (!severity) return null;
  const matrix = dangerSeverityMatrix[getVisualModeKey(modeId)] || dangerSeverityMatrix.duel;
  return matrix[severity] || null;
}
