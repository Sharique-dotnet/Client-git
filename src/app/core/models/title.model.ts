export interface Title {
  id: string;
  name: string;
}

// API: GET /api/Title/titleList/{page?}/{pageSize?}/{name?}
export interface TitleListResponse {
  functionalTitleModel: Title[];
  totalCount: number;
}
