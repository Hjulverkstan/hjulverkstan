export interface GeneralContentStripped {
  key: string;
  value: string;
  imageUrl?: string | null;
}

export interface GeneralContent extends GeneralContentStripped {
  description: string;
  name: string;
  imageUrl?: string | null;
}
