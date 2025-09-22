
import { OutputPreset } from './types';

export const OUTPUT_PRESETS: OutputPreset[] = [
  {
    id: 'cinematic',
    name: 'Cinematic Poster',
    description: 'Transform your photo into a dramatic movie poster.',
    prompt: 'A high-detail, cinematic movie poster featuring the subject. The background is epic and dramatic with professional color grading. Add movie title text at the bottom.',
  },
  {
    id: 'wedding',
    name: 'Wedding Invitation',
    description: 'Create an elegant and beautiful wedding invitation.',
    prompt: 'An elegant wedding invitation card featuring the subject. The background is soft and romantic with floral elements and beautiful typography. The style is sophisticated and timeless.',
  },
  {
    id: 'birthday',
    name: 'Birthday Card',
    description: 'A fun and festive birthday celebration card.',
    prompt: 'A fun and festive birthday celebration card featuring the subject. The background is filled with colorful balloons, confetti, and a birthday cake. The mood is joyful and celebratory.',
  },
  {
    id: 'business',
    name: 'Business Flier',
    description: 'A professional flier for business or corporate use.',
    prompt: 'A professional business flier featuring the subject. The background is clean and corporate, with geometric shapes and a modern color palette. The subject looks professional and confident.',
  },
  {
    id: 'banner',
    name: 'Social Media Banner',
    description: 'An eye-catching banner for your online profiles.',
    prompt: 'An eye-catching social media banner for a profile. The subject is the main focus, with a vibrant, abstract background that grabs attention. The composition is modern and dynamic.',
  },
  {
    id: 'passport',
    name: 'Passport Photo',
    description: 'A high-quality, professional headshot.',
    prompt: 'A professional passport photograph of the subject. The background is plain white. The lighting is even and clear, with no shadows. The subject has a neutral expression.',
  },
];
