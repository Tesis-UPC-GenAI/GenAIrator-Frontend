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
  totalTokens?: number;
  promptTokens?: number;
  completionTokens?: number;
  errorMessage?: string;
  sonarBugs?: number;
  sonarVulnerabilities?: number;
  sonarCodeSmells?: number;
  lighthousePerformanceScore?: number;
  lighthouseAccessibilityScore?: number;
  generationLogs?: GenerationLog[];
  fechaCreacion: string; // ISO date string
  fechaActualizacion?: string;
}

export interface GenerationLog {
  timestamp: string; // ISO date
  logLevel?: string;
  message?: string;
}
