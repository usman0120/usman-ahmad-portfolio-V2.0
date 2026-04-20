import type { Variants } from 'framer-motion';

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -20
  }
};

export const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

// Stagger children animations
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

// Fade up animation
export const fadeUp: Variants = {
  initial: {
    opacity: 0,
    y: 30
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Fade in animation
export const fadeIn: Variants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

// Scale animation
export const scale: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5
    }
  }
};

// Slide in from left
export const slideInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -50
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Slide in from right
export const slideInRight: Variants = {
  initial: {
    opacity: 0,
    x: 50
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Bounce animation
export const bounce: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

// Hover animations
export const hoverScale = {
  whileHover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  whileTap: {
    scale: 0.95
  }
};

export const hoverLift = {
  whileHover: {
    y: -5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

// Text reveal animation
export const textReveal: Variants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

// Floating animation for background elements
export const floating: Variants = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Quick float for faster elements
export const quickFloat: Variants = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Rotate animation
export const rotate: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Pulse animation
export const pulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Draw path animation (for SVGs)
export const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: "spring", duration: 1.5, bounce: 0 },
      opacity: { duration: 0.01 }
    }
  }
};

// Typing animation
export const typingContainer: Variants = {
  hidden: {
    opacity: 1
  },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.5,
      staggerChildren: 0.08
    }
  }
};

export const typingLetter: Variants = {
  hidden: {
    opacity: 0,
    y: 10
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

// Grid stagger animation
export const gridStagger: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export const gridItem: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5
    }
  }
};

// CYBER/HACKER THEME ANIMATIONS

// Glitch effect animation
export const glitchAnimation: Variants = {
  animate: {
    x: [0, -2, 2, -2, 0, 2, -2, 0],
    y: [0, 2, -2, 2, 0, -2, 2, 0],
    transition: {
      duration: 0.3,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  }
};

// Matrix rain animation
export const matrixRainAnimation: Variants = {
  initial: { 
    y: "-100%",
    opacity: 0 
  },
  animate: { 
    y: "100vh",
    opacity: [0, 1, 1, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Scan line effect
export const scanLineAnimation: Variants = {
  animate: {
    y: ["-100%", "100%"],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Neon pulse for cyber elements
export const neonPulse: Variants = {
  animate: {
    boxShadow: [
      "0 0 10px rgba(0, 255, 65, 0.3)",
      "0 0 20px rgba(0, 255, 65, 0.6)",
      "0 0 10px rgba(0, 255, 65, 0.3)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Terminal cursor blink
export const cursorBlink: Variants = {
  animate: {
    opacity: [1, 0, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
    }
  }
};

// Binary float animation
export const binaryFloat: Variants = {
  animate: {
    y: [0, -30, 0],
    opacity: [0.3, 0.8, 0.3],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Cyber border pulse
export const borderPulse: Variants = {
  animate: {
    borderColor: [
      "rgba(0, 255, 65, 0.3)",
      "rgba(0, 255, 65, 0.8)",
      "rgba(0, 255, 65, 0.3)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Hacker text scramble effect (for individual characters)
export const textScramble: Variants = {
  animate: {
    opacity: [1, 0.8, 1, 0.9, 1],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  }
};

// Skew animation for cyber buttons
export const cyberHover = {
  whileHover: {
    scale: 1.05,
    skewX: -5,
    boxShadow: "0 0 20px rgba(0, 255, 65, 0.5)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17
    }
  },
  whileTap: {
    scale: 0.95,
    skewX: 0
  }
};

// Terminal slide animation
export const terminalSlide: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.3
    }
  }
};

// Access granted animation
export const accessGranted: Variants = {
  initial: {
    scale: 0,
    opacity: 0,
    rotate: -180
  },
  animate: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

// Glitch text reveal (staggered characters)
export const glitchTextContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.3
    }
  }
};

export const glitchTextLetter: Variants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: [0, 1, 0.8, 1],
    y: 0,
    transition: {
      duration: 0.5,
      times: [0, 0.3, 0.7, 1]
    }
  }
};

// Matrix digital rain effect for containers
export const matrixContainer: Variants = {
  initial: {
    opacity: 0,
    backgroundPosition: "0% 0%"
  },
  animate: {
    opacity: 1,
    backgroundPosition: ["0% 0%", "0% 100%"],
    transition: {
      opacity: { duration: 0.5 },
      backgroundPosition: {
        duration: 10,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }
};

// Custom animation presets for different sections
export const heroAnimations = {
  container: staggerContainer,
  item: fadeUp,
  glitch: glitchTextContainer,
  glitchLetter: glitchTextLetter
};

export const cardAnimations = {
  container: gridStagger,
  item: {
    ...gridItem,
    ...hoverLift
  }
};

export const skillAnimations = {
  container: staggerContainer,
  item: bounce,
  cyber: {
    ...bounce,
    ...neonPulse
  }
};

// Cyber section animations
export const cyberSectionAnimations = {
  container: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  },
  item: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  }
};