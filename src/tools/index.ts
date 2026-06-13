import { getVerseTool } from './get-verse';
import { getChapterTool } from './get-chapter';
import { getPassageTool } from './get-passage';
import { listVersionsTool } from './list-versions';
import { listBooksTool } from './list-books';
import type { Tool } from '../mcp/types';

/**
 * Registro de todas as tools MCP expostas pelo servidor.
 * A ordem aqui é a ordem em que aparecem em `tools/list`.
 */
export const TOOLS: Tool[] = [
  getVerseTool,
  getChapterTool,
  getPassageTool,
  listVersionsTool,
  listBooksTool,
];

const TOOL_BY_NAME: Map<string, Tool> = new Map(
  TOOLS.map((t) => [t.definition.name, t]),
);

export function getToolByName(name: string): Tool | undefined {
  return TOOL_BY_NAME.get(name);
}
