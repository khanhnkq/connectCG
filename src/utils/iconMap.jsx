import React from "react";
import { MusicNote as Music, Trophy, Book, Airplane as Plane, ForkKnife as Utensils, GameController as Gamepad2, FilmStrip as Film, Camera, Palette, Barbell as Dumbbell, Dog, Monitor, Star, Headphones, Microphone as Mic, Guitar, PianoKeys as Piano, Tent, Mountains as Mountain, MapTrifold as Map, Compass, Bicycle as Bike, Waves, Tree as Trees, CloudSun, Coffee, BeerBottle as Beer, Pizza, ShoppingBag, TShirt as Shirt, Watch, Heart, Briefcase, Code, DeviceMobile as Smartphone, Cpu, Globe, Translate as Languages, PenNib as PenTool, Hammer, Wrench, Car, Bus, Train, Boat as Ship, Anchor, Rocket, Atom, Flask as FlaskConical, Stethoscope, GraduationCap, GraduationCap as School, Buildings as Building, House as Home, Users, Smiley as Smile, Leaf, Flower as Flower2, Fish, Bird, Cat, Footprints, Baby, DiceFive as Dice5, PuzzlePiece as Puzzle, Spade, Club, Ticket, FilmSlate as Clapperboard, Video, Image, PaintBrush as Brush, Scissors, Drop as Droplets, Lightning as Zap, Flame, Snowflake, Sun, Moon, Umbrella, Wind, Tornado, TreePalm as Palmtree, Campfire as TentTree, Thermometer, Pulse as Activity, Heartbeat as HeartPulse, Brain, Lightbulb, Eyeglasses as Glasses, Crown, Diamond as Gem, Gift, Ghost, Skull, NavigationArrow as Locate, NavigationArrow as Navigation, Flag, Target, Medal, Medal as Award, Sword as Swords, Shield, LightningSlash as ZapOff } from "@phosphor-icons/react";

const iconMap = {
  // Arts & Music
  music_note: Music,
  music: Music,
  headphones: Headphones,
  mic: Mic,
  guitar: Guitar,
  piano: Piano,
  palette: Palette,
  brush: Brush,
  film: Film,
  movie: Film,
  video: Video,
  camera: Camera,
  photo_camera: Camera,
  image: Image,
  clapperboard: Clapperboard,
  book: Book,
  menu_book: Book,
  pen_tool: PenTool,

  // Sports & Fitness
  trophy: Trophy,
  sports_soccer: Trophy, // Fallback for soccer
  medal: Medal,
  award: Award,
  dumbbell: Dumbbell,
  fitness_center: Dumbbell,
  activity: Activity,
  heart_pulse: HeartPulse,
  bike: Bike,
  directions_bike: Bike,
  swords: Swords,
  shield: Shield,
  target: Target,
  flag: Flag,

  // Travel & Adventure
  plane: Plane,
  flight: Plane,
  map: Map,
  compass: Compass,
  globe: Globe,
  mountain: Mountain,
  hiking: Mountain,
  tent: Tent,
  camping: Tent,
  tent_tree: TentTree,
  palmtree: Palmtree,
  anchor: Anchor,
  ship: Ship,
  car: Car,
  bus: Bus,
  train: Train,
  rocket: Rocket,
  navigation: Navigation,
  locate: Locate,

  // Food & Drink
  restaurant: Utensils,
  utensils: Utensils,
  coffee: Coffee,
  beer: Beer,
  pizza: Pizza,

  // Gaming & Tech
  gamepad: Gamepad2,
  sports_esports: Gamepad2,
  monitor: Monitor,
  computer: Monitor,
  smartphone: Smartphone,
  cpu: Cpu,
  code: Code,
  zap: Zap,
  zap_off: ZapOff,

  // Nature & Animals
  dog: Dog,
  pets: Dog,
  cat: Cat,
  bird: Bird,
  fish: Fish,
  footprints: Footprints,
  leaf: Leaf,
  flower: Flower2,
  trees: Trees,
  flame: Flame,
  droplets: Droplets,
  snowflake: Snowflake,
  sun: Sun,
  moon: Moon,
  cloud_sun: CloudSun,
  wind: Wind,
  tornado: Tornado,
  umbrella: Umbrella,

  // Job & Education
  briefcase: Briefcase,
  work: Briefcase,
  graduation_cap: GraduationCap,
  school: School,
  school_outline: School,
  building: Building,
  home: Home,
  wrench: Wrench,
  hammer: Hammer,
  stethoscope: Stethoscope,
  flask: FlaskConical,
  atom: Atom,

  // Fashion & Shopping
  shopping_bag: ShoppingBag,
  shirt: Shirt,
  watch: Watch,
  glasses: Glasses,
  gem: Gem,
  crown: Crown,
  gift: Gift,

  // Misc
  star: Star,
  heart: Heart,
  users: Users,
  smile: Smile,
  baby: Baby,
  dice: Dice5,
  puzzle: Puzzle,
  spade: Spade,
  club: Club,
  ticket: Ticket,
  scissors: Scissors,
  thermometer: Thermometer,
  brain: Brain,
  lightbulb: Lightbulb,
  ghost: Ghost,
  skull: Skull,
};

export const getIconComponent = (iconName, props = {}) => {
  // Normalize icon name: lowercase and trim
  const normalizedKey = iconName ? String(iconName).toLowerCase().trim() : "";

  // Try exact match, direct mapping, or fallback
  const Icon = iconMap[normalizedKey] || iconMap[iconName] || Star;

  return <Icon {...props} />;
};

export default iconMap;
