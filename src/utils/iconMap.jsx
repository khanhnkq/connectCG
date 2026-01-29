import React from "react";
import {
  Music,
  Trophy,
  Book,
  Plane,
  Utensils,
  Gamepad2,
  Film,
  Camera,
  Palette,
  Dumbbell,
  Dog,
  Monitor,
  Star,
} from "lucide-react";

const iconMap = {
  music_note: Music,
  sports_soccer: Trophy,
  menu_book: Book,
  flight: Plane,
  restaurant: Utensils,
  sports_esports: Gamepad2,
  movie: Film,
  photo_camera: Camera,
  palette: Palette,
  fitness_center: Dumbbell,
  pets: Dog,
  computer: Monitor,
};

export const getIconComponent = (iconName, props = {}) => {
  const Icon = iconMap[iconName] || Star;
  return <Icon {...props} />;
};

export default iconMap;
