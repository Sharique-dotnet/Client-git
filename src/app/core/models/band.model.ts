export interface Band {
  id: string;
  name: string;
}

export interface BandViewModel {
  bandModel: Band[];
  totalCount: number;
}
