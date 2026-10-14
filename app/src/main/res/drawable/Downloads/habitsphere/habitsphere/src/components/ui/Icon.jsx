import {
  Apple, Award, BarChart3, Bike, BookMarked, BookOpen, Brain, CalendarDays,
  Check, CheckCircle2, Circle, Code, Coffee, Database, Droplets, Dumbbell,
  Flame, Flower2, Footprints, GraduationCap, Heart, HeartPulse, LayoutDashboard,
  Leaf, ListChecks, Moon, Music, PenLine, Percent, Rocket, Settings, SkipForward,
  Smile, Sparkles, Sprout, Star, Sun, Sunrise, Target, Timer, TrendingUp,
  Trophy, User, Zap,
} from 'lucide-react'

// Curated registry so dynamic-by-name icons still work while letting the
// bundler tree-shake lucide-react down to only what we actually use.
const REGISTRY = {
  Apple, Award, BarChart3, Bike, BookMarked, BookOpen, Brain, CalendarDays,
  Check, CheckCircle2, Circle, Code, Coffee, Database, Droplets, Dumbbell,
  Flame, Flower2, Footprints, GraduationCap, Heart, HeartPulse, LayoutDashboard,
  Leaf, ListChecks, Moon, Music, PenLine, Percent, Rocket, Settings, SkipForward,
  Smile, Sparkles, Sprout, Star, Sun, Sunrise, Target, Timer, TrendingUp,
  Trophy, User, Zap,
}

export default function Icon({ name, className = '', size = 20, strokeWidth = 2, ...rest }) {
  const Cmp = REGISTRY[name] || Circle
  return <Cmp className={className} size={size} strokeWidth={strokeWidth} aria-hidden {...rest} />
}
