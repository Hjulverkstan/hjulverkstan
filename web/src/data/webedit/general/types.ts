export interface GeneralContentStripped {
  key: string;
  value: string;
  imageURL?: string | null;
}

export interface GeneralContent extends GeneralContentStripped {
  description: string;
  name: string;
  imageURL?: string | null;
}
