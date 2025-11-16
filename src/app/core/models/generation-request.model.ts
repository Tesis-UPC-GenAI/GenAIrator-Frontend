export interface GenerationRequest {
  // Backend returns 'id' but some places may expect 'generationRequestId'
  id?: number;
  generationRequestId?: number;

  framework: string;
  lenguaje?: string;
  estilo?: string;
  incluirTests?: boolean;
  incluirDoc?: boolean;
  estado?: 'Pending' | 'Processing' | 'Completed' | 'Failed' | string;
  // Backwards-compatible alias some code may expect
  status?: 'Pending' | 'Processing' | 'Completed' | 'Failed' | string;

  resultadoPath?: string;
  componentesGenerados?: number;
  lineasDeCodigo?: number;
  fechaCreacion: string; // ISO date string
  fechaActualizacion?: string;
}
