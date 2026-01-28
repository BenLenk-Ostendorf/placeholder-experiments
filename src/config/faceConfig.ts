// Face configuration - each face has its own positioning settings
// Usage: <StorySection faceId="spezi_confused" ... />

export interface FaceConfig {
  characterName: string;
  imagePath: string;
  alt: string;
  imageSize: number;
  imageScale: number;
  imagePositionX: number;
  imagePositionY: number;
  imageObjectFit: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

// Each face has its own positioning - adjust values after testing
export const faces: Record<string, FaceConfig> = {
  // Spezi faces
  spezi_frustrated: {
    characterName: 'Spezi',
    imagePath: '/resources/faces/spezi/spezi_frustrated.png',
    alt: 'Spezi frustrated',
    imageSize: 96,
    imageScale: 1.6,
    imagePositionX: 60,
    imagePositionY: 20,
    imageObjectFit: 'cover',
  },
  spezi_confused: {
    characterName: 'Spezi',
    imagePath: '/resources/faces/spezi/spezi_confused.png',
    alt: 'Spezi confused',
    imageSize: 96,
    imageScale: 1.5,
    imagePositionX: 20,
    imagePositionY: 20,
    imageObjectFit: 'cover',
  },
  spezi_understanding: {
    characterName: 'Spezi',
    imagePath: '/resources/faces/spezi/spezi_understanding.png',
    alt: 'Spezi understanding',
    imageSize: 96,
    imageScale: 1.6,
    imagePositionX: 50,
    imagePositionY: 20,
    imageObjectFit: 'cover',
  },

  // Dr. Puck faces
  puck_tea: {
    characterName: 'Dr. Puck',
    imagePath: '/resources/faces/puck/puck_tea.png',
    alt: 'Dr. Puck drinking tea',
    imageSize: 96,
    imageScale: 2,
    imagePositionX: 60,
    imagePositionY: 20,
    imageObjectFit: 'cover',
  },
  puck_asking: {
    characterName: 'Dr. Puck',
    imagePath: '/resources/faces/puck/puck_asking.png',
    alt: 'Dr. Puck asking',
    imageSize: 96,
    imageScale: 2.2,
    imagePositionX: 50,
    imagePositionY: 10,
    imageObjectFit: 'cover',
  },
  puck_explaining: {
    characterName: 'Dr. Puck',
    imagePath: '/resources/faces/puck/puck_explaining.png',
    alt: 'Dr. Puck explaining',
    imageSize: 96,
    imageScale: 1.4,
    imagePositionX: 40,
    imagePositionY: 20,
    imageObjectFit: 'cover',
  },
  puck_pointing: {
    characterName: 'Dr. Puck',
    imagePath: '/resources/faces/puck/puck_pointing.png',
    alt: 'Dr. Puck pointing',
    imageSize: 96,
    imageScale: 1.6,
    imagePositionX: 50,
    imagePositionY: 20,
    imageObjectFit: 'cover',
  },
  puck_evil_grin: {
    characterName: 'Dr. Puck',
    imagePath: '/resources/faces/puck/puck_evil_smile.png',
    alt: 'Dr. Puck evil grin',
    imageSize: 96,
    imageScale: 1.6,
    imagePositionX: 50,
    imagePositionY: 20,
    imageObjectFit: 'cover',
  },
};

export function getFace(faceId: string): FaceConfig | undefined {
  return faces[faceId];
}
