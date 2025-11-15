export interface GenerationRequest {
  // Backend returns 'id' but some places may expect 'generationRequestId'
  id?: number;
  generationRequestId?: number;

  framework: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed' | string;
  resultadoPath?: string;
  fechaCreacion: string; // ISO date string
  fechaActualizacion?: string;
}
