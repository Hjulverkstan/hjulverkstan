export interface GeneralContentStripped {
  key: string;
  value: string;
}

export interface GeneralContent extends GeneralContentStripped {
  description: string;
  name: string;
}
