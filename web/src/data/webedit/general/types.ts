export interface textStripped {
  key: string;
  value: string;
}

export interface text extends textStripped {
  description: string;
  name: string;
}
