
export enum WorkflowStep {
  UPLOAD,
  EDIT,
}

export interface OutputPreset {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export interface SourceImage {
  base64: string;
  mimeType: string;
  name: string;
}

export interface GeneratedImage {
  id: string;
  src: string;
  prompt: string;
}
