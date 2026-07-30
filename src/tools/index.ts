import { getVerseTool } from './get-verse';
import { getChapterTool } from './get-chapter';
import { getPassageTool } from './get-passage';
import { searchBibleTool } from './search-bible';
import { comparePassageTool } from './compare-passage';
import { listVersionsTool } from './list-versions';
import { listBooksTool } from './list-books';
import { searchStudyTool } from './search-study';
import { getCommentaryTool } from './get-commentary';
import { getCrossReferencesTool } from './get-cross-references';
import type { Tool } from '../mcp/types';

/**
 * Registro de todas as tools MCP expostas pelo servidor.
 * A ordem aqui é a ordem em que aparecem em `tools/list`.
 */
export const TOOLS: Tool[] = [
  getVerseTool,
  getChapterTool,
  getPassageTool,
  searchBibleTool,
  comparePassageTool,
  listVersionsTool,
  listBooksTool,
  getCrossReferencesTool,
  searchStudyTool,
  getCommentaryTool,
];

const TOOL_BY_NAME: Map<string, Tool> = new Map(
  TOOLS.map((t) => [t.definition.name, t]),
);

export function getToolByName(name: string): Tool | undefined {
  return TOOL_BY_NAME.get(name);
}
